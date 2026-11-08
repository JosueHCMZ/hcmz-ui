"use client";

import { useEffect } from "react";

/* Errores del navegador → POST /api/errores (→ GlitchTip). Sin dependencias: ~1 KB. Máximo 10 por página y sin
   repetir el mismo mensaje. Se ignora el ruido que no es del módulo (extensiones, «Script error.», ResizeObserver).
   Además mide el rendimiento real de esta carga de página (Web Vitals) y lo manda UNA vez, al ocultar o cerrar la
   pestaña, por la misma ruta (→ pestaña Rendimiento del Monitor). Solo ruta genérica y tiempos: nada de quién.
   Vive SOLO en @j3ehcmz/ui: los módulos lo importan, no lo copian. */

function enviar(cuerpo: string) {
  if (!navigator.sendBeacon?.("/api/errores", new Blob([cuerpo], { type: "application/json" }))) {
    void fetch("/api/errores", { method: "POST", body: cuerpo, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  }
}

/** Segmentos con números o muy largos (ids, fechas, códigos) → «:id», para no mandar datos de nadie. */
const rutaGenerica = (p: string) =>
  p
    .split("/")
    .map((s) => (s.length > 24 || (/\d/.test(s) && s.length > 2) ? ":id" : s.replace(/[^\w\-.]/g, "")))
    .join("/")
    .slice(0, 200) || "/";

let vitalesIniciadas = false;

function medirVitales() {
  if (vitalesIniciadas || typeof PerformanceObserver === "undefined") return;
  vitalesIniciadas = true;
  const v: { lcp?: number; fcp?: number; cls?: number } = {};
  const interacciones = new Map<number, number>();
  let cls = 0;
  let ventana = 0;
  let primero = 0;
  let ultimo = 0;
  const observar = (type: string, cb: (e: PerformanceEntry) => void, extra: Record<string, unknown> = {}) => {
    try {
      new PerformanceObserver((l) => l.getEntries().forEach(cb)).observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
    } catch {
      /* navegador viejo: esa métrica no se mide */
    }
  };
  observar("largest-contentful-paint", (e) => (v.lcp = e.startTime));
  observar("paint", (e) => {
    if (e.name === "first-contentful-paint") v.fcp = e.startTime;
  });
  observar("layout-shift", (e) => {
    const s = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
    if (s.hadRecentInput) return;
    if (ventana && s.startTime - ultimo < 1000 && s.startTime - primero < 5000) ventana += s.value;
    else {
      ventana = s.value;
      primero = s.startTime;
    }
    ultimo = s.startTime;
    cls = Math.max(cls, ventana);
    v.cls = cls;
  });
  observar(
    "event",
    (e) => {
      const id = (e as PerformanceEntry & { interactionId?: number }).interactionId;
      if (id) interacciones.set(id, Math.max(interacciones.get(id) ?? 0, e.duration));
    },
    { durationThreshold: 16 },
  );
  let mandado = false;
  const mandar = () => {
    if (mandado || (v.fcp === undefined && v.lcp === undefined)) return;
    mandado = true;
    const n = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const d = [...interacciones.values()].sort((a, b) => b - a);
    const red = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType;
    enviar(
      JSON.stringify({
        tipo: "vitales",
        ruta: rutaGenerica(location.pathname),
        lcp: v.lcp,
        fcp: v.fcp,
        cls: v.cls ?? 0,
        inp: d.length ? d[Math.min(Math.floor(d.length / 50), d.length - 1)] : undefined,
        ttfb: n && n.responseStart > 0 ? n.responseStart : undefined,
        carga: n && n.loadEventEnd > 0 ? n.loadEventEnd : undefined,
        ancho: innerWidth,
        red,
        nav: n?.type,
      }),
    );
  };
  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") mandar();
  });
  addEventListener("pagehide", mandar);
}

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
    enviar(JSON.stringify({ mensaje, tipo: e.name, pila: pila.slice(0, 8000), url: location.href, donde }));
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
    medirVitales();
    return () => {
      removeEventListener("error", alError);
      removeEventListener("unhandledrejection", alRechazo);
    };
  }, []);
  return null;
}
