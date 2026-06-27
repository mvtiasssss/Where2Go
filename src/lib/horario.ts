import type { DiaSemana, Venue } from "@/types/venue";

// getDay(): 0=domingo … 6=sábado -> DiaSemana
const DIAS_JS: DiaSemana[] = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];

function parseHora(texto: string): number | null {
  const partes = texto.trim().split(":");
  if (partes.length !== 2) return null;
  const horas = Number(partes[0]);
  const minutos = Number(partes[1]);
  if (!Number.isInteger(horas) || !Number.isInteger(minutos)) return null;
  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) return null;
  return horas * 60 + minutos;
}

// "19:00 - 03:00" -> { apertura: 1140, cierre: 180 }
function parseRango(
  rango: string
): { apertura: number; cierre: number } | null {
  const partes = rango.split("-");
  if (partes.length !== 2) return null;
  const apertura = parseHora(partes[0] ?? "");
  const cierre = parseHora(partes[1] ?? "");
  if (apertura === null || cierre === null) return null;
  return { apertura, cierre };
}

/**
 * ¿El local está abierto en el instante `ahora`? Función PURA: no llama a
 * new Date() (recibe `ahora`), así es testeable y no rompe SSR/hidratación.
 *
 * Cruce de medianoche: si cierre <= apertura (ej. "19:00 - 03:00"), el local
 * sigue abierto pasada la medianoche. Por eso se revisan dos rangos:
 *  - el de HOY, cuya porción nocturna (ahora >= apertura) pertenece a hoy;
 *  - el de AYER que cruza medianoche, cuya porción de madrugada (ahora < cierre)
 *    cae en hoy -> así un sábado a la 01:00 sigue abierto por el horario del viernes.
 * Día ausente en `horarios` (es Partial) => cerrado ese día.
 */
export function estaAbierto(venue: Venue, ahora: Date): boolean {
  const hoy = DIAS_JS[ahora.getDay()];
  const ayer = DIAS_JS[(ahora.getDay() + 6) % 7];
  // getDay() siempre devuelve 0-6; el guard satisface noUncheckedIndexedAccess.
  if (!hoy || !ayer) return false;

  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  // Rango de HOY.
  const textoHoy = venue.horarios[hoy];
  if (textoHoy) {
    const rango = parseRango(textoHoy);
    if (rango) {
      if (rango.cierre > rango.apertura) {
        // Rango normal, dentro del mismo día.
        if (minutosAhora >= rango.apertura && minutosAhora < rango.cierre) {
          return true;
        }
      } else if (minutosAhora >= rango.apertura) {
        // Cruza medianoche: solo la porción nocturna pertenece a hoy.
        return true;
      }
    }
  }

  // Rango de AYER que cruza medianoche -> continuación de madrugada en hoy.
  const textoAyer = venue.horarios[ayer];
  if (textoAyer) {
    const rango = parseRango(textoAyer);
    if (rango && rango.cierre <= rango.apertura && minutosAhora < rango.cierre) {
      return true;
    }
  }

  return false;
}
