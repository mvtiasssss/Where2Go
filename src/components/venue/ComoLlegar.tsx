import type { Coordinates } from "@/types/venue";

interface ComoLlegarProps {
  coordenadas: Coordinates;
  className?: string;
}

// Única fuente de la URL "Cómo llegar" (Google Maps directions, pestaña nueva).
// Usada por el popup del mapa y por la ficha; el estilo se pasa por className.
export function ComoLlegar({ coordenadas, className }: ComoLlegarProps) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${coordenadas.lat},${coordenadas.lng}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      Cómo llegar
    </a>
  );
}
