import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { GlifoIcono, type IconoProp } from "../iconos/glifos";
import { Boton } from "./controles";
import { COLOR_TONO, CLASES_TONO, GLIFO_TONO, type Tono } from "./contenido";

/* Piezas de página sin estado (sirven en componentes de servidor). Solo tokens del paquete. */

/** Encabezado de página: título Sora 26/500 (22 en teléfono), descripción y acciones a la derecha.
 *  - `volver`: enlace «‹ Texto» arriba (pantallas de detalle).
 *  - `etiqueta`: etiqueta mono ENCIMA del título. Úsala solo si da contexto real (el expediente, la unidad); no como adorno.
 *  - `vivo`: junto al título (p. ej. <Frescura /> o un ChipEstado). */
export function EncabezadoPagina({
  titulo,
  descripcion,
  etiqueta,
  volver,
  acciones,
  vivo,
  className = "",
}: {
  titulo: ReactNode;
  descripcion?: ReactNode;
  etiqueta?: ReactNode;
  volver?: { href: string; texto: string };
  acciones?: ReactNode;
  vivo?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-4 gap-y-3 ${className}`}>
      <div className="grid min-w-0 gap-1.5">
        {volver && (
          <Link href={volver.href} className="inline-flex min-h-6 w-fit items-center gap-1 text-ui text-tinta-3 hover:text-tinta-2">
            <ChevronLeft width={14} height={14} strokeWidth={1.75} aria-hidden="true" />
            {volver.texto}
          </Link>
        )}
        {etiqueta && <span className="font-mono text-etiqueta uppercase tracking-[.12em] text-tinta-3">{etiqueta}</span>}
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="m-0 min-w-0 font-display text-seccion font-medium text-tinta [overflow-wrap:anywhere] max-[620px]:text-[22px]">{titulo}</h1>
          {vivo}
        </div>
        {descripcion && <p className="m-0 max-w-[760px] text-ui-lg text-tinta-3 [text-wrap:pretty]">{descripcion}</p>}
      </div>
      {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
    </div>
  );
}

/** Tarjeta con encabezado (título, subtítulo, ícono y algo a la derecha) y cuerpo con relleno 18.
 *  Sin `titulo` ni `derecha` no dibuja encabezado. `etiqueta` = nombre accesible de la sección cuando no hay título visible. */
export function Panel({
  titulo,
  subtitulo,
  icono,
  derecha,
  sinRelleno = false,
  etiqueta,
  className = "",
  children,
}: {
  titulo?: ReactNode;
  subtitulo?: ReactNode;
  icono?: IconoProp;
  derecha?: ReactNode;
  sinRelleno?: boolean;
  etiqueta?: string;
  className?: string;
  children: ReactNode;
}) {
  const cabeza = titulo !== undefined || derecha !== undefined;
  return (
    <section aria-label={titulo === undefined ? etiqueta : undefined} className={`min-w-0 overflow-hidden rounded-tarjeta border border-borde-sutil bg-tarjeta shadow-plana ${className}`}>
      {cabeza && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-divisor px-[18px] py-[13px]">
          <div className="flex min-w-0 items-center gap-2.5">
            {icono && (
              <span className="flex size-7 flex-none items-center justify-center rounded-[8px] bg-hundida text-tinta-2">
                <GlifoIcono icono={icono} tamano={15} />
              </span>
            )}
            <div className="grid min-w-0">
              {titulo !== undefined && <h2 className="m-0 truncate font-display text-cuerpo font-medium text-tinta">{titulo}</h2>}
              {subtitulo && <p className="m-0 truncate text-mini text-tinta-3">{subtitulo}</p>}
            </div>
          </div>
          {derecha && <div className="flex flex-none items-center gap-2">{derecha}</div>}
        </header>
      )}
      <div className={sinRelleno ? "" : "p-[18px]"}>{children}</div>
    </section>
  );
}

const TINTA_TONO: Record<Tono, string> = {
  aldia: "text-aldia-tinta",
  porvencer: "text-porvencer-tinta",
  fallo: "text-fallo-tinta",
  suspendido: "text-suspendido-tinta",
  sindatos: "text-sindatos-tinta",
};

/** Cifra clave: etiqueta mono, valor Sora 26 con números tabulares y nota. Con `tono`, el valor va en la tinta del
 *  estado Y lleva su glifo (el estado nunca va solo en color). `compacto` = valor 20 y menos relleno (filas de 4–6). */
export function Kpi({
  etiqueta,
  valor,
  nota,
  icono,
  tono,
  compacto,
  className = "",
}: {
  etiqueta: ReactNode;
  valor: ReactNode;
  nota?: ReactNode;
  icono?: IconoProp;
  tono?: Tono;
  compacto?: boolean;
  className?: string;
}) {
  const tinta = tono ? TINTA_TONO[tono] : "text-tinta";
  return (
    <div className={`grid min-w-0 content-start gap-1 rounded-tarjeta border border-borde-sutil bg-tarjeta shadow-plana ${compacto ? "px-4 py-3" : "px-5 py-4"} ${className}`}>
      <span className="flex min-w-0 items-center gap-1.5 font-mono text-etiqueta uppercase tracking-[.12em] text-tinta-3">
        {icono && <GlifoIcono icono={icono} tamano={13} />}
        <span className="truncate">{etiqueta}</span>
      </span>
      <span className={`flex items-center gap-2 font-display font-medium tabular-nums ${compacto ? "text-[20px] leading-[1.25] tracking-[-0.01em]" : "text-[26px] leading-[1.15] tracking-[-0.02em]"} ${tinta}`}>
        {tono && <GlifoIcono icono={GLIFO_TONO[tono]} tamano={compacto ? 16 : 18} className={COLOR_TONO[tono]} />}
        {valor}
      </span>
      {nota && <span className="text-mini text-tinta-3">{nota}</span>}
    </div>
  );
}

/** Aviso en línea (banda): fondo del estado, ícono del estado, título y texto, y una acción opcional.
 *  «fallo» y «suspendido» se anuncian (role="alert"); los demás, role="status". Sin borde lateral grueso. */
export function Aviso({
  tono = "porvencer",
  icono,
  titulo,
  accion,
  className = "",
  children,
}: {
  tono?: Tono;
  icono?: IconoProp | null;
  titulo?: ReactNode;
  accion?: { texto: string; onClick: () => void };
  className?: string;
  children?: ReactNode;
}) {
  const glifo = icono === undefined ? GLIFO_TONO[tono] : icono;
  const urgente = tono === "fallo" || tono === "suspendido";
  return (
    <div role={urgente ? "alert" : "status"} className={`flex flex-wrap items-start gap-x-3 gap-y-2 rounded-panel px-4 py-3 ${CLASES_TONO[tono]} ${className}`}>
      {glifo && (
        <span className="flex h-[21px] flex-none items-center">
          <GlifoIcono icono={glifo} tamano={16} className={COLOR_TONO[tono]} />
        </span>
      )}
      <div className="grid min-w-0 flex-1 basis-[220px] gap-0.5 text-ui-lg">
        {titulo && <span className="font-medium text-tinta">{titulo}</span>}
        {children && <div className="text-tinta-2 [text-wrap:pretty]">{children}</div>}
      </div>
      {accion && (
        <Boton alto={32} variante="secundario" onClick={accion.onClick} className="-my-1">
          {accion.texto}
        </Boton>
      )}
    </div>
  );
}

/** Bloque de carga en el lugar del contenido. Pulso suave que se apaga con prefers-reduced-motion. */
export function Esqueleto({ ancho = "100%", alto = 14, redondo, className = "" }: { ancho?: number | string; alto?: number | string; redondo?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: ancho, height: alto }}
      className={`block flex-none animate-pulse bg-esqueleto motion-reduce:animate-none ${redondo ? "rounded-full" : "rounded-[6px]"} ${className}`}
    />
  );
}

const ANCHOS = ["62%", "88%", "45%", "74%", "56%"];

/** Fila de lista cargando: avatar opcional + `lineas` de anchos distintos. Anuncia «Cargando…» a lectores de pantalla. */
export function FilaEsqueleto({ lineas = 3, avatar, className = "" }: { lineas?: number; avatar?: boolean; className?: string }) {
  return (
    <div role="status" className={`flex items-start gap-3 px-[18px] py-[14px] ${className}`}>
      <span className="sr-only">Cargando…</span>
      {avatar && <Esqueleto ancho={36} alto={36} redondo />}
      <div className="grid min-w-0 flex-1 gap-2 pt-0.5">
        {Array.from({ length: lineas }, (_, i) => (
          <Esqueleto key={i} ancho={i === 0 ? "38%" : ANCHOS[i % ANCHOS.length]} alto={i === 0 ? 14 : 12} />
        ))}
      </div>
    </div>
  );
}
