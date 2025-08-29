import fs from 'node:fs/promises';
import path from 'node:path';

export type Poll = {
  id: string;
  question: string;
  options: string[];
  active?: boolean;
};
export type PollsData = {
  polls: Poll[];
  votes: Record<string, Record<string, number>>;
};

const DATA_PATH = path.join(process.cwd(), 'data', 'polls.json');

// Internal in-memory cache for quicker reads in-process
let cached: PollsData | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    const initial: PollsData = { polls: [], votes: {} };
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(initial, null, 2), 'utf8');
  }
}

async function readData(): Promise<PollsData> {
  if (cached) return cached;
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  try {
    const json = JSON.parse(raw);
    if (!json.polls || !json.votes) throw new Error('Bad schema');
    cached = json as PollsData;
    return cached;
  } catch {
    cached = { polls: [], votes: {} };
    return cached;
  }
}

async function writeData(next: PollsData): Promise<void> {
  // serialize writes
  writeQueue = writeQueue.then(async () => {
    const tmp = DATA_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), 'utf8');
    await fs.rename(tmp, DATA_PATH);
    cached = next;
  });
  return writeQueue;
}

/* New public API (named exports) */
export async function getAll(): Promise<PollsData> {
  return await readData();
}

export async function getResults(id: string): Promise<{ poll: Poll | null; results: Record<string, number>; total: number }> {
  const data = await readData();
  const poll = data.polls.find(p => p.id === id) || null;
  const results = data.votes[id] || {};
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  return { poll, results, total };
}

export async function vote(pollId: string, option: string): Promise<{ results: Record<string, number>; total: number }> {
  const data = await readData();
  const poll = data.polls.find(p => p.id === pollId);
  if (!poll) throw new Error('Unknown poll');
  if (!poll.options.includes(option)) throw new Error('Invalid option');
  if (!data.votes[pollId]) data.votes[pollId] = {};
  data.votes[pollId][option] = (data.votes[pollId][option] || 0) + 1;
  await writeData(data);
  const results = data.votes[pollId];
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  return { results, total };
}

/* Backwards-compatible default export for existing code */
export async function get(pollId: string): Promise<Record<string, number>> {
  const data = await readData();
  return data.votes[pollId] || {};
}

export async function increment(pollId: string, option: string): Promise<void> {
  // use vote implementation
  await vote(pollId, option);
}

export async function forceWrite(): Promise<void> {
  if (!cached) return;
  try {
    const tmp = DATA_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(cached, null, 2), 'utf8');
    await fs.rename(tmp, DATA_PATH);
  } catch (err) {
    console.error('forceWrite failed:', err);
  }
}

export default { getAll, getResults, vote, get, increment, forceWrite };

