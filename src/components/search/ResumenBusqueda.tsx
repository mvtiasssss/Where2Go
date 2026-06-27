import type { SearchQuery } from "@/types/search";

const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);

interface ResumenBusquedaProps {
  query: SearchQuery;
  onEditar: () => void;
}

// Resumen compacto de lo elegido, derivado del SearchQuery (no de strings sueltos).
export function ResumenBusqueda({ query, onEditar }: ResumenBusquedaProps) {
  const ubicacion =
    query.modo === "cerca-de-mi"
      ? "📍 Cerca de mí"
      : (query.comuna ?? "Comuna");
  const categoria = query.categoria ? capitalizar(query.categoria) : "Todas";
  const precio =
    query.presupuestoMax !== undefined
      ? `Hasta $${query.presupuestoMax.toLocaleString("es-CL")}`
      : "Sin límite";

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 px-4 py-2.5 dark:border-white/15">
      <p className="truncate text-sm">
        {ubicacion} · {categoria} · {precio}
      </p>
      <button
        type="button"
        onClick={onEditar}
        className="shrink-0 rounded-full border border-black/15 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        Editar
      </button>
    </div>
  );
}
