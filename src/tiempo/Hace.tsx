"use client";

import { useEffect, useState } from "react";
import { ChipEstado, type Tono } from "../ui/contenido";
import { aMs, fechaCorta, fechaHora, hace, type OpcionesHace } from "./relativo";

type Fecha = string | number | Date | null | undefined;

/** Reloj que se actualiza solo. `null` en el servidor y en el primer render (no desfasa la hidratación).
 *  Se pausa con la pestaña oculta y se pone al día al volver (regla de rendimiento: nada corre de fondo). */
export function useAhora(cadaMs = 1000): number | null {
  const [ahora, setAhora] = useState<number | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setInterval> | undefined;
    const tic = () => setAhora(Date.now());
    const arrancar = () => {
      clearInterval(t);
      tic();
      t = setInterval(tic, cadaMs);
    };
    const visibilidad = () => (document.hidden ? clearInterval(t) : arrancar());
    const t0 = setTimeout(arrancar, 0);
    document.addEventListener("visibilitychange", visibilidad);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
      document.removeEventListener("visibilitychange", visibilidad);
    };
  }, [cadaMs]);
  return ahora;
}

/** «hace 4 min» que se actualiza solo (cada 15 s). Antes de montar muestra la fecha (igual en servidor y navegador).
 *  El `title` lleva la fecha y hora exactas de Guatemala. */
export function Hace({ fecha, prefijo, corte, nunca = "nunca", className }: { fecha: Fecha; prefijo?: string; corte?: OpcionesHace["corte"]; nunca?: string; className?: string }) {
  const ahora = useAhora(15_000);
  const ms = aMs(fecha);
  if (ms === null) return <span className={className}>{nunca}</span>;
  const texto = ahora === null ? fechaCorta(ms) : hace(ms, ahora, { corte });
  return (
    <time dateTime={new Date(ms).toISOString()} title={fechaHora(ms)} className={className}>
      {prefijo ? `${prefijo} ${texto}` : texto}
    </time>
  );
}

/** Frescura de los datos de una fuente: «Actualizado hace 2 min» en verde; ámbar pasados `avisoMin`; rojo pasados `criticoMin`;
 *  gris si nunca llegó nada. Va en `extras` del Shell o junto al título. */
export function Frescura({ fecha, avisoMin = 3, criticoMin = 5, sinDatos = "Sin datos todavía", className }: { fecha: Fecha; avisoMin?: number; criticoMin?: number; sinDatos?: string; className?: string }) {
  const ahora = useAhora(1000);
  const ms = aMs(fecha);
  let tono: Tono = "sindatos";
  let texto = sinDatos;
  if (ms !== null) {
    if (ahora === null) {
      texto = `Actualizado ${fechaCorta(ms)}`;
    } else {
      const min = (ahora - ms) / 60_000;
      const rel = hace(ms, ahora);
      tono = min >= criticoMin ? "suspendido" : min >= avisoMin ? "porvencer" : "aldia";
      texto = tono === "suspendido" ? `Última actualización ${rel}` : `Actualizado ${rel}`;
    }
  }
  return (
    <span role="status" aria-live="off" title={ms !== null ? fechaHora(ms) : undefined} className={`inline-flex ${className ?? ""}`}>
      <ChipEstado tono={tono}>{texto}</ChipEstado>
    </span>
  );
}
