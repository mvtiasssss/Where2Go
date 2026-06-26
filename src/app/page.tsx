import { getAllVenues } from "@/lib/data";
import { SearchExperience } from "@/components/search/SearchExperience";

export default async function Home() {
  const venues = await getAllVenues();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Where2Go</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          ¿Dónde salir hoy en Santiago? Responde tres preguntas.
        </p>
      </header>
      <SearchExperience venues={venues} />
    </main>
  );
}
