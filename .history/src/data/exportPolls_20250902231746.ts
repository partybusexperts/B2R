// exportPolls.ts
import { writeFileSync } from "fs";
import { POLL_REGISTRY } from "./pollsRegistry"; // same folder, so ./ is correct

writeFileSync("polls.json", JSON.stringify(POLL_REGISTRY, null, 2));
console.log("✅ Wrote polls.json");
