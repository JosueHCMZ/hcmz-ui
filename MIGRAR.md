# Migrar un módulo a @j3ehcmz/ui

Receta sacada de los pilotos (ideas-hcmz y monitor-hcmz, 8-nov-2026). El objetivo: el módulo deja de tener
su propia copia del sistema de diseño y usa el paquete. **Mismo comportamiento, mismos textos, misma lógica.**
Nada de rediseños escondidos.

## 0 · Antes
- Rama nueva: `git checkout -b ui-compartida` (desde `master` al día: `git pull --ff-only`).
- Capturas «antes» (ver §4) en `<scratchpad>/<modulo>-antes`.

## 1 · Dependencia
```jsonc
// package.json → dependencies
"@j3ehcmz/ui": "^0.2.0"        // desde npm (org j3ehcmz)
```
`bun install` (genera `bun.lock`). En `next.config.ts`: `transpilePackages: ["@j3ehcmz/ui"]`.

## 2 · Lo que se BORRA del módulo (si existe y es la copia del portal)
| Archivo del módulo | Ahora viene de |
|---|---|
| `app/tokens.css`, el `@theme` de `app/globals.css` | `@import "@j3ehcmz/ui/estilos.css";` (reemplaza `@import "tailwindcss"` y `@import "./tokens.css"`) |
| `app/fonts/*.woff2` + `localFont(...)` en `layout.tsx` | el paquete (fuentes locales) |
| `app/transicion-portal.ts` + script del tema en `<head>` | `<ScriptsCabecera />` dentro de `<head>` |
| `components/reportar-errores.tsx` | `import { ReportarErrores, reportarErrorNavegador } from "@j3ehcmz/ui"` |
| `components/shell/Shell.tsx`, `BotonTema.tsx`, `ui/Monograma.tsx` | `Shell` del paquete (props: `modulo={{id, nombre, icono}}`, `persona`, `textoSoloLectura`, `navegacion`, `extras`) |
| `components/ui/estilos.ts` (clases `BTN`, `INPUT`…) | `import { BTN, INPUT, SELECT, … } from "@j3ehcmz/ui"` |

En `globals.css` queda SOLO lo propio del módulo: el acento (`--acento`, `--acento-tinta`, `--acento-bg` en
`:root` y en `[data-tema="oscuro"]`) y estilos que de verdad son de ese módulo. Si el módulo tenía un token o
una clase que el paquete NO trae, **no lo borres**: déjalo en el módulo y anótalo en el informe (puede subir al
paquete después).

## 3 · Lo que NO se toca
- `lib/` (acceso, portal-auth, sesión, drenado, registro-errores), `proxy.ts`, `instrumentation.ts`, rutas `app/api/**`,
  base de datos, scripts de despliegue, `Dockerfile` (salvo que copie archivos borrados).
- Textos, flujos, permisos. Si algo del paquete no encaja (barra con pestañas adentro, barra propia de la familia
  WhatsApp, kiosco sin barra), deja la pieza del módulo y explícalo.
- Componentes propios del módulo: se quedan, pero si usaban los archivos borrados, cambia el import al paquete.

## 4 · Validar (todo en verde o no se sube)
```bash
bun x tsc --noEmit -p .            # o bun run tipos
bun run lint
node scripts/revisar-rendimiento.mjs
npm run build
node scripts/revisar-rendimiento.mjs --build
node ~/.claude/skills/pulir-hcmz/scripts/detector.mjs .    # que no salgan hallazgos NUEVOS
```
Capturas antes y después (puerto propio, nunca matar procesos ajenos):
```bash
DEV_AUTH_BYPASS=1 node node_modules/next/dist/bin/next dev -p <puerto>   # en segundo plano
MSYS_NO_PATHCONV=1 node ~/.claude/skills/revision-visual-hcmz/scripts/capturas.mjs http://localhost:<puerto> \
  --rutas / --anchos 390,1040 --temas claro,oscuro --salida "<ruta Windows>\\<modulo>-despues"
```
Mirar «antes» y «después» con Read: se tienen que ver iguales (o mejor). Detener el `next dev` propio al terminar.
Revertir `AGENTS.md` si `next dev` lo regeneró (`git checkout AGENTS.md`).

## 5 · Commit
En la rama `ui-compartida`, un commit: `Usar @j3ehcmz/ui (tokens, fuentes, Shell y componentes del paquete)`.
No se fusiona ni se sube a `master` sin revisión.

## 6 · Componentes compartidos 0.2.0

Desde 0.2.0 el paquete trae las piezas que estaban copiadas en 3+ módulos. Al migrar (o en una pasada aparte),
**borra la copia local y usa la del paquete** si se ve igual; si la copia local hace algo más, déjala y anótalo.

