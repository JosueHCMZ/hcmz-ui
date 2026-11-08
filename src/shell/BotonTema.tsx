"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Tema = "claro" | "oscuro";

function leer(): Tema {
  return document.documentElement.dataset.tema === "oscuro" ? "oscuro" : "claro";
}

function suscribir(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  return () => obs.disconnect();
}

/* Cambia data-tema en <html>; el script TEMA_INICIAL lo guarda en la cookie portal-tema y lo heredan todos los módulos. */
export function BotonTema({ grande = false }: { grande?: boolean }) {
  const tema = useSyncExternalStore(suscribir, leer, () => "claro" as Tema);
  const Glifo = tema === "oscuro" ? Sun : Moon;

  function alternar() {
    document.documentElement.dataset.tema = leer() === "oscuro" ? "claro" : "oscuro";
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={tema === "oscuro" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={
        grande
          ? "inline-flex size-11 cursor-pointer items-center justify-center border-0 bg-transparent text-tinta-2"
          : "inline-flex size-[34px] cursor-pointer items-center justify-center rounded-[8px] border border-borde-fuerte bg-control text-tinta transition-colors duration-[120ms] ease-estandar hover:bg-sutil"
      }
    >
      <Glifo width={grande ? 18 : 16} height={grande ? 18 : 16} strokeWidth={1.85} aria-hidden="true" />
    </button>
  );
}
