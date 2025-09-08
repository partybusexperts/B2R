import { fetchHomePage } from "@/lib/pages";
import { renderBlock } from "@/components/blocks/registry";

// Minimal server component: fetch page definition and render its blocks
export default async function Home() {
  const data = await fetchHomePage();
  if (!data) {
    return <main className="p-8">No page found.</main>;
  }
  return (
    <main className="space-y-6 p-4">
      {data.blocks.map((b: any, i: number) => (
        <div key={b.slug ?? i}>{renderBlock(b)}</div>
      ))}
    </main>
  );
}
