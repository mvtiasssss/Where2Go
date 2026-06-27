interface EtiquetasProps {
  etiquetas: string[];
  max?: number;
}

// Chips de presentación (no filtran). Si está vacío no renderiza nada.
export function Etiquetas({ etiquetas, max }: EtiquetasProps) {
  if (etiquetas.length === 0) return null;
  const mostradas = max !== undefined ? etiquetas.slice(0, max) : etiquetas;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {mostradas.map((etiqueta) => (
        <li
          key={etiqueta}
          className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
        >
          {etiqueta}
        </li>
      ))}
    </ul>
  );
}
