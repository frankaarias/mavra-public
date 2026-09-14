/**
 * Las dos primitivas que nos costaron la noche del 2026-07-30, ahora con Radix.
 *
 * El problema de fondo no era el z-index: era que un tooltip o un menú dibujado
 * DENTRO de una celda de tabla vive dentro del contexto de apilamiento que crea
 * ese `th` sticky. Ahí no hay número que alcance — si dos `th` empatan, gana el
 * que está después en el DOM, y por eso el tooltip salía tapado por el input de
 * la fila de abajo. La solución no es subir el número: es sacar el elemento de
 * la tabla.
 *
 * Radix lo monta en un portal, colgado de `document.body`, y encima lo
 * posiciona solo para que no se salga de la pantalla. Además trae lo que yo no
 * había escrito: cerrar con Escape, cerrar al clickear afuera, foco atrapado
 * mientras está abierto, y los `aria-*` que hacen que se pueda usar sin mouse.
 */
import * as RadixTooltip from '@radix-ui/react-tooltip'
import * as RadixPopover from '@radix-ui/react-popover'

const PANEL =
  'z-flotante bg-surface border border-copper/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] ' +
  'font-sans text-fg/90 normal-case tracking-normal'

/** El "?" de los encabezados. `texto` es la ayuda; el disparador es el hijo. */
export function Ayuda({ texto, children }) {
  if (!texto) return children ?? null
  return (
    <RadixTooltip.Root delayDuration={120}>
      <RadixTooltip.Trigger asChild>
        {children ?? (
          <button type="button" className="rsch-ayuda" aria-label={`Ayuda: ${texto}`}>
            <span aria-hidden="true">?</span>
          </button>
        )}
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side="bottom"
          align="center"
          sideOffset={6}
          collisionPadding={12}
          className={`${PANEL} max-w-[280px] px-[0.6rem] py-2 text-dato font-normal leading-[1.45] text-left whitespace-pre-line`}
        >
          {texto}
          <RadixTooltip.Arrow className="fill-[var(--surface)]" width={10} height={5} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

/** Provider único. Va una sola vez, arriba de todo el panel. */
export const ProveedorAyuda = ({ children }) => (
  <RadixTooltip.Provider delayDuration={120} skipDelayDuration={300}>
    {children}
  </RadixTooltip.Provider>
)

/**
 * Menú desplegable de columna (filtros, opciones). `boton` es lo que se ve
 * cerrado; `children`, el contenido de adentro.
 */
export function Menu({ boton, etiqueta, activo, children, ancho = 'min-w-[190px]' }) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>
        <button type="button" className={`rsch-opts-btn${activo ? ' on' : ''}`} aria-label={etiqueta}>
          {boton}
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={12}
          className={`${PANEL} ${ancho} max-h-[min(60vh,420px)] overflow-auto p-[0.55rem_0.6rem] text-dato`}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
