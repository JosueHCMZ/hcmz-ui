// @josuehcmz/ui — sistema de diseño de los módulos del Portal HCMZ.
// Estilos: @import "@josuehcmz/ui/estilos.css" en el globals.css del módulo.

export { Shell, Monograma, type Modulo } from "./shell/Shell";
export { BotonPortal, DivisorCabecera, URL_PORTAL } from "./shell/BotonPortal";
export { BotonTema } from "./shell/BotonTema";

export { Boton, BotonIcono, Pista, FilaInterruptor, Segmentado } from "./ui/controles";
export { ChipEstado, Avatar, EtiquetaSeccion, Titulo, Tarjeta, TarjetaFilas, FilaDato, Nota, Vacio, type Tono } from "./ui/contenido";
export { Dialogo } from "./ui/Dialogo";
export * from "./ui/clases";

export { ScriptsCabecera, TEMA_INICIAL } from "./navegador/ScriptsCabecera";
export { TRANSICION_PORTAL } from "./navegador/transicion-portal";
export { ReportarErrores, reportarErrorNavegador } from "./navegador/reportar-errores";
