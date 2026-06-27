"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Venue } from "@/types/venue";
import { getPriceLevel } from "@/lib/utils";
import { IndicadorAbierto } from "@/components/venue/IndicadorAbierto";

const PLACEHOLDER = "/venues/placeholder.png";

interface VenueCardProps {
  venue: Venue;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

export function VenueCard({ venue, selected, onSelect }: VenueCardProps) {
  const ref = useRef<HTMLElement>(null);

  // Sync mapa -> lista: al resaltarse desde el mapa, la card entra en vista
  // (block: "nearest" no scrollea si ya está visible).
  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selected]);

  // Guarda noUncheckedIndexedAccess: fotos[0] puede ser undefined.
  const portada = venue.fotos[0] ?? PLACEHOLDER;
  const precio = getPriceLevel(venue.ticketPromedio);

  return (
    // Hover/foco resalta el marcador en el mapa (sync). En mobile (toggle) el
    // hover no aplica; no se fuerza nada.
    <article
      ref={ref}
      onMouseEnter={() => onSelect(venue.id)}
      onMouseLeave={() => onSelect(null)}
      onFocus={() => onSelect(venue.id)}
      onBlur={() => onSelect(null)}
      className={`flex items-stretch gap-3 rounded-xl border p-3 transition-colors ${
        selected
          ? "border-foreground ring-2 ring-foreground/30"
          : "border-black/10 dark:border-white/15"
      }`}
    >
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-black/5">
        <Image
          src={portada}
          alt={venue.nombre}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{venue.nombre}</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {precio}
          </span>
          <IndicadorAbierto venue={venue} />
        </div>
        <span className="text-sm capitalize text-zinc-500">
          {venue.categoria} · {venue.comuna}
          {venue.sector ? ` (${venue.sector})` : ""}
        </span>
        <span className="text-sm text-zinc-500">
          ${venue.ticketPromedio.toLocaleString("es-CL")} por persona
        </span>
      </div>

      {/* Link = navegar a la ficha. */}
      <Link
        href={`/venues/${venue.slug}`}
        className="shrink-0 self-center rounded-full border border-black/15 px-3 py-1.5 text-sm transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        Ver detalle
      </Link>
    </article>
  );
}
