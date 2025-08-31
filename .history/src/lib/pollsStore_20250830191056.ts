import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import type { PollReg } from '@/data/pollsRegistry';

export type Poll = PollReg;
export type PollsData = {
  polls: Poll[]; // canonical ordered polls from registry
  votes: Record<string, Record<string, number>>;
};

const DATA_PATH = path.join(process.cwd(), 'data', 'polls.json');
const REGISTRY_JSON_PATH = path.join(process.cwd(), 'data', 'pollsRegistry.json');

// Eagerly load registry JSON at module initialization to avoid per-request
// filesystem reads and reduce latency. This is safe because the JSON is
// generated offline by scripts and updated infrequently.
let REGISTRY_CACHE: PollReg[] | null = null;

// In-memory cache for votes to reduce per-request disk I/O (declared early
// so we can eager-load it below during module init)
let VOTES_CACHE: Record<string, Record<string, number>> | null = null;

// Attempt synchronous read during module init; if it fails, fallback to
// the dynamic import path when first requested.
try {
  const raw = fsSync.existsSync(REGISTRY_JSON_PATH) ? fsSync.readFileSync(REGISTRY_JSON_PATH, 'utf8') : null;
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) REGISTRY_CACHE = parsed as PollReg[];
  }
} catch {
  // ignore - will lazy-load via dynamic import later
}

// Eagerly load votes from disk at module init to avoid the first-request
// synchronous file read penalty in long-lived server processes and server
// function cold starts. If the file is missing or malformed we fall back to
// lazy load when first requested.
try {
  const rawVotes = fsSync.existsSync(DATA_PATH) ? fsSync.readFileSync(DATA_PATH, 'utf8') : null;
  if (rawVotes) {
    try {
      const parsed = JSON.parse(rawVotes || '{}');
      VOTES_CACHE = parsed.votes || {};
    } catch (e) {
      VOTES_CACHE = {};
    }
  }
} catch (e) {
  VOTES_CACHE = null;
}

async function loadRegistry(): Promise<PollReg[]> {
  if (REGISTRY_CACHE) return REGISTRY_CACHE;

  // Try JSON file first (fast, avoids TS compile/bundle costs). If absent,
  // fallback to dynamic import of the TS registry (keeps compatibility).
  try {
    const raw = await fs.readFile(REGISTRY_JSON_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      REGISTRY_CACHE = parsed as PollReg[];
      return REGISTRY_CACHE;
    }
  } catch (e) {
    // ignore and fallback to dynamic import
  }

  try {
    // dynamic import to avoid top-level bundling of a very large TS file
    // when this module is referenced from other places.
    const mod = await import('@/data/pollsRegistry').catch(() => null);
    const arr = mod && (mod as any).POLL_REGISTRY && Array.isArray((mod as any).POLL_REGISTRY)
      ? (mod as any).POLL_REGISTRY as PollReg[]
      : [];
    REGISTRY_CACHE = arr;
    return REGISTRY_CACHE;
  } catch {
    // As a last resort return empty array
    REGISTRY_CACHE = [];
    return REGISTRY_CACHE;
  }
}
let writeQueue: Promise<void> = Promise.resolve();

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify({ votes: {} }, null, 2), 'utf8');
  }
}

async function readVotes(): Promise<Record<string, Record<string, number>>> {
  // Prefer in-memory cache if loaded
  if (VOTES_CACHE) return VOTES_CACHE;
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const json = JSON.parse(raw || '{}');
    VOTES_CACHE = json.votes || {};
  } catch {
    VOTES_CACHE = {};
  }
  // Type guard - ensure non-null return
  if (!VOTES_CACHE) VOTES_CACHE = {};
  return VOTES_CACHE;
}

async function writeVotes(votes: Record<string, Record<string, number>>) {
  // Legacy immediate-write path kept for compatibility; prefer schedulePersistVotes
  VOTES_CACHE = votes;
  return schedulePersistVotes();
}

// In-memory cache for votes to reduce per-request disk I/O
// Debounced / batched write machinery
let pendingWriteTimer: NodeJS.Timeout | null = null;
let pendingWritePromise: Promise<void> | null = null;
const WRITE_DEBOUNCE_MS = 5000; // batch writes within this window (longer to reduce I/O)

async function persistVotesNow(): Promise<void> {
  const tmp = DATA_PATH + '.tmp';
  const payload = JSON.stringify({ votes: VOTES_CACHE || {} }, null, 2);
  await fs.writeFile(tmp, payload, 'utf8');
  await fs.rename(tmp, DATA_PATH);
}

function schedulePersistVotes(): Promise<void> {
  if (pendingWriteTimer) clearTimeout(pendingWriteTimer);
  if (!pendingWritePromise) {
    // Start a promise that will be replaced on subsequent writes
    pendingWritePromise = new Promise((resolve, reject) => {
      pendingWriteTimer = setTimeout(async () => {
        try {
          await persistVotesNow();
          resolve();
        } catch (err) {
          // swallow; next write will retry
          reject(err);
        } finally {
          pendingWritePromise = null;
          pendingWriteTimer = null;
        }
      }, WRITE_DEBOUNCE_MS);
    });
    return pendingWritePromise;
  }
  // If a write is already pending, create a chained promise to wait for it
  const chain = pendingWritePromise.then(() => Promise.resolve());
  return chain;
}

