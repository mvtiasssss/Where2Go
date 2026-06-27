import { useEffect, useState } from "react";

// Carto basemaps (free tier, sin API key para uso básico). Host único, sin el
// patrón {s} deprecado. Atribución de OSM + CARTO: requisito de licencia.
const TILES_CLARO = "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"; // Positron
const TILES_OSCURO = "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"; // Dark Matter
const ATRIBUCION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const CONSULTA_OSCURO = "(prefers-color-scheme: dark)";

interface TemaTiles {
  tema: "claro" | "oscuro";
  url: string;
  atribucion: string;
}

/**
 * Sigue prefers-color-scheme y reacciona a cambios de tema del SO: Positron en
 * claro, Dark Matter en oscuro. Solo se usa en los mapas, que son client-only
 * (dynamic ssr:false), por eso puede leer matchMedia sin riesgo de hidratación.
 */
export function useTilesCarto(): TemaTiles {
  const [oscuro, setOscuro] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(CONSULTA_OSCURO).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(CONSULTA_OSCURO);
    const onChange = (e: MediaQueryListEvent) => setOscuro(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return {
    tema: oscuro ? "oscuro" : "claro",
    url: oscuro ? TILES_OSCURO : TILES_CLARO,
    atribucion: ATRIBUCION,
  };
}
