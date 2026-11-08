/* «El ícono viaja» — mitad del MÓDULO (handoff «Transiciones entre módulos», partes 1b y 1c).
   El mismo archivo vive en cada módulo, al lado de su layout raíz (copiar tal cual; el original está
   en portal-hcmz/docs/transicion-portal.ts). Se pone en <head>, antes de pintar:
     <script dangerouslySetInnerHTML={{ __html: TRANSICION_PORTAL }} />
   - Entrada (1b): si se llegó desde el portal (Referrer-Policy del portal = strict-origin-when-cross-origin,
     llega el origen), el <main> funde 220 ms desde 6 px abajo. La barra NO se anima: queda fija desde el
     primer cuadro donde terminó la réplica del portal. La marca se quita al terminar ese fundido (no con un
     temporizador: si el módulo pinta tarde, el fundido igual corre y no hay brinco). Por eso la barra tiene que estar FUERA del <main>.
   - Regreso (1c): un clic en cualquier enlace a la portada del portal (el botón «Portal») funde el <main>
     160 ms y navega en el mismo clic (la red corre en paralelo; esperar el fundido solo sumaba espera). El portal, al ver que venís de acá, baja ícono y nombre a la tarjeta.
   - Precarga: al dejar el puntero ~200 ms sobre el botón «Portal», Chrome/Edge ya piden la portada (regla de
     precarga, mismo sitio: va con la cookie de Access) y el regreso no espera al servidor.
   - NADA de este script agrega nodos al HTML antes de que React hidrate: un <style>/<script> metido en <head> mientras
     se lee la página hacía que React no reconociera su <head>, tirara el error #418 y volviera a pintar TODA la página
     en cada carga (~0,6-1,2 s de congelamiento, medido el 26-oct). Por eso el estilo va como hoja adoptada (no es un
     nodo) y la regla de precarga se agrega al terminar de cargar.
   Con movimiento reducido, teclas modificadoras, botón del medio o target=_blank: navegación normal. */
export const TRANSICION_PORTAL = `(function(){try{
var P="https://portal.hcmz.online",h=document.documentElement,C="cubic-bezier(.2,0,.2,1)";
var quieto=matchMedia("(prefers-reduced-motion: reduce)").matches;
var r=document.referrer&&new URL(document.referrer);
if(r&&r.origin===P&&!quieto){h.dataset.desdePortal="1";var fin=function(){delete h.dataset.desdePortal};addEventListener("animationend",function(e){if(e.animationName==="entra-modulo")fin()});setTimeout(fin,4000)}
var css="html[data-desde-portal] main{animation:entra-modulo 220ms "+C+" backwards}@keyframes entra-modulo{from{opacity:0;transform:translateY(6px)}}";
try{var hoja=new CSSStyleSheet();hoja.replaceSync(css);document.adoptedStyleSheets=document.adoptedStyleSheets.concat(hoja)}catch(_){addEventListener("DOMContentLoaded",function(){var s=document.createElement("style");s.textContent=css;document.head.appendChild(s)})}
if(HTMLScriptElement.supports&&HTMLScriptElement.supports("speculationrules"))addEventListener("load",function(){var sr=document.createElement("script");sr.type="speculationrules";sr.textContent=JSON.stringify({prefetch:[{where:{href_matches:P+"/"},eagerness:"moderate"}]});document.head.appendChild(sr)});
document.addEventListener("click",function(e){
if(quieto||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
var a=e.target&&e.target.closest&&e.target.closest("a[href]");
if(!a||(a.target&&a.target!=="_self")||a.hasAttribute("download"))return;
var u=new URL(a.href,location.href);
if(u.origin!==P||u.pathname!=="/"||u.search||u.hash)return;
var m=document.querySelector("main");
if(!m||!m.animate)return;
e.preventDefault();
var an=m.animate([{opacity:1},{opacity:0}],{duration:160,easing:C,fill:"forwards"});
requestAnimationFrame(function(){location.href=P+"/"});
addEventListener("pageshow",function(ev){if(ev.persisted)an.cancel()},{once:true});
});
}catch(e){}})()`;
