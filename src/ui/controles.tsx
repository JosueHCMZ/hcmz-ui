"use client";

import type { LucideIcon } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/* Piezas del sistema de diseño con los valores del rediseño v4 de WhatsApp (el más pulido).
   Íconos: se pasan como componente de lucide-react importado por nombre (icono={Plus}), así cada
   módulo solo carga los que usa. */

type BotonBase = {
  children: ReactNode;
  variante?: "primario" | "secundario" | "destructivo" | "fantasma";
  icono?: LucideIcon;
  /** 32–36: módulos (v4 de WhatsApp). 38–42: los del portal (más padding y texto). */
  alto?: 32 | 34 | 36 | 38 | 40 | 42;
  className?: string;
};

type BotonProps =
  | (BotonBase & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { href?: undefined })
  | (BotonBase & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & { href: string });

const VARIANTE: Record<NonNullable<BotonBase["variante"]>, string> = {
  primario: "border-0 bg-tinta font-semibold text-sobre-tinta hover:opacity-90",
  secundario: "border border-borde-fuerte bg-tarjeta text-tinta-2 hover:bg-sutil",
  // En oscuro, suspendido-tinta es rosa (#f0908f) y el blanco no se lee: ahí va el rojo validado #d03b3b (6,6:1).
  destructivo: "border-0 bg-suspendido-tinta font-semibold text-blanco hover:opacity-90 dark:bg-suspendido",
  fantasma: "border-0 bg-transparent text-tinta-2 hover:bg-hundida",
};

const ALTO = {
  32: "h-8 px-[15px] text-[13px]",
  34: "h-[34px] px-[15px] text-[13px]",
  36: "h-9 px-[15px] text-[13px]",
  38: "h-[38px] px-4 text-[13.5px]",
  40: "h-10 px-[18px] text-[14px]",
  42: "h-[42px] px-5 text-[14.5px]",
} as const;

/** Con `href` se dibuja como enlace (antes BotonEnlace del portal). */
export function Boton(props: BotonProps) {
  const { children, variante = "secundario", icono: Glifo, alto = 36, className = "" } = props;
  const clase = `inline-flex cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap rounded-[9px] font-sans no-underline disabled:cursor-default disabled:opacity-50 ${ALTO[alto]} ${VARIANTE[variante]} ${className}`;
  const glifo = Glifo && <Glifo width={15} height={15} strokeWidth={1.75} aria-hidden="true" style={{ flex: "none" }} />;
  if (props.href !== undefined) {
    const { children: _c, variante: _v, icono: _i, alto: _a, className: _k, ...resto } = props;
    return (
      <a {...resto} className={clase}>
        {glifo}
        {children}
      </a>
    );
  }
  const { children: _c, variante: _v, icono: _i, alto: _a, className: _k, type = "button", ...resto } = props;
  return (
    <button type={type} {...resto} className={clase}>
      {glifo}
      {children}
    </button>
  );
}

/** Botón de solo ícono, 44×44 (objetivo táctil mínimo). `titulo` es obligatorio: es su nombre accesible. */
export function BotonIcono({
  icono: Glifo,
  titulo,
  activo,
  size = 20,
  redondo,
  expandido,
  className = "",
  ...resto
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icono: LucideIcon;
  titulo: string;
  activo?: boolean;
  size?: number;
  redondo?: boolean;
  expandido?: boolean;
}) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      aria-expanded={expandido}
      {...resto}
      className={`flex size-11 flex-none cursor-pointer items-center justify-center text-tinta-2 hover:bg-hundida disabled:cursor-default disabled:opacity-50 ${redondo ? "rounded-full" : "rounded-[10px]"} ${activo ? "bg-hundida" : "bg-transparent"} ${className}`}
    >
      <Glifo width={size} height={size} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

/** Interruptor 40×24: pista de acento (encendido) o borde fuerte; perilla blanca 18. Solo visual. */
export function Pista({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`flex h-6 w-10 flex-none rounded-pildora p-[3px] transition-colors duration-[120ms] ${on ? "justify-end bg-acento" : "justify-start bg-borde-fuerte"}`}>
      <span className="size-[18px] rounded-full bg-blanco shadow-[0_1px_2px_rgba(32,40,38,.2)]" />
    </span>
  );
}

/** Fila con título, explicación e interruptor (Ajustes). `suelta` = tarjeta propia en vez de fila dentro de TarjetaFilas. */
export function FilaInterruptor({
  titulo,
  sub,
  on,
  alternar,
  suelta,
  disabled,
}: {
  titulo: ReactNode;
  sub?: ReactNode;
  on: boolean;
  alternar: () => void;
  suelta?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={alternar}
      disabled={disabled}
      className={`flex w-full cursor-pointer items-center gap-[14px] px-[18px] py-[14px] text-left disabled:cursor-default disabled:opacity-60 ${
        suelta ? "rounded-[16px] border border-borde-sutil bg-tarjeta" : "border-b border-divisor bg-transparent last:border-b-0"
      }`}
    >
      <span className="flex flex-1 flex-col gap-[3px]">
        <span className="text-[14.5px] text-tinta">{titulo}</span>
        {sub && <span className="text-[13px] leading-[1.4] text-tinta-3">{sub}</span>}
      </span>
      <Pista on={on} />
    </button>
  );
}

/** Control segmentado: fondo hundida, la opción activa en tarjeta con sombra mínima. */
export function Segmentado<T extends string>({
  opciones,
  valor,
  elegir,
  etiqueta,
  alto = 34,
  ancho,
  colorActivo,
  className = "",
}: {
  opciones: { v: T; txt: ReactNode; disabled?: boolean }[];
  valor: T;
  elegir: (v: T) => void;
  /** Nombre accesible del grupo. */
  etiqueta: string;
  alto?: 30 | 32 | 34;
  /** "igual" = todas del mismo ancho. */
  ancho?: "igual";
  colorActivo?: (v: T) => string;
  className?: string;
}) {
  const h = { 30: "h-[30px]", 32: "h-8", 34: "h-[34px]" }[alto];
  return (
    <div role="tablist" aria-label={etiqueta} className={`flex rounded-[10px] bg-hundida p-[3px] ${className}`}>
      {opciones.map((o) => {
        const on = o.v === valor;
        return (
          <button
            key={o.v}
            type="button"
            role="tab"
            aria-selected={on}
            disabled={o.disabled}
            onClick={() => !o.disabled && elegir(o.v)}
            className={`${h} cursor-pointer whitespace-nowrap rounded-[8px] font-medium disabled:cursor-default disabled:opacity-45 ${
              ancho === "igual" ? "flex-1" : alto === 34 ? "px-4" : "px-3"
            } ${alto === 34 ? "text-[13.5px]" : "text-[13px]"} ${on ? `bg-tarjeta shadow-plana ${colorActivo?.(o.v) ?? "text-tinta"}` : "bg-transparent text-tinta-3"}`}
          >
            {o.txt}
          </button>
        );
      })}
    </div>
  );
}
