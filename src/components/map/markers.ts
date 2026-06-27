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

function hacerIconoCategoria(
  categoria: VenueCategory,
  resaltado: boolean
): DivIcon {
  const estilo = ESTILO_CATEGORIA[categoria];
  const clase = resaltado
    ? "venue-marker__pin venue-marker__pin--resaltado"
    : "venue-marker__pin";
  return new DivIcon({
    className: "venue-marker",
    html: `<span class="${clase}" style="background:${estilo.color}">${estilo.emoji}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

interface VarianteIcono {
  normal: DivIcon;
  resaltado: DivIcon;
}

// Pre-creados (4 categorías × normal/resaltado): se reutilizan en cada marcador.
const ICONOS_CATEGORIA: Record<VenueCategory, VarianteIcono> = {
  discoteca: { normal: hacerIconoCategoria("discoteca", false), resaltado: hacerIconoCategoria("discoteca", true) },
  bar: { normal: hacerIconoCategoria("bar", false), resaltado: hacerIconoCategoria("bar", true) },
  pub: { normal: hacerIconoCategoria("pub", false), resaltado: hacerIconoCategoria("pub", true) },
  restaurante: { normal: hacerIconoCategoria("restaurante", false), resaltado: hacerIconoCategoria("restaurante", true) },
};

export function iconoCategoria(
  categoria: VenueCategory,
  resaltado = false
): DivIcon {
  return ICONOS_CATEGORIA[categoria][resaltado ? "resaltado" : "normal"];
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
