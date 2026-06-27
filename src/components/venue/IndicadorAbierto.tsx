"use client";

import { useSyncExternalStore } from "react";
import type { Venue } from "@/types/venue";
import { estaAbierto } from "@/lib/horario";

// Sin suscripción: el valor solo se recalcula en cada render (no hay store externo).
const suscribir = () => () => {};

interface IndicadorAbiertoProps {
  venue: Venue;
}

export function IndicadorAbierto({ venue }: IndicadorAbiertoProps) {
  // useSyncExternalStore con snapshot de servidor neutro (null): en SSR/hidratación
  // inicial React usa ese null -> server y cliente coinciden (sin mismatch); recién
  // tras hidratar usa el snapshot de cliente, que sí conoce la hora real.
  const abierto = useSyncExternalStore<boolean | null>(
    suscribir,
    () => estaAbierto(venue, new Date()),
    () => null
  );

  if (abierto === null) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        abierto
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {abierto ? "Abierto" : "Cerrado ahora"}
    </span>
  );
}
