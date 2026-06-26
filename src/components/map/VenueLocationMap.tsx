"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coordinates } from "@/types/venue";

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
  return (
    <MapContainer
      center={coordenadas}
      zoom={16}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