| Copia local en el módulo | Ahora | Notas |
|---|---|---|
| `components/ui/Icono.tsx` (mapa propio de nombres) | `Icono` de `@j3ehcmz/ui/iconos` | Acepta `size`/`stroke` (alias). Mejor aún: importar el glifo de lucide-react por nombre. El registro pesa ~32 KB gzip: solo donde el nombre viene de datos. |
| `components/shell/Nav.tsx` (pestañas bajo la barra) | `NavModulo` en `navegacion` del Shell | `variante="barra"` = Ideas (ya trae la franja con borde); `"banda"` = Central de Atención; `"inferior-movil"` = Avisos (en teléfono, barra fija abajo: agrega `claseContenido="max-[760px]:pb-24"` al Shell). `cuenta` = insignia. Íconos como componente (`icono: Lightbulb`). |
| `Encabezado` (isc, central, m365…) | `EncabezadoPagina` | `detalle`/`texto` → `descripcion`; `derecha` → `acciones`. Sin margen propio (usa el `gap` de la página o `className`). |
| `Panel` (avisos), `Tarjeta` con título (central, m365) | `Panel` | `accion` → `derecha`; `icono` acepta componente o nombre base. |
| `Tabla`/`Columna` (isc), `Tabla` + `TH`/`TD` (avisos) | `Tabla`, `TH`, `TD`, `TR` | Scroll horizontal propio, `tabular-nums`, `etiqueta` obligatoria. `TH` ya no trae `text-left`: ponlo en la celda o en el `<tr>`. |
| `Cifra` (isc), `Kpi` (central, m365, asistencia) | `Kpi` | Con `tono`, el valor lleva también el glifo del estado. `compacto` para filas de 4–6. |
| `Aviso` (asistencia, médicos), `NoDisponible` | `Aviso` | `tono` por omisión «porvencer»; `fallo`/`suspendido` → role="alert". |
| `Hace`, `useAhora`, `haceSeg`/`haceCuanto`, `duracion` (avisos, monitor, deploy…) | `Hace`, `useAhora`, `hace(ms, ahora)`, `duracion(seg)` | Texto: «hace un momento», «hace 4 min», «hace 2 h», «ayer», «3 nov». OJO: avisos decía «hace instantes» / «hace 12 s»; cambia el texto, revísalo con el usuario si importa. |
| `Frescura` (monitor, escáneres) | `Frescura` | Genérica (recibe `fecha`); el «· sin conexión» del Monitor queda en el módulo. |
| `Filtros` con input de texto, buscadores | `CampoBusqueda` | Controlado (`valor`/`onCambio`) o en `<form method="get">` (`nombre`/`defaultValue`). |
| `Modal` (vales), diálogos sin acción fija | `Modal` o `Dialogo` sin `accion` | `pie` para botones propios. |
| `Chip`/`ChipEstado` locales, `CLASES_TONO` (avisos, central) | `ChipEstado` (`tamano="chica"`), `CLASES_TONO`, `COLOR_TONO` | Los tonos propios («primario», «neutro», «acento») no están: se quedan en el módulo. |
| `Interruptor` (deploy, luces, pantalla) | `Interruptor` | Misma `Pista` que `FilaInterruptor`. |
| `CopiarCorreo`, botones de copiar | `BotonCopiar` | Ícono 44×44 por omisión; `conTexto` = «Copiar». |
| `Toaster` (agenda) y toasts sueltos | `ToastProvider` + `useToast()` | `toast(texto, { tono, ms, deshacer })`. |
| Esqueletos sueltos (`animate-pulse`) | `Esqueleto`, `FilaEsqueleto` | Respetan prefers-reduced-motion. |
| `iniciales`, `sinTildes`/`normal` | `iniciales`, `sinAcentos`, `normalizar` de `@j3ehcmz/ui/texto` | `iniciales` = primer nombre + última palabra, salta «Dr./Licda./Ing.». |
| Botones de engrane/ajustes que desaparecían en el teléfono | `Shell` con `accionesMovil={<BotonIcono …/>}` o `extrasEnMovil` | Máximo 1–2 botones de 44×44 para que el nombre quepa en los 56 px. |

**Íconos por nombre dentro de los componentes** (`icono="inbox"`): solo el juego base (`GLIFOS_BASE`: estados,
vacíos, avisos; ~2 KB). Otro nombre pinta un círculo punteado y avisa en desarrollo: pasa el componente
(`icono={Lightbulb}`) o `icono={<Icono nombre="lightbulb" />}`.

Ver todas las piezas: `demo/Catalogo.tsx` (cópialo a `app/catalogo/page.tsx` de un módulo y abre `next dev`).
