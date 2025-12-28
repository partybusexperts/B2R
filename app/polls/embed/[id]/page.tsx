import { createClient } from "@/lib/supabase/server";
import { PollCard } from "@/components/sections/poll-card";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPollById(id: string) {
  const supabase = await createClient();
  const { data: poll, error } = await supabase
    .from("polls1")
    .select(`
      id,
      question,
      category_slug,
      category_data:poll_categories1 (
        name
      ),
      options:poll_options1 (
        id,
        label,
        vote_count,
        ord
      )
    `)
    .eq("id", id)
    .order("ord", { referencedTable: "poll_options1", ascending: true })
    .single();

  if (error || !poll) {
    return null;
  }

  return poll;
}

export default async function EmbedPollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const poll = await getPollById(id);

  if (!poll) {
    notFound();
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{poll.question} | Bus2Ride Poll</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #0d1d3a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }
          .card {
            background: linear-gradient(135deg, rgba(39, 54, 89, 0.9), rgba(15, 23, 42, 0.95));
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            max-width: 400px;
            width: 100%;
            color: white;
          }
          .question { font-size: 18px; font-weight: 600; margin-bottom: 16px; line-height: 1.4; }
          .option {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .option:hover { background: rgba(255, 255, 255, 0.1); }
          .footer { 
            margin-top: 16px; 
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
          }
          .footer a { 
            color: rgba(255, 255, 255, 0.5); 
            text-decoration: none; 
            font-size: 12px;
          }
          .footer a:hover { color: white; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <PollCard poll={poll} noLoadSpinner showEmbed={false} />
          <div className="footer">
            <a href="https://bus2ride.com/polls" target="_blank" rel="noopener noreferrer">
              Powered by Bus2Ride
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
