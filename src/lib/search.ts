import type { Commune, Coordinates, Venue, VenueCategory } from "@/types/venue";
import type { SearchQuery } from "@/types/search";
import { haversineDistanceKm } from "./geo";
import { costoPersona } from "./utils";
import { estaAbierto } from "./horario";

export function searchByCategory(
  venues: Venue[],
  categoria: VenueCategory
): Venue[] {
  return venues.filter((venue) => venue.categoria === categoria);
}

export function searchByCommune(venues: Venue[], comuna: Commune): Venue[] {
  return venues.filter((venue) => venue.comuna === comuna);
}

// Filtra por presupuesto usando el costo real por persona (ticket + entrada si la
// cobra), no solo el ticket: conserva los locales con costoPersona <= presupuestoMax.
export function searchByBudget(
  venues: Venue[],
  presupuestoMax: number
): Venue[] {
  return venues.filter((venue) => costoPersona(venue) <= presupuestoMax);
}

export function searchByRadius(
  venues: Venue[],
  centro: Coordinates,
  radioKm: number
): Venue[] {
  return venues.filter(
    (venue) => haversineDistanceKm(centro, venue.coordenadas) <= radioKm
  );
}

/**
 * Orquestador: único punto de contacto entre la UI (Fase 4) y el motor.
 * Resuelve el "¿dónde?" según query.modo y luego aplica categoría y presupuesto
 * como filtros AND. Las funciones son puras y componibles: el orden no altera el
 * resultado.
 *
 * Los campos requeridos por modo (comuna / coordenadas + radioKm) se asumen
 * presentes por contrato: la UI construye queries válidas y no hay validación
 * runtime en el MVP. Los guards existen para satisfacer el tipado y no fallar si
 * faltara un dato.
 *
 * `ahora` se recibe por parámetro (no se lee con new Date() adentro) para mantener
 * el motor puro y testeable. Solo se usa si query.soloAbiertosAhora está activo.
 */
export function searchVenues(
  venues: Venue[],
  query: SearchQuery,
  ahora?: Date
): Venue[] {
  let resultado = venues;

  switch (query.modo) {
    case "comuna":
      if (query.comuna) {
        resultado = searchByCommune(resultado, query.comuna);
      }
      break;
    // "cerca-de-mi" toma el centro de la geolocalización del navegador y "radio"
    // de un punto/comuna elegidos; para el motor ambos son el mismo filtro de radio.
    case "cerca-de-mi":
    case "radio":
      if (query.coordenadas && query.radioKm !== undefined) {
        resultado = searchByRadius(resultado, query.coordenadas, query.radioKm);
      }
      break;
  }

  if (query.categoria) {
    resultado = searchByCategory(resultado, query.categoria);
  }
  if (query.presupuestoMax !== undefined) {
    resultado = searchByBudget(resultado, query.presupuestoMax);
  }
  if (query.soloAbiertosAhora && ahora) {
    resultado = resultado.filter((venue) => estaAbierto(venue, ahora));
  }

  return resultado;
}
