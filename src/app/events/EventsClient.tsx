"use client";

import EventsExplorer from "../../components/events/EventsExplorer";

export default function EventsClient() {
  return (
    <section className="relative isolate -mt-16 pb-24 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-400/20 blur-[200px]" />
        <div className="absolute top-8 -left-10 h-80 w-80 rounded-full bg-indigo-500/30 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] translate-x-16 rounded-full bg-emerald-400/20 blur-[180px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Event playbook</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Browse every party bus event idea
          </h2>
          <p className="mt-3 text-base text-white/75 sm:text-lg">
            Filter popular use cases, search by name, or jump straight into a curated event guide. All the tiles
            below link to a ready-to-book walkthrough.
          </p>
        </header>

        <EventsExplorer />
      </div>
    </section>
  );
}