// Best-effort flush on process exit
try {
  if (typeof process !== 'undefined' && process && typeof process.on === 'function') {
    process.on('exit', () => {
      try {
        if (VOTES_CACHE) fsSync.writeFileSync(DATA_PATH, JSON.stringify({ votes: VOTES_CACHE }, null, 2), 'utf8');
      } catch (e) {
        // ignore
      }
    });
  }
} catch {}

// Results cache to avoid recomputing totals repeatedly for hot polls
const RESULTS_CACHE = new Map<string, { ts: number; results: Record<string, number>; total: number }>();
const RESULTS_TTL_MS = 30000; // cache aggregated results for 30s to reduce recompute

/* Public API */
export async function getAll(): Promise<PollsData> {
  const votes = await readVotes();
  // Load registry once and cache it in memory. Also exclude auto-generated
  // filler polls so the UI shows only real polls.
  const rawRegistry = await loadRegistry();
  const polls = rawRegistry.filter(p => {
    if ((p as any).active === false) return false;
    if (typeof (p as any).id === 'string' && /^autofill_/i.test((p as any).id)) return false;
    if (typeof (p as any).question === 'string' && /^auto-?fill poll/i.test((p as any).question)) return false;
    return true;
  });
  return { polls, votes };
}

// Lightweight helper: return only the canonical polls array (no votes payload)
export async function getPolls(): Promise<Poll[]> {
  const rawRegistry = await loadRegistry();
  const polls = rawRegistry.filter(p => {
    if ((p as any).active === false) return false;
    if (typeof (p as any).id === 'string' && /^autofill_/i.test((p as any).id)) return false;
    if (typeof (p as any).question === 'string' && /^auto-?fill poll/i.test((p as any).question)) return false;
    return true;
  });
  return polls;
}

export async function getResults(id: string): Promise<{ poll: Poll | null; results: Record<string, number>; total: number }> {
  // Check results cache first
  const cached = RESULTS_CACHE.get(id);
  const now = Date.now();
  if (cached && now - cached.ts < RESULTS_TTL_MS) {
    const { results, total } = cached;
    const { polls } = await getAll();
    const poll = polls.find(p => p.id === id) || null;
    return { poll, results: { ...results }, total };
  }

  const { polls, votes } = await getAll();
  const poll = polls.find(p => p.id === id) || null;
  const results = votes[id] || {};
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  RESULTS_CACHE.set(id, { ts: now, results: { ...results }, total });
  return { poll, results, total };
}

export async function vote(pollId: string, option: string): Promise<{ results: Record<string, number>; total: number }> {
  const { polls } = await getAll();
  // Normalize inputs
  const pid = String(pollId || '').trim();
  const opt = String(option || '').trim();

  // Find poll by id first. If not found, attempt a slug/heuristic fallback so
  // clients that submit slugified question strings still route to the
  // canonical poll. This is a safe, best-effort fallback for dev/debug.
  let poll = polls.find(p => String(p.id) === pid);
  if (!poll) {
    // build a helper to slugify question/title
    const slugify = (s: string) => (s || 'misc').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const getQuestion = (p: any) => (typeof p.question === 'string' && p.question) || (typeof p.title === 'string' && p.title) || (typeof p.prompt === 'string' && p.prompt) || '';
    const bySlug = polls.find(p => slugify(getQuestion(p)) === pid || String(p.id) === pid);
    if (bySlug) {
      poll = bySlug;
      // mutate pid for downstream votes map key
      pollId = String(poll.id);
    }
  }
  if (!poll) throw new Error('Unknown poll');
  if (!Array.isArray(poll.options) || !poll.options.includes(opt)) throw new Error('Invalid option');
  const votes = await readVotes();
  if (!votes[pollId]) votes[pollId] = {};
  votes[pollId][opt] = (votes[pollId][opt] || 0) + 1;
  // update in-memory cache and schedule persist
  VOTES_CACHE = votes;
  await schedulePersistVotes();
  // invalidate/refresh results cache for this poll
  const results = votes[pollId];
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  RESULTS_CACHE.set(pollId, { ts: Date.now(), results: { ...results }, total });
  return { results, total };
}

/* Backwards compat */
export async function get(pollId: string): Promise<Record<string, number>> {
  const votes = await readVotes();
  return votes[pollId] || {};
}

export async function increment(pollId: string, option: string): Promise<void> {
  await vote(pollId, option);
}

export async function forceWrite(): Promise<void> {
  // Force persist the in-memory votes cache
  try {
    await persistVotesNow();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('forceWrite failed:', err);
  }
}

export default { getAll, getResults, vote, get, increment, forceWrite };

