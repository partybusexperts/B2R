import fs from "node:fs/promises";
import path from "node:path";

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

const DATA_PATH = path.join(process.cwd(), "data", "polls.json");

let writeQueue: Promise<void> = Promise.resolve();

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    const initial: PollsData = { polls: [], votes: {} };
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readData(): Promise<PollsData> {
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  try {
    const json = JSON.parse(raw);
    if (!json.polls || !json.votes) throw new Error("Bad schema");
    return json as PollsData;
  } catch {
    return { polls: [], votes: {} };
  }
}

async function writeData(next: PollsData): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    const tmp = DATA_PATH + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
    await fs.rename(tmp, DATA_PATH);
  });
  return writeQueue;
}

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
  if (!poll) {
    throw new Error("Unknown poll");
  }
  const valid = poll.options.includes(option);
  if (!valid) {
    throw new Error("Invalid option");
  }
  if (!data.votes[pollId]) data.votes[pollId] = {};
  data.votes[pollId][option] = (data.votes[pollId][option] || 0) + 1;
  await writeData(data);
  const results = data.votes[pollId];
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  return { results, total };
}
import fs from 'fs/promises';
import path from 'path';

const POLL_FILE = path.join(process.cwd(), 'data', 'polls.json');

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
    console.error('forceWrite failed:', err);
  }
}

export default { getAll, get, increment, forceWrite };
