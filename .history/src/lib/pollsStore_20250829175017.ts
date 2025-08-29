import fs from 'node:fs/promises';
import path from 'node:path';
import { POLL_REGISTRY, type PollReg } from '@/data/pollsRegistry';

export type Poll = PollReg;
export type PollsData = {
  polls: Poll[]; // canonical ordered polls from registry
  votes: Record<string, Record<string, number>>;
};

const DATA_PATH = path.join(process.cwd(), 'data', 'polls.json');
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
  const polls = POLL_REGISTRY.filter(p => p.active !== false);
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

