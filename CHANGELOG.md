# Cambios de @j3ehcmz/ui

## 0.2.0 — 8-nov-2026

Piezas que el inventario encontró copiadas en 3 o más módulos. **Retrocompatible**: todo lo que existía en 0.1.x
se dibuja y se comporta igual (comprobado con render en servidor y con `tsc` de ideas-hcmz contra el paquete local).

### Cambiado (solo agregados opcionales)
- `Icono` (`@j3ehcmz/ui/iconos`): acepta `size` / `stroke` como alias de `tamano` / `trazo`; `tamano` acepta cualquier número.
- `Vacio`: `icono` acepta componente, elemento o nombre; nuevas props `tipo` («vacio», «sin-datos», «caido», «sin-coincidencias»: ponen el ícono por omisión; «caido» va en rojo con role="alert"), `accion` (botón o enlace), `marco` (caja con borde) y `className`.
- `ChipEstado`: `icono` acepta nombre o elemento; `tamano="chica"` (20 px, para tablas); `className`.
- `Dialogo`: `accion` / `onAccion` opcionales y `pie?: ReactNode`. Sin `accion` funciona como modal genérico (botón Cerrar arriba, foco entra y regresa). Con `accion`, idéntico a 0.1.x.
- `Segmentado`: opciones con `href` → se dibuja como navegación con enlaces de next/link y `aria-current`; `elegir` pasa a opcional (sigue funcionando igual).
- `Shell`: `accionesMovil?: ReactNode` (acciones DENTRO de la barra móvil, antes del tema) y `extrasEnMovil?: boolean` (repetir `extras` ahí). Por omisión la barra móvil queda igual que antes.

### Nuevo
- `Modal` (alias de Dialogo genérico: `titulo`, `abierto`, `alCerrar`, `ancho=440`, `pie`, `children`).
- `CLASES_TONO`, `COLOR_TONO`, `GLIFO_TONO` (mapas por estado).
- `NavModulo` (variantes «barra», «banda», «inferior-movil»), `EncabezadoPagina`, `Panel`, `Tabla` + `TH`/`TD`/`TR`, `Kpi`, `Aviso`,
  `CampoBusqueda`, `Interruptor`, `BotonCopiar`, `ToastProvider` + `useToast`, `Esqueleto`, `FilaEsqueleto`.
- Tiempo: `Hace`, `Frescura`, `useAhora` (null en servidor, pausado con la pestaña oculta) y las puras `hace`, `duracion`, `aMs`, `fechaCorta`, `fechaHora`.
- `@j3ehcmz/ui/texto`: `sinAcentos`, `normalizar`, `iniciales`.
- Íconos por nombre en los componentes: juego base `GLIFOS_BASE` (25 glifos de estados/vacíos, ~2 KB gzip). El registro
  completo (319, ~32 KB gzip) sigue aparte en `@j3ehcmz/ui/iconos`.
- `bun test tests` (pruebas de hace/duracion/sinAcentos/iniciales) y `demo/Catalogo.tsx` (no se publica).

## 0.1.2 — 8-nov-2026
- Renombrado a `@j3ehcmz/ui` (org de npm j3ehcmz).

## 0.1.0 — 4-nov-2026
- Tokens, tema Tailwind v4, fuentes locales, Shell/barra, componentes e íconos.
