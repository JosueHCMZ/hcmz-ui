import { TRANSICION_PORTAL } from "./transicion-portal";

/* Tema compartido con el portal: la fuente es la cookie portal-tema de .hcmz.online (el localStorage es de cada
   subdominio). Sin cookie = el del sistema, y lo sigue en vivo; al volver a la pestaña se relee. Si el botón de
   un módulo cambia data-tema, se guarda en la cookie y lo heredan todos. */
export const TEMA_INICIAL = `(function(){try{var h=document.documentElement,q=matchMedia('(prefers-color-scheme: dark)'),propio=null;function aplicar(){var m=document.cookie.match(/(?:^|; )portal-tema=(claro|oscuro)/);var t=m?m[1]:(q.matches?'oscuro':'claro');propio=t;if(h.dataset.tema!==t)h.dataset.tema=t}aplicar();q.addEventListener('change',aplicar);document.addEventListener('visibilitychange',function(){if(!document.hidden)aplicar()});new MutationObserver(function(){var t=h.dataset.tema==='oscuro'?'oscuro':'claro';if(t===propio)return;propio=t;var d=location.hostname.endsWith('.hcmz.online')?'; domain=.hcmz.online':'',s=location.protocol==='https:'?'; secure':'';document.cookie='portal-tema='+t+'; path=/; max-age=31536000; samesite=lax'+d+s}).observe(h,{attributes:true,attributeFilter:['data-tema']})}catch(e){}})()`;

/** Va dentro de <head> del layout raíz: «el ícono viaja» (entrada/regreso del portal) + tema antes de pintar. */
export function ScriptsCabecera({ transicion = true }: { transicion?: boolean }) {
  return (
    <>
      {transicion && <script dangerouslySetInnerHTML={{ __html: TRANSICION_PORTAL }} />}
      <script dangerouslySetInnerHTML={{ __html: TEMA_INICIAL }} />
    </>
  );
}
