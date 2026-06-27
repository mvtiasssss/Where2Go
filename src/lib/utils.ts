import type { Venue } from "@/types/venue";

export type PriceLevel = "$" | "$$" | "$$$";

/**
 * Costo real por persona: ticket promedio más la entrada cuando el local la cobra
 * (típicamente discotecas). Fuente de verdad para el filtro de presupuesto.
 */
export function costoPersona(venue: Venue): number {
  return (
    venue.ticketPromedio + (venue.cobraEntrada ? (venue.valorEntrada ?? 0) : 0)
  );
}

/**
 * Helper VISUAL para el badge de precio. El dominio no tiene PriceLevel:
 * la única fuente de verdad del precio es ticketPromedio (CLP por persona).
 * Umbrales pensados para el rango del dataset de Santiago.
 */
export function getPriceLevel(ticketPromedio: number): PriceLevel {
  if (ticketPromedio <= 15000) return "$";
  if (ticketPromedio <= 30000) return "$$";
  return "$$$";
}

/**
 * Formatea una distancia (km) legible: "a 850 m" si es menor a 1 km, o "a 1,2 km"
 * (coma decimal es-CL) en caso contrario.
 */
export function formatearDistancia(km: number): string {
  if (km < 1) return `a ${Math.round(km * 1000)} m`;
  return `a ${km.toLocaleString("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}
