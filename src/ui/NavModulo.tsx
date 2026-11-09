"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { GlifoIcono, type IconoProp } from "../iconos/glifos";

export type EnlaceModulo = {
  href: string;
  texto: string;
  /** Lo normal: componente de lucide-react (icono={Lightbulb}). */
  icono?: IconoProp;
  /** Cuándo está activo. Por omisión: "/" solo en "/", lo demás en la ruta y sus hijas. */
  activo?: (ruta: string) => boolean;
  /** Insignia con un número (sin leer, pendientes). 0 o undefined = sin insignia. */
  cuenta?: number;
};

type Props = {
  enlaces: EnlaceModulo[];
  /** Nombre accesible («Secciones de Ideas»). */
  etiqueta: string;
  /**
   * - "barra" (Ideas): franja bajo la barra, pestañas compactas con subrayado de acento.
   * - "banda" (Central de Atención): franja centrada a 1180, borde inferior de acento de punta a punta de la pestaña.
   * - "inferior-movil" (Avisos): pestañas bajo la barra en escritorio; en el teléfono, barra inferior FIJA de 64 px.
   *   Con esta variante el módulo deja espacio abajo: `<Shell claseContenido="max-[760px]:pb-24">`.
   */
  variante?: "barra" | "banda" | "inferior-movil";
  className?: string;
};

const porOmision = (href: string) => (ruta: string) => (href === "/" ? ruta === "/" : ruta === href || ruta.startsWith(`${href}/`));

function Insignia({ n, movil }: { n: number; movil?: boolean }) {
  if (!n || n <= 0) return null;
  return (
    <span
      className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-pildora bg-tinta px-[5px] font-mono text-etiqueta tracking-normal text-sobre-tinta ${
        movil ? "max-[760px]:absolute max-[760px]:left-[calc(50%+6px)] max-[760px]:top-[9px]" : ""
      }`}
    >
      <span className="sr-only">, {n} pendientes</span>
      <span aria-hidden="true">{n > 99 ? "99+" : n}</span>
    </span>
  );
}

/** Navegación del módulo para el slot `navegacion` del Shell (franja propia DEBAJO de la barra). */
export function NavModulo({ enlaces, etiqueta, variante = "barra", className = "" }: Props) {
  const ruta = usePathname() ?? "/";
  const items = enlaces.map((e) => ({ ...e, on: (e.activo ?? porOmision(e.href))(ruta) }));

  if (variante === "banda") {
    return (
      <nav aria-label={etiqueta} className={`noprint border-b border-borde-sutil bg-tarjeta ${className}`}>
        <div className="sin-barra mx-auto flex w-full max-w-[1180px] gap-1 overflow-x-auto px-5 max-[620px]:px-2">
          {items.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              aria-current={e.on ? "page" : undefined}
              className={`-mb-px inline-flex h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-ui ${
                e.on ? "border-acento font-medium text-tinta" : "border-transparent text-tinta-3 hover:text-tinta"
              }`}
            >
              {e.icono && <GlifoIcono icono={e.icono} tamano={15} />}
              {e.texto}
              <Insignia n={e.cuenta ?? 0} />
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  if (variante === "inferior-movil") {
    return (
      <nav
        aria-label={etiqueta}
        className={`noprint border-b border-borde-sutil bg-tarjeta pb-[env(safe-area-inset-bottom,0px)] max-[760px]:fixed max-[760px]:inset-x-0 max-[760px]:bottom-0 max-[760px]:z-40 max-[760px]:border-b-0 max-[760px]:border-t ${className}`}
      >
        <ul
          style={{ "--columnas": `repeat(${items.length}, minmax(0, 1fr))` } as CSSProperties}
          className="m-0 flex list-none items-center gap-1 px-7 py-0 max-[760px]:grid max-[760px]:grid-cols-[var(--columnas)] max-[760px]:gap-0 max-[760px]:px-0"
        >
          {items.map((e) => (
            <li key={e.href} className="flex-none">
              <Link
                href={e.href}
                aria-current={e.on ? "page" : undefined}
                className={`relative inline-flex h-11 items-center gap-[7px] whitespace-nowrap px-3 text-ui-lg max-[760px]:h-16 max-[760px]:w-full max-[760px]:flex-col max-[760px]:justify-center max-[760px]:gap-[3px] max-[760px]:px-0 max-[760px]:text-mini ${
                  e.on
                    ? "-mb-px border-b-2 border-tinta font-semibold text-tinta max-[760px]:mb-0 max-[760px]:border-b-0 max-[760px]:shadow-[inset_0_2px_0_var(--tinta)]"
                    : "text-tinta-3"
                }`}
              >
                {e.icono && <GlifoIcono icono={e.icono} tamano={19} trazo={e.on ? 2 : 1.75} />}
                {e.texto}
                <Insignia n={e.cuenta ?? 0} movil />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // "barra"
  return (
    <div className={`noprint sin-barra overflow-x-auto border-b border-borde-sutil bg-tarjeta px-5 max-[760px]:px-3 ${className}`}>
      <nav aria-label={etiqueta} className="flex items-center gap-1">
        {items.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            aria-current={e.on ? "page" : undefined}
            className={`relative inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-[8px] px-2.5 text-ui ${e.on ? "font-medium text-tinta" : "text-tinta-3 hover:text-tinta"}`}
          >
            {e.icono && <GlifoIcono icono={e.icono} tamano={15} />}
            {e.texto}
            <Insignia n={e.cuenta ?? 0} />
            {e.on && <span aria-hidden="true" className="absolute inset-x-2.5 -bottom-px h-[2px] rounded-pildora bg-acento" />}
          </Link>
        ))}
      </nav>
    </div>
  );
}
