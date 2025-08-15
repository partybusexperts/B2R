"use client";
import React, { useState } from "react";

const defaultItems = [
  "Cooler",
  "Ice",
  "Chargers",
  "Playlist",
  "Permission rules",
  "Snacks",
  "Drinks",
  "Cups & Plates",
  "Napkins",
  "Trash Bags",
  "Grill or Food",
  "Games (e.g. cornhole)",
  "Team Gear",
  "Tickets/Passes"
];

const TailgateChecklist: React.FC = () => {
  const [items, setItems] = useState(
    defaultItems.map((text) => ({ text, checked: false }))
  );
  const [newItem, setNewItem] = useState("");

  const toggleItem = (idx: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems((prev) => [...prev, { text: newItem.trim(), checked: false }]);
      setNewItem("");
    }
  };

  const clearAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400 w-full">
      <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow">Tailgate Checklist</h3>
      <p className="text-lg text-blue-900 mb-4">Cooler, ice, chargers, playlist, permission rules—everything you need for the ultimate tailgate.</p>
      <form onSubmit={addItem} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Add item..."
          className="border rounded px-3 py-2 text-lg flex-1"
        />
        <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg shadow transition">Add</button>
      </form>
      <ul className="mb-4 space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(idx)}
              className="w-5 h-5 accent-blue-700"
            />
            <span className={item.checked ? "line-through text-gray-400" : "text-blue-900"}>{item.text}</span>
          </li>
        ))}
      </ul>
      <button onClick={clearAll} className="bg-gray-200 hover:bg-gray-300 text-blue-900 font-semibold px-4 py-2 rounded-lg shadow transition">Clear All</button>
    </div>
  );
};

export default TailgateChecklist;
