import { createClient } from "@/lib/supabase/server";

export type HomeTool = {
  slug: string;
  name: string;
};

export async function getHomeTools(): Promise<HomeTool[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_tools_home")
    .select("slug,name")
    .order("slug", { ascending: true });

  if (error) {
    console.error("[tools] v_tools_home query failed:", error);
    return [];
  }
  return (data ?? []) as HomeTool[];
}
