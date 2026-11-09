import { ICONOS, ALIAS, type NombreIcono } from "./registro";

type Props = {
  /** Nombre del registro (kebab-case de Lucide) o alias del portal (`starlink`, `bien`…). */
  nombre: NombreIcono | (string & {});
  /** Tamaño en px (12–28 son los del sistema). */
  tamano?: number;
  /** Alias de `tamano` (el nombre que usaban las copias locales de los módulos). */
  size?: number;
  trazo?: number;
  /** Alias de `trazo`. */
  stroke?: number;
  className?: string;
  /** Si el ícono comunica algo por sí solo (sin texto al lado), pasá la etiqueta. */
  etiqueta?: string;
};

export function Icono({ nombre, tamano, size, trazo, stroke, className, etiqueta }: Props) {
  const px = tamano ?? size ?? 16;
  const grosor = trazo ?? stroke ?? 1.75;
  const clave = (nombre in ICONOS ? nombre : ALIAS[nombre]) as NombreIcono | undefined;
  if (!clave && process.env.NODE_ENV !== "production") console.warn(`[Icono] «${nombre}» no está en el registro; se dibuja circle-dashed.`);
  const Comp = ICONOS[clave ?? "circle-dashed"];
  return (
    <Comp
      width={px}
      height={px}
      strokeWidth={grosor}
      absoluteStrokeWidth={false}
      className={className}
      aria-hidden={etiqueta ? undefined : true}
      aria-label={etiqueta}
      role={etiqueta ? "img" : undefined}
      focusable="false"
    />
  );
}
