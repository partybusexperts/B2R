import { Suspense } from "react";
import { HeroClient } from "./hero.client";
import { HeroSkeleton } from "./hero-skeleton";
import { getHeroBySlug } from "@/lib/data/heroes";
import { getRandomVehiclesImages } from "@/lib/data/vehicles";
import { toPublicStorageUrl } from "@/lib/helpers/storage";

interface HeroProps {
  slug: string;
}

export default async function Hero({ slug }: HeroProps) {
  const heroData = await getHeroBySlug(slug);

  const heroImages = heroData?.image_keys?.map((imagePath) =>
    toPublicStorageUrl(heroData.storage_bucket, imagePath),
  );

  const imagesForHeroSlide = heroImages || (await getRandomVehiclesImages());

  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroClient hero={heroData} slideImageUrls={imagesForHeroSlide} />
    </Suspense>
  );
}
