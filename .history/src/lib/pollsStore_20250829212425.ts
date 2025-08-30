import fs from 'node:fs/promises';
import path from 'node:path';
import type { PollReg } from '@/data/pollsRegistry';

export type Poll = PollReg;
export type PollsData = {
  polls: Poll[]; // canonical ordered polls from registry
  votes: Record<string, Record<string, number>>;
};

const DATA_PATH = path.join(process.cwd(), 'data', 'polls.json');
const REGISTRY_JSON_PATH = path.join(process.cwd(), 'data', 'pollsRegistry.json');

// In-memory cache for the registry so we don't reload/parset every request.
let REGISTRY_CACHE: PollReg[] | null = null;

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
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const mod = await import('@/data/pollsRegistry');
    const arr = (mod && mod.POLL_REGISTRY) ? mod.POLL_REGISTRY as PollReg[] : [];
    REGISTRY_CACHE = arr;
    return REGISTRY_CACHE;
  } catch (err) {
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
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const json = JSON.parse(raw || '{}');
    return json.votes || {};
  } catch {
    return {};
  }
}

async function writeVotes(votes: Record<string, Record<string, number>>) {
  writeQueue = writeQueue.then(async () => {
    const tmp = DATA_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify({ votes }, null, 2), 'utf8');
    await fs.rename(tmp, DATA_PATH);
  });
  return writeQueue;
}

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

export async function getResults(id: string): Promise<{ poll: Poll | null; results: Record<string, number>; total: number }> {
  const { polls, votes } = await getAll();
  const poll = polls.find(p => p.id === id) || null;
  const results = votes[id] || {};
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  return { poll, results, total };
}

export async function vote(pollId: string, option: string): Promise<{ results: Record<string, number>; total: number }> {
  const { polls } = await getAll();
  const poll = polls.find(p => p.id === pollId);
  if (!poll) throw new Error('Unknown poll');
  if (!poll.options.includes(option)) throw new Error('Invalid option');
  const votes = await readVotes();
  if (!votes[pollId]) votes[pollId] = {};
  votes[pollId][option] = (votes[pollId][option] || 0) + 1;
  await writeVotes(votes);
  const results = votes[pollId];
  const total = Object.values(results).reduce((a, b) => a + b, 0);
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
  const votes = await readVotes();
  try {
    const tmp = DATA_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify({ votes }, null, 2), 'utf8');
    await fs.rename(tmp, DATA_PATH);
  } catch (err) {
    console.error('forceWrite failed:', err);
  }
}

export default { getAll, getResults, vote, get, increment, forceWrite };

