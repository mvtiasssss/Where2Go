export type VenueCategory = "discoteca" | "bar" | "pub" | "restaurante";

export type VenueStatus = "activo" | "temporalmente-cerrado" | "cerrado";

// Comunas reales del MVP — cerrado a propósito para evitar typos. Se expande al escalar.
export type Commune =
  | "Providencia"
  | "Las Condes"
  | "Vitacura"
  | "Ñuñoa"
  | "Santiago"
  | "Recoleta";

export type DiaSemana = "lun" | "mar" | "mie" | "jue" | "vie" | "sab" | "dom";

// Horario por día, ej: { vie: "19:00 - 04:00", sab: "20:00 - 05:00" }
export type HorarioSemanal = Partial<Record<DiaSemana, string>>;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Venue {
  id: string; // identificador interno estable (futura clave en Supabase)
  slug: string; // identificador para la URL /venues/{slug} — único
  nombre: string;
  descripcion: string;
  categoria: VenueCategory;
  estado: VenueStatus;
  comuna: Commune;
  sector?: string; // barrio dentro de la comuna, ej: "Bellavista", "Lastarria"
  direccion: string;
  coordenadas: Coordinates;
  ticketPromedio: number; // CLP por persona — ÚNICA fuente de verdad del precio
  cobraEntrada: boolean; // discotecas suelen cobrar; restaurantes no
  valorEntrada?: number; // CLP, presente solo si cobraEntrada === true
  horarios: HorarioSemanal;
  fotos: string[]; // URLs (placeholders que SÍ carguen en el dataset semilla)
  etiquetas: string[]; // ej: ["terraza", "coctelería", "electrónica"]
  instagram?: string; // handle, ej: "@nombrelocal"
  sitioWeb?: string;
  telefono?: string;
  ultimaActualizacion: string; // ISO 8601, ej: "2026-06-23"
}
