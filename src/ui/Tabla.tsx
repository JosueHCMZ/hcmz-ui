import Link from "next/link";
import type { Key, ReactNode } from "react";

/* Tabla de datos (modelo: isc-hcmz components/ui/datos.tsx). Sin estado: sirve en componentes de servidor.
   Scroll horizontal PROPIO (nunca ensancha la página), números tabulares, encabezado mono. */

/** Clases de celda para tablas armadas a mano (mismas medidas que <Tabla>). */
export const TH = "whitespace-nowrap px-4 py-2.5 font-mono text-etiqueta font-medium uppercase tracking-[0.06em] text-tinta-3";
export const TD = "px-4 py-2.5 align-top text-tinta-2";
/** Fila del cuerpo (divisor + resalte al pasar). */
export const TR = "border-b border-borde-sutil last:border-0 hover:bg-sutil";

export type Columna<T> = {
  titulo: ReactNode;
  celda: (fila: T) => ReactNode;
  /** Alinea a la derecha (cifras, montos). */
  derecha?: boolean;
  /** Ancho CSS de la columna ("120px", "30%"). */
  ancho?: string;
};

export function Tabla<T>({
  etiqueta,
  columnas,
  filas,
  clave,
  enlace,
  vacio = "No hay resultados.",
  minAncho,
  enTarjeta = true,
  className = "",
}: {
  /** Nombre accesible de la tabla (y de su región con scroll). */
  etiqueta: string;
  columnas: Columna<T>[];
  filas: T[];
  /** Clave estable de cada fila; por omisión el índice. */
  clave?: (fila: T, i: number) => Key;
  /** Si la fila lleva a un detalle: la primera celda se vuelve enlace. */
  enlace?: (fila: T) => string;
  /** Lo que se ve sin filas (texto o un <Vacio />). */
  vacio?: ReactNode;
  /** Ancho mínimo en px antes de desplazar horizontalmente. */
  minAncho?: number;
  /** false = sin tarjeta alrededor (dentro de un Panel con sinRelleno). */
  enTarjeta?: boolean;
  className?: string;
}) {
  const marco = enTarjeta ? "rounded-tarjeta border border-borde-sutil bg-tarjeta shadow-plana" : "";
  if (filas.length === 0) {
    return typeof vacio === "string" ? <div className={`${marco} px-5 py-8 text-center text-ui-lg text-tinta-3 ${className}`}>{vacio}</div> : <div className={`${marco} ${className}`}>{vacio}</div>;
  }
  return (
    <div role="region" aria-label={etiqueta} tabIndex={0} className={`${marco} overflow-x-auto ${className}`}>
      <table aria-label={etiqueta} className="w-full border-collapse text-ui tabular-nums" style={minAncho ? { minWidth: minAncho } : undefined}>
        <thead>
          <tr className="border-b border-borde-sutil">
            {columnas.map((c, j) => (
              <th key={j} scope="col" className={`${TH} ${c.derecha ? "text-right" : "text-left"}`} style={c.ancho ? { width: c.ancho } : undefined}>
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => {
            const href = enlace?.(f);
            return (
              <tr key={clave ? clave(f, i) : i} className={TR}>
                {columnas.map((c, j) => (
                  <td key={j} className={`${TD} ${c.derecha ? "text-right" : ""}`}>
                    {href && j === 0 ? (
                      <Link href={href} className="font-medium text-tinta underline-offset-2 hover:underline">
                        {c.celda(f)}
                      </Link>
                    ) : (
                      c.celda(f)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
