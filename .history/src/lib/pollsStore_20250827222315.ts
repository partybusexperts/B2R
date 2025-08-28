import fs from 'fs/promises';
import path from 'path';

const POLL_FILE = path.join(process.cwd(), 'polls.json');

type PollsShape = Record<string, Record<string, number>>;

let polls: PollsShape = {};
let loaded = false;
let writeTimer: NodeJS.Timeout | null = null;

async function loadIfNeeded() {
  if (loaded) return;
  try {
    const txt = await fs.readFile(POLL_FILE, 'utf8');
    polls = JSON.parse(txt || '{}');
  } catch {
    polls = {};
  }
  loaded = true;
}

function scheduleWrite() {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(async () => {
    try {
      const tmp = POLL_FILE + '.tmp';
      await fs.writeFile(tmp, JSON.stringify(polls, null, 2), 'utf8');
      await fs.rename(tmp, POLL_FILE);
    } catch (err) {
      // swallow — writes are best-effort in dev
      // eslint-disable-next-line no-console
      console.error('Failed to write polls file:', err);
    } finally {
      writeTimer = null;
    }
  }, 500);
}

export async function getAll(): Promise<PollsShape> {
  await loadIfNeeded();
  return polls;
}

export async function get(pollId: string): Promise<Record<string, number>> {
  await loadIfNeeded();
  return polls[pollId] || {};
}

export async function increment(pollId: string, option: string): Promise<void> {
  await loadIfNeeded();
  if (!polls[pollId]) polls[pollId] = {};
  if (!polls[pollId][option]) polls[pollId][option] = 0;
  polls[pollId][option] += 1;
  scheduleWrite();
}

export async function forceWrite(): Promise<void> {
  await loadIfNeeded();
  try {
    const tmp = POLL_FILE + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(polls, null, 2), 'utf8');
    await fs.rename(tmp, POLL_FILE);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('forceWrite failed:', err);
  }
}

export default { getAll, get, increment, forceWrite };
