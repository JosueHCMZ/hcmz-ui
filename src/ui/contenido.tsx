import { CircleAlert, CircleCheck, CircleDashed, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

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

/** `icono` por omisión = el del estado; `icono={null}` lo quita. */
export function ChipEstado({ tono, icono, children }: { tono: Tono; icono?: LucideIcon | null; children: ReactNode }) {
  const t = TONO[tono];
  const Glifo = icono === undefined ? t.glifo : icono;
  return (
    <span className={`inline-flex h-6 items-center gap-[5px] whitespace-nowrap rounded-pildora px-[10px] text-[12.5px] font-medium ${t.chip}`}>
      {Glifo && <Glifo width={14} height={14} strokeWidth={1.75} aria-hidden="true" className={t.icono} />}
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

/** Estado vacío: ícono, una línea de qué pasa y (opcional) qué hacer. */
export function Vacio({ icono: Glifo, titulo, children }: { icono?: LucideIcon; titulo: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      {Glifo && (
        <span className="mb-1 flex size-10 items-center justify-center rounded-full bg-hundida text-tinta-3">
          <Glifo width={18} height={18} strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <span className="font-display text-titulo-tarjeta font-medium text-tinta">{titulo}</span>
      {children && <div className="max-w-[420px] text-ui text-tinta-3">{children}</div>}
    </div>
  );
}
