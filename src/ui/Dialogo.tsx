"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Boton, BotonIcono } from "./controles";

type PropsDialogo = {
  titulo: string;
  descripcion?: ReactNode;
  children?: ReactNode;
  /** Texto del botón principal. Sin `accion` (y sin `pie`) el diálogo funciona como modal genérico: lleva botón Cerrar arriba y no tiene pie. */
  accion?: string;
  onAccion?: () => void;
  onCancelar: () => void;
  ancho?: number;
  ocupado?: boolean;
  error?: string | null;
  destructivo?: boolean;
  deshabilitado?: boolean;
  /** Pie propio (reemplaza Cancelar + acción). */
  pie?: ReactNode;
};

/** Diálogo: radio 14, sombra de menú, pie sutil con Cancelar + acción. Escape y clic afuera cancelan. */
export function Dialogo({ titulo, descripcion, children, accion, onAccion, onCancelar, ancho = 420, ocupado, error, destructivo, deshabilitado, pie }: PropsDialogo) {
  const generico = accion === undefined;
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && !ocupado && onCancelar();
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, [onCancelar, ocupado]);

  // Modal genérico: el foco entra al abrir y regresa al cerrar (el diálogo con acción conserva su comportamiento de siempre).
  useEffect(() => {
    if (!generico) return;
    const antes = document.activeElement as HTMLElement | null;
    caja.current?.focus();
    return () => antes?.focus?.();
  }, [generico]);

  const conPie = pie !== undefined || !generico;
  const cabeza = (
    <>
      <span className="block font-display text-[19px] font-normal tracking-[-.01em]">{titulo}</span>
      {descripcion && <p className="m-0 mt-[9px] text-[13.5px] leading-[1.55] text-tinta-2 [text-wrap:pretty]">{descripcion}</p>}
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-velo-dialogo p-4" onMouseDown={(e) => e.target === e.currentTarget && !ocupado && onCancelar()}>
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={generico ? -1 : undefined}
        style={{ maxWidth: ancho }}
        className="flex max-h-full w-full flex-col overflow-hidden rounded-[14px] bg-tarjeta text-tinta shadow-menu focus:outline-none"
      >
        <div className={`min-h-0 overflow-y-auto ${conPie ? "" : "pb-6"}`}>
          {generico ? (
            <div className="flex items-start gap-2 pl-6 pr-3 pt-3">
              <div className="min-w-0 flex-1 pt-3">{cabeza}</div>
              <BotonIcono icono={X} titulo="Cerrar" onClick={onCancelar} disabled={ocupado} />
            </div>
          ) : (
            <div className="px-6 pt-6">{cabeza}</div>
          )}
          {children && <div className="flex flex-col gap-[10px] px-6 pt-[18px]">{children}</div>}
          {error && (
            <p role="alert" className="m-0 px-6 pt-3 text-[13px] text-suspendido-tinta">
              {error}
            </p>
          )}
        </div>
        {pie !== undefined ? (
          <div className="mt-[22px] flex flex-none flex-wrap justify-end gap-[9px] border-t border-divisor bg-sutil px-6 py-4">{pie}</div>
        ) : (
          !generico && (
            <div className="mt-[22px] flex flex-none justify-end gap-[9px] border-t border-divisor bg-sutil px-6 py-4">
              <Boton onClick={onCancelar} disabled={ocupado}>
                Cancelar
              </Boton>
              <Boton variante={destructivo ? "destructivo" : "primario"} onClick={onAccion} disabled={ocupado || deshabilitado}>
                {ocupado ? "Un momento…" : accion}
              </Boton>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/** Modal genérico (formularios, detalle): Dialogo sin acción fija. `abierto={false}` no dibuja nada. */
export function Modal({
  titulo,
  abierto = true,
  alCerrar,
  ancho = 440,
  pie,
  descripcion,
  children,
}: {
  titulo: string;
  abierto?: boolean;
  alCerrar: () => void;
  ancho?: number;
  pie?: ReactNode;
  descripcion?: ReactNode;
  children?: ReactNode;
}) {
  if (!abierto) return null;
  return (
    <Dialogo titulo={titulo} descripcion={descripcion} onCancelar={alCerrar} ancho={ancho} pie={pie}>
      {children}
    </Dialogo>
  );
}
