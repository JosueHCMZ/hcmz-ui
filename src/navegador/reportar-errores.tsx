"use client";

import { useEffect } from "react";

/* Errores del navegador → POST /api/errores (→ GlitchTip). Sin dependencias: ~1 KB. Máximo 10 por página y sin
   repetir el mismo mensaje. Se ignora el ruido que no es del módulo (extensiones, «Script error.», ResizeObserver).
   COPIA EXACTA en todos los módulos (origen: plantilla-modulo-hcmz/components/reportar-errores.tsx). */

const vistos = new Set<string>();

export function reportarErrorNavegador(error: unknown, donde?: string) {
  try {
    const e = error instanceof Error ? error : new Error(typeof error === "string" ? error : JSON.stringify(error) ?? String(error));
    const mensaje = (e.message || String(error)).slice(0, 2000);
    const pila = e.stack ?? "";
    if (/^Script error\.?$|ResizeObserver loop|^AbortError|signal is aborted/i.test(mensaje)) return;
    if (/chrome-extension:|moz-extension:|safari-extension:/.test(pila)) return;
    const clave = `${e.name}:${mensaje}`;
    if (vistos.has(clave) || vistos.size >= 10) return;
    vistos.add(clave);
    const cuerpo = JSON.stringify({ mensaje, tipo: e.name, pila: pila.slice(0, 8000), url: location.href, donde });
    if (!navigator.sendBeacon?.("/api/errores", new Blob([cuerpo], { type: "application/json" }))) {
      void fetch("/api/errores", { method: "POST", body: cuerpo, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* reportar nunca rompe la página */
  }
}

export function ReportarErrores() {
  useEffect(() => {
    const alError = (ev: ErrorEvent) => reportarErrorNavegador(ev.error ?? ev.message, "window.onerror");
    const alRechazo = (ev: PromiseRejectionEvent) => reportarErrorNavegador(ev.reason, "promesa sin capturar");
    addEventListener("error", alError);
    addEventListener("unhandledrejection", alRechazo);
    return () => {
      removeEventListener("error", alError);
      removeEventListener("unhandledrejection", alRechazo);
    };
  }, []);
  return null;
}
