import { supabaseAnon } from "./theme";

export async function fetchHomePage() {
  const sb = supabaseAnon();
  const { data: page } = await sb
    .from("pages")
    .select(`
      id, route, title, description, theme_key,
      page_sections ( position,
        content_blocks ( id, slug, type, variant, props, status )
      )
    `)
    .eq("route", "/")
    .maybeSingle();

  if (!page) return null;

  const blocks = (page.page_sections || [])
    .sort((a:any,b:any)=>a.position-b.position)
    .flatMap((s:any)=>s.content_blocks||[])
    .map((b:any)=>({ slug:b.slug, type:b.type, variant:b.variant, props:b.props }));

  return { page, blocks };
}
