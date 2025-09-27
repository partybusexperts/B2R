import React from "react";
import { createClient } from "@/lib/supabase/server";
export const revalidate = 60;

function normalizeOptions(rows: any[]) {
  return (rows ?? []).map((r) => {
    const label = r.label ?? r.text ?? r.title ?? r.option ?? r.name ?? String(r.option_value ?? "");
    const id = r.option_id_uuid ?? r.id ?? r.uuid ?? r.option_uuid ?? r.option_id ?? label;
    return { id: String(id), label: String(label) };
  });
}

export default async function EmbedPoll({ params }: { params: { id: string } }) {
  const pollId = decodeURIComponent(params.id);
  const supabase = createClient();

  // options (try common sources)
  const sources = ["v_poll_options", "poll_options1", "poll_options"];
  let optRows: any[] = [];
  for (const t of sources) {
    const { data, error } = await supabase.from(t).select("*").eq("poll_id_uuid", pollId).limit(200);
    if (!error && data?.length) { optRows = data; break; }
  }
  const options = normalizeOptions(optRows);

  // votes aggregate
  const { data: votes } = await supabase
    .from("poll_votes")
    .select("option_id")
    .eq("poll_id", pollId);
  const counts = new Map<string, number>();
  (votes ?? []).forEach((r: any) => counts.set(String(r.option_id), (counts.get(String(r.option_id)) || 0) + 1));
  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-[220px] bg-white text-[#0a1530] p-4">
      <div className="mx-auto max-w-2xl">
        <h3 className="m-0 text-lg font-semibold">Community Poll Results</h3>
        <div className="mt-2 space-y-2">
          {options.map((o) => {
            const c = counts.get(o.id) || 0;
            const pct = total ? Math.round((c / total) * 1000) / 10 : 0;
            return (
              <div key={o.id}>
                <div className="flex justify-between text-sm">
                  <span>{o.label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded">
                  <div className="h-full rounded bg-[#3b82f6]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-600">
          Data by <a href="/" target="_blank" rel="nofollow" className="underline">Bus2Ride</a>
        </p>
      </div>
    </main>
  );
}

