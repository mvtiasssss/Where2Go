"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coordinates } from "@/types/venue";
import { useTilesCarto } from "@/components/map/tiles";

// Ícono manual con assets locales (los defaults de Leaflet rompen bajo el bundler).
const ICONO = new Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface VenueLocationMapProps {
  coordenadas: Coordinates;
  nombre: string;
  direccion: string;
}

export function VenueLocationMap({
  coordenadas,
  nombre,
  direccion,
}: VenueLocationMapProps) {
  const { tema, url, atribucion } = useTilesCarto();

  return (
    <MapContainer
      center={coordenadas}
      zoom={16}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      {/* key={tema} remonta el TileLayer limpio al cambiar de tema (sin tiles mezclados). */}
      <TileLayer key={tema} attribution={atribucion} url={url} />
      <Marker position={coordenadas} icon={ICONO}>
        <Popup>
          <span className="font-medium">{nombre}</span>
          <br />
          {direccion}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
