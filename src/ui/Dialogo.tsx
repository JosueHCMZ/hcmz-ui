"use client";

import { useEffect, type ReactNode } from "react";
import { Boton } from "./controles";

/** Diálogo: radio 14, sombra de menú, pie sutil con Cancelar + acción. Escape y clic afuera cancelan. */
export function Dialogo({
  titulo,
  descripcion,
  children,
  accion,
  onAccion,
  onCancelar,
  ancho = 420,
  ocupado,
  error,
  destructivo,
  deshabilitado,
}: {
  titulo: string;
  descripcion?: ReactNode;
  children?: ReactNode;
  accion: string;
  onAccion: () => void;
  onCancelar: () => void;
  ancho?: number;
  ocupado?: boolean;
  error?: string | null;
  destructivo?: boolean;
  deshabilitado?: boolean;
}) {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && !ocupado && onCancelar();
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, [onCancelar, ocupado]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-velo-dialogo p-4" onMouseDown={(e) => e.target === e.currentTarget && !ocupado && onCancelar()}>
      <div role="dialog" aria-modal="true" aria-label={titulo} style={{ maxWidth: ancho }} className="flex max-h-full w-full flex-col overflow-hidden rounded-[14px] bg-tarjeta text-tinta shadow-menu">
        <div className="min-h-0 overflow-y-auto">
          <div className="px-6 pt-6">
            <span className="block font-display text-[19px] font-normal tracking-[-.01em]">{titulo}</span>
            {descripcion && <p className="m-0 mt-[9px] text-[13.5px] leading-[1.55] text-tinta-2 [text-wrap:pretty]">{descripcion}</p>}
          </div>
          {children && <div className="flex flex-col gap-[10px] px-6 pt-[18px]">{children}</div>}
          {error && (
            <p role="alert" className="m-0 px-6 pt-3 text-[13px] text-suspendido-tinta">
              {error}
            </p>
          )}
        </div>
        <div className="mt-[22px] flex flex-none justify-end gap-[9px] border-t border-divisor bg-sutil px-6 py-4">
          <Boton onClick={onCancelar} disabled={ocupado}>
            Cancelar
          </Boton>
          <Boton variante={destructivo ? "destructivo" : "primario"} onClick={onAccion} disabled={ocupado || deshabilitado}>
            {ocupado ? "Un momento…" : accion}
          </Boton>
        </div>
      </div>
    </div>
  );
}
