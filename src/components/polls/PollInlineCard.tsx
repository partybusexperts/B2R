"use client";
"use client";
import React, { useEffect, useMemo, useState } from "react";
// keep types loose for flexibility
import { fetchOptionsForPoll, castVote, fetchTotals } from "@/lib/polls/client-helpers";

type Props = {
	pollId: string | null;
	slug: string | null;
	question: string;
};

export default function PollInlineCard({ pollId, slug, question }: Props) {
	const [loading, setLoading] = useState(true);
	const [opts, setOpts] = useState<{ option_id: string; label: string }[]>([]);
	const [totals, setTotals] = useState<Map<string, number>>(new Map());
	const [selected, setSelected] = useState<string | null>(null);
		const [voted, setVoted] = useState(false);

	useEffect(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			const [o, t] = await Promise.all([
				fetchOptionsForPoll(pollId, slug),
				pollId ? fetchTotals(pollId) : Promise.resolve(new Map()),
			]);
			if (!alive) return;
			setOpts(o);
			setTotals(t);
			setLoading(false);
		})();
		return () => { alive = false; };
	}, [pollId, slug]);

	const totalVotes = useMemo(
		() => Array.from(totals.values()).reduce((a, b) => a + b, 0),
		[totals]
	);

	async function onVote(optionId: string) {
		if (!pollId) return;
		setSelected(optionId);
		const res = await castVote(pollId, optionId);
		// Refresh totals after vote
		const t = await fetchTotals(pollId);
		setTotals(t);
		setVoted(true);
	}

	return (
		<div className="rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
			<div className="flex items-start gap-2">
				<span className="mt-[6px] inline-block h-2 w-2 rounded-full bg-sky-400 flex-shrink-0" />
				<h4 className="font-medium leading-snug text-white text-[14px]">{question}</h4>
			</div>

			{loading && (
				<div className="mt-2 text-xs text-white/60">Loading options…</div>
			)}

			{!loading && !opts.length && (
				<div className="mt-2 text-xs text-white/50">No options available for this poll.</div>
			)}

			{!loading && opts.length > 0 && (
				<div className="mt-2 space-y-2">
					{opts.map((o) => {
						const count = totals.get(o.option_id) ?? 0;
						const pct = totalVotes ? Math.round((count * 100) / totalVotes) : 0;
						const isChosen = selected === o.option_id;

						return (
							<button
								key={o.option_id}
								onClick={() => onVote(o.option_id)}
								className={`w-full text-left rounded-md px-3 py-2 transition
									${isChosen ? "bg-sky-500/20 ring-1 ring-sky-400" : "bg-white/6 hover:bg-white/8 ring-1 ring-white/10"}
								`}
							>
								<div className="text-[13px] text-white">{o.label}</div>

								{/* results bar, always visible under the option */}
								<div className="mt-1 h-2 w-full rounded bg-white/10 overflow-hidden">
									<div
										className="h-2 bg-sky-400"
										style={{ width: `${pct}%` }}
										aria-hidden
									/>
								</div>
								<div className="mt-1 text-[11px] text-white/60">
									{pct}% {totalVotes ? `• ${count.toLocaleString()} vote${count === 1 ? "" : "s"}` : ""}
								</div>
							</button>
						);
					})}

					{/* “Use this data” nudger */}
								{(pollId || slug) && (
						<div className="pt-1 text-[11px] text-white/50">
							Use this data on your site?{" "}
							<a
											href={`/embed/poll?${pollId ? `poll_id=${encodeURIComponent(pollId)}` : `slug=${encodeURIComponent(slug ?? "")}`}`}
											className="underline underline-offset-4 hover:text-white/80"
											target="_blank"
											rel="noreferrer noopener"
							>
								Get embed code
							</a>
							.
						</div>
					)}
				</div>
			)}
		</div>
	);
}
