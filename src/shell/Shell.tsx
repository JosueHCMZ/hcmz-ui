import Image from "next/image";
import { Circle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { BotonPortal, DivisorCabecera, URL_PORTAL } from "./BotonPortal";
import { BotonTema } from "./BotonTema";

export type Modulo = {
  /** = PORTAL_MODULE_ID (para «Pedir permiso para editar»). */
  id: string;
  /** El de la tarjeta del portal; una sola línea. */
  nombre: string;
  /** Para la barra móvil. */
  nombreCorto?: string;
  /** El MISMO glifo de la tarjeta del portal (import por nombre de lucide-react). */
  icono: LucideIcon;
  /** Caja del ícono sin acento (fondo hundida, tinta-2), como el Monitor. Por omisión lleva el acento del módulo. */
  sinAcento?: boolean;
};

type Props = {
  modulo: Modulo;
  /** Quién mira; null = sin sesión (no se muestra «quién»). */
  persona: { nombre: string; nivel?: string; puedeEditar: boolean } | null;
  /** Extras del grupo derecho (frescura, avisos), alto ≤ 34. Van ANTES del tema. */
  extras?: ReactNode;
  /** Franja propia DEBAJO de la barra (pestañas / navegación del módulo). */
  navegacion?: ReactNode;
  /** Barra pegada arriba al hacer scroll. */
  fija?: boolean;
  /** Ancho máximo del contenido; "completo" = sin límite (bandejas, tableros). */
  ancho?: "normal" | "completo";
  urlPortal?: string;
  /** Debajo de la barra móvil (p. ej. la frescura de los datos). */
  extrasMovil?: ReactNode;
  /** false = no mostrar el aviso «Solo lectura» (módulos que son de solo lectura para todos). */
  avisoSoloLectura?: boolean;
  /** Clases extra del <main> (p. ej. "flex flex-col gap-[18px]"). */
  claseContenido?: string;
  /** Texto del aviso de solo lectura, después de «Solo lectura.». */
  textoSoloLectura?: ReactNode;
  children: ReactNode;
};

/* Barra de módulo (Sistema-de-diseno-Portal-HCMZ/reglas/barra-de-modulo.md). NO cambiar medidas ni orden: la
   transición «el ícono viaja» del portal cuenta con ellas (ícono en 88,29; nombre en 130,29). La barra va FUERA
   del <main>. La sesión se maneja en el Portal: aquí solo se regresa a él. */
export function Shell({ modulo, persona, extras, navegacion, fija, ancho = "normal", urlPortal = URL_PORTAL, textoSoloLectura = "Tu cuenta puede ver pero no cambiar nada.", extrasMovil, avisoSoloLectura = true, claseContenido = "", children }: Props) {
  const Glifo = modulo.icono ?? Circle;
  const nivel = persona?.nivel ?? (persona?.puedeEditar ? "Puede editar" : "Solo lectura");
  const pedirEditar = `${urlPortal}/solicitar?modulo=${encodeURIComponent(modulo.id)}&nivel=editar`;

  return (
    <div className="min-h-screen bg-pagina">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-control focus:bg-tarjeta focus:px-3 focus:py-2 focus:text-ui"
      >
        Saltar al contenido
      </a>

      <div className={`noprint ${fija ? "sticky top-0 z-30" : ""}`}>
        {/* Escritorio */}
        <header className="flex h-14 items-center gap-[14px] border-b border-borde-sutil bg-tarjeta px-6 max-[760px]:hidden">
          <Monograma alto={30} />
          <DivisorCabecera alto={24} />
          <span className={`flex size-7 flex-none items-center justify-center rounded-[8px] ${modulo.sinAcento ? "bg-hundida text-tinta-2" : "bg-acento-bg text-acento-tinta"}`}>
            <Glifo width={16} height={16} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="whitespace-nowrap font-display text-[15px] font-medium tracking-[-0.01em] text-tinta">{modulo.nombre}</span>
          <div className="ml-auto flex items-center gap-[14px]">
            {extras}
            <BotonTema />
            {persona && (
              <div className="flex flex-col items-end gap-0.5 max-[1000px]:hidden">
                <span className="whitespace-nowrap text-ui-lg font-medium text-tinta">{persona.nombre}</span>
                <span className="font-mono text-etiqueta uppercase tracking-[0.08em] text-tinta-3">{nivel}</span>
              </div>
            )}
            <DivisorCabecera />
            <BotonPortal href={urlPortal} />
          </div>
        </header>

        {/* Móvil */}
        <header className="hidden border-b border-borde-sutil bg-tarjeta max-[760px]:block">
          <div className="flex h-14 items-center gap-2.5 pl-4 pr-1.5">
            <Monograma alto={28} />
            <span className="whitespace-nowrap font-display text-[14.5px] font-medium text-tinta">{modulo.nombreCorto ?? modulo.nombre}</span>
            <span className="ml-auto flex">
              <BotonTema grande />
              <BotonPortal href={urlPortal} compacto />
            </span>
          </div>
          {extrasMovil && <div className="px-4 pb-2.5">{extrasMovil}</div>}
        </header>

        {navegacion}
      </div>

      <main
        id="contenido"
        className={`mx-auto w-full px-7 pb-9 pt-7 max-[620px]:px-4 max-[620px]:pb-6 max-[620px]:pt-5 ${ancho === "completo" ? "" : "max-w-[1240px]"} ${claseContenido}`}
      >
        {avisoSoloLectura && persona && !persona.puedeEditar && (
          <div className="noprint mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-panel border border-borde-sutil bg-sindatos-bg px-4 py-3 text-ui text-tinta-2">
            <Circle width={14} height={14} strokeWidth={1.75} aria-hidden="true" className="text-sindatos" />
            <span>
              <b className="font-medium text-tinta">Solo lectura.</b> {textoSoloLectura}
            </span>
            <a className="font-medium text-tinta underline underline-offset-2" href={pedirEditar}>
              Pedir permiso para editar
            </a>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

/** Monograma «M» del hospital (alt según la regla de marca). Lee /marca/monograma-m.png del public/ del módulo (todos lo tienen). */
export function Monograma({ alto = 30 }: { alto?: number }) {
  return <Image src="/marca/monograma-m.png" alt="Hospital Centro Médico Zacapa" width={200} height={170} priority style={{ height: alto, width: "auto", display: "block" }} />;
}
