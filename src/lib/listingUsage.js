// Dónde está usada cada keyword dentro del listing, con la lectura de DataDive.
//
// Los cinco campos indexables: T = título · B = viñetas · D = descripción ·
// GK = Generic Keywords (los search terms del backend) · IH = Item Highlight, el
// campo de 125 caracteres que Amazon muestra bajo el título cuando el título baja
// de 75 caracteres.
//
// El match es LITERAL: Amazon no hace stemming, así que `goth` nunca cuenta como
// `gothic`. Lo único que se tolera es la variación de plural (s / es).

export const USAGE_FIELDS = [
  { key: 'T', label: 'Título' },
  { key: 'B', label: 'Viñetas' },
  { key: 'D', label: 'Descripción' },
  { key: 'GK', label: 'Generic Keywords (backend)' },
  { key: 'IH', label: 'Item Highlight' },
]

const palabras = (s) => (s || '').toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, ' ').split(' ').filter(Boolean)
const singular = (w) =>
  w.length > 4 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w

/** 'exact' | 'exact plural' | 'broad' | 'broad plural' | null (no está) */
export function fieldMatch(kw, texto) {
  const hay = palabras(texto)
  const busca = palabras(kw)
  if (!busca.length || !hay.length) return null
  const contiguo = (cmp) => {
    for (let i = 0; i + busca.length <= hay.length; i++) {
      if (busca.every((w, j) => cmp(w, hay[i + j]))) return true
    }
    return false
  }
  const igual = (a, b) => a === b
  const igualPlural = (a, b) => singular(a) === singular(b)
  if (contiguo(igual)) return 'exact'
  if (contiguo(igualPlural)) return 'exact plural'
  if (busca.every((w) => hay.some((h) => igual(w, h)))) return 'broad'
  if (busca.every((w) => hay.some((h) => igualPlural(w, h)))) return 'broad plural'
  return null
}

export const SIN_CAMPO = 'sin escribir'
export const NO_ESTA = 'no está'

/** El valor que va en la celda: el tipo de match, "no está", o "sin escribir" si el campo no existe. */
export function usageValor(kw, texto) {
  if (!texto) return SIN_CAMPO
  return fieldMatch(kw, texto) || NO_ESTA
}

export const USAGE_COLOR = {
  exact: '#6f9c63',
  'exact plural': '#6f9c63',
  broad: '#d08b3f',
  'broad plural': '#d08b3f',
}
export const USAGE_HUECO = new Set(['exact plural', 'broad plural'])

export const USAGE_AYUDA =
  'Dónde está usada la keyword. Verde: la frase aparece tal cual. Naranja: están todas las ' +
  'palabras pero separadas. Gris: no está. Punteado: ese campo aún no está escrito.'

// 🔑 La versión inglesa del mismo texto. Vive al lado del castellano a
// propósito: si alguien cambia la lectura de un color, tiene las dos frases
// delante y no se olvida de una — que es como una app queda diciendo cosas
// distintas en cada idioma.
export const USAGE_AYUDA_EN =
  'Where the keyword is used. Green: the phrase appears verbatim. Orange: every word is ' +
  'there but apart. Grey: not there. Dotted: that field is not written yet.'
