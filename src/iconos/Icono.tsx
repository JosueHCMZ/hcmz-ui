import { ICONOS, ALIAS, type NombreIcono } from "./registro";

type Props = {
  nombre: NombreIcono | (string & {});
  tamano?: 12 | 14 | 15 | 16 | 18 | 20 | 24 | 28;
  trazo?: number;
  className?: string;
  /** Si el ícono comunica algo por sí solo (sin texto al lado), pasá la etiqueta. */
  etiqueta?: string;
};

export function Icono({ nombre, tamano = 16, trazo = 1.75, className, etiqueta }: Props) {
  const clave = (nombre in ICONOS ? nombre : ALIAS[nombre]) as NombreIcono | undefined;
  if (!clave && process.env.NODE_ENV !== "production") console.warn(`[Icono] «${nombre}» no está en el registro; se dibuja circle-dashed.`);
  const Comp = ICONOS[clave ?? "circle-dashed"];
  return (
    <Comp
      width={tamano}
      height={tamano}
      strokeWidth={trazo}
      absoluteStrokeWidth={false}
      className={className}
      aria-hidden={etiqueta ? undefined : true}
      aria-label={etiqueta}
      role={etiqueta ? "img" : undefined}
      focusable="false"
    />
  );
}
