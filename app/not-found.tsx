import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-background">
      <div className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border
              border-border bg-card/60 px-3 py-1 text-xs font-semibold
              text-muted-foreground"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            404 — Page Not Found
          </div>

          <h1
            className="text-4xl font-extrabold tracking-tight text-foreground
              md:text-5xl"
          >
            We couldn’t find that page
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The link may be broken or the page may have moved. Try heading back
            home or browse our most popular fleet categories.
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-3
              sm:flex-row"
          >
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-xl"
            >
              <Link href="/party-buses">
                <Search className="mr-2 h-4 w-4" /> Browse Party Buses
              </Link>
            </Button>

            <Button asChild variant="ghost" size="lg" className="rounded-xl">
              <Link href="/contact">
                <ArrowLeft className="mr-2 h-4 w-4" /> Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
