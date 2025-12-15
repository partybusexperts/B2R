import {
  getPolls,
  getPollsByCategory,
  PollWithOptions,
} from "@/lib/data/polls";
import { PollCard } from "./poll-card";
import { shuffle } from "@/lib/utils";

interface PollsGridProps {
  category?: string; // e.g. "home", "pricing", "party-bus"
}

export async function PollsGrid({ category }: PollsGridProps) {
  // 1. Fetch ALL polls (or a reasonable limit) to handle randomization in JS
  // Supabase doesn't support .order('random()') easily without RPC,
  // so fetching ~20 and shuffling is efficient enough for small datasets.
  const polls = await getPolls(50);

  const pollsByCategory = await getPollsByCategory(category || "");

  if (!polls || polls.length === 0) return null;

  // 2. Strategy:
  // - Find one poll that matches the requested category (Context)
  // - Fill the rest with random polls (Discovery)

  const shuffledCategoryPolls = shuffle(pollsByCategory || []);

  const contextPoll =
    shuffledCategoryPolls?.[0] ||
    polls.find(
      (poll) => poll.category_slug?.toLowerCase() === category?.toLowerCase(),
    );

  const otherPolls = shuffle(
    polls.filter((poll) => poll.id !== contextPoll?.id),
  );

  // If no context match found, just take the first random one
  const col1 = contextPoll || otherPolls.pop();
  const col2 = otherPolls.pop();
  const col3 = otherPolls.pop();

  const displayPolls = [col1, col2, col3].filter(
    (poll): poll is PollWithOptions => Boolean(poll),
  );

  if (displayPolls.length === 0) return null;

  return (
    <section
      className="py-20 md:py-24 bg-secondary/10 border-b border-border/40"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-foreground mb-4"
          >
            Trending Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            See what other riders are thinking. Cast your vote to reveal the
            results instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayPolls.map((poll) => (
            <div key={poll.id} className="h-full">
              <PollCard poll={poll} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
