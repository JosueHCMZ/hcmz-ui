// @j3ehcmz/ui — sistema de diseño de los módulos del Portal HCMZ.
// Estilos: @import "@j3ehcmz/ui/estilos.css" en el globals.css del módulo.

export { Shell, Monograma, type Modulo } from "./shell/Shell";
export { BotonPortal, DivisorCabecera, URL_PORTAL } from "./shell/BotonPortal";
export { BotonTema } from "./shell/BotonTema";

export { Boton, BotonIcono, Pista, FilaInterruptor, Segmentado, Interruptor } from "./ui/controles";
export {
  ChipEstado,
  Avatar,
  EtiquetaSeccion,
  Titulo,
  Tarjeta,
  TarjetaFilas,
  FilaDato,
  Nota,
  Vacio,
  CLASES_TONO,
  COLOR_TONO,
  GLIFO_TONO,
  type Tono,
} from "./ui/contenido";
export { Dialogo, Modal } from "./ui/Dialogo";
export * from "./ui/clases";

// 0.2.0 — piezas que estaban copiadas en 3+ módulos.
export { NavModulo, type EnlaceModulo } from "./ui/NavModulo";
export { EncabezadoPagina, Panel, Kpi, Aviso, Esqueleto, FilaEsqueleto } from "./ui/pagina";
export { Tabla, TH, TD, TR, type Columna } from "./ui/Tabla";
export { CampoBusqueda, BotonCopiar, ToastProvider, useToast } from "./ui/interactivos";
export { Hace, Frescura, useAhora } from "./tiempo/Hace";
export { hace, duracion, aMs, fechaCorta, fechaHora, type OpcionesHace } from "./tiempo/relativo";
export { GLIFOS_BASE, type IconoProp, type NombreIconoBase } from "./iconos/glifos";

export { ScriptsCabecera, TEMA_INICIAL } from "./navegador/ScriptsCabecera";
export { TRANSICION_PORTAL } from "./navegador/transicion-portal";
export { ReportarErrores, reportarErrorNavegador } from "./navegador/reportar-errores";
