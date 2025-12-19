import { getPolls, PollWithOptions } from "@/lib/data/polls";
import { shuffle } from "@/lib/utils";
import { PollsColumnsClient } from "./polls-columns.client";
import Link from "next/link";

interface PollsGridProps {
  category?: string; // e.g. "home", "pricing", "party-bus"
}

export async function PollsGrid({ category }: PollsGridProps) {
  // Fetch enough to build 3 columns of 50.
  // Supabase doesn't support random ordering easily without RPC.
  const polls = await getPolls(200);

  if (!polls) return null;

  const normalizedCategory = (category ?? "").trim().toLowerCase();

  const contextCandidates = normalizedCategory
    ? polls.filter((poll) =>
        (poll.category_slug ?? "").toLowerCase().includes(normalizedCategory),
      )
    : [];

  const shuffledContext = shuffle([...contextCandidates]);
  const contextIds = new Set(shuffledContext.map((p) => p.id));

  const shuffledRemainder = shuffle(
    polls.filter((poll) => !contextIds.has(poll.id)),
  );

  const buildColumn = (
    primary: PollWithOptions[],
    filler: PollWithOptions[],
    count: number,
    used: Set<string>,
  ) => {
    const result: PollWithOptions[] = [];

    for (const poll of primary) {
      if (result.length >= count) break;
      if (used.has(poll.id)) continue;
      used.add(poll.id);
      result.push(poll);
    }

    for (const poll of filler) {
      if (result.length >= count) break;
      if (used.has(poll.id)) continue;
      used.add(poll.id);
      result.push(poll);
    }

    // If we still don't have enough polls (small dataset), repeat from the
    // available pool so the UI still renders 50 items per column.
    if (result.length < count) {
      const pool = [...primary, ...filler].filter((p) => !used.has(p.id));
      const fallbackPool = pool.length > 0 ? pool : [...primary, ...filler];
      if (fallbackPool.length > 0) {
        let i = 0;
        while (result.length < count) {
          result.push(fallbackPool[i % fallbackPool.length]);
          i += 1;
        }
      }
    }

    return result;
  };

  const usedIds = new Set<string>();
  const col1 = buildColumn(shuffledContext, shuffledRemainder, 50, usedIds);
  const col2 = buildColumn([], shuffledRemainder, 50, usedIds);
  const col3 = buildColumn([], shuffledRemainder, 50, usedIds);

  const columns = [col1, col2, col3].filter((c) => c.length > 0);
  if (columns.length === 0) return null;

  return (
    <section className="bg-[#0E1F46] px-4 py-10">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Trending Questions
        </h2>
        <p className="text-sm text-white/70">
          See what other riders are thinking. Cast your vote to reveal the
          results instantly.
        </p>

        <PollsColumnsClient columns={columns} />

        <div className="mt-10 flex justify-center">
          <Link
            href="/polls"
            className="text-sm rounded-xl border border-white/15 bg-white/10
              px-4 py-2 hover:bg-white/15 text-white"
          >
            See all polls
          </Link>
        </div>
      </div>
    </section>
  );
}
