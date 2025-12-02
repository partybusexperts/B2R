const { loadEnvConfig } = require("@next/env");
const { createClient } = require("@supabase/supabase-js");

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const tag = process.argv[2] || "party-bus";

async function main() {
  const pollsRes = await supabase
    .from("v_polls_with_tags")
    .select("id, slug, question, tag_slug, tag_name")
    .eq("tag_slug", tag)
    .eq("show_on_polls", true)
    .eq("active", true)
    .order("created_at", { ascending: true })
    .limit(10);

  console.log("Polls status:", pollsRes.status);
  if (pollsRes.error) {
    console.error("Polls error:", pollsRes.error);
    process.exit(1);
  }
  console.log("Poll count:", pollsRes.data?.length ?? 0);
  console.log(JSON.stringify(pollsRes.data, null, 2));

  if (!pollsRes.data || pollsRes.data.length === 0) {
    return;
  }

  const pollIds = pollsRes.data.map((p) => p.id);

  const optionsRes = await supabase
    .from("v_poll_options_label")
    .select("id, poll_id, label, slug, sort_order")
    .in("poll_id", pollIds)
    .order("sort_order", { ascending: true });

  console.log("Options status:", optionsRes.status);
  if (optionsRes.error) {
    console.error("Options error:", optionsRes.error);
    process.exit(1);
  }
  console.log("Options count:", optionsRes.data?.length ?? 0);
  console.log(JSON.stringify(optionsRes.data, null, 2));
}

main().then(() => {
  process.exit(0);
});
