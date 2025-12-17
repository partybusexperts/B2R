import Image from "next/image";
import Link from "next/link";
import { getRandomVehicleByType } from "@/lib/data/vehicles";
import { getRandomImage } from "@/lib/helpers/storage";

type FleetCardConfig = {
  title: string;
  description: string;
  href: string;
  type: "party-bus" | "limo" | "coach";
  borderClassName: string;
  tagClassName: string;
};

const FLEET_CARDS: FleetCardConfig[] = [
  {
    title: "Party Buses",
    description: "Big energy, big sound, and room for everyone.",
    href: "/party-buses",
    type: "party-bus",
    borderClassName: "border-blue-500/35",
    tagClassName: "text-blue-200/70",
  },
  {
    title: "Limousines",
    description: "Clean, classy, and perfect for a polished arrival.",
    href: "/limousines",
    type: "limo",
    borderClassName: "border-violet-500/35",
    tagClassName: "text-violet-200/70",
  },
  {
    title: "Coach Buses",
    description: "Comfortable group travel for longer routes and events.",
    href: "/coach-buses",
    type: "coach",
    borderClassName: "border-emerald-500/35",
    tagClassName: "text-emerald-200/70",
  },
];

export default async function FleetPage() {
  const vehicles = await Promise.all(
    FLEET_CARDS.map(async (card) => getRandomVehicleByType(card.type)),
  );

  const cardsWithImages = FLEET_CARDS.map((card, idx) => {
    const vehicle = vehicles[idx];
    const imageUrl = getRandomImage(vehicle?.images ?? null, "vehicles1");
    return {
      ...card,
      imageUrl,
      imageAlt: vehicle?.name ? `${vehicle.name} photo` : `${card.title} photo`,
    };
  });

  return (
    <main>
      <section className="bg-[#0E1F46] py-16 px-4 sm:px-6 lg:px-8">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center text-white
            font-serif tracking-tight"
        >
          Explore Our Fleet
        </h1>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3">
          Party buses, limos, and coach buses—pick the ride that fits your
          group.
        </p>
      </section>

      <section className="bg-[#0B1938] py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {cardsWithImages.map((card) => (
              <Link
                key={card.type}
                href={card.href}
                className="group rounded-3xl overflow-hidden border
                  border-blue-800/30 bg-[#060E23]/60 backdrop-blur
                  shadow-[0_20px_60px_rgba(3,7,18,0.45)] hover:-translate-y-1
                  transition"
              >
                <div
                  className={`relative h-56 w-full border-b
                  ${card.borderClassName}`}
                >
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority={card.type === "party-bus"}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#060E23]
                      via-transparent to-transparent"
                  />
                  <div className="absolute left-5 top-5">
                    <p
                      className={`text-xs font-semibold uppercase
                      tracking-[0.35em] ${card.tagClassName}`}
                    >
                      FLEET
                    </p>
                  </div>
                </div>

                <div className="p-7">
                  <h2
                    className="text-2xl font-extrabold text-white
                      tracking-tight"
                  >
                    {card.title}
                  </h2>
                  <p className="mt-2 text-blue-100/80 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <div
                    className="mt-6 inline-flex items-center gap-2 text-sm
                      font-semibold text-white/90"
                  >
                    <span
                      className="rounded-xl border border-white/15 bg-white/5
                        px-4 py-2 group-hover:bg-white/10 transition"
                    >
                      View {card.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
