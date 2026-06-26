import type { Coordinates } from "@/types/venue";

// Radio medio de la Tierra en km (modelo esférico, suficiente para distancias urbanas).
const EARTH_RADIUS_KM = 6371;

function toRadians(grados: number): number {
  return (grados * Math.PI) / 180;
}

/**
 * Distancia Haversine entre dos coordenadas, en kilómetros.
 * Es el núcleo del filtro por radio; en Fase 7 podría delegarse a PostGIS sin
 * cambiar la interfaz de quien la consume.
 */
export function haversineDistanceKm(
  origen: Coordinates,
  destino: Coordinates
): number {
  const dLat = toRadians(destino.lat - origen.lat);
  const dLng = toRadians(destino.lng - origen.lng);
  const lat1 = toRadians(origen.lat);
  const lat2 = toRadians(destino.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}
