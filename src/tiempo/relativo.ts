/* Tiempo relativo en español de Guatemala. Puro (sin React ni Date.now): sirve en servidor, navegador y pruebas.
   Zona: America/Guatemala (UTC−6 fijo, sin horario de verano). */

const ZONA = "America/Guatemala";
const DESFASE_MS = -6 * 3600_000;
const MIN = 60_000;
const HORA = 3600_000;
const DIA = 86400_000;

/** Número de día calendario en Guatemala (para «ayer»). */
function diaGT(ms: number): number {
  return Math.floor((ms + DESFASE_MS) / DIA);
}

const fmtFecha = new Intl.DateTimeFormat("es-GT", { timeZone: ZONA, day: "numeric", month: "short" });
const fmtFechaAnio = new Intl.DateTimeFormat("es-GT", { timeZone: ZONA, day: "numeric", month: "short", year: "numeric" });
const fmtCompleta = new Intl.DateTimeFormat("es-GT", { timeZone: ZONA, day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });

/** «3 nov» (o «3 nov 2025» si es de otro año que `ahora`). */
export function fechaCorta(ms: number, ahora: number = ms): string {
  const anio = (x: number) => new Date(x + DESFASE_MS).getUTCFullYear();
  return (anio(ms) === anio(ahora) ? fmtFecha : fmtFechaAnio).format(ms);
}

/** «3 nov 2026, 14:05» (hora de Guatemala). Para el `title` de un «hace…». */
export function fechaHora(ms: number): string {
  return fmtCompleta.format(ms);
}

export type OpcionesHace = {
  /** "fecha" (por omisión): después de «ayer» se muestra la fecha. "dias": «hace 3 días» hasta 30 días y luego la fecha. */
  corte?: "dias" | "fecha";
};

/**
 * Cuánto hace de `ms` (epoch en milisegundos) visto desde `ahora`:
 * «hace un momento» (< 1 min) → «hace 4 min» → «hace 2 h» (mismo día, o menos de 6 h) → «ayer» → «3 nov».
 * Un futuro de hasta 1 min (relojes desfasados) cuenta como «hace un momento»; más allá se muestra la fecha.
 */
export function hace(ms: number, ahora: number, { corte = "fecha" }: OpcionesHace = {}): string {
  if (!Number.isFinite(ms) || !Number.isFinite(ahora)) return "—";
  const d = ahora - ms;
  if (d < -MIN) return fechaCorta(ms, ahora);
  if (d < MIN) return "hace un momento";
  if (d < HORA) return `hace ${Math.floor(d / MIN)} min`;
  const dias = diaGT(ahora) - diaGT(ms);
  if (d < 6 * HORA || dias === 0) return `hace ${Math.floor(d / HORA)} h`;
  if (dias === 1) return "ayer";
  if (corte === "dias" && dias < 30) return `hace ${dias} días`;
  return fechaCorta(ms, ahora);
}

/** Convierte lo que suelen traer los datos (ISO, epoch ms, Date) a epoch ms; null si no se puede. */
export function aMs(fecha: string | number | Date | null | undefined): number | null {
  if (fecha === null || fecha === undefined || fecha === "") return null;
  const ms = fecha instanceof Date ? fecha.getTime() : typeof fecha === "number" ? fecha : Date.parse(fecha);
  return Number.isFinite(ms) ? ms : null;
}

/** Duración corta: 45 → «45 s»; 82 → «1 min 22 s»; 3700 → «1 h 1 min»; 200000 → «2 d 7 h». */
export function duracion(seg: number | null | undefined): string {
  if (seg === null || seg === undefined || !Number.isFinite(seg)) return "—";
  const s = Math.max(0, Math.round(seg));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${s % 60 ? ` ${s % 60} s` : ""}`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} h${m % 60 ? ` ${m % 60} min` : ""}`;
  return `${Math.floor(h / 24)} d${h % 24 ? ` ${h % 24} h` : ""}`;
}
