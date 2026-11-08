import { LayoutGrid } from "lucide-react";
import type { MouseEvent } from "react";

export const URL_PORTAL = "https://portal.hcmz.online";

type Props = {
  /** A dónde lleva (por omisión, la portada del portal). */
  href?: string;
  /** Solo ícono, 44×44 (cabecera móvil). */
  compacto?: boolean;
  /** Si se pasa, se usa en vez de navegar con href. */
  onClick?: () => void;
};

/* Botón «Portal»: el último de la barra de todo módulo (regla barra-de-modulo.md).
   Alto 34, padding 0 13, gap 7, radio 8, borde fuerte, glifo layout-grid 15 + «Portal» 13/500.
   Nunca «Inicio», «Volver» ni «Salir». La transición del portal lo detecta por su href. */
export function BotonPortal({ href = URL_PORTAL, compacto = false, onClick }: Props) {
  const manejar = onClick
    ? (e: MouseEvent) => {
        e.preventDefault();
        onClick();
      }
    : undefined;

  if (compacto) {
    return (
      <a href={href} onClick={manejar} aria-label="Portal" title="Portal" className="inline-flex size-11 items-center justify-center rounded-[8px] text-tinta-2">
        <LayoutGrid width={17} height={17} strokeWidth={1.75} aria-hidden="true" style={{ flex: "none" }} />
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={manejar}
      className="inline-flex h-[34px] cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-[8px] border border-borde-fuerte bg-tarjeta px-[13px] font-sans text-ui font-medium text-tinta hover:bg-sutil"
    >
      <LayoutGrid width={15} height={15} strokeWidth={1.75} aria-hidden="true" style={{ flex: "none" }} />
      Portal
    </a>
  );
}

/** Divisor vertical que va antes del botón «Portal» en la cabecera de escritorio. */
export function DivisorCabecera({ alto = 26 }: { alto?: 24 | 26 }) {
  return <span aria-hidden="true" className={`w-px flex-none bg-borde-sutil ${alto === 24 ? "h-6" : "h-[26px]"}`} />;
}
