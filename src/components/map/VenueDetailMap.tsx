"use client";

import dynamic from "next/dynamic";
import type { Coordinates, VenueCategory } from "@/types/venue";

// Wrapper client: la ficha es server component, así que el dynamic(ssr:false)
// del mapa vive aquí (en Next 16 ssr:false no se permite en server components).
const VenueLocationMap = dynamic(
  () =>
    import("@/components/map/VenueLocationMap").then(
      (mod) => mod.VenueLocationMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Cargando mapa…
      </div>
    ),
  }
);

interface VenueDetailMapProps {
  coordenadas: Coordinates;
  nombre: string;
  direccion: string;
  categoria: VenueCategory;
}

export function VenueDetailMap(props: VenueDetailMapProps) {
  return <VenueLocationMap {...props} />;
}
