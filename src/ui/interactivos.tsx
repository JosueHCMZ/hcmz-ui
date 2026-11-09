"use client";

import { Check, Copy, Search, Undo2, X, type LucideIcon } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { BotonIcono } from "./controles";
import { COLOR_TONO, GLIFO_TONO, type Tono } from "./contenido";

/* ───────────── CampoBusqueda ───────────── */

/** Campo de búsqueda con lupa y botón para limpiar.
 *  - Controlado: `valor` + `onCambio`.
 *  - Dentro de un <form method="get">: `nombre` + `defaultValue` (funciona sin JS; limpiar vacía el campo y envía el formulario). */
export function CampoBusqueda({
  valor,
  onCambio,
  nombre,
  defaultValue,
  placeholder,
  etiqueta,
  limpiar = true,
  autoFocus,
  className = "",
}: {
  valor?: string;
  onCambio?: (valor: string) => void;
  nombre?: string;
  defaultValue?: string;
  placeholder: string;
  /** Nombre accesible del campo («Buscar paciente»). */
  etiqueta: string;
  limpiar?: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  const controlado = valor !== undefined;
  const [interno, setInterno] = useState(defaultValue ?? "");
  const actual = controlado ? valor : interno;
  const ref = useRef<HTMLInputElement>(null);

  const borrar = () => {
    const input = ref.current;
    if (controlado) onCambio?.("");
    else {
      setInterno("");
      if (input) input.value = "";
      onCambio?.("");
      // En un formulario GET, limpiar = quitar el filtro.
      if (input?.form && nombre && defaultValue) input.form.requestSubmit();
    }
    input?.focus();
  };

  return (
    <div className={`relative flex min-w-0 items-center ${className}`}>
      <Search width={15} height={15} strokeWidth={1.75} aria-hidden="true" className="pointer-events-none absolute left-3 text-tinta-3" />
      <input
        ref={ref}
        type="search"
        name={nombre}
        aria-label={etiqueta}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        {...(controlado ? { value: valor } : { defaultValue })}
        onChange={(e) => {
          if (!controlado) setInterno(e.target.value);
          onCambio?.(e.target.value);
        }}
        onKeyDown={(e) => e.key === "Escape" && actual && limpiar && (e.preventDefault(), borrar())}
        className={`h-9 w-full rounded-[8px] border border-borde-fuerte bg-control pl-9 text-ui-lg text-tinta placeholder:text-tinta-apoyo focus:outline-2 focus:outline-tinta [&::-webkit-search-cancel-button]:appearance-none ${limpiar ? "pr-9" : "pr-3"}`}
      />
      {limpiar && actual && (
        <button
          type="button"
          onClick={borrar}
          aria-label="Limpiar búsqueda"
          title="Limpiar búsqueda"
          className="absolute right-0.5 flex size-8 cursor-pointer items-center justify-center rounded-[7px] bg-transparent text-tinta-3 hover:bg-hundida hover:text-tinta"
        >
          <X width={15} height={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* ───────────── BotonCopiar ───────────── */

async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // http:// (modo local) o permisos: el método viejo.
    try {
      const area = document.createElement("textarea");
      area.value = texto;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Copia `texto` al portapapeles y confirma 1,5 s con ✓ (y «Copiado» para lectores de pantalla).
 *  Por omisión es botón de ícono 44×44 (`etiqueta` = su nombre); `conTexto` = botón con «Copiar». */
export function BotonCopiar({ texto, etiqueta, conTexto, icono = Copy, className = "" }: { texto: string; etiqueta: string; conTexto?: boolean; icono?: LucideIcon; className?: string }) {
  const [estado, setEstado] = useState<"listo" | "copiado" | "error">("listo");
  useEffect(() => {
    if (estado === "listo") return;
    const t = setTimeout(() => setEstado("listo"), 1500);
    return () => clearTimeout(t);
  }, [estado]);
  const copiar = async () => setEstado((await copiarTexto(texto)) ? "copiado" : "error");
  const Glifo = estado === "copiado" ? Check : icono;
  const aviso = estado === "copiado" ? "Copiado" : estado === "error" ? "No se pudo copiar" : "";

  return (
    <>
      {conTexto ? (
        <button
          type="button"
          onClick={copiar}
          title={etiqueta}
          className={`inline-flex h-8 cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap rounded-[9px] border border-borde-fuerte bg-tarjeta px-3 text-[13px] text-tinta-2 hover:bg-sutil ${className}`}
        >
          <Glifo width={15} height={15} strokeWidth={1.75} aria-hidden="true" className={estado === "copiado" ? "text-aldia" : undefined} />
          {estado === "copiado" ? "Copiado" : estado === "error" ? "No se pudo" : "Copiar"}
        </button>
      ) : (
        <BotonIcono icono={Glifo} titulo={etiqueta} onClick={copiar} size={17} className={`${estado === "copiado" ? "text-aldia" : ""} ${className}`} />
      )}
      <span role="status" className="sr-only">
        {aviso}
      </span>
    </>
  );
}

/* ───────────── Toasts ───────────── */

type OpcionesToast = { tono?: Tono; ms?: number; deshacer?: () => void };
type Toast = OpcionesToast & { id: number; texto: string };
type FnToast = (texto: string, opciones?: OpcionesToast) => void;

const ContextoToast = createContext<FnToast | null>(null);

/** Pon <ToastProvider> una vez (en el layout, dentro del Shell o alrededor). Los avisos salen abajo al centro,
 *  4 s (7 s si tienen «Deshacer»); se pausan al pasar el mouse o el foco. Sin `tono` = neutro. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const siguiente = useRef(1);
  const quitar = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const mostrar = useCallback<FnToast>((texto, opciones = {}) => {
    const id = siguiente.current++;
    setToasts((t) => [...t.slice(-2), { id, texto, ...opciones }]);
  }, []);

  return (
    <ContextoToast.Provider value={mostrar}>
      {children}
      <div aria-live="polite" className="noprint pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 max-[760px]:bottom-[calc(80px+env(safe-area-inset-bottom,0px))]">
        {toasts.map((t) => (
          <TarjetaToast key={t.id} toast={t} quitar={quitar} />
        ))}
      </div>
    </ContextoToast.Provider>
  );
}

function TarjetaToast({ toast, quitar }: { toast: Toast; quitar: (id: number) => void }) {
  const [pausa, setPausa] = useState(false);
  const { id } = toast;
  const cerrar = useCallback(() => quitar(id), [quitar, id]);
  const ms = toast.ms ?? (toast.deshacer ? 7000 : 4000);
  useEffect(() => {
    if (pausa) return;
    const t = setTimeout(cerrar, ms);
    return () => clearTimeout(t);
  }, [pausa, ms, cerrar]);
  const Glifo = toast.tono ? GLIFO_TONO[toast.tono] : null;

  return (
    <div
      role={toast.tono === "fallo" || toast.tono === "suspendido" ? "alert" : "status"}
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
      className="pointer-events-auto flex min-h-11 w-full max-w-[440px] items-center gap-2.5 rounded-panel border border-borde-sutil bg-tarjeta py-1 pl-4 pr-1 text-ui-lg text-tinta shadow-menu"
    >
      {Glifo && toast.tono && <Glifo width={16} height={16} strokeWidth={1.75} aria-hidden="true" className={`flex-none ${COLOR_TONO[toast.tono]}`} />}
      <span className="min-w-0 flex-1 py-1.5 [text-wrap:pretty]">{toast.texto}</span>
      {toast.deshacer && (
        <button
          type="button"
          onClick={() => {
            toast.deshacer?.();
            cerrar();
          }}
          className="inline-flex h-9 flex-none cursor-pointer items-center gap-1.5 rounded-[8px] bg-transparent px-2.5 text-ui font-semibold text-tinta hover:bg-hundida"
        >
          <Undo2 width={14} height={14} strokeWidth={1.75} aria-hidden="true" />
          Deshacer
        </button>
      )}
      <button type="button" onClick={cerrar} aria-label="Cerrar aviso" className="flex size-9 flex-none cursor-pointer items-center justify-center rounded-[8px] bg-transparent text-tinta-3 hover:bg-hundida">
        <X width={15} height={15} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}

/** `const toast = useToast(); toast("Orden guardada", { tono: "aldia" })`. Fuera de un ToastProvider no hace nada (avisa en desarrollo). */
export function useToast(): FnToast {
  const fn = useContext(ContextoToast);
  return (
    fn ??
    ((texto: string) => {
      if (process.env.NODE_ENV !== "production") console.warn(`[@j3ehcmz/ui] useToast() sin <ToastProvider>: «${texto}» no se mostró.`);
    })
  );
}
