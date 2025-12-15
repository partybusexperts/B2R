import Link from "next/link";
import { Button } from "../ui/button";

interface LocationReadyToPlanProps {
  cityName: string;
  citySlug: string;
  stateSlug: string;
}

export default async function LocationReadyToPlan({
  cityName,
  citySlug,
  stateSlug,
}: LocationReadyToPlanProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="relative overflow-hidden rounded-[2.5rem] border
            border-primary/20 bg-primary px-6 py-12 md:px-12 md:py-16
            text-center shadow-2xl"
        >
          {/* Background Ambience - slightly toned down for a cleaner look */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
              bg-primary-foreground/5 blur-3xl -z-10"
          />

          <div className="mx-auto max-w-3xl space-y-6 relative z-10">
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight
                text-primary-foreground"
            >
              Ready to plan your {cityName} party bus?
            </h2>

            <p
              className="text-primary-foreground/80 text-base md:text-lg
                leading-relaxed max-w-2xl mx-auto"
            >
              Tell us your date, headcount, and rough route. We&apos;ll match
              you with vehicles that can actually handle {cityName} roads and
              winter, not just look pretty in photos.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center
                gap-8 pt-4"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-secondary text-secondary-foreground
                  font-bold px-8 h-12 transition-all duration-300
                  hover:bg-secondary/90 hover:-translate-y-1 shadow-lg
                  shadow-secondary/40 hover:shadow-secondary/60"
              >
                <Link href="/contact" className="text-foreground/80">
                  Get a fast quote
                </Link>
              </Button>

              {/* SECONDARY BUTTON */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30
                  bg-transparent text-primary-foreground
                  hover:bg-primary-foreground/10 hover:text-primary-foreground
                  px-8 h-12"
              >
                <Link
                  href={`/locations/state/${stateSlug}/city/${citySlug}/party-buses`}
                >
                  See {cityName} vehicles
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
