import {
  Ban,
  BellOff,
  Check,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleHelp,
  CircleX,
  Clock,
  CloudOff,
  FilterX,
  History,
  Inbox,
  Info,
  LoaderCircle,
  Lock,
  OctagonAlert,
  Plus,
  RefreshCw,
  Search,
  SearchX,
  TriangleAlert,
  Unplug,
  WifiOff,
  X,
  type LucideIcon,
} from "lucide-react";
import { isValidElement, type ReactElement } from "react";

/* Íconos por NOMBRE dentro de los componentes del paquete (Vacio, ChipEstado, Panel, Aviso, Kpi…).
   Solo un juego BASE (estados, vacíos, avisos): el registro completo pesa ~32 KB gzip y cargarlo desde
   ChipEstado lo metería en todas las páginas. Para cualquier otro nombre:
     icono={Lightbulb}                       ← lo normal (import por nombre de lucide-react)
     icono={<Icono nombre="lightbulb" />}    ← nombre que viene de datos (@j3ehcmz/ui/iconos) */
export const GLIFOS_BASE = {
  ban: Ban,
  "bell-off": BellOff,
  check: Check,
  "circle-alert": CircleAlert,
  "circle-check": CircleCheck,
  "circle-dashed": CircleDashed,
  "circle-help": CircleHelp,
  "circle-x": CircleX,
  clock: Clock,
  "cloud-off": CloudOff,
  "filter-x": FilterX,
  history: History,
  inbox: Inbox,
  info: Info,
  "loader-circle": LoaderCircle,
  lock: Lock,
  "octagon-alert": OctagonAlert,
  plus: Plus,
  "refresh-cw": RefreshCw,
  search: Search,
  "search-x": SearchX,
  "triangle-alert": TriangleAlert,
  unplug: Unplug,
  "wifi-off": WifiOff,
  x: X,
} as const satisfies Record<string, LucideIcon>;

/** Alias del registro del portal que caen en el juego base. */
const ALIAS_BASE: Record<string, keyof typeof GLIFOS_BASE> = {
  alerta: "triangle-alert",
  bien: "circle-check",
  mal: "circle-x",
  reloj: "clock",
  cargando: "loader-circle",
  buscar: "search",
  "octagon-x": "octagon-alert",
};

export type NombreIconoBase = keyof typeof GLIFOS_BASE;

/** Lo que aceptan las props `icono` de los componentes: componente de lucide-react, elemento ya dibujado o nombre del juego base. */
export type IconoProp = LucideIcon | ReactElement | NombreIconoBase | (string & {});

function glifoPorNombre(nombre: string): LucideIcon {
  const clave = (nombre in GLIFOS_BASE ? nombre : ALIAS_BASE[nombre]) as NombreIconoBase | undefined;
  if (!clave && process.env.NODE_ENV !== "production")
    console.warn(`[@j3ehcmz/ui] El ícono «${nombre}» no está en el juego base; pasa el componente (icono={X}) o <Icono nombre="${nombre}" />.`);
  return GLIFOS_BASE[clave ?? "circle-dashed"];
}

/** Dibuja una prop `icono` (componente, elemento o nombre). Decorativo: aria-hidden. */
export function GlifoIcono({ icono, tamano = 16, trazo = 1.75, className }: { icono: IconoProp; tamano?: number; trazo?: number; className?: string }) {
  if (isValidElement(icono)) return icono;
  const Comp = typeof icono === "string" ? glifoPorNombre(icono) : (icono as LucideIcon);
  return <Comp width={tamano} height={tamano} strokeWidth={trazo} aria-hidden="true" focusable="false" className={className} style={{ flex: "none" }} />;
}
