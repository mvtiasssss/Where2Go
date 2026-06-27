"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import { latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coordinates, Venue } from "@/types/venue";
import { useTilesCarto } from "@/components/map/tiles";
import {
  ESTILO_CATEGORIA,
  ORDEN_CATEGORIAS,
  iconoCategoria,
  iconoUsuario,
} from "@/components/map/markers";
import { VenuePopup } from "@/components/venue/VenuePopup";

// Centro de Santiago por defecto, hasta que fitBounds encuadre los resultados.
const SANTIAGO_CENTER: Coordinates = { lat: -33.43, lng: -70.62 };

// Centro/radio del usuario, solo cuando la búsqueda fue por geolocalización.
interface CentroUsuario {
  coordenadas: Coordinates;
  radioKm: number;
}

interface MapControllerProps {
  venues: Venue[];
  centro: Coordinates | null;
}

// Encuadra los resultados (y el centro del usuario, si lo hay) al cambiar.
function MapController({ venues, centro }: MapControllerProps) {
  const map = useMap();
  useEffect(() => {
    const puntos: Coordinates[] = venues.map((v) => v.coordenadas);
    if (centro) puntos.push(centro);
    if (puntos.length === 0) return;
    map.fitBounds(latLngBounds(puntos), { padding: [40, 40], maxZoom: 15 });
  }, [map, venues, centro]);
  return null;
}

// El mapa puede quedar montado pero oculto (toggle mobile -> display:none rompe el
// sizing de Leaflet). invalidateSize en cada resize del contenedor lo corrige.
function InvalidarTamano() {
  const map = useMap();
  useEffect(() => {
    const observador = new ResizeObserver(() => map.invalidateSize());
    observador.observe(map.getContainer());
    return () => observador.disconnect();
  }, [map]);
  return null;
}

// Leyenda discreta: no captura clics (pointer-events-none) ni tapa el mapa.
function Leyenda() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-lg bg-background/85 px-2.5 py-2 text-xs shadow-md ring-1 ring-black/10 backdrop-blur dark:ring-white/15">
      <ul className="flex flex-col gap-1">
        {ORDEN_CATEGORIAS.map((categoria) => (
          <li key={categoria} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: ESTILO_CATEGORIA[categoria].color }}
            />
            {ESTILO_CATEGORIA[categoria].etiqueta}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface VenueMapProps {
  venues: Venue[];
  centroUsuario: CentroUsuario | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function VenueMap({
  venues,
  centroUsuario,
  selectedId,
  onSelect,
}: VenueMapProps) {
  const { tema, url, atribucion } = useTilesCarto();

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={SANTIAGO_CENTER}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* key={tema} remonta el TileLayer limpio al cambiar de tema (sin tiles mezclados). */}
        <TileLayer key={tema} attribution={atribucion} url={url} />

        {venues.map((venue) => {
          const resaltado = venue.id === selectedId;
          return (
            // Clic abre el popup (toque intermedio). Hover resalta su card (sync).
            <Marker
              key={venue.id}
              position={venue.coordenadas}
              icon={iconoCategoria(venue.categoria, resaltado)}
              zIndexOffset={resaltado ? 1000 : 0}
              eventHandlers={{
                mouseover: () => onSelect(venue.id),
                mouseout: () => onSelect(null),
              }}
            >
              <Popup>
                <VenuePopup venue={venue} />
              </Popup>
            </Marker>
          );
        })}

        {/* Solo en modo "cerca-de-mi": círculo de radio + pin del usuario. */}
        {centroUsuario && (
          <>
            <Circle
              center={centroUsuario.coordenadas}
              radius={centroUsuario.radioKm * 1000}
              pathOptions={{
                color: "#2563eb",
                weight: 1,
                fillColor: "#3b82f6",
                fillOpacity: 0.08,
              }}
            />
            <Marker position={centroUsuario.coordenadas} icon={iconoUsuario()}>
              <Popup>Tu ubicación</Popup>
            </Marker>
          </>
        )}

        <MapController
          venues={venues}
          centro={centroUsuario ? centroUsuario.coordenadas : null}
        />
        <InvalidarTamano />
      </MapContainer>

      <Leyenda />
    </div>
  );
}
