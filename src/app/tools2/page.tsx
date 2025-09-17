import React from 'react';
import { getTools, ToolRow } from '../../lib/getTools';
import Link from 'next/link';
import calculators from '@/lib/tools/calculators';
import { normalizeInputs, validateInputs, runTool } from '@/lib/tools/calculators';

export const revalidate = 0; // always fresh during configuration

export default async function Tools2Page() {
  const tools: ToolRow[] = await getTools(200);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold mb-4">Tools2 — DB-driven tools (configure)</h1>
      <p className="text-sm text-slate-500 mb-6">This page pulls tools from Supabase so you can iterate and configure each tool centrally.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => (
          <div key={t.id} className="border rounded-lg p-4 bg-white/5">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{t.title ?? t.id}</h3>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-700">{t.category}</span>
                </div>
                <div className="text-sm text-slate-300 mt-2">{t.desc}</div>
                <div className="mt-3 flex gap-2 items-center">
                  <Link href={t.href || `/tools/${t.id}`} className="text-sm bg-blue-600 px-3 py-1 rounded text-white">Open</Link>
                  <Link href={`/tools2/edit/${encodeURIComponent(t.id)}`} className="text-sm border px-3 py-1 rounded">Edit</Link>
                  {calculators[t.id] && (
                    <>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white">Implemented</span>
                      <div className="text-xs text-slate-400 mt-2">
                        {/* show a small sample result using defaults */}
                        {(() => {
                          try {
                            const def = calculators[t.id];
                            const schema = def.schema;
                            // build defaults
                            const raw: Record<string, unknown> = {};
                            for (const f of schema.fields || []) raw[f.name] = f.default;
                            const res = runTool(t.id, raw);
                            return <pre className="text-xs bg-slate-800 p-2 rounded max-w-xs">{JSON.stringify(res.result, null, 2)}</pre>;
                          } catch (e: any) {
                            return <span className="text-amber-300">error running</span>;
                          }
                        })()}
                      </div>
                    </>
                  )}
                  <span className={`ml-auto text-sm ${t.configured ? 'text-emerald-400' : 'text-yellow-300'}`}>{t.configured ? 'Configured' : 'Not configured'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
