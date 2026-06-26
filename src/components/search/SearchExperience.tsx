"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Venue } from "@/types/venue";
import type { SearchQuery } from "@/types/search";
import { searchVenues } from "@/lib/search";
import { SearchForm } from "@/components/search/SearchForm";
import { VenueList } from "@/components/venue/VenueList";

// Mapa client-only: dynamic + ssr:false vive aquí (componente cliente), nunca en
// page.tsx; en Next 16 ssr:false no se permite en server components.
const VenueMap = dynamic(
  () => import("@/components/map/VenueMap").then((mod) => mod.VenueMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
        Cargando mapa…
      </div>
    ),
  }
);

type VistaResultados = "mapa" | "lista";

interface SearchExperienceProps {
  venues: Venue[];
}

export function SearchExperience({ venues }: SearchExperienceProps) {
  // El form solo construye y entrega la query; el motor vive acá (no en el form).
  const [query, setQuery] = useState<SearchQuery | null>(null);
  // Estado de sincronización lista <-> mapa.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Vista de resultados: el mapa es la vista principal por defecto.
  const [vistaResultados, setVistaResultados] = useState<VistaResultados>("mapa");

  const resultados = useMemo(
    () => (query ? searchVenues(venues, query) : []),
    [venues, query]
  );

  function manejarBusqueda(nuevaQuery: SearchQuery) {
    setQuery(nuevaQuery);
    setSelectedId(null); // nueva búsqueda -> limpia la selección
    setVistaResultados("mapa"); // ...y vuelve a la vista de mapa
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchForm onSearch={manejarBusqueda} />

      {query === null ? (
        <p className="text-sm text-zinc-500">
          Define tu búsqueda y presiona Buscar.
        </p>
      ) : (
        <section aria-live="polite" className="flex flex-col gap-3">
          {/* Cabecera en flujo normal -> siempre por encima del mapa (z-index 400). */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {resultados.length}{" "}
              {resultados.length === 1
                ? "local encontrado"
                : "locales encontrados"}
            </p>
            <div className="inline-flex rounded-full border border-black/10 p-1 dark:border-white/15">
              {(["mapa", "lista"] as const).map((vista) => (
                <button
                  key={vista}
                  type="button"
                  aria-pressed={vistaResultados === vista}
                  onClick={() => setVistaResultados(vista)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    vistaResultados === vista
                      ? "bg-foreground text-background"
                      : "text-zinc-500 hover:text-foreground"
                  }`}
                >
                  {vista}
                </button>
              ))}
            </div>
          </div>

          {vistaResultados === "mapa" ? (
            // z-0: mantiene el mapa de Leaflet por debajo de overlays/barras fijas.
            <div className="relative z-0 h-[65vh] min-h-[420px] overflow-hidden rounded-xl border border-black/10 dark:border-white/15">
              <VenueMap venues={resultados} />
            </div>
          ) : (
            <VenueList
              venues={resultados}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </section>
      )}
    </div>
  );
}
