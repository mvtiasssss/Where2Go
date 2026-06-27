"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Coordinates, VenueCategory } from "@/types/venue";
import { useTilesCarto } from "@/components/map/tiles";
import { iconoCategoria } from "@/components/map/markers";

interface VenueLocationMapProps {
  coordenadas: Coordinates;
  nombre: string;
  direccion: string;
  categoria: VenueCategory;
}

export function VenueLocationMap({
  coordenadas,
  nombre,
  direccion,
  categoria,
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
      <Marker position={coordenadas} icon={iconoCategoria(categoria)}>
        <Popup>
          <span className="font-medium">{nombre}</span>
          <br />
          {direccion}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
