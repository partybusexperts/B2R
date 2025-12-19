import { cache } from "react";
import { createClient } from "../supabase/server";

export const getSecrets = cache(async () => {
  const supabase = await createClient();

  const { data: secrets, error } = await supabase
    .from("industry_secrets")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("getSecrets:", error);
    return null;
  }

  if (!secrets) {
    console.warn("getSecrets:", "No data found");
    return null;
  }

  return secrets;
});

export type SecretsData = NonNullable<
  Awaited<ReturnType<typeof getSecrets>>
>[number];
