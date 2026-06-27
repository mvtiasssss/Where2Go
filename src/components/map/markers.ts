import { DivIcon } from "leaflet";
import type { VenueCategory } from "@/types/venue";

interface EstiloCategoria {
  color: string;
  emoji: string;
  etiqueta: string;
}

// Fuente única del estilo de marcadores por categoría: mapa de resultados, ficha
// y leyenda leen de acá. El color es el diferenciador principal; el emoji, extra.
export const ESTILO_CATEGORIA: Record<VenueCategory, EstiloCategoria> = {
  discoteca: { color: "#7c3aed", emoji: "🪩", etiqueta: "Discoteca" },
  bar: { color: "#0d9488", emoji: "🍸", etiqueta: "Bar" },
  pub: { color: "#d97706", emoji: "🍺", etiqueta: "Pub" },
  restaurante: { color: "#e11d48", emoji: "🍽️", etiqueta: "Restaurante" },
};

// Orden estable para la leyenda.
export const ORDEN_CATEGORIAS: VenueCategory[] = [
  "discoteca",
  "bar",
  "pub",
  "restaurante",
];

function hacerIconoCategoria(categoria: VenueCategory): DivIcon {
  const estilo = ESTILO_CATEGORIA[categoria];
  return new DivIcon({
    className: "venue-marker",
    html: `<span class="venue-marker__pin" style="background:${estilo.color}">${estilo.emoji}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

// Pre-creados (4 categorías): se reutilizan en cada marcador.
const ICONOS_CATEGORIA: Record<VenueCategory, DivIcon> = {
  discoteca: hacerIconoCategoria("discoteca"),
  bar: hacerIconoCategoria("bar"),
  pub: hacerIconoCategoria("pub"),
  restaurante: hacerIconoCategoria("restaurante"),
};

export function iconoCategoria(categoria: VenueCategory): DivIcon {
  return ICONOS_CATEGORIA[categoria];
}

// Marcador del usuario: claramente distinto a los locales (punto azul).
const ICONO_USUARIO = new DivIcon({
  className: "user-marker",
  html: '<span class="user-marker__dot"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function iconoUsuario(): DivIcon {
  return ICONO_USUARIO;
}
