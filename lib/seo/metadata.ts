import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl, siteConfig } from "@/lib/seo/site";

type OgImages = NonNullable<Metadata["openGraph"]>["images"];

type RootMetadataArgs = {
  defaultTitle?: string;
  description?: string;
  noIndex?: boolean;
};

export function rootMetadata({
  defaultTitle,
  description,
  noIndex,
}: RootMetadataArgs = {}): Metadata {
  const siteUrl = getSiteUrl();
  const finalDescription = description ?? siteConfig.description;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle ?? siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: finalDescription,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
    openGraph: {
      title: defaultTitle ?? siteConfig.name,
      description: finalDescription,
      siteName: siteConfig.name,
      locale: siteConfig.defaultLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle ?? siteConfig.name,
      description: finalDescription,
    },
  };
}

type PageMetadataArgs = {
  title: string;
  description?: string;
  path?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImages?: OgImages;
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  openGraphTitle,
  openGraphDescription,
  openGraphImages,
  noIndex,
}: PageMetadataArgs): Metadata {
  const finalDescription = description ?? siteConfig.description;
  const canonical = path ? absoluteUrl(path) : undefined;

  const toImageUrl = (image: unknown): string | null => {
    if (typeof image === "string") return image;
    if (image instanceof URL) return image.toString();
    if (typeof image === "object" && image !== null && "url" in image) {
      const url = (image as { url: unknown }).url;
      if (typeof url === "string") return url;
      if (url instanceof URL) return url.toString();
    }
    return null;
  };

  const twitterImages = openGraphImages
    ? (Array.isArray(openGraphImages) ? openGraphImages : [openGraphImages])
        .map(toImageUrl)
        .filter((url): url is string => Boolean(url))
    : undefined;

  return {
    title,
    description: finalDescription,
    alternates: canonical ? { canonical } : undefined,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
    openGraph: {
      title: openGraphTitle ?? title,
      description: openGraphDescription ?? finalDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.defaultLocale,
      type: "website",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle ?? title,
      description: openGraphDescription ?? finalDescription,
      images: twitterImages,
    },
  };
}
