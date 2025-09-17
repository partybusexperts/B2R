import React from 'react';
import { getTools } from '../../../../lib/getTools';

export default async function ToolEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tools = await getTools(500);
  const tool = tools.find(t => t.id === id) || tools.find(t => encodeURIComponent(t.id) === id) || null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit tool: {tool ? (tool.title || tool.id) : id}</h1>
      <div className="mb-6">
        <a href="/tools2" className="text-blue-600 underline">← Back to Tools2</a>
      </div>

      <pre className="bg-slate-800 p-4 rounded text-sm overflow-auto">{JSON.stringify(tool || { id }, null, 2)}</pre>

      <div className="mt-6 text-sm text-slate-400">Implement form here to edit tool configuration and push to Supabase.</div>
    </main>
  );
}
