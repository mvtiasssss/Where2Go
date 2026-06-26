export type PriceLevel = "$" | "$$" | "$$$";

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
