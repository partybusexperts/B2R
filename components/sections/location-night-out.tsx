import Image from "next/image";
import { MapPin, Music, Utensils, Sparkles, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getRandomImage } from "@/lib/helpers/storage";

const DEFAULT_IMAGE_URL = getRandomImage(
  [
    "girls nights out.jpg",
    "guys nights out.jpg.jpg",
    "entertainment tours.jpg",
    "dinners out.jpg",
  ],
  "Events1",
);

const DEFAULT_STOPS = [
  {
    time: "6:30 PM",
    title: "Pick-up + playlist warmup",
    description:
      "Meet your group, confirm the route, and get the vibe set before the first stop.",
    Icon: MapPin,
  },
  {
    time: "7:15 PM",
    title: "Dinner stop",
    description:
      "A sit-down spot where parking is easy and everyone can regroup before the night ramps up.",
    Icon: Utensils,
  },
  {
    time: "8:45 PM",
    title: "Main event",
    description:
      "Concert, game, or venue entry — aim to arrive early enough to avoid lines.",
    Icon: Music,
  },
  {
    time: "10:30 PM",
    title: "Photo + scenic loop",
    description:
      "A quick scenic pass for photos (and a breather) before the late-night stretch.",
    Icon: Sparkles,
  },
  {
    time: "12:15 AM",
    title: "Smooth drop-offs",
    description:
      "Split drop-offs keep it calm — confirm the last stop and the final headcount.",
    Icon: Home,
  },
] as const;

export function LocationNightOut({
  city,
  imageUrl,
}: {
  city: string;
  imageUrl?: string;
}) {
  return (
    <section className="py-16 md:py-24 bg-background border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Sample {city} night out route
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            A realistic, ops-friendly flow you can copy-paste.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          <Card
            className="relative overflow-hidden border-border/60 shadow-sm py-0"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={imageUrl ?? DEFAULT_IMAGE_URL}
                alt={`Night out in ${city}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={false}
              />
            </div>
          </Card>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="space-y-5">
                {DEFAULT_STOPS.map(({ time, title, description, Icon }) => (
                  <div key={`${time}-${title}`} className="flex gap-4">
                    <div
                      className="mt-0.5 flex h-10 w-10 items-center
                        justify-center rounded-full bg-primary/10 text-primary
                        shrink-0"
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p
                        className="text-xs font-bold uppercase tracking-wide
                          text-muted-foreground"
                      >
                        {time}
                      </p>
                      <p className="text-lg font-bold leading-tight">{title}</p>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Want this customized to your event timing and pickup zones? We can
              plan a route that keeps the group on schedule.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
