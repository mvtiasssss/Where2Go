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
  // Filtro rápido "Abierto ahora" (no agrega un paso al wizard).
  const [soloAbiertos, setSoloAbiertos] = useState(false);

  const resultados = useMemo(() => {
    if (!query) return [];
    // new Date() acá: solo corre en cliente (los resultados se montan tras buscar),
    // así no hay mismatch de hidratación. El motor sigue puro: recibe `ahora`.
    return searchVenues(
      venues,
      { ...query, soloAbiertosAhora: soloAbiertos },
      new Date()
    );
  }, [venues, query, soloAbiertos]);

  // Centro/radio para el mapa, solo si la búsqueda fue por geolocalización.
  // Sale de la query (no se recalcula geo); en modo comuna queda null.
  const centroUsuario = useMemo(() => {
    if (
      query?.modo === "cerca-de-mi" &&
      query.coordenadas &&
      query.radioKm !== undefined
    ) {
      return { coordenadas: query.coordenadas, radioKm: query.radioKm };
    }
    return null;
  }, [query]);

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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">
                {resultados.length}{" "}
                {resultados.length === 1
                  ? "local encontrado"
                  : "locales encontrados"}
              </p>
              <button
                type="button"
                aria-pressed={soloAbiertos}
                onClick={() => setSoloAbiertos((v) => !v)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  soloAbiertos
                    ? "border-foreground bg-foreground text-background"
                    : "border-black/15 text-zinc-500 hover:text-foreground dark:border-white/20"
                }`}
              >
                Abierto ahora
              </button>
            </div>
            {/* Toggle solo en mobile/angosto; en lg+ se muestran mapa y lista juntos. */}
            <div className="inline-flex rounded-full border border-black/10 p-1 lg:hidden dark:border-white/15">
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

          {/* Mobile/angosto: el toggle muestra uno u otro (CSS hidden). lg+: ambos en
              grid 2 columnas, el mapa sticky. Los dos se renderizan siempre; el
              ResizeObserver del mapa corrige el sizing si estaba oculto. */}
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start lg:gap-4">
            <div className={vistaResultados === "lista" ? "lg:block" : "hidden lg:block"}>
              <VenueList
                venues={resultados}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <div
              className={
                vistaResultados === "mapa"
                  ? "lg:sticky lg:top-4"
                  : "hidden lg:sticky lg:top-4 lg:block"
              }
            >
              {/* z-0: mantiene el mapa de Leaflet por debajo de overlays/barras fijas. */}
              <div
                role="region"
                aria-label="Mapa de resultados"
                className="relative z-0 h-[65vh] min-h-[420px] overflow-hidden rounded-xl border border-black/10 lg:h-[78vh] dark:border-white/15"
              >
                <VenueMap
                  venues={resultados}
                  centroUsuario={centroUsuario}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
