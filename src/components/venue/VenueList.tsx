import type { VenueConDistancia } from "@/lib/search";
import { VenueCard } from "@/components/venue/VenueCard";

interface VenueListProps {
  resultados: VenueConDistancia[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function VenueList({ resultados, selectedId, onSelect }: VenueListProps) {
  if (resultados.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No encontramos locales con esos filtros. Prueba ampliar el presupuesto o
        el radio.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {resultados.map(({ venue, distanciaKm }) => (
        <li key={venue.id}>
          <VenueCard
            venue={venue}
            distanciaKm={distanciaKm}
            selected={venue.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
