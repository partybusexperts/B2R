/**
 * Converts a Supabase storage key to a public URL.
 * If the key is already a full URL, returns it as-is.
 * Otherwise, constructs a public URL using the Supabase base URL.
 *
 * @param bucket - The storage bucket name (defaults to 'media')
 * @param key - The storage key or full URL
 * @returns The public URL to the stored object
 */
export function toPublicStorageUrl(
  bucket: string | undefined,
  key: string,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  // Already a full URL, return as-is
  if (/^https?:\/\//i.test(key)) return key;

  const sanitizedBaseUrl = baseUrl.replace(/\/+$/, "");

  const encodePathComponent = (path: string) =>
    path.split("/").map(encodeURIComponent).join("/");

  const sanitizedKey = key.replace(/^\/+/, "");
  return `${sanitizedBaseUrl}/storage/v1/object/public/${
    bucket ?? "media"
  }/${encodePathComponent(sanitizedKey)}`;
}

export function toSimplePublicStorageUrl(bucket: string, path: string) {
  // This just returns a string
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export const getRandomImage = (
  image_keys: string[] | null,
  bucket = "vehicles1",
) => {
  if (image_keys && image_keys.length > 0) {
    const randomIndex = Math.floor(Math.random() * image_keys.length);
    const randomImage = toPublicStorageUrl(bucket, image_keys[randomIndex]);
    return randomImage;
  }

  // Fallback placeholder image
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23334155' width='800' height='600'/%3E%3C/svg%3E";
};
