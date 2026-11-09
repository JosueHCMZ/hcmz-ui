"use client";

/* Catálogo de componentes de @j3ehcmz/ui (NO se publica: «files» no incluye demo/).
   Para verlo: copia este archivo a un módulo como app/catalogo/page.tsx (con `export default Catalogo`,
   cambiando "../src" por "@j3ehcmz/ui") y abre /catalogo en `next dev`, en claro y oscuro, a 390 / 1040 / 1440.
   Datos de muestra SOLO aquí. */

import { Bell, Inbox, Lightbulb, ListChecks, Plus, Settings, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Aviso,
  Boton,
  BotonCopiar,
  CampoBusqueda,
  ChipEstado,
  CLASES_TONO,
  Dialogo,
  EncabezadoPagina,
  Esqueleto,
  FilaEsqueleto,
  Frescura,
  Hace,
  Interruptor,
  Kpi,
  Modal,
  NavModulo,
  Panel,
  Segmentado,
  Tabla,
  TD,
  TH,
  ToastProvider,
  Vacio,
  duracion,
  useToast,
  type Tono,
} from "../src";
import { Icono } from "../src/iconos";
import { iniciales, sinAcentos } from "../src/texto";

type Fila = { codigo: string; nombre: string; estado: Tono; monto: number };
const FILAS: Fila[] = [
  { codigo: "A-001", nombre: "Muestra uno", estado: "aldia", monto: 1250.5 },
  { codigo: "A-002", nombre: "Muestra dos con un nombre bastante largo para probar el corte", estado: "porvencer", monto: 87 },
  { codigo: "A-003", nombre: "Muestra tres", estado: "fallo", monto: 0 },
];
const TONOS: Tono[] = ["aldia", "porvencer", "fallo", "suspendido", "sindatos"];

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="grid gap-3">
      <h2 className="m-0 font-display text-modulo font-medium text-tinta">{titulo}</h2>
      {children}
    </section>
  );
}

