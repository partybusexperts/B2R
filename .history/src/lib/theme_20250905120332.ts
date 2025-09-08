import { createClient } from "@supabase/supabase-js";

export function supabaseAnon() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const toVar = (name: string) => `--${name.replace(/\./g, "-")}`;

export async function loadThemeVars(themeKey = "light") {
  const sb = supabaseAnon();
  const { data: theme } = await sb.from("themes").select("id,key").eq("key", themeKey).maybeSingle();
  const themeId = theme?.id ?? null;

  const { data: global } = await sb.from("design_tokens").select("name,value").eq("scope","global");
  const themed = themeId
    ? (await sb.from("design_tokens").select("name,value").eq("scope","theme").eq("theme_id", themeId)).data
    : [];

  const vars: Record<string,string> = {};
  for (const row of [...(global||[]), ...(themed||[])]) vars[toVar(row.name)] = row.value;
  return vars;
}

export default loadThemeVars;
