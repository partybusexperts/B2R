import React from "react";
import { getHomepageCategoryColumns } from "../../lib/home-polls";
import PollColumnsByCategoryClient from "./PollColumnsByCategoryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePollsSection() {
  const columns = await getHomepageCategoryColumns({ numColumns: 3, perColumn: 50 });
  const total = columns.reduce((n, c) => n + c.items.length, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-semibold">Limo Polls &amp; Surveys</h2>
      <p className="text-sm text-white/70">Rotates each refresh</p>

      {total === 0 ? (
        <div className="mt-6 rounded-xl bg-yellow-100 text-yellow-900 p-4">
          No categories found. Add more global polls or relax filters.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <PollColumnsByCategoryClient columns={columns} />
          </div>
          <div className="mt-8 text-center">
            <p className="text-base text-white/80">
              Want more? See thousands and thousands of additional polls, breakdowns, and rider opinions.
            </p>
            <a
              href="/polls"
              className="mt-4 inline-flex items-center justify-center rounded-2xl border border-blue-500 bg-blue-600 px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg transition hover:bg-blue-500"
            >
              See All Polls
            </a>
          </div>
        </>
      )}
    </section>
  );
}
