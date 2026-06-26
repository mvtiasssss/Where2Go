import type { Venue } from "@/types/venue";
import { VenueCard } from "@/components/venue/VenueCard";

interface VenueListProps {
  venues: Venue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function VenueList({ venues, selectedId, onSelect }: VenueListProps) {
  if (venues.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No encontramos locales con esos filtros. Prueba ampliar el presupuesto o
        el radio.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {venues.map((venue) => (
        <li key={venue.id}>
          <VenueCard
            venue={venue}
            selected={venue.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
