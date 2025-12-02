const { readFileSync } = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "pollsRegistry.json");
const polls = JSON.parse(readFileSync(dataPath, "utf8"));
const tags = new Map();

for (const poll of polls) {
  if (!poll || !Array.isArray(poll.tags)) continue;
  for (const tag of poll.tags) {
    if (!tag) continue;
    const key = String(tag).toLowerCase();
    tags.set(key, (tags.get(key) ?? 0) + 1);
  }
}

const sorted = Array.from(tags.entries()).sort((a, b) => b[1] - a[1]);
console.log("unique tags:", sorted.length);
console.log(sorted.slice(0, 50));
