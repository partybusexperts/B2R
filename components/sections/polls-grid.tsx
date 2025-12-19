import { getPolls, PollWithOptions } from "@/lib/data/polls";
import { PollsColumnsClient } from "./polls-columns.client";
import Link from "next/link";
import Locations from "../../lib/data/local/locations.json";

const cities = Locations.flatMap((loc) =>
  loc.cities.map((city) => city.toLowerCase()),
);

interface PollsGridProps {
  category?: string; // e.g. "home", "pricing", "party-bus"
  columnCategories?: string[]; // up to 3 category slugs, one per column
  hideCities?: boolean; // whether to show city polls
}

export async function PollsGrid({
  category,
  columnCategories,
  hideCities = true,
}: PollsGridProps) {
  const COLUMN_COUNT = 3;
  const PER_COLUMN = 50;
  const FETCH_LIMIT = 250;

  const categories = (
    columnCategories && columnCategories.length > 0
      ? columnCategories
      : category
        ? [category, "", ""]
        : ["", "", ""]
  )
    .slice(0, COLUMN_COUNT)
    .map((c) => (c ?? "").trim());

  const totalVotesForPoll = (poll: PollWithOptions) =>
    (poll.options ?? []).reduce(
      (sum, opt) => sum + Number(opt.vote_count ?? 0),
      0,
    );

  const sortByMostVotes = (polls: PollWithOptions[]) =>
    [...polls].sort(
      (a, b) =>
        totalVotesForPoll(b) - totalVotesForPoll(a) ||
        (a.question ?? "").localeCompare(b.question ?? ""),
    );

  const [raw1, raw2, raw3] = await Promise.all([
    getPolls(FETCH_LIMIT, categories[0] ?? ""),
    getPolls(FETCH_LIMIT, categories[1] ?? ""),
    getPolls(FETCH_LIMIT, categories[2] ?? ""),
  ]);

  // Filter out city-specific polls if needed
  const filterCityPolls = (polls: PollWithOptions[] | null) => {
    if (!hideCities || !polls) return polls;

    return polls.filter((poll) => {
      const question = poll.question?.toLowerCase() ?? "";
      return !cities.some((city) => question.includes(city));
    });
  };

  const col1 = filterCityPolls(raw1)
    ? sortByMostVotes(filterCityPolls(raw1)!).slice(0, PER_COLUMN)
    : [];
  const col2 = filterCityPolls(raw2)
    ? sortByMostVotes(filterCityPolls(raw2)!).slice(0, PER_COLUMN)
    : [];
  const col3 = filterCityPolls(raw3)
    ? sortByMostVotes(filterCityPolls(raw3)!).slice(0, PER_COLUMN)
    : [];

  const columns: PollWithOptions[][] = [col1, col2, col3];

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
