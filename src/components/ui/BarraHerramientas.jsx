/**
 * La barra de herramientas de la tabla.
 *
 * Frank: *"de normal ese botón no es así de largo en ninguna app, el cómo se lee
 * va a la izquierda y así, o sea metele amor al UX"*. Tenía razón: eran seis
 * botones de texto corrido —COLUMNAS 24/24, VER SIN HELIUM 10, RANKS:
 * ORGÁNICOS, CÓMO SE LEE— todos del mismo peso visual y compitiendo entre sí.
 * Cuando todo grita, no se entiende qué es principal.
 *
 * Ahora hay una jerarquía:
 *   · el buscador ocupa el ancho que sobra — es lo que más se usa;
 *   · los interruptores son ICONOS con tooltip, agrupados y del mismo tamaño;
 *   · lo que solo aparece cuando hay algo que deshacer (limpiar filtros, reset)
 *     va aparte, en tono apagado, para que no pese cuando no hace falta;
 *   · la ayuda es un "?" al final, que es donde se la busca.
 */
import { Search, Columns3, EyeOff, Eye, Users, ArrowUpDown, HelpCircle, RotateCcw, FilterX, Tag } from 'lucide-react'

/** Un interruptor de la barra: solo ícono, con el estado a la vista. */
export function Boton({ icono: Icono, titulo, activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={titulo}
      aria-label={titulo}
      aria-pressed={activo}
      className={`inline-flex h-[26px] items-center gap-[0.3rem] border px-[0.45rem] text-[0.68rem] normal-case tracking-normal transition-colors
        ${activo
          ? 'border-copper-bright/70 bg-copper-bright/15 text-fg'
          : 'border-copper/35 bg-transparent text-fg/60 hover:border-copper/70 hover:text-fg/90'}`}
    >
      <Icono size={13} strokeWidth={1.75} aria-hidden="true" />
      {children}
    </button>
  )
}

// Ancho propio, no `flex-1`: la barra tiene `flex-wrap`, así que un buscador
// elástico se comía la fila entera y empujaba todo lo demás abajo. Se lleva el
// lugar más visible, pero no todo.
export function Buscador({ valor, onChange }) {
  return (
    <span className="relative flex w-[260px] max-w-full items-center">
      <Search size={13} strokeWidth={1.75} aria-hidden="true"
        className="pointer-events-none absolute left-[0.5rem] text-copper/70" />
      <input
        type="search"
        className="rsch-search h-[26px] w-full !pl-[1.6rem]"
        placeholder="Buscar keyword…"
        title={'Varias palabras: coma = o, más = y, guion adelante = saca.\n\ngoth, decor\ngoth + decor\n-witch'}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      />
    </span>
  )
}

export const Iconos = { Search, Columns3, EyeOff, Eye, Users, ArrowUpDown, HelpCircle, RotateCcw, FilterX, Tag }
