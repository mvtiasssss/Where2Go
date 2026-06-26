"use client";

import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Algo salió mal</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Ocurrió un error inesperado. Probá de nuevo.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Volver a la búsqueda
        </Link>
      </div>
    </main>
  );
}
