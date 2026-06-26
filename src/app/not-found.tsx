import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-5xl font-bold tracking-tight text-zinc-300 dark:text-zinc-700">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">
        No encontramos ese local
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Puede que el enlace esté mal o que el local ya no esté disponible.
      </p>
      <Link
        href="/"
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
      >
        ← Volver a la búsqueda
      </Link>
    </main>
  );
}
