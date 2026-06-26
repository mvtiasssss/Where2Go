import type { Commune, Coordinates, VenueCategory } from "@/types/venue";

export type SearchMode = "cerca-de-mi" | "comuna" | "radio";

export interface SearchQuery {
  modo: SearchMode;
  categoria?: VenueCategory;
  comuna?: Commune; // requerido si modo === "comuna"
  coordenadas?: Coordinates; // requerido si modo === "cerca-de-mi" | "radio"
  radioKm?: number; // requerido si modo === "cerca-de-mi" | "radio"
  presupuestoMax?: number; // CLP por persona; filtra ticketPromedio <= presupuestoMax
}
