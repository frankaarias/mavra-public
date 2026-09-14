import { NICHOS, GEO_FUERA_DE_US, NICHO_POR_DEFECTO } from './nichos.js'

/**
 * MOTOR DE SELECCIÓN DE CREADORES — genérico, parametrizado por nicho
 *
 * Escrito el 2026-08-06 después de abrir 86 cuentas del directorio una por una.
 * De esas 86: 27 eran del nicho, 6 eran COMPETIDORES y 5 tenían geo fuera de EE.UU.
 *
 * La conclusión que manda todo este archivo:
 *
 *    Las tres cosas que descalifican a un creador —competidor, geo y encaje—
 *    NO SE VEN EN NINGÚN NÚMERO. Hay que abrir el perfil.
 *
 * El scorer ordena una lista larga. No decide quién entra.
 * Los descartes de valor los encontró Frank mirando, no el scorer midiendo.
 */

// ─────────────────────────────────────────────────────────────────────────────
// FILTROS DUROS — si falla uno, queda fuera. No se compensan con alcance.
// ─────────────────────────────────────────────────────────────────────────────

export const FILTROS_DUROS = [
  {
    id: 'storefront',
    titulo: 'Storefront real de amazon.com',
    pregunta: '¿El link de la bio lleva a amazon.com/shop/... verificado abriéndolo?',
    porque:
      'El campo del directorio mintió en las dos direcciones: marcó ✅ una WISHLIST ' +
      '(@easttnelvira) y marcó ❓ a cuatro que sí tenían storefront, incluidos los dos ' +
      'mejores por alcance. El dato estaba a un clic, dentro del linktree.',
    comoSeVerifica:
      'Abrir la bio. Si el link es un linktree/direct.me/bio.site, abrirlo también. ' +
      'Buscar amazon.com/shop/. Ojo: el nombre del storefront NO tiene por qué ' +
      'coincidir con el handle (@lexidevail → potterprimos, @kcallanott → influencer-27ca5225).',
  },
  {
    id: 'geo',
    titulo: 'Geo compatible con EE.UU.',
    pregunta: '¿Su audiencia compra donde vendemos?',
    porque:
      'MAVRA vende en amazon.com. Un creador australiano, alemán o turco tiene una ' +
      'audiencia que no puede comprarnos. En 86 cuentas aparecieron 5 con geo fuera ' +
      'de EE.UU. y ningún filtro numérico las habría visto.',
    comoSeVerifica:
      'La bio lo suele decir gratis: bandera, ciudad o idioma. "satx creator" = San ' +
      'Antonio TX. "📍Germany". "In Elenco AGCOM" = regulador italiano. Si no lo dice, ' +
      'el storefront .com sin links a .co.uk/.com.au/.de es señal fuerte — no prueba.',
  },
  {
    id: 'no_competidor',
    titulo: 'No vende decoración',
    pregunta: '¿El link de bio lleva a una tienda propia?',
    porque:
      'Seis competidores estaban DENTRO del directorio de creadores, y a todos les ' +
      'íbamos a mandar producto gratis. @ilove.skull vende calaveras en skullstores.com. ' +
      '@spiraldirect y @moodyygoodyy tienen marca propia.',
    comoSeVerifica:
      'Mirar el link de bio. Web propia, Etsy, Shopify o Big Cartel = revisar QUÉ vende. ' +
      'Vender no descalifica solo: @bridgetteturco tiene Etsy pero vende descargas ' +
      'digitales, no decoración física. Lo que descalifica es vender NUESTRA categoría.',
  },
  {
    id: 'encaje',
    titulo: 'Encaje declarado, no inferido',
    pregunta: '¿La bio nombra casa, decoración o interiores?',
    porque:
      'Este es el filtro que faltaba y el que metió más ruido. "witchy", "spooky" y ' +
      '"goth" a secas NO son el nicho: en TikTok eso es mayormente brujería, tarot y ' +
      'moda. Siete cuentas de tarot entraron por ahí, y las tres más grandes de todo ' +
      'el directorio (2,4M, 1,4M, 914K) son ruido.',
    comoSeVerifica:
      'Leer la bio buscando: home, decor, interiors, house, room. ' +
      '"Curvy alt fashion & GOTH HOME DECOR" entra. "folk witch" no. ' +
      '"Gothic Baby series/book" tampoco, por más 2,4M que tenga.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEÑALES — ordenan a los que ya pasaron los filtros duros. No deciden.
// ─────────────────────────────────────────────────────────────────────────────

export const SENALES = [
  {
    id: 'alcance',
    titulo: 'Alcance real',
    formula: 'vistas medianas ÷ seguidores',
    porque:
      'Los seguidores no dicen quién ve. @gothicdecor tenía 200K y rendía 0,09%. ' +
      'Pero ojo con el otro extremo: @witchy..aesthetic dio alcance 12,00 con ' +
      'CUATRO seguidores. Sin piso de audiencia, el ratio es ruido.',
    piso: 'Ignorar el ratio por debajo de ~5.000 seguidores.',
  },
  {
    id: 'monetiza_amazon',
    titulo: 'Monetiza Amazon de verdad',
    formula: 'tiene storefront + enlaces amzn.to activos',
    porque:
      'Tener la tienda abierta no es lo mismo que usarla. @houseonoctoberdrive tiene ' +
      '17 enlaces amzn.to en su linktree: eso es alguien que ya vive de esto. ' +
      'Quien monetiza con TikTok Shop (collabs.shop) o solo con LTK juega otro juego, ' +
      'y hay que explicarle el trato antes.',
  },
  {
    id: 'engagement',
    titulo: 'Engagement',
    formula: 'likes ÷ (seguidores × videos), o el que reporte la fuente',
    porque: 'Complementa al alcance. Alto engagement con audiencia chica sigue siendo un envío barato.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EVALUADOR — genérico. El vocabulario entra por parámetro, no está clavado acá.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evalúa un creador contra los 4 filtros duros del nicho indicado.
 *
 * @param {object} c      { handle, bio, bioLink, storefront, pais, seguidores }
 * @param {string} nichoId  clave de NICHOS (por defecto, el de la marca actual)
 * @returns {{ apto: boolean, fallos: string[], avisos: string[] }}
 */
export function evaluarCreador(c = {}, nichoId = NICHO_POR_DEFECTO) {
  const n = NICHOS[nichoId]
  if (!n) throw new Error(`Nicho desconocido: ${nichoId}`)

  const fallos = []
  const avisos = []
  const bio = (c.bio || '').toLowerCase()
  const link = (c.bioLink || '').toLowerCase()
  const sf = (c.storefront || '').toLowerCase()
  const shopPath = `${n.marketplace}/shop/`

  // 1 · storefront real del marketplace donde vendemos
  if (!sf.includes(shopPath)) {
    if (sf.includes('wishlist') || sf.includes('baby-reg')) {
      fallos.push('El link de Amazon es una wishlist o baby registry, no un storefront')
    } else if (sf) {
      fallos.push(`Storefront no verificado como ${shopPath}`)
    } else {
      fallos.push('Sin storefront verificado')
    }
  }
  if (n.marketplacesAjenos.some(m => (link + sf).includes(m))) {
    fallos.push('Enlaza a un marketplace donde no vendemos')
  }

  // 2 · geo
  if (GEO_FUERA_DE_US.test(bio) || GEO_FUERA_DE_US.test(c.pais || '')) {
    fallos.push('Geo declarada fuera del mercado donde vendemos')
  }

  // 3 · competidor
  if (n.competidores.some(x => link.includes(x.toLowerCase()) || (c.handle || '').toLowerCase().includes(x.toLowerCase()))) {
    fallos.push('Es competidor conocido')
  }
  if (/etsy\.com\/shop|myshopify|bigcartel|\.store/.test(link)) {
    avisos.push('El link de bio lleva a tienda propia — revisar QUÉ vende antes de decidir')
  }

  // 4 · encaje declarado
  const encaja = n.encaje.some(w => bio.includes(w))
  if (!encaja) fallos.push('La bio no nombra nada del nicho')

  const falsoAmigo = n.falsosAmigos.some(w => bio.includes(w))
  if (falsoAmigo && !encaja) {
    fallos.push('Cae en un falso amigo del nicho: la palabra parece del rubro pero el contenido es otro')
  }

  // 🔴 Piso de audiencia: es FILTRO DURO, no aviso.
  // @witchy..aesthetic dio el alcance más alto de las 66 medidas (12,00) con
  // CUATRO seguidores y un video. Si esto fuera solo un aviso, volvería a colarse.
  if (typeof c.seguidores === 'number' && c.seguidores < n.pisoSeguidores) {
    fallos.push(`Menos de ${n.pisoSeguidores.toLocaleString('es')} seguidores: sin audiencia el ratio de alcance es ruido`)
  }

  return { apto: fallos.length === 0, fallos, avisos }
}

// ─────────────────────────────────────────────────────────────────────────────
// LO QUE COSTÓ APRENDER ESTO — casos reales, para no repetirlos
// ─────────────────────────────────────────────────────────────────────────────

export const CASOS = [
  { handle: '@theblackenedteeth', motivo: 'COMPETIDOR', detalle: 'marca de gothic home decor UK. Salía por alcance 0,01, o sea por el motivo equivocado: el día que su engagement subiera, volvía a entrar.' },
  { handle: '@ilove.skull', motivo: 'COMPETIDOR', detalle: '174K seguidores y skullstores.com/shop en la bio.' },
  { handle: '@thegrimmremains', motivo: 'GEO', detalle: 'Australia. Tenía storefront ✅ y alcance 0,25: pasaba todos los filtros numéricos.' },
  { handle: '@saturns_elixir', motivo: 'NO NICHO', detalle: 'músico. 528 videos, ninguno de decoración. Entró por alcance 0,16 y storefront ✅.' },
  { handle: '@easttnelvira', motivo: 'STOREFRONT FALSO', detalle: 'el directorio lo marcaba ✅ y el link era una wishlist. Además: fotógrafa boudoir.' },
  { handle: '@witchy..aesthetic', motivo: 'RATIO SIN PISO', detalle: 'alcance 12,00 — el más alto de las 66 medidas — con 4 seguidores y 1 video.' },
  { handle: '@rebyhardy', motivo: 'NO NICHO', detalle: '2,4M seguidores, actriz con agencia. Ordenar por seguidores la habría puesto primera.' },
  { handle: '@bridgetteturco', motivo: 'FALSA ALARMA', detalle: 'tiene Etsy propio, pero vende descargas digitales. NO es competidora: entró al lote.' },
]
