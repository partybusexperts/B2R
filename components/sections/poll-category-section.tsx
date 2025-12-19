import { cn } from "@/lib/utils";
import Link from "next/link";
import { getPollsByCategory, PollWithOptions } from "@/lib/data/polls";
import { PollCard } from "@/components/sections/poll-card";

interface PollCategorySectionProps {
  category: string;
  title: string;
  className?: string;
  limit?: number;
}

const totalVotesForPoll = (poll: PollWithOptions) =>
  (poll.options ?? []).reduce(
    (sum, opt) => sum + Number(opt.vote_count ?? 0),
    0,
  );

export async function PollCategorySection({
  category,
  title,
  className,
  limit = 9,
}: PollCategorySectionProps) {
  const polls = (await getPollsByCategory(category, Math.max(limit, 1))) ?? [];
  if (polls.length === 0) return null;

  const sorted = [...polls].sort(
    (a, b) =>
      totalVotesForPoll(b) - totalVotesForPoll(a) ||
      (a.question ?? "").localeCompare(b.question ?? ""),
  );

  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="relative overflow-hidden rounded-[2.5rem] border
            border-white/10 bg-gradient-to-br from-[#0B1938]/90 via-[#081533]/80
            to-[#060E23]/90 shadow-[0_25px_60px_rgba(3,7,18,0.45)]"
        >
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div
              className="mx-auto h-full max-w-5xl
                bg-[radial-gradient(circle_at_top,_rgba(58,105,255,0.35),_transparent_60%)]"
            />
          </div>

          <div className="relative px-6 py-10 md:px-12 md:py-12">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.55em]
                    text-white/45"
                >
                  {category.replace(/-/g, " ")}
                </p>
                <h2
                  className="mt-3 text-4xl md:text-5xl font-extrabold
                    tracking-tight text-white font-serif"
                >
                  {title}
                </h2>
                <p className="mt-2 text-white/65">Vote to reveal results.</p>
              </div>

              <Link
                href={`/polls?category=${encodeURIComponent(category)}`}
                className="shrink-0 rounded-full border border-white/15
                  bg-white/5 px-5 py-2 text-sm font-semibold text-white/70
                  transition hover:bg-white/10"
              >
                See more
              </Link>
            </div>

            <div className="mt-8">
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sorted.slice(0, limit).map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    backgroundClassName="shadow-[0_35px_120px_rgba(5,10,35,0.65)]
                      border border-white/10 bg-gradient-to-r from-slate-900/80
                      to-slate-950/90"
                    noLoadSpinner
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
