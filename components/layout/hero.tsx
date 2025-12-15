import { Suspense } from "react";
import { HeroHeader } from "./hero-header";
import { HeroSkeleton } from "./hero-skeleton";
import { getHeroBySlug } from "@/lib/data/heroes";
import { getRandomVehiclesImages } from "@/lib/data/vehicles";
import { toPublicStorageUrl } from "@/lib/helpers/storage";

async function HeroContent({ slug }: { slug: string }) {
  const heroData = await getHeroBySlug(slug);

  const heroImages = heroData?.image_keys?.map((imagePath) =>
    toPublicStorageUrl(heroData.storage_bucket, imagePath),
  );

  const imagesForHeroSlide = heroImages || (await getRandomVehiclesImages());

  return <HeroHeader hero={heroData} slideImageUrls={imagesForHeroSlide} />;
}

export default function Hero({ slug }: { slug?: string }) {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroContent slug={slug ?? "default"} />
    </Suspense>
  );
}
