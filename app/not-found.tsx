import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Page Not Found",
  description: "This page doesn’t exist or may have moved.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-[#0B1938]">
      <div className="absolute inset-0 opacity-40">
        <div
          className="mx-auto h-full max-w-6xl
            bg-[radial-gradient(circle_at_top,_rgba(58,105,255,0.35),_transparent_60%)]"
        />
      </div>

      <div className="relative container mx-auto px-4 md:px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.4em]
              text-white/55"
          >
            404 — PAGE NOT FOUND
          </p>

          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight
              text-white"
          >
            We couldn’t find that page
          </h1>

          <p
            className="mt-4 text-base md:text-lg leading-relaxed
              text-blue-100/85"
          >
            The link may be broken or the page may have moved. Head back home or
            jump into the fleet to find the right ride.
          </p>

          <div
            className="mx-auto mt-10 max-w-2xl rounded-3xl border
              border-blue-800/30 bg-[#060E23]/70 p-6 md:p-8 backdrop-blur"
          >
            <div
              className="flex flex-col items-stretch justify-center gap-3
                sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-white text-blue-900 border
                  border-blue-200 hover:bg-blue-50"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" /> Go Home
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="rounded-xl bg-blue-700 text-white border
                  border-blue-800 hover:bg-blue-800"
              >
                <Link href="/party-buses">
                  <Search className="mr-2 h-4 w-4" /> Browse Party Buses
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 text-white
                  hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Contact Us
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 text-left">
              <Link
                href="/limousines"
                className="rounded-2xl border border-white/10 bg-white/5 px-4
                  py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                Limousines
              </Link>
              <Link
                href="/coach-buses"
                className="rounded-2xl border border-white/10 bg-white/5 px-4
                  py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                Coach Buses
              </Link>
              <Link
                href="/events"
                className="rounded-2xl border border-white/10 bg-white/5 px-4
                  py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                Popular Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
