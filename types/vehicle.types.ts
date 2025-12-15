import type { Database } from "./database.types";

// TODO: add city, state to table
export type VehicleData = Database["public"]["Tables"]["vehicles"]["Row"];
