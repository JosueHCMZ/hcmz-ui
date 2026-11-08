/* Clases sueltas para lo que no vale la pena volver componente (inputs nativos, enlaces con forma de botón).
   Mismas medidas que los componentes. Si una pantalla necesita otra medida, primero se agrega aquí. */

export const BTN =
  "inline-flex h-[34px] cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap rounded-[8px] border border-borde-fuerte bg-control px-[13px] text-ui text-tinta-2 hover:bg-sutil disabled:cursor-default disabled:opacity-50";
export const BTN_PRIMARIO =
  "inline-flex h-[34px] cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap rounded-[8px] border border-tinta bg-tinta px-[13px] text-ui font-medium text-sobre-tinta hover:opacity-90 disabled:cursor-default disabled:opacity-50";
export const BTN_PELIGRO =
  "inline-flex h-[34px] cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap rounded-[8px] border border-suspendido bg-suspendido-bg px-[13px] text-ui font-medium text-suspendido-tinta hover:opacity-90 disabled:cursor-default disabled:opacity-50";
export const INPUT =
  "h-9 w-full rounded-[8px] border border-borde-fuerte bg-control px-3 text-ui-lg text-tinta placeholder:text-tinta-apoyo focus:outline-2 focus:outline-tinta";
export const SELECT = `${INPUT} cursor-pointer`;
export const TEXTAREA = "w-full rounded-[8px] border border-borde-fuerte bg-control px-3 py-2 text-ui-lg text-tinta placeholder:text-tinta-apoyo focus:outline-2 focus:outline-tinta";
export const ETIQUETA = "mb-1 block text-mini font-medium text-tinta-2";
export const TARJETA = "rounded-tarjeta border border-borde-sutil bg-tarjeta shadow-plana";
export const TITULO = "m-0 font-display text-seccion font-medium text-tinta max-[620px]:text-[22px]";
