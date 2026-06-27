import Image from "next/image";
import type { Venue } from "@/types/venue";
import { getPriceLevel, formatearDistancia } from "@/lib/utils";
import { IndicadorAbierto } from "@/components/venue/IndicadorAbierto";
import { ComoLlegar } from "@/components/venue/ComoLlegar";

const PLACEHOLDER = "/venues/placeholder.png";

interface VenuePopupProps {
  venue: Venue;
  distanciaKm: number | null;
}

export function VenuePopup({ venue, distanciaKm }: VenuePopupProps) {
  // Guarda noUncheckedIndexedAccess: fotos[0] puede ser undefined.
  const portada = venue.fotos[0] ?? PLACEHOLDER;
  const precio = getPriceLevel(venue.ticketPromedio);

  return (
    <div className="w-48">
      <Image
        src={portada}
        alt={venue.nombre}
        width={192}
        height={108}
        className="mb-2 h-24 w-full rounded-md object-cover"
      />
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-sm font-semibold">{venue.nombre}</span>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {precio}
        </span>
      </div>
      <p className="mt-0.5 text-xs capitalize text-zinc-600">
        {venue.categoria} · {venue.comuna}
      </p>
      <p className="text-xs text-zinc-600">
        ${venue.ticketPromedio.toLocaleString("es-CL")} por persona
      </p>
      {distanciaKm !== null && (
        <p className="text-xs text-zinc-600">{formatearDistancia(distanciaKm)}</p>
      )}
      <div className="mt-1.5">
        {/* Reutiliza estaAbierto vía IndicadorAbierto (hidratación-seguro). */}
        <IndicadorAbierto venue={venue} />
      </div>
      <div className="mt-2 flex items-center gap-3">
        {/* <a> nativos: el popup lo renderiza Leaflet; navegan siempre. */}
        <ComoLlegar
          coordenadas={venue.coordenadas}
          className="font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
        />
        <a
          href={`/venues/${venue.slug}`}
          className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400"
        >
          Ver detalle →
        </a>
      </div>
    </div>
  );
}
