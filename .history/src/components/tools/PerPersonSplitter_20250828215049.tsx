import React, { useState } from "react";

export default function PerPersonSplitter() {
  const [total, setTotal] = useState<string>("");
  const [people, setPeople] = useState<string>("4");

  const parsedTotal = parseFloat(total || "0");
  const parsedPeople = Math.max(1, parseInt(people || "0") || 1);
  const perPerson = parsedPeople > 0 ? parsedTotal / parsedPeople : 0;

  return (
    <div className="space-y-4 text-blue-100">
      <label className="block">
        <div className="text-sm font-semibold mb-1">Total price (USD)</div>
        <input
          inputMode="decimal"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="w-full rounded-md px-3 py-2 text-black"
          placeholder="e.g. 600"
          aria-label="Total price"
        />
      </label>

      <label className="block">
        <div className="text-sm font-semibold mb-1">Group size</div>
        <input
          inputMode="numeric"
          value={people}
          onChange={(e) => setPeople(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-32 rounded-md px-3 py-2 text-black"
          aria-label="Group size"
        />
      </label>

      <div className="text-white font-bold text-lg">
        Per person: ${isFinite(perPerson) ? perPerson.toFixed(2) : "0.00"}
      </div>

      <div className="text-sm text-blue-200">Tip & fees not included — add them into the Total for a final per-person number.</div>
    </div>
  );
}
