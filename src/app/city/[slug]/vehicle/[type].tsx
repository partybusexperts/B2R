import React from "react";
import { GetServerSideProps } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ImageRow = {
  id: number | string;
  storage_path?: string | null;
  alt_text?: string | null;
  [k: string]: any;
};

type AmenityRow = {
  id: number | string;
  label: string;
  description?: string | null;
  [k: string]: any;
};

type Props = {
  city: { id: number; slug: string; name: string };
  images: Array<ImageRow & { public_url: string | null }>;
  amenities: AmenityRow[];
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const { slug, type } = params as { slug: string; type: string };

  const { data: cities } = await supabase
    .from("cities111")
    .select("id,slug,name")
    .eq("slug", slug)
    .limit(1);

  if (!cities || cities.length === 0) return { notFound: true };
  const city = cities[0];

  const [{ data: images }, { data: amenities }] = await Promise.all([
    supabase.from("images111").select("*").eq("city_id", city.id).eq("vehicle_type", type),
    supabase.from("amenities111").select("*").eq("city_id", city.id).eq("vehicle_type", type),
  ]);

  const storageHost = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/^https?:\/\//, "") + "/storage/v1/object/public";
  const imagesWithUrl = (images || []).map((i: ImageRow) => ({
    ...i,
    public_url: i.storage_path ? `https://${storageHost}/${i.storage_path}` : null,
  }));

  return {
    props: {
      city,
      images: imagesWithUrl,
      amenities: (amenities as AmenityRow[]) || [],
    },
  };
};

export default function VehiclePage({ city, images, amenities }: Props) {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      <h1>{city.name}</h1>

      <section>
        <h2>Images</h2>
        {images.length === 0 && <p>No images found.</p>}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {images.map((img) => (
            <img
              key={img.id}
              src={img.public_url ?? ""}
              alt={img.alt_text ?? ""}
              style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 6 }}
            />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Amenities</h2>
        {amenities.length === 0 && <p>No amenities listed.</p>}
        <ul>
          {amenities.map((a) => (
            <li key={a.id}>
              <strong>{a.label}</strong>
              {a.description ? ` — ${a.description}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
