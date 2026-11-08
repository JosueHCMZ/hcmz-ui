# @josuehcmz/ui — UI-HCMZ

Sistema de diseño compartido de los módulos del Portal HCMZ (Next 16 + Tailwind v4). Un cambio aquí llega a todos los módulos al subir la versión (Renovate).

**Fuente de diseño:** proyecto «Portal HCMZ Design System» en Claude Design (previews en claro/oscuro, kits Monitor y WhatsApp). Lo que se decide ahí se pasa aquí; la lista viva es `CAMBIOS-PAQUETE.md` de ese proyecto.

## Usar en un módulo

```bash
bun add @josuehcmz/ui
```

`next.config.ts`: `transpilePackages: ["@josuehcmz/ui"]` (se publica como TypeScript).

`app/globals.css` — solo el acento del módulo (el de su tarjeta del portal):

```css
@import "@josuehcmz/ui/estilos.css";
:root { --acento: …; --acento-tinta: …; --acento-bg: …; }
[data-tema="oscuro"] { --acento: …; --acento-tinta: …; --acento-bg: …; }
```

`app/layout.tsx`:

```tsx
import { ReportarErrores, ScriptsCabecera, Shell } from "@josuehcmz/ui";
<html lang="es" suppressHydrationWarning>
  <head><ScriptsCabecera /></head>
  <body className="min-h-screen bg-pagina font-sans text-tinta">
    <ReportarErrores />
    <Shell modulo={{ id, nombre, icono }} persona={…} navegacion={<Nav />}>{children}</Shell>
```

Se borran del módulo: `app/tokens.css`, `app/fonts/`, `app/transicion-portal.ts`, `components/shell/{Shell,BotonTema}.tsx`, `components/ui/{Monograma,estilos}.*`, `components/reportar-errores.tsx`.

## Qué trae

- **Estilos**: tokens (piedra/tinta/estados validados para daltonismo), tema Tailwind que REEMPLAZA la paleta (un hex o color de Tailwind en una clase es un bug), fuentes locales (sin Google), scroll de WhatsApp global + utilidad `sin-barra`, impresión.
- **Barra**: `Shell` (regla barra-de-modulo: medidas fijas por la transición «el ícono viaja»), `BotonPortal`, `DivisorCabecera`, `BotonTema`, `Monograma`.
- **Componentes** (rediseño v4 de WhatsApp): `Boton`, `BotonIcono`, `Pista`, `FilaInterruptor`, `Segmentado`, `ChipEstado`, `Avatar`, `EtiquetaSeccion`, `Titulo`, `Tarjeta`, `TarjetaFilas`, `FilaDato`, `Nota`, `Vacio`, `Dialogo` + clases sueltas (`BTN`, `INPUT`…).
- **Navegador**: `ScriptsCabecera` (tema compartido por cookie + transición, idéntica al maestro del portal), `ReportarErrores`.

- **Tokens extra** (ronda 4–6): Nómina (`nomina`, `[data-modulo="nomina"]`), vínculo «En Nómina» (`vinculo`), marca del membrete (`marca-*`, fijos en los dos temas) y `font-marca` (Josefin Sans local, solo membrete).
- `Boton`: altos 32–42 (38/40/42 = los del portal) y `href` → se dibuja como enlace.

Íconos: se pasan como componente de lucide-react importado por nombre (`icono={Plus}`). El registro completo del portal (319, con alias como `starlink` → `satellite-dish`) está aparte en `@josuehcmz/ui/iconos`, para usar solo donde los nombres vienen de datos.

Pendiente de portar cuando se migre cada módulo (están en Claude Design, `CAMBIOS-PAQUETE.md`): componentes del portal (BarraPortal con container queries, BuscadorRapido, MenuPerfil, Insignia, TarjetaModulo…) y los de Nómina/Resultados (HojaNomina con membrete, FranjaNomina, TablaOrdenes…).

## Rendimiento

Si el módulo tiene un mapa de íconos propio (`components/ui/Icono.tsx`) que antes cargaba su `BotonTema`, impórtalo desde un componente de cliente del layout (p. ej. el Nav) para que las páginas lo compartan; si no, cada página trae su copia (Monitor: +34 KB).

## Pilotos

`ideas-hcmz` y `monitor-hcmz`, rama `ui-compartida` (tipos, oxlint, revisión de rendimiento y build en verde; Monitor 266 KB = igual que master).
