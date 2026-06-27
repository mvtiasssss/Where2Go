import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getVenueBySlug, getAllVenuesIncludingInactive } from "@/lib/data";
import { getPriceLevel } from "@/lib/utils";
import { VenueDetailMap } from "@/components/map/VenueDetailMap";
import { IndicadorAbierto } from "@/components/venue/IndicadorAbierto";
import { ImagenesReferenciales } from "@/components/venue/ImagenesReferenciales";
import type { DiaSemana } from "@/types/venue";

const PLACEHOLDER = "/venues/placeholder.png";

const DIAS_ORDEN: { id: DiaSemana; etiqueta: string }[] = [
  { id: "lun", etiqueta: "Lunes" },
  { id: "mar", etiqueta: "Martes" },
  { id: "mie", etiqueta: "Miércoles" },
  { id: "jue", etiqueta: "Jueves" },
  { id: "vie", etiqueta: "Viernes" },
  { id: "sab", etiqueta: "Sábado" },
  { id: "dom", etiqueta: "Domingo" },
];

interface VenueDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const venues = await getAllVenuesIncludingInactive();
  // Prerenderizamos las fichas navegables: activas y temporalmente-cerradas.
  // Las "cerrado" dan 404 (notFound), así que no hace falta prerenderearlas.
  return venues
    .filter((venue) => venue.estado !== "cerrado")
    .map((venue) => ({ slug: venue.slug }));
}

export async function generateMetadata({
  params,
}: VenueDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue || venue.estado === "cerrado") {
    return { title: "Local no encontrado · Where2Go" };
  }
  return { title: `${venue.nombre} · Where2Go`, description: venue.descripcion };
}

export default async function VenueDetailPage({
  params,
}: VenueDetailPageProps) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);

  // La lógica de estado vive en la página (no en data.ts).
  if (!venue || venue.estado === "cerrado") {
    notFound();
  }

  const fotos = venue.fotos.length > 0 ? venue.fotos : [PLACEHOLDER];
  const precio = getPriceLevel(venue.ticketPromedio);

  // horarios es Partial: nos quedamos solo con los días presentes, en orden.
  const horarios = DIAS_ORDEN.map((dia) => ({
    etiqueta: dia.etiqueta,
    horario: venue.horarios[dia.id],
  })).filter(
    (item): item is { etiqueta: string; horario: string } =>
      item.horario !== undefined
  );

  const entrada = venue.cobraEntrada
    ? venue.valorEntrada !== undefined
      ? `Entrada $${venue.valorEntrada.toLocaleString("es-CL")}`
      : "Cobra entrada"
    : "Entrada liberada";

  const tieneContacto =
    venue.instagram !== undefined ||
    venue.sitioWeb !== undefined ||
    venue.telefono !== undefined;

  // Formateado en UTC para no correr el día al renderizar en el servidor.
  const actualizado = new Date(venue.ultimaActualizacion).toLocaleDateString(
    "es-CL",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <Link
        href="/"
        className="text-sm text-zinc-500 transition-colors hover:text-foreground"
      >
        ← Volver a la búsqueda
      </Link>

      {venue.estado === "temporalmente-cerrado" && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
          ⚠️ Este local está temporalmente cerrado.
        </p>
      )}

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {venue.nombre}
          </h1>
          <IndicadorAbierto venue={venue} />
        </div>
        <p className="capitalize text-zinc-500">
          {venue.categoria} · {venue.comuna}
          {venue.sector ? ` (${venue.sector})` : ""}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400">{venue.descripcion}</p>
      </header>

      <div className="flex flex-col gap-1">
        <section className="grid gap-2 sm:grid-cols-2">
          {fotos.map((foto, indice) => (
            <div
              key={`${foto}-${indice}`}
              className="relative aspect-video overflow-hidden rounded-xl bg-black/5"
            >
              <Image
                src={foto}
                alt={`${venue.nombre} — foto ${indice + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </section>
        <ImagenesReferenciales />
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <dl className="flex flex-col gap-3 text-sm">
          <div>
            <dt className="text-zinc-500">Ticket promedio</dt>
            <dd className="font-medium">
              ${venue.ticketPromedio.toLocaleString("es-CL")} por persona{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {precio}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Entrada</dt>
            <dd className="font-medium">{entrada}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Dirección</dt>
            <dd className="font-medium">{venue.direccion}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 text-sm">
          <h2 className="text-zinc-500">Horarios</h2>
          {horarios.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {horarios.map((item) => (
                <li key={item.etiqueta} className="flex justify-between gap-4">
                  <span>{item.etiqueta}</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {item.horario}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500">Sin horarios informados.</p>
          )}
        </div>
      </section>

      {tieneContacto && (
        <section className="flex flex-wrap gap-3 text-sm">
          {venue.instagram !== undefined && (
            <a
              href={`https://instagram.com/${venue.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-4 py-2 transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              {venue.instagram}
            </a>
          )}
          {venue.sitioWeb !== undefined && (
            <a
              href={venue.sitioWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-4 py-2 transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Sitio web
            </a>
          )}
          {venue.telefono !== undefined && (
            <a
              href={`tel:${venue.telefono}`}
              className="rounded-full border border-black/15 px-4 py-2 transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              {venue.telefono}
            </a>
          )}
        </section>
      )}

      {/* z-0: mantiene el mapa de Leaflet por debajo de overlays/barras fijas. */}
      <section
        role="region"
        aria-label="Ubicación del local en el mapa"
        className="relative z-0 h-[320px] overflow-hidden rounded-xl border border-black/10 dark:border-white/15"
      >
        <VenueDetailMap
          coordenadas={venue.coordenadas}
          nombre={venue.nombre}
          direccion={venue.direccion}
          categoria={venue.categoria}
        />
      </section>

      <p className="text-xs text-zinc-400">Actualizado el {actualizado}</p>
    </main>
  );
}
