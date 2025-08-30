'use client';

import React, { useState, useMemo } from 'react';
import PollCardPro from './PollCardPro';
import type { PollReg as Poll } from '@/data/pollsRegistry';

interface ClientPollsProps {
  polls: Poll[];
}

export default function ClientPolls({ polls }: ClientPollsProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    polls.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [polls]);

  const filtered = useMemo(() => {
    return polls.filter((p) => {
      const matchTag = selectedTag ? p.tags?.includes(selectedTag) : true;
      const q = query.toLowerCase().trim();
      const matchQuery = !q || p.question.toLowerCase().includes(q);
      return matchTag && matchQuery;
    });
  }, [polls, selectedTag, query]);

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search polls..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((poll) => (
          <PollCardPro key={poll.id} poll={poll} initialCounts={{}} />
        ))}
      </div>
    </main>
  );
}
