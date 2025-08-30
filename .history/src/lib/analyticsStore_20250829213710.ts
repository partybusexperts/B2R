import fs from "node:fs/promises";
import path from "node:path";

const LOG_PATH = path.join(process.cwd(), "data", "analytics.log");
let writeQueue: Promise<void> = Promise.resolve();

async function ensure() {
  try { await fs.access(LOG_PATH); } catch { await fs.mkdir(path.dirname(LOG_PATH), { recursive: true }); await fs.writeFile(LOG_PATH, "", "utf8"); }
}

export async function appendEvent(evt: Record<string, unknown>) {
  await ensure();
  const line = JSON.stringify({ t: Date.now(), ...evt }) + "\n";
  writeQueue = writeQueue.then(async () => { await fs.appendFile(LOG_PATH, line, "utf8"); });
  return writeQueue;
}
