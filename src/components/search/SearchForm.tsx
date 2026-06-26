"use client";

import { useState } from "react";
import type { Commune, Coordinates, VenueCategory } from "@/types/venue";
import type { SearchQuery } from "@/types/search";

const COMUNAS: Commune[] = [
  "Providencia",
  "Las Condes",
  "Vitacura",
  "Ñuñoa",
  "Santiago",
  "Recoleta",
];
const CATEGORIAS: VenueCategory[] = ["discoteca", "bar", "pub", "restaurante"];
const PRESUPUESTOS_CLP = [12000, 20000, 30000, 50000];
const COMUNA_DEFAULT: Commune = "Providencia";
// El wizard ya no pregunta el radio: en modo "cerca-de-mi" usamos un valor razonable.
const RADIO_CERCA_KM = 5;

const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);
const formatoCLP = (monto: number) => `$${monto.toLocaleString("es-CL")}`;

const claseOpcion = (activa: boolean) =>
  `rounded-lg border px-3 py-2 text-sm transition-colors ${
    activa
      ? "border-foreground bg-foreground text-background"
      : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
  }`;
const claseVolver =
  "self-start text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-foreground hover:underline";
const ENCABEZADO = "text-sm font-semibold uppercase tracking-wide text-zinc-500";

type Paso = "ubicacion" | "categoria" | "precio";

// Sub-estado del paso de ubicación.
type GeoFase = "inicial" | "solicitando" | "fallback";

// Ubicación resuelta que alimenta la query. El modo "radio" sigue vivo en
// SearchMode y en el motor (searchByRadius), pero el wizard ya no lo ofrece.
type Ubicacion =
  | { modo: "cerca-de-mi"; coordenadas: Coordinates; radioKm: number }
  | { modo: "comuna"; comuna: Commune };

interface SearchFormProps {
  onSearch: (query: SearchQuery) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [paso, setPaso] = useState<Paso>("ubicacion");
  const [geoFase, setGeoFase] = useState<GeoFase>("inicial");
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [categoria, setCategoria] = useState<VenueCategory | undefined>(
    undefined
  );
  const [aviso, setAviso] = useState<string | null>(null);

  function usarMiUbicacion() {
    setAviso(null);
    // La geolocalización puede no existir -> caer directo al selector de comuna.
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeoFase("fallback");
      setAviso("No pudimos obtener tu ubicación. Elegí una comuna.");
      return;
    }
    setGeoFase("solicitando");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coordenadas = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        // Permiso concedido -> avanzar usando la posición, sin mostrar comunas.
        setUbicacion({
          modo: "cerca-de-mi",
          coordenadas,
          radioKm: RADIO_CERCA_KM,
        });
        setPaso("categoria");
      },
      () => {
        // Denegado / no disponible / timeout -> recién aquí aparecen las comunas.
        setGeoFase("fallback");
        setAviso("No pudimos obtener tu ubicación. Elegí una comuna.");
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  function elegirComuna(valor: string) {
    const comuna = COMUNAS.find((c) => c === valor) ?? COMUNA_DEFAULT;
    setUbicacion({ modo: "comuna", comuna });
    setPaso("categoria");
  }

  // "← Volver" del Paso 2: rehace la ubicación desde cero (rol del antiguo
  // "Cambiar ubicación").
  function volverAUbicacion() {
    setUbicacion(null);
    setGeoFase("inicial");
    setAviso(null);
    setPaso("ubicacion");
  }

  function elegirCategoria(valor: VenueCategory | undefined) {
    setCategoria(valor);
    setPaso("precio");
  }

  // Construye la query con el presupuesto explícito (evita leer un estado recién
  // seteado). "Todas" = categoria undefined; "Sin límite" = presupuesto undefined.
  function construirQuery(presupuestoMax: number | undefined): SearchQuery | null {
    if (!ubicacion) return null;
    if (ubicacion.modo === "comuna") {
      return {
        modo: "comuna",
        comuna: ubicacion.comuna,
        categoria,
        presupuestoMax,
      };
    }
    return {
      modo: "cerca-de-mi",
      coordenadas: ubicacion.coordenadas,
      radioKm: ubicacion.radioKm,
      categoria,
      presupuestoMax,
    };
  }

  // Último paso: tocar un precio (o omitir) dispara la búsqueda.
  function buscarConPresupuesto(presupuestoMax: number | undefined) {
    const query = construirQuery(presupuestoMax);
    if (query) onSearch(query);
  }

  const numeroPaso = paso === "ubicacion" ? 1 : paso === "categoria" ? 2 : 3;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/15">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        Paso {numeroPaso} de 3
      </p>

      {paso === "ubicacion" && (
        <div className="flex flex-col gap-4">
          <p className={ENCABEZADO}>¿Dónde estás?</p>

          {geoFase !== "fallback" && (
            <button
              type="button"
              onClick={usarMiUbicacion}
              disabled={geoFase === "solicitando"}
              className="self-start rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {geoFase === "solicitando"
                ? "📍 Pidiendo ubicación…"
                : "Usar mi ubicación"}
            </button>
          )}

          {geoFase === "fallback" && (
            <div className="flex flex-col gap-3">
              {aviso && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {aviso}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {COMUNAS.map((comuna) => (
                  <button
                    key={comuna}
                    type="button"
                    onClick={() => elegirComuna(comuna)}
                    className={claseOpcion(false)}
                  >
                    {comuna}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {paso === "categoria" && (
        <div className="flex flex-col gap-4">
          <p className={ENCABEZADO}>¿Qué buscas?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              aria-pressed={categoria === undefined}
              onClick={() => elegirCategoria(undefined)}
              className={claseOpcion(categoria === undefined)}
            >
              Todas
            </button>
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={categoria === c}
                onClick={() => elegirCategoria(c)}
                className={claseOpcion(categoria === c)}
              >
                {capitalizar(c)}
              </button>
            ))}
          </div>
          <button type="button" onClick={volverAUbicacion} className={claseVolver}>
            ← Volver
          </button>
        </div>
      )}

      {paso === "precio" && (
        <div className="flex flex-col gap-4">
          <p className={ENCABEZADO}>¿Cuánto?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => buscarConPresupuesto(undefined)}
              className={claseOpcion(false)}
            >
              Sin límite
            </button>
            {PRESUPUESTOS_CLP.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => buscarConPresupuesto(p)}
                className={claseOpcion(false)}
              >
                Hasta {formatoCLP(p)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaso("categoria")}
            className={claseVolver}
          >
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}
