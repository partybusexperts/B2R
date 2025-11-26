export function buildVehicleImageUrl(path: string | null | undefined) {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET || "vehicles1";
  if (!path || !base) return "";

  let cleaned = path.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  const bucketPrefix = `${bucket}/`;
  if (cleaned.startsWith(bucketPrefix)) cleaned = cleaned.slice(bucketPrefix.length);

  const encoded = cleaned
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${base}/storage/v1/object/public/${bucket}/${encoded}`;
}
