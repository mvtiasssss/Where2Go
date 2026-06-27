"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coordinates, Venue } from "@/types/venue";
import { useTilesCarto } from "@/components/map/tiles";

// Centro de Santiago por defecto, hasta que fitBounds encuadre los resultados.
const SANTIAGO_CENTER: Coordinates = { lat: -33.43, lng: -70.62 };

// Ícono manual: los defaults de Leaflet rompen bajo el bundler de Next.
// Apunta a assets locales en /public/leaflet (coherente con las fotos locales).
const ICONO = new Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Encuadra los resultados cuando cambia el conjunto.
function MapController({ venues }: { venues: Venue[] }) {
  const map = useMap();
  useEffect(() => {
    if (venues.length === 0) return;
    const bounds = latLngBounds(venues.map((v) => v.coordenadas));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, venues]);
  return null;
}

interface VenueMapProps {
  venues: Venue[];
}

export function VenueMap({ venues }: VenueMapProps) {
  const { tema, url, atribucion } = useTilesCarto();

  return (
    <MapContainer
      center={SANTIAGO_CENTER}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      {/* key={tema} remonta el TileLayer limpio al cambiar de tema (sin tiles mezclados). */}
      <TileLayer key={tema} attribution={atribucion} url={url} />
      {venues.map((venue) => (
        // El Marker con Popup hijo abre el globito al hacer clic (toque intermedio,
        // no navegación directa); "Ver detalle" recién lleva a la ficha.
        <Marker key={venue.id} position={venue.coordenadas} icon={ICONO}>
          <Popup>
            <span className="text-sm font-semibold">{venue.nombre}</span>
            <br />
            <span className="text-xs capitalize text-zinc-500">
              {venue.categoria} · {venue.comuna}
            </span>
            <br />
            {/* <a> nativo: el popup lo renderiza Leaflet; un anchor navega siempre.
                El slug sale del venue, no se arma a mano. */}
            <a
              href={`/venues/${venue.slug}`}
              className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              Ver detalle →
            </a>
          </Popup>
        </Marker>
      ))}
      <MapController venues={venues} />
    </MapContainer>
  );
}
