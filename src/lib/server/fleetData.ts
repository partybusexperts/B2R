import type { SupabaseClient } from "@supabase/supabase-js";

import type { HomepageVehicle, HomepageVehicleCategory } from "../../types/homepageVehicles";
import { buildVehicleImageUrl } from "../images";
import { createClient } from "../supabase/server";

export type FleetCategoryKey = HomepageVehicleCategory;
export type FleetVehicle = HomepageVehicle;

type VehicleRow = {
  id: number;
  name: string;
  capacity: number | null;
  type: string | null;
  amenities: string[] | string | null;
  storage_path: string | null;
  storage_path_2: string | null;
  storage_path_3: string | null;
};

const IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET ?? process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET ?? "vehicles1";
const folderImageCache = new Map<string, Promise<string[]>>();

export async function fetchFleetVehicles(): Promise<Record<FleetCategoryKey, FleetVehicle[]>> {
  const vehicles = await getVehiclesFromSupabase();
  const grouped: Record<FleetCategoryKey, FleetVehicle[]> = {
    "party-buses": [],
    "limousines": [],
    "coach-buses": [],
  };

  for (const vehicle of vehicles) {
    grouped[vehicle.category]?.push(vehicle);
  }

  return grouped;
}

function normalizeAmenities(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((value) => (typeof value === "string" ? value.trim() : String(value)))
      .filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }
  return [];
}

export async function getVehiclesFromSupabase(): Promise<HomepageVehicle[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vehicles11")
    .select("id, name, capacity, type, amenities, storage_path, storage_path_2, storage_path_3")
    .not("storage_path", "is", null)
    .returns<VehicleRow[]>();

  if (error || !data) {
    console.error("[fleet] error loading vehicles11", error);
    return [];
  }

  const vehicles = await Promise.all(data.map((row) => mapRowToHomepageVehicle(row, supabase)));
  return vehicles;
}

function toCategory(type: string | null, name: string | null): HomepageVehicleCategory {
  const t = (type || "").toLowerCase();
  const n = (name || "").toLowerCase();
  const combined = `${t} ${n}`.trim();

  if (combined.includes("party bus")) return "party-buses";

  if (
    combined.includes("limo") ||
    combined.includes("sprinter") ||
    combined.includes("chrysler 300") ||
    combined.includes("lincoln")
  ) {
    return "limousines";
  }

  if (combined.includes("shuttle") || combined.includes("coach")) return "coach-buses";

  return "party-buses";
}

export async function mapRowToHomepageVehicle(row: VehicleRow, supabase: SupabaseClient): Promise<HomepageVehicle> {
  const category = toCategory(row.type, row.name);

  const [imageUrl, secondaryImageUrl, thirdImageUrl] = supabase ? await resolveVehicleImages(row, supabase) : [];

  return {
    id: row.id,
    name: row.name,
    category,
    imageUrl,
    secondaryImageUrl,
    thirdImageUrl,
    capacityMin: row.capacity ?? null,
    capacityMax: row.capacity ?? null,
    amenities: normalizeAmenities(row.amenities),
  };
}

async function resolveVehicleImages(row: VehicleRow, supabase: SupabaseClient): Promise<string[]> {
  if (!supabase) return [];

  const sources = [row.storage_path, row.storage_path_2, row.storage_path_3].filter(Boolean) as string[];
  if (!sources.length) return [];

  const urls: string[] = [];
  for (const source of sources) {
    const normalized = normalizeStoragePath(source);
    if (!normalized) continue;

    if (hasFileExtension(normalized)) {
      urls.push(buildVehicleImageUrl(normalized));
    } else {
      const folderImages = await fetchFolderImageUrls(normalized, supabase);
      urls.push(...folderImages);
    }

    if (urls.length >= 3) break;
  }

  if (!urls.length) {
    const fallback = normalizeStoragePath(sources[0]);
    urls.push(...(await fetchFolderImageUrls(fallback, supabase)));
  }

  return Array.from(new Set(urls.filter(Boolean))).slice(0, 3);
}

async function fetchFolderImageUrls(folder: string, supabase: SupabaseClient): Promise<string[]> {
  if (!folder) return [];
  if (folderImageCache.has(folder)) {
    return folderImageCache.get(folder)!;
  }

  const promise = supabase.storage
    .from(IMAGE_BUCKET)
    .list(folder, { limit: 50, sortBy: { column: "name", order: "asc" } })
    .then(({ data, error }) => {
      if (error) {
        console.error(`[fleet] unable to list storage folder "${folder}":`, error.message ?? error);
        return [] as string[];
      }
      const files = (data ?? []).filter((entry) => entry?.name && !entry.name.endsWith("/"));
      files.sort((a, b) => scoreImageName(a.name) - scoreImageName(b.name) || a.name.localeCompare(b.name));
      return files.map((file) => buildVehicleImageUrl(`${folder}/${file.name}`));
    })
    .catch((err) => {
      console.error(`[fleet] unexpected error listing folder "${folder}":`, err);
      return [] as string[];
    });

  folderImageCache.set(folder, promise);
  return promise;
}

function normalizeStoragePath(path: string | null | undefined): string {
  if (!path) return "";
  let cleaned = path.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  if (!cleaned) return "";
  const bucketPrefix = `${IMAGE_BUCKET}/`;
  if (cleaned.startsWith(bucketPrefix)) {
    cleaned = cleaned.slice(bucketPrefix.length);
  }
  return cleaned;
}

function hasFileExtension(path: string): boolean {
  const lastSegment = path.split("/").pop() ?? "";
  return lastSegment.includes(".");
}

function scoreImageName(name: string): number {
  const lower = name.toLowerCase();
  if (lower.includes("exterior")) return 0;
  if (lower.includes("interior") || lower.includes("inside")) return 1;
  if (lower.includes("lounge") || lower.includes("seating")) return 2;
  return 3;
}
