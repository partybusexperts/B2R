// exportPolls.ts
import { writeFileSync } from "fs";
import { POLL_REGISTRY } from "./pollsRegistry";

// write polls.json to the PROJECT ROOT (../../)
writeFileSync("../../polls.json", JSON.stringify(POLL_REGISTRY, null, 2));
console.log(" Wrote ../../polls.json");