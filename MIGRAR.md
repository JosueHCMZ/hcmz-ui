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
"@j3ehcmz/ui": "^0.1.2"        // desde npm (org j3ehcmz)
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
