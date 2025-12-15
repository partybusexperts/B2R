import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { toPublicStorageUrl } from "@/lib/helpers/storage"; // Assuming you have this helper

// Define the 3 main categories
const CATEGORIES = [
  {
    id: "party-bus",
    title: "Party Buses",
    description:
      "Turn the journey into the destination with premium sound and lights.",
    link: "/fleet/party-bus",
  },
  {
    id: "limo",
    title: "Limousines",
    description:
      "Classic stretch limos for elegant arrivals and smaller groups.",
    link: "/fleet/limo",
  },
  {
    id: "coach",
    title: "Coach Buses",
    description:
      "Comfortable, reliable seating for large group transportation.",
    link: "/fleet/coach",
  },
] as const;

type FleetType = (typeof CATEGORIES)[number]["id"];

interface OtherFleetsProps {
  currentType: FleetType; // The type of the page we are currently on
  className?: string;
}

export async function OtherFleets({
  currentType,
  className,
}: OtherFleetsProps) {
  const supabase = await createClient();

  // 1. Identify which categories to show (exclude the current one)
  const categoriesToShow = CATEGORIES.filter((cat) => cat.id !== currentType);

  // 2. Fetch a random vehicle image for each category to use as a preview
  // We use Promise.all to fetch both in parallel for speed
  const cardsWithImages = await Promise.all(
    categoriesToShow.map(async (category) => {
      const { data } = await supabase
        .from("vehicles") // Using your 'vehicles' table
        .select("images")
        .eq("type", category.id)
        .limit(1)
        // Ordering by random() is tricky in Supabase JS directly without RPC,
        // but for a small dataset, just grabbing the first one or using a view is fine.
        // If you have the RPC we discussed: .rpc('get_random_rows', { limit_count: 1 })
        // For now, we'll just grab one.
        .maybeSingle();

      // Get the first image from the array, or a fallback
      const imageKey = data?.images?.[0] || null;
      const imageUrl = imageKey
        ? toPublicStorageUrl("vehicles1", imageKey)
        : "/placeholder-vehicle.jpg";

      return {
        ...category,
        imageUrl,
      };
    }),
  );

  return (
    <section
      className={cn(
        // Matching the dark blue background from the image
        "py-20 md:py-28 bg-primary/90 text-primary-foreground",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            We Also Have {cardsWithImages[0].title} & {cardsWithImages[1].title}
          </h2>
          <p
            className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl
              mx-auto"
          >
            Need something different? Explore our other options for elegant
            arrivals or simple, comfy transport.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {cardsWithImages.map((card) => (
            <Link
              key={card.id}
              href={card.link}
              className="group relative flex flex-col rounded-3xl isolate
                overflow-hidden bg-primary-foreground/5 border border-white/10
                shadow-2xl transition-transform duration-500
                hover:-translate-y-2 hover:shadow-3xl"
            >
              {/* Image Area */}
              <div
                className="relative aspect-[4/3] w-full overflow-hidden
                  rounded-3xl"
              >
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700
                    group-hover:scale-105"
                />

                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/90
                    via-black/20 to-transparent opacity-80"
                />

                {/* Top Label (Optional, matches 'Coach Bus' label in image) */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div
                    className="bg-white/20 backdrop-blur-md px-4 py-1.5
                      rounded-full text-sm font-bold tracking-wide uppercase
                      text-white border border-white/20"
                  >
                    {card.title}
                  </div>
                </div>
              </div>

              {/* Text Content Area - Positioned at bottom or separate block? 
                  The image shows the text visually inside the blue block below the image. 
                  We'll create that structure. */}
              <div
                className="absolute bottom-0 left-0 right-0 p-8 md:p-10
                  text-center"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                  {card.title}
                </h3>
                <p className="text-primary-foreground/70 font-medium">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
