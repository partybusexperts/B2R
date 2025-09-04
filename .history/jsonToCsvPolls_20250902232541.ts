// jsonToCsvPolls.ts
import fs from "fs";
import polls from "./polls.json" assert { type: "json" };

type P = { id: string; question: string; options?: string[]; tags?: string[]; active?: boolean };

function pgArray(arr?: string[]) {
  if (!arr || arr.length === 0) return "{}"; // empty Postgres array
  // Postgres array literal with proper escaping: {"a","b"}
  return (
    "{" +
    arr.map((s) => '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"').join(",") +
    "}"
  );
}

function csvCell(s: string) {
  // CSV-escape: wrap in quotes and double any internal quotes
  return `"${s.replace(/"/g, '""')}"`;
}

const rows = polls as P[];
const lines: string[] = ["id,question,options,tags,active"];

for (const p of rows) {
  lines.push(
    [
      csvCell(p.id),
      csvCell(p.question),
      csvCell(pgArray(p.options)),
      csvCell(pgArray(p.tags)),
      (p.active ?? true).toString(),
    ].join(",")
  );
}

fs.writeFileSync("polls.csv", lines.join("\n"));
console.log("✅ wrote polls.csv");
