import venuesData from "@/data/venues.json";
import type { Venue } from "@/types/venue";

/**
 * Dataset semilla (src/data/venues.json) tratado como la "DB" del MVP.
 * Sin validación runtime (sin Zod) por decisión de alcance: el cast `as Venue[]`
 * basta y la estructura se auto-audita al generar el dataset (Fase 2).
 */
const VENUES = venuesData as Venue[];

/**
 * Única puerta de entrada a los datos. Devuelve solo locales activos:
 * alimenta la lista y el motor de búsqueda. Async para que la migración a
 * Supabase (Fase 7) no obligue a tocar a quien la llama.
 */
export async function getAllVenues(): Promise<Venue[]> {
  return VENUES.filter((venue) => venue.estado === "activo");
}

/**
 * Busca un local por slug SIN filtrar por estado, para que los enlaces directos
 * funcionen. La presentación según `estado` (404 / banner) es responsabilidad de
 * la página de detalle (Fase 6), no de esta función.
 */
export async function getVenueBySlug(slug: string): Promise<Venue | undefined> {
  return VENUES.find((venue) => venue.slug === slug);
}

/**
 * Devuelve TODOS los locales, sin filtrar por estado. Pensado para
 * generateStaticParams (prerender de fichas): la página decide cuáles prerenderear
 * según `estado`, igual que decide la presentación. No usar para lista/buscador
 * (eso es getAllVenues, solo activos).
 */
export async function getAllVenuesIncludingInactive(): Promise<Venue[]> {
  return VENUES;
}
