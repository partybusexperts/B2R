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
      <h2 className="text-2xl font-semibold">Limo Polls &amp; Surveys</h2>
      <p className="text-sm text-gray-500">Rotates each refresh • non-city/state • grouped by category</p>

      {total === 0 ? (
        <div className="mt-6 rounded-xl bg-yellow-100 text-yellow-900 p-4">
          No non-city/state categories found. Add more global categories or relax filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <PollColumnsByCategoryClient columns={columns} />
        </div>
      )}
    </section>
  );
}
