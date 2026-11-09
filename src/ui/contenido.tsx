import { CircleAlert, CircleCheck, CircleDashed, CloudOff, Inbox, OctagonAlert, SearchX, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GlifoIcono, type IconoProp } from "../iconos/glifos";

export type Tono = "aldia" | "porvencer" | "fallo" | "suspendido" | "sindatos";

/* Estados VALIDADOS PARA DALTONISMO: van siempre con texto y ícono, nunca solo color.
   Versión oficial del design system (4-nov): fondo -bg, texto -tinta, ícono en el hex validado. */
const TONO: Record<Tono, { chip: string; icono: string; glifo: LucideIcon }> = {
  aldia: { chip: "bg-aldia-bg text-aldia-tinta", icono: "text-aldia", glifo: CircleCheck },
  porvencer: { chip: "bg-porvencer-bg text-porvencer-tinta", icono: "text-porvencer", glifo: TriangleAlert },
  fallo: { chip: "bg-fallo-bg text-fallo-tinta", icono: "text-fallo", glifo: CircleAlert },
  suspendido: { chip: "bg-suspendido-bg text-suspendido-tinta", icono: "text-suspendido", glifo: OctagonAlert },
  sindatos: { chip: "bg-sindatos-bg text-sindatos-tinta", icono: "text-sindatos", glifo: CircleDashed },
};

/** Fondo + tinta de texto de cada estado (chips, avisos, celdas). Para el ícono del estado, `text-<tono>`. */
export const CLASES_TONO: Record<Tono, string> = {
  aldia: TONO.aldia.chip,
  porvencer: TONO.porvencer.chip,
  fallo: TONO.fallo.chip,
  suspendido: TONO.suspendido.chip,
  sindatos: TONO.sindatos.chip,
};

/** Color «hex» validado del estado, para el ícono (`text-aldia`…). */
export const COLOR_TONO: Record<Tono, string> = {
  aldia: TONO.aldia.icono,
  porvencer: TONO.porvencer.icono,
  fallo: TONO.fallo.icono,
  suspendido: TONO.suspendido.icono,
  sindatos: TONO.sindatos.icono,
};

/** Glifo reservado de cada estado. */
export const GLIFO_TONO: Record<Tono, LucideIcon> = {
  aldia: TONO.aldia.glifo,
  porvencer: TONO.porvencer.glifo,
  fallo: TONO.fallo.glifo,
  suspendido: TONO.suspendido.glifo,
  sindatos: TONO.sindatos.glifo,
};

/** `icono` por omisión = el del estado; `icono={null}` lo quita. Acepta componente, elemento o nombre del juego base.
 *  `tamano="chica"` = 20 px de alto (dentro de tablas y filas densas). */
export function ChipEstado({
  tono,
  icono,
  tamano = "normal",
  className = "",
  children,
}: {
  tono: Tono;
  icono?: IconoProp | null;
  tamano?: "normal" | "chica";
  className?: string;
  children: ReactNode;
}) {
  const t = TONO[tono];
  const glifo = icono === undefined ? t.glifo : icono;
  const chica = tamano === "chica";
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-pildora font-medium ${chica ? "h-5 gap-1 px-2 text-mini" : "h-6 gap-[5px] px-[10px] text-[12.5px]"} ${t.chip} ${className}`}
    >
      {glifo && <GlifoIcono icono={glifo} tamano={chica ? 12 : 14} className={t.icono} />}
      {children}
    </span>
  );
}

/** Iniciales en círculo (persona o contacto). */
export function Avatar({ texto, size = 36, fuente = 14, peso = 500, className = "" }: { texto: string; size?: number; fuente?: number; peso?: 300 | 400 | 500; className?: string }) {
  return (
    <span
      style={{ width: size, height: size, fontSize: fuente, fontWeight: peso }}
      className={`flex flex-none items-center justify-center rounded-full bg-hundida font-display text-tinta-2 ${className}`}
    >
      {texto}
    </span>
  );
}

/** Etiqueta de sección: mono 11, +.12em, mayúsculas. */
export function EtiquetaSeccion({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-[11px] uppercase leading-[1.3] tracking-[.12em] text-tinta-3 ${className}`}>{children}</span>;
}

/** Título de página (Sora 26/500; 22 en teléfono). */
export function Titulo({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h1 className={`m-0 font-display text-seccion font-medium text-tinta max-[620px]:text-[22px] ${className}`}>{children}</h1>;
}

/** Tarjeta base del portal (radio 14). */
export function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-tarjeta border border-borde-sutil bg-tarjeta shadow-plana ${className}`}>{children}</div>;
}

/** Tarjeta radio 16 con filas divididas (Ajustes, Desglose). Usar con FilaDato / FilaInterruptor. */
export function TarjetaFilas({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`overflow-hidden rounded-[16px] border border-borde-sutil bg-tarjeta shadow-plana ${className}`}>{children}</div>;
}

export function FilaDato({ k, children, ultima }: { k: ReactNode; children: ReactNode; ultima?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 px-[18px] py-[14px] text-[14px] ${ultima ? "" : "border-b border-divisor"}`}>
      <span className="text-tinta-3">{k}</span>
      <span className="min-w-0 text-right text-tinta">{children}</span>
    </div>
  );
}

export function Nota({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 text-[13px] leading-[1.5] text-tinta-3 ${className}`}>{children}</p>;
}

type TipoVacio = "vacio" | "sin-datos" | "caido" | "sin-coincidencias";

const ICONO_VACIO: Record<TipoVacio, LucideIcon> = {
  vacio: Inbox,
  "sin-datos": CircleDashed,
  caido: CloudOff,
  "sin-coincidencias": SearchX,
};

/** Estado vacío: ícono, una línea de qué pasa y (opcional) qué hacer.
 *  - `tipo` pone el ícono por omisión (vacío, sin datos de la fuente, servicio caído, búsqueda sin resultados);
 *    «caido» pinta el ícono en rojo y se anuncia (role="alert").
 *  - `accion`: botón o enlace de qué hacer («Agregar la primera», «Quitar filtros», «Reintentar»).
 *  - `marco`: caja con borde (cuando el vacío va suelto en la página y no dentro de una tarjeta). */
export function Vacio({
  icono,
  titulo,
  tipo,
  accion,
  marco,
  className = "",
  children,
}: {
  icono?: IconoProp;
  titulo: string;
  tipo?: TipoVacio;
  accion?: ReactNode;
  marco?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const glifo = icono ?? (tipo ? ICONO_VACIO[tipo] : undefined);
  const caido = tipo === "caido";
  return (
    <div
      role={caido ? "alert" : undefined}
      className={`flex flex-col items-center gap-2 px-6 py-12 text-center ${marco ? "rounded-tarjeta border border-borde-sutil bg-tarjeta shadow-plana" : ""} ${className}`}
    >
      {glifo && (
        <span className={`mb-1 flex size-10 items-center justify-center rounded-full ${caido ? "bg-fallo-bg text-fallo" : "bg-hundida text-tinta-3"}`}>
          <GlifoIcono icono={glifo} tamano={18} />
        </span>
      )}
      <span className="font-display text-titulo-tarjeta font-medium text-tinta">{titulo}</span>
      {children && <div className="max-w-[420px] text-ui text-tinta-3">{children}</div>}
      {accion && <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{accion}</div>}
    </div>
  );
}