function Contenido() {
  const toast = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [on, setOn] = useState(true);
  const [seg, setSeg] = useState<"todas" | "abiertas">("todas");
  const [modal, setModal] = useState(false);
  const [dialogo, setDialogo] = useState(false);
  const [ahora] = useState(() => Date.now());

  return (
    <div className="grid gap-10 pb-24">
      <EncabezadoPagina
        titulo="Catálogo 0.2.0"
        descripcion="Cada pieza nueva del paquete con sus variantes. Revisar en claro y oscuro."
        volver={{ href: "/", texto: "Inicio" }}
        vivo={<Frescura fecha={ahora - 4 * 60_000} />}
        acciones={
          <>
            <Boton icono={Plus} variante="primario">
              Nueva
            </Boton>
            <BotonCopiar texto="A-001" etiqueta="Copiar código" />
          </>
        }
      />

      <Seccion titulo="NavModulo">
        {(["barra", "banda"] as const).map((v) => (
          <NavModulo
            key={v}
            variante={v}
            etiqueta={`Demo ${v}`}
            enlaces={[
              { href: "/", texto: "Ideas", icono: Lightbulb, activo: () => true },
              { href: "/tareas", texto: "Tareas", icono: ListChecks, cuenta: 3 },
              { href: "/ajustes", texto: "Ajustes", icono: Settings },
            ]}
          />
        ))}
        <p className="m-0 text-ui text-tinta-3">La variante inferior-movil va fija abajo en el teléfono (ver al pie).</p>
      </Seccion>

      <Seccion titulo="Kpi">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          <Kpi etiqueta="Órdenes" valor="1,284" nota="este mes" icono={Inbox} />
          <Kpi etiqueta="Vencidas" valor="12" tono="fallo" nota="revisar hoy" />
          <Kpi etiqueta="Por vencer" valor="5" tono="porvencer" compacto />
          <Kpi etiqueta="Al día" valor="98 %" tono="aldia" compacto />
        </div>
      </Seccion>

      <Seccion titulo="Aviso">
        {TONOS.map((t) => (
          <Aviso key={t} tono={t} titulo={`Aviso ${t}`} accion={t === "fallo" ? { texto: "Reintentar", onClick: () => toast("Reintentando…") } : undefined}>
            Texto del aviso que explica qué pasó y qué hacer.
          </Aviso>
        ))}
      </Seccion>

      <Seccion titulo="ChipEstado (normal, chica, ícono por nombre) y CLASES_TONO">
        <div className="flex flex-wrap gap-2">
          {TONOS.map((t) => (
            <ChipEstado key={t} tono={t}>
              {t}
            </ChipEstado>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TONOS.map((t) => (
            <ChipEstado key={t} tono={t} tamano="chica" icono={t === "aldia" ? "check" : undefined}>
              {t}
            </ChipEstado>
          ))}
          {TONOS.map((t) => (
            <span key={`c-${t}`} className={`rounded-chip px-2 py-0.5 text-mini ${CLASES_TONO[t]}`}>
              {t}
            </span>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Panel + Tabla">
        <Panel
          titulo="Órdenes recientes"
          subtitulo="Últimos 7 días"
          icono={Users}
          derecha={<Hace fecha={ahora - 2 * 3600_000} prefijo="Actualizado" className="text-mini text-tinta-3" />}
          sinRelleno
        >
          <Tabla<Fila>
            etiqueta="Órdenes recientes"
            enTarjeta={false}
            minAncho={560}
            clave={(f) => f.codigo}
            enlace={(f) => `/orden/${f.codigo}`}
            columnas={[
              { titulo: "Código", celda: (f) => f.codigo, ancho: "110px" },
              { titulo: "Nombre", celda: (f) => f.nombre },
              {
                titulo: "Estado",
                celda: (f) => (
                  <ChipEstado tono={f.estado} tamano="chica">
                    {f.estado}
                  </ChipEstado>
                ),
              },
              { titulo: "Monto", celda: (f) => `Q${f.monto.toLocaleString("es-GT", { minimumFractionDigits: 2 })}`, derecha: true },
            ]}
            filas={FILAS}
          />
        </Panel>
        <Tabla<Fila>
          etiqueta="Vacía"
          columnas={[{ titulo: "Código", celda: (f) => f.codigo }]}
          filas={[]}
          vacio={
            <Vacio tipo="sin-coincidencias" titulo="Nada coincide con «xyz»">
              Prueba con otra palabra.
            </Vacio>
          }
        />
        <div className="overflow-x-auto rounded-tarjeta border border-borde-sutil bg-tarjeta">
          <table className="w-full border-collapse text-ui">
            <thead>
              <tr className="border-b border-borde-sutil">
                <th className={`${TH} text-left`}>TH/TD a mano</th>
                <th className={`${TH} text-right`}>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={TD}>
                  {sinAcentos("Peña")} · {iniciales("Dra. Ana Pérez")}
                </td>
                <td className={`${TD} text-right tabular-nums`}>{duracion(3700)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Seccion>

      <Seccion titulo="Vacio (tipos, marco, acción)">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
          <Vacio tipo="vacio" titulo="Todavía no hay órdenes" marco accion={<Boton icono={Plus}>Agregar la primera</Boton>}>
            Las órdenes que subas aparecen aquí.
          </Vacio>
          <Vacio tipo="sin-datos" titulo="El recolector no ha reportado" marco />
          <Vacio tipo="caido" titulo="No se pudo cargar" marco accion={<Boton>Reintentar</Boton>}>
            El servidor no respondió.
          </Vacio>
          <Vacio icono={<Icono nombre="starlink" tamano={18} />} titulo="Ícono del registro" marco />
        </div>
      </Seccion>

      <Seccion titulo="Controles">
        <div className="flex flex-wrap items-center gap-4">
          <CampoBusqueda etiqueta="Buscar" placeholder="Buscar por nombre o código" valor={busqueda} onCambio={setBusqueda} className="w-[320px] max-w-full" />
          <form method="get" className="w-[260px] max-w-full">
            <CampoBusqueda etiqueta="Buscar (formulario GET)" placeholder="En formulario GET" nombre="q" defaultValue="" />
          </form>
          <Interruptor activo={on} onCambio={setOn} etiqueta="Avisar por WhatsApp" />
          <Segmentado
            etiqueta="Filtro"
            opciones={[
              { v: "todas", txt: "Todas" },
              { v: "abiertas", txt: "Abiertas" },
            ]}
            valor={seg}
            elegir={setSeg}
          />
          <Segmentado
            etiqueta="Filtro por URL"
            opciones={[
              { v: "todas", txt: "Todas", href: "?f=todas" },
              { v: "abiertas", txt: "Abiertas", href: "?f=abiertas" },
            ]}
            valor="todas"
          />
          <BotonCopiar texto="A-001" etiqueta="Copiar código" conTexto />
        </div>
        <div className="flex flex-wrap gap-2">
          <Boton onClick={() => toast("Orden guardada", { tono: "aldia" })}>Toast al día</Boton>
          <Boton onClick={() => toast("No se pudo guardar", { tono: "fallo" })}>Toast fallo</Boton>
          <Boton onClick={() => toast("Orden archivada", { deshacer: () => toast("Deshecho") })}>Toast con deshacer</Boton>
          <Boton onClick={() => setModal(true)}>Modal</Boton>
          <Boton onClick={() => setDialogo(true)}>Dialogo (como antes)</Boton>
        </div>
      </Seccion>

      <Seccion titulo="Esqueleto">
        <div className="flex items-center gap-3">
          <Esqueleto ancho={36} alto={36} redondo />
          <Esqueleto ancho={180} />
        </div>
        <Panel sinRelleno etiqueta="Cargando lista">
          <FilaEsqueleto avatar />
          <FilaEsqueleto lineas={2} />
        </Panel>
      </Seccion>

      <Modal
        titulo="Detalle de la orden"
        abierto={modal}
        alCerrar={() => setModal(false)}
        pie={
          <Boton variante="primario" onClick={() => setModal(false)}>
            Listo
          </Boton>
        }
      >
        <p className="m-0 text-ui-lg text-tinta-2">Contenido libre del modal.</p>
      </Modal>
      {dialogo && <Dialogo titulo="¿Archivar la orden?" descripcion="Se puede recuperar después." accion="Archivar" onAccion={() => setDialogo(false)} onCancelar={() => setDialogo(false)} />}

      <NavModulo
        variante="inferior-movil"
        etiqueta="Demo inferior"
        enlaces={[
          { href: "/", texto: "Ahora", icono: Bell, activo: () => true, cuenta: 4 },
          { href: "/avisos", texto: "Avisos", icono: Inbox },
          { href: "/ajustes", texto: "Ajustes", icono: Settings },
        ]}
      />
    </div>
  );
}

export function Catalogo() {
  return (
    <ToastProvider>
      <Contenido />
    </ToastProvider>
  );
}
