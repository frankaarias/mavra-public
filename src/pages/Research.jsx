import { Fragment, useMemo, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import useMavraLanguage from '../components/useMavraLanguage.js'
import { traducir } from './researchI18n.js'
import { Ayuda as TooltipRadix, Menu as MenuRadix, ProveedorAyuda } from '../components/ui/Flotantes'
import { traerCorrecciones, guardarCorrecciones } from '../lib/correcciones'
import { Boton, Buscador, Iconos } from '../components/ui/BarraHerramientas'
import lmp from '../data/lmp_mkl_v3.json'
import cnd from '../data/cnd_mkl_v3.json'
import swd from '../data/swd_mkl_v3.json'
import lmpUkl from '../data/lmp_ukl.json'
import cndUkl from '../data/cnd_ukl.json'
import swdUkl from '../data/swd_ukl.json'
// El copy vivo de cada producto (título de 75, viñetas, backend, Item Highlight) y
// la lectura de "dónde está usada esta keyword" al estilo DataDive.
import LISTING_COPY from '../data/listing_copy.json'
// Ficha de cada competidor por ASIN (foto, marca, título, precio, reseñas, rating).
// El reverse-ASIN solo devuelve el ASIN y los ranks: esto lo completa.
import COMP_INFO from '../data/competidores_info.json'
import { USAGE_FIELDS, usageValor, USAGE_COLOR, USAGE_HUECO, USAGE_AYUDA, USAGE_AYUDA_EN, SIN_CAMPO, NO_ESTA } from '../lib/listingUsage'

// Los tres MKL de MAVRA. LMP sale del export de Cerebro (matriz completa por ASIN);
// CND y SWD se reconstruyeron con el MCP de H10, una llamada por competidor, para
// tener el rank individual y poder calcular la relevancy de página 1 igual que DataDive.
const DATASETS = { LMP: lmp, CND: cnd, SWD: swd }
// La UKL es OTRA fuente, no otro bucket: el MKL sale del reverse ASIN (el mundo de
// tus competidores) y la UKL sale de Magnet por roots (la demanda del nicho). Por
// eso vive en su propio archivo y en su propia tabla, al lado del MKL.
const UKL = { LMP: lmpUkl, CND: cndUkl, SWD: swdUkl }

// MKL v3 — las tablas de DataDive con SUS umbrales exactos + Roots + Normalizer +
// Competidores + Overview.
// Relevancy % = competidores en PÁGINA 1 (top 45) ÷ total.
// MKL: relevancy ≥30% y SV ≥450 · Outliers: SV ≥2.000 y relevancy <30% · Residue: el resto
// que alguien rankea · Negatives: mismatch de producto (nuestro, DD no lo hace).
// Descartadas: nadie rankea ni en el top 101 — no es un bucket, es ruido: va al pie.
// La UKL es otra FUENTE (Magnet por roots) pero se comporta como un bucket más:
// Frank la quiere con todo lo que tienen las otras tablas — mover keywords de ahí
// al MKL, filtrar, seleccionar. Tenerla como tabla aparte la dejaba heredando la
// mitad de las funciones; como bucket las hereda todas y sin código especial.
// El orden es el del embudo, no el del dive: primero el universo del nicho, y de
// ahí se baja a lo que ya se pelea, lo que sobra y lo que se descarta.
// (Frank, 2026-07-31)
// 🔴 `Negatives` SIGUE SIENDO UN BUCKET, PERO NO UNA PESTAÑA.
//
// Frank, 2026-09-15: esta pantalla tiene que leerse como el MKL que ya
// entregamos (app.agta.io/mkl/...), y ahí Negatives no existe — las pestañas
// son MKL · Atípicos · Residuo · Raíces · Competidores.
//
// ⚠️ Se saca de la NAVEGACIÓN, no de `assign`. Las 941 keywords que hoy están
// ahí siguen asignadas a `Negatives` y siguen contándose: borrar el bucket las
// mandaría a otro sin que nadie lo decidiera, y un movimiento así no se ve.
// Volver a mostrarlo es añadir la cadena a esta lista.
const BUCKETS = ['UKL', 'MKL', 'Outliers', 'Residue']
const BUCKETS_OCULTOS = ['Negatives']
// El veredicto del nicho es un INFORME, el MKL es una HERRAMIENTA: no comparten
// pantalla. El veredicto vive en su propia pestaña y la tabla usa todo el alto.
// 🔴 EL ORDEN LO PIDIÓ FRANK, Y NO ES ARBITRARIO: es el del MKL que entregamos.
// Primero los cuatro grupos de keywords, después las herramientas. Roots va
// antes que Veredicto porque Roots se usa todos los días y el Veredicto se lee
// una vez. `Normalizer` sale de la navegación (2026-09-15) — su lista sigue
// calculándose, solo deja de tener pestaña.
// 🔴 EL ORDEN LO FIJA FRANK (2026-09-16): UKL · MKL · Outliers · Residue ·
// Roots · Competidores · VEREDICTO AL FINAL. El veredicto es la conclusion:
// va despues de todo lo que la sostiene, no en medio.
const TOOLS = ['Roots', 'Competidores', 'Veredicto']
// Los umbrales son los mismos en los tres (son los de DataDive), así que los textos
// de ayuda se arman una sola vez.
const S = lmp.meta.settings

// 🔴 LOS TEXTOS DE LA PANTALLA, EN LOS DOS IDIOMAS.
//
// El selector EN/ES del sitio funcionaba y esta página no lo escuchaba: estaba
// escrita solo en castellano, así que pulsar EN no cambiaba una palabra — y el
// sitio arranca en inglés por defecto, o sea que un visitante veía «EN» marcado
// sobre una página en español.
//
// 🔑 QUÉ NO SE TRADUCE, Y ES A PROPÓSITO: los nombres del método —`MKL`, `UKL`,
// `Relevancy`, `share of voice`, `reverse ASIN`, `P1`, `root`, `outlier`— se
// quedan igual en las dos versiones. Un vendedor de Amazon ya los usa en inglés;
// traducirlos haría la versión inglesa MENOS clara, no más.
const TAB_DESC_I18N = {
  es: {
    MKL: `Keywords obtenidas de los competidores seleccionados, filtradas por las que comparten al menos ${S.min_comp} de ellos en la primera página, con un volumen mínimo de ${S.min_sv} búsquedas al mes.`,
    Outliers: `Keywords con ${S.outlier_min_sv.toLocaleString('en-US')} búsquedas mensuales o más que menos de ${S.outlier_max_comp} de los competidores tienen en la primera página.`,
    Residue: 'Keywords que algún competidor rankea pero que no llegan al mínimo de competidores compartidos ni al volumen de un outlier.',
    Negatives: 'Keywords que comparten vocabulario con el nicho pero describen otro producto.',
    Descartadas: `Keywords donde ninguno de los competidores aparece ni en el top ${S.max_rank}.`,
    UKL: 'El universo del nicho, no el mundo de tus competidores. El MKL sale del reverse ASIN, así que solo puede devolver términos donde alguno de ellos ya rankea; esta lista sale de Magnet por roots y trae lo que se busca en el nicho aunque ninguno esté ahí. Por eso la columna de relevancy va en rayita: la ausencia es el dato. Cada keyword lleva dos etiquetas independientes — cuándo se puede atacar y para qué sirve.',
    Veredicto: 'La lectura del nicho antes de entrar: si conviene, por qué, y por dónde. Es la decisión que se toma una vez; el resto de las pestañas es el trabajo de todos los días.',
    Roots: 'Las palabras que se repiten a lo largo del núcleo. La frecuencia dice en cuántas keywords aparece cada una; el volumen broad, cuánto tráfico mueve la familia entera. Cada root es una campaña de PPC, y se ataca de a uno por vez. Marca uno o varios para ver sus keywords al lado.',
    Normalizer: 'El núcleo sin plurales ni conjunciones, agrupado por forma. Sirve para una cosa concreta: detectar cuándo estás diciendo lo mismo de tres maneras distintas. En PPC esas tres variantes compiten entre sí y te suben el costo por clic. Las campañas no se arman desde acá: se arman por root.',
    Competidores: 'Quién es quién en el nicho, medido contra la mediana. Cobertura, share y fuerza se recalculan con los buckets actuales: si mueves keywords, estos números se mueven. Precio, reseñas, edad y actividad de venta salen de Keepa — dato observado, no estimado.',
  },
  en: {
    MKL: `Keywords taken from the selected competitors, filtered down to the ones at least ${S.min_comp} of them hold on page one, with a minimum of ${S.min_sv} searches a month.`,
    Outliers: `Keywords with ${S.outlier_min_sv.toLocaleString('en-US')} monthly searches or more that fewer than ${S.outlier_max_comp} competitors hold on page one.`,
    Residue: 'Keywords some competitor ranks for, but that reach neither the shared-competitor minimum nor the volume of an outlier.',
    Negatives: 'Keywords that share vocabulary with the niche but describe a different product.',
    Descartadas: `Keywords where none of the competitors shows up, not even in the top ${S.max_rank}.`,
    UKL: 'The universe of the niche, not the world of your competitors. The MKL comes from reverse ASIN, so it can only return terms where one of them already ranks; this list comes from Magnet by roots and brings what the niche searches for even when none of them is there. That is why the relevancy column shows a dash: the absence is the finding. Each keyword carries two independent labels — when it can be attacked and what it is good for.',
    Veredicto: 'Reading the niche before entering: whether it’s worth it, why, and where you get in. This is the decision you make once; the rest of the tabs are the everyday work.',
    Roots: 'The words that repeat across the core. Frequency says how many keywords each one appears in; broad volume, how much traffic the whole family moves. Each root is a PPC campaign, and you attack them one at a time. Select one or more to see their keywords next to them.',
    Normalizer: 'The core without plurals or conjunctions, grouped by form. It serves one concrete purpose: spotting when you are saying the same thing three different ways. In PPC those three variants bid against each other and push your cost per click up. Campaigns are not built from here: they are built by root.',
    Competidores: 'Who’s who in the niche, measured against the median. Coverage, share and strength recalculate with the current buckets: move keywords and these numbers move. Price, reviews, age and sales activity come from Keepa — observed data, not estimated.',
  },
}

const INFO_I18N = {
  es: {
  use_T: `Título — ${USAGE_AYUDA}`,
  use_B: `Viñetas — ${USAGE_AYUDA}`,
  use_D: `Descripción — ${USAGE_AYUDA}`,
  use_GK: `Generic Keywords, el backend — ${USAGE_AYUDA}`,
  use_IH: `Item Highlight, bajo el título — ${USAGE_AYUDA}`,
  kw: 'Keyword — el término tal como lo escribe el comprador en Amazon. · dato de mercado',
  root: 'Root — la raíz que agrupa una familia de keywords: las variantes de una misma palabra caen juntas. Evita armar tres campañas de lo mismo. · cálculo AGTA',
  vol: 'Vol — búsquedas mensuales del término. · dato de mercado',
  sales: 'Vtas — unidades que el mercado vende por ese término. Es la demanda que efectivamente se convierte en compra. · dato de mercado',
  rel: `Relevancy % — qué proporción de tus competidores está en página 1 de ese término. · cálculo AGTA`,
  // Había dos claves `p1` en este objeto: la segunda pisaba a la primera, así que
  // el texto corto ("Es la base del Relevancy") no se mostró nunca. Se conserva la
  // que se venía viendo y se le suma esa frase, que era lo único que aportaba.
  p1: `P1 — cuántos de tus ${DATASETS.LMP.meta.n_comp} competidores están en la primera página de ese término (puesto ${S.p1_rank} o mejor). Desde ${S.min_comp} la keyword entra al núcleo. · cálculo AGTA sobre ranks del mercado`,
  fit: 'Fit — qué tan de TU producto es la keyword. No es lo mismo que Relevancy: relevancy mide cuánto la dominan tus competidores, fit mide si te sirve a ti. · cálculo AGTA',
  idn: 'IDN — demanda capturable: volumen × fit. Ordena por lo que te puedes llevar, no por lo que se busca. · cálculo AGTA',
  td: 'TD — cuántos del top usan la keyword en el TÍTULO. Bajo = título libre, más fácil de ganar. · dato de mercado',
  cp: 'CP — cuántos productos compiten por ese término. · dato de mercado',
  tier: 'Tier — qué tan tuya es la keyword. CORE nombra tu producto; SECONDARY es del tipo pero no el tuyo; LONG-TAIL, el resto. · cálculo AGTA',
  prio: 'Prio — P1, P2 o P3 por demanda capturable. Es el orden en que se atacan en el lanzamiento. · cálculo AGTA',
  match: 'Match sugerido para PPC. Si la keyword ya es específica va exact; si encabeza una familia grande, phrase; si es la cabecera con volumen, broad. · cálculo AGTA',
  cuando: 'Cuándo se puede atacar, solo en la UKL. AHORA: la satisfaces y el hueco está abierto. DESPUES: el hueco está cerrado o es de temporada. NO: no se puja. · cálculo AGTA',
  para: 'Para qué sirve, solo en la UKL. VENDER: tu producto satisface esa búsqueda. TARGET: la satisface un hermano de tu catálogo — se targetea su página en vez de pujar. CATALOGO: demanda del nicho que hoy no fabricas. AUDIENCIA: dice quién es el cliente, no qué comprar. · cálculo AGTA',
  serp: 'SERP — flags de la página de resultados: SBV = Sponsored Brand Video · AC = Amazon’s Choice · SP = Sponsored Product. Se puede filtrar escribiendo SBV, AC o SP.',
  root_root: 'Root — palabra o frase que se repite en el núcleo. Si aparece en una sola keyword no es un root. Cada root es una campaña de PPC, y se ataca de a uno por vez. · cálculo AGTA',
  root_frec: 'Frecuencia — en cuántas keywords del MKL de ahora aparece este root. Se recalcula cuando mueves keywords entre buckets.',
  root_sv: 'Volumen broad — suma del SV de todas las keywords del MKL que contienen el root. Es el techo de tráfico de la familia, no lo que vas a captar.',
  root_kws: 'Las keywords del MKL que contienen alguno de los roots tildados. Sumar roots amplía la cobertura.',
  norm_kw: 'Forma normalizada — la keyword sin plurales ni conjunciones. Las que quedan iguales se agrupan en una sola fila.',
  norm_sv: 'SV — suma del volumen de todas las keywords que colapsaron en esta forma. Es la demanda real de la idea, no la de una sola manera de escribirla.',
  norm_n: 'Variantes — cuántas keywords colapsaron en esta forma. Son maneras de escribir lo mismo: en PPC se puja una sola, o compiten entre sí y te suben el CPC.',
  comp_metrica: 'Cada fila es una métrica del competidor. Clic en el nombre de la fila para ordenar las columnas por esa métrica.',
  comp_med: 'Mediana del nicho — la mitad de los competidores está por encima de este valor y la otra mitad por debajo. Es la vara para leer si un número es alto o bajo acá adentro.',
  // Las tres señales. Ninguna herramienta del mercado las trae: dicen si la
  // keyword se compra, si es de temporada y si ahí cobran lo que cobras tú.
  compra_mil: 'KW CVR — qué parte de las búsquedas de ese término termina en compra. Es del MERCADO, no tuyo: se lee contra la mediana del nicho. · cálculo AGTA sobre datos de mercado',
  trend: 'Tendencia — cómo se mueve el volumen. Arriba de +80% es una keyword de TEMPORADA: si tu producto es de año redondo, ese volumen no es tuyo aunque sea enorme.',
  price_fit: 'Precio — precio mediano POR UNIDAD de quienes rankean ahí frente al tuyo. Debajo de 60% compran mucho más barato; arriba de 160% cobran más que tú.',
  veredicto: 'Eval — la señal en una palabra: ATACAR, PRECIO SUPERIOR, PRECIO INFERIOR, CVR BAJO o ESTACIONAL. Pasa el ratón por el valor para ver el número que la disparó.',
  },
  en: {
    use_T: `Title — ${USAGE_AYUDA_EN}`,
    use_B: `Bullets — ${USAGE_AYUDA_EN}`,
    use_D: `Description — ${USAGE_AYUDA_EN}`,
    use_GK: `Generic Keywords, the backend — ${USAGE_AYUDA_EN}`,
    use_IH: `Item Highlight, under the title — ${USAGE_AYUDA_EN}`,
    kw: 'Keyword — the term exactly as a shopper types it on Amazon. · market data',
    root: 'Root — the stem that groups a keyword family: variants of the same word fall together. Keeps you from building three campaigns for one thing. · AGTA calculation',
    vol: 'Vol — monthly searches for the term. · market data',
    sales: 'Sales — units the market sells through that term. It is the demand that actually turns into a purchase. · market data',
    rel: `Relevancy % — what share of your competitors sits on page one for that term. · AGTA calculation`,
    p1: `P1 — how many of your ${DATASETS.LMP.meta.n_comp} competitors are on page one for that term (position ${S.p1_rank} or better). At ${S.min_comp} or more, the keyword enters the core. · AGTA calculation over market ranks`,
    fit: 'Fit — how much the keyword is about YOUR product. Not the same as Relevancy: relevancy measures how much your competitors own it, fit measures whether it is any use to you. · AGTA calculation',
    idn: 'IDN — capturable demand: volume × fit. Sort by it to rank keywords by what you can take. · AGTA calculation',
    td: 'TD — how many of the top listings use the keyword in their TITLE. Low = the title is uncontested, easier to win. · market data',
    cp: 'CP — how many products compete for that term. · market data',
    tier: 'Tier — how closely the keyword matches your product. CORE names your product; SECONDARY is the type but not yours; LONG-TAIL, the rest. · AGTA calculation',
    prio: 'Prio — P1, P2 or P3 by capturable demand. It is the order you attack them in at launch. · AGTA calculation',
    match: 'Suggested PPC match type. If the keyword is already specific it goes exact; if it heads a large family, phrase; if it is the head term with volume, broad. · AGTA calculation',
    cuando: 'When to attack it, UKL only. NOW: you satisfy it and the gap is open. LATER: the gap is closed or it is seasonal. NO: do not bid. · AGTA calculation',
    para: 'What it is good for, UKL only. SELL: your product satisfies that search. TARGET: a sibling does — target its page instead of bidding. CATALOG: niche demand you do not make today. AUDIENCE: tells you who the buyer is, not what to sell. · AGTA calculation',
    serp: 'SERP — result-page flags: SBV = Sponsored Brand Video · AC = Amazon’s Choice · SP = Sponsored Product. You can filter by typing SBV, AC or SP.',
    root_root: 'Root — a word or phrase that repeats across the core. If it shows up in a single keyword it is not a root. Each root is a PPC campaign, and you attack them one at a time. · AGTA calculation',
    root_frec: 'Frequency — how many MKL keywords this root appears in. It recalculates when you move keywords between buckets.',
    root_sv: 'Broad volume — the total SV of every MKL keyword containing the root. It is the traffic ceiling of the family, not what you will capture.',
    root_kws: 'The MKL keywords containing any of the checked roots. Adding roots widens your coverage.',
    norm_kw: 'Normalised form — the keyword without plurals or conjunctions. The ones that end up identical collapse into a single row.',
    norm_sv: 'SV — the summed volume of every keyword that collapsed into this form. It is the real demand for the idea, not for one way of writing it.',
    norm_n: 'Variants — how many MKL keywords collapsed into this form. If it says 3, there are 3 ways of writing the same thing that in PPC bid against each other and push your CPC up: run one.',
    comp_metrica: 'Each row is one competitor metric. Click the row name to sort the columns by that metric.',
    comp_med: 'Niche median — half the competitors sit above this value and half below. It is the yardstick for reading whether a number is high or low in here.',
    compra_mil: 'KW CVR — what share of that term’s searches ends in a purchase. It belongs to the MARKET, not to you: read it against the niche median. · AGTA calculation over market data',
    trend: 'Trend — how the volume moves. Above +80% it is a SEASONAL keyword: if your product sells year-round, that volume is not yours however large it looks.',
    price_fit: 'Price — median PER-UNIT price of those ranking there against yours. Below 60% they buy far cheaper; above 160% they charge more than you.',
    veredicto: 'Eval — the signal in one word: ATTACK, PRICE ABOVE, PRICE BELOW, LOW CVR or SEASONAL. Hover the value to see the number behind it.',
  },
}

// `tipo` decide cómo se filtra la columna: las de opciones cerradas (tier, prio,
// match, veredicto) se marcan de una lista, no se escriben a mano; las numéricas
// aceptan >100 / <50 / 100-500; el resto es texto que contiene.
const COLS_BASE = [
  // Grupo 1 — de qué término estamos hablando
  { k: 'kw', origen: 'mercado', grupo: 'Término', label: 'Keyword', align: 'left', tipo: 'texto' },
  // Grupo 2 — cuánta demanda hay y de qué clase
  { k: 'vol', origen: 'mercado', grupo: 'Demanda', label: 'Vol', align: 'right', tipo: 'num', fmt: (v) => (v || 0).toLocaleString('en-US') },
  { k: 'sales', origen: 'mercado', grupo: 'Demanda', label: 'Vtas', align: 'right', tipo: 'num' },
  { k: 'compra_mil', origen: 'agta', necesitaH10: true, grupo: 'Demanda', label: 'KW CVR', align: 'right', tipo: 'num', fmt: (v) => (v == null ? '—' : `${(v / 10).toFixed(2)}%`) },
  // Grupo 3 — quién la está peleando
  // Conteo, no porcentaje: con % el umbral se mueve solo al agregar o quitar
  // competidores del dive. Es como lo hace DataDive. (2026-07-30)
  { k: 'p1', origen: 'agta', necesitaH10: true, grupo: 'Competencia', label: 'Relev.', align: 'right', tipo: 'num' },
  { k: 'td', origen: 'mercado', grupo: 'Competencia', label: 'TD', align: 'right', tipo: 'num' },
  { k: 'cp', origen: 'mercado', grupo: 'Competencia', label: 'CP', align: 'right', tipo: 'num', fmt: (v) => (v || 0).toLocaleString('en-US') },
  // La puja sugerida ya venía en el XLSX de Cerebro y no la leíamos. Es el dato
  // con el que se arman las campañas: sin esto la puja de cada término se pone
  // a ojo. (2026-07-31)
  { k: 'bid', origen: 'mercado', grupo: 'Competencia', label: 'Puja', align: 'right', tipo: 'num', fmt: (v) => (v == null ? '—' : `$${Number(v).toFixed(2)}`) },
  // Grupo 4 — qué tan tuya es
  { k: 'fit', origen: 'agta', grupo: 'Tu producto', label: 'Fit', align: 'right', tipo: 'num', fmt: (v) => Math.round((v || 0) * 100) },
  { k: 'idn', origen: 'agta', necesitaH10: true, grupo: 'Tu producto', label: 'IDN', align: 'right', tipo: 'num', fmt: (v) => (v || 0).toLocaleString('en-US') },
  // ⛔ La columna «Precio» (price_fit) salio de la tabla el 2026-09-16 con el
  //    campo «tu precio» de la barra: sin ese numero escrito la columna solo
  //    podia mostrar rayitas. El calculo sigue en `kwsEval` por si vuelve.
  // Grupo 5 — qué hacer con ella
  // Las dos etiquetas propias de la UKL. Se venían calculando desde el día uno y
  // no se mostraban en ningún lado: la tabla traía las 324 filas sin decir qué
  // hacer con ninguna. Van acá para que filtren y ordenen como cualquier otra.
  // Grupo 6 — dónde está usada hoy dentro del listing. Mismos cinco campos que
  // muestra DataDive, medidos contra el copy real del producto. (2026-07-31)
  ...USAGE_FIELDS.map((f) => ({
    k: `use_${f.key}`,
    origen: 'agta',
    grupo: 'Uso en el listing',
    label: f.key,
    align: 'center',
    tipo: 'opciones',
  })),
]

/**
 * El circulito de "uso en el listing". Relleno = match directo, hueco = el match
 * es por plural, gris = no está, punteado = ese campo todavía no está escrito.
 */
function UsoDot({ valor, campo }) {
  const [lang] = useMavraLanguage()
  const color = USAGE_COLOR[valor]
  const hueco = USAGE_HUECO.has(valor)
  const sinCampo = valor === SIN_CAMPO
  return (
    <span
      title={`${campo} — ${valor === NO_ESTA
        ? (lang === 'en' ? 'the keyword is not in this field' : 'la keyword no está en este campo')
        : sinCampo
          ? (lang === 'en' ? 'not written yet — nothing to measure' : 'todavía no está escrito, no hay nada que medir')
          : valor}`}
      style={{
        display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
        background: color && !hueco ? color : 'transparent',
        border: sinCampo
          ? '1px dashed rgba(148,163,184,0.35)'
          : `1px solid ${color || 'rgba(148,163,184,0.28)'}`,
        boxShadow: !color && !sinCampo ? 'inset 0 0 0 10px rgba(148,163,184,0.18)' : undefined,
        verticalAlign: 'middle',
      }}
    />
  )
}

// Color del veredicto por keyword. ENTRA es lo unico verde: el resto son avisos
// de por que esa keyword, aunque tenga volumen, no es tuya.
const VEREDICTO_COLOR = {
  ATACAR: '#4ade80',
  'PRECIO SUPERIOR': '#60a5fa',
  ESTACIONAL: '#fbbf24',
  'CVR BAJO': '#fb923c',
  'SIN VENTAS': '#94a3b8',
  'PRECIO INFERIOR': '#f87171',
}

const VER_COLOR = { Lanzar: '#4ade80', Riesgoso: '#fbbf24', Evitar: '#f87171' }
const STRENGTH_COLOR = { 'Muy fuerte': '#f87171', Fuerte: '#fb923c', Media: '#fbbf24', 'Débil': '#4ade80' }
const STRENGTH_ORD = { 'Muy fuerte': 4, Fuerte: 3, Media: 2, 'Débil': 1 }
// Columnas de texto: el primer clic en el sorter las ordena A→Z; las numéricas
// arrancan de mayor a menor, que es como uno las quiere leer.
const COLS_TEXTO = new Set(['kw', 'root', 'tier', 'prio', 'match', 'serp', 'brand', 'asin', 'categoria', 'veredicto'])
const miles = (n) => (n == null ? '—' : Number(n).toLocaleString('en-US'))
const rootBg = (w) => (w >= 4 ? 'rgba(74,222,128,0.22)' : w >= 2 ? 'rgba(74,222,128,0.10)' : 'transparent')
// Tope de roots que muestra DataDive. Con un MKL chico nunca se toca; está para
// que un MKL de miles de keywords no escupa una lista imposible de leer.
const TOPE_ROOTS = 120
const serpTexto = (k) => [k.sbv ? 'SBV' : '', k.choice ? 'AC' : '', k.sp ? 'SP' : ''].filter(Boolean).join(' ')

/**
 * Filtro por columna, como el de DataDive. El filtro habla el idioma del dato:
 *   lista      -> ['exact','phrase'] : los valores tildados (columnas de opciones)
 *   texto      -> contiene
 *   >100 <50   -> comparación
 *   100-500    -> rango
 *   =5         -> exacto
 */
function matchFilter(value, expr) {
  // Columnas de opciones cerradas: llega la lista de valores tildados. Lista
  // vacía = sin filtro, igual que un input en blanco.
  if (Array.isArray(expr)) return expr.length === 0 || expr.includes(String(value ?? ''))
  // Filtro de palabras armado con la UI: dos listas y un modo. Frank: "dame una
  // forma de filtrar por palabras que no sea aprendiéndome comandos". La coma,
  // el más y el guion siguen funcionando para quien los sepa —abajo—, pero ya
  // no hace falta saberlos: el popover arma este objeto solo.
  if (expr && typeof expr === 'object' && (expr.incluye || expr.excluye)) {
    const t = String(value ?? '').toLowerCase()
    const inc = expr.incluye || []
    const exc = expr.excluye || []
    if (exc.some((s) => t.includes(s))) return false
    if (inc.length === 0) return true
    return expr.modo === 'todas' ? inc.every((s) => t.includes(s)) : inc.some((s) => t.includes(s))
  }
  // Rango {min, max} — la forma que manda el filtro numérico nuevo. Nada que
  // adivinar de sintaxis: dos números y listo.
  if (expr && typeof expr === 'object') {
    if (expr.min === undefined && expr.max === undefined) return true
    const n = typeof value === 'number' ? value : parseFloat(String(value ?? '').replace(/[^\d.-]/g, ''))
    if (Number.isNaN(n)) return false
    if (expr.min !== undefined && n < expr.min) return false
    if (expr.max !== undefined && n > expr.max) return false
    return true
  }
  const q = (expr || '').trim()
  if (!q) return true
  const num = typeof value === 'number' ? value : parseFloat(String(value ?? '').replace(/[^\d.-]/g, ''))
  const m = q.match(/^([<>]=?|=)\s*(-?[\d.]+)$/)
  if (m && !Number.isNaN(num)) {
    const n = parseFloat(m[2])
    switch (m[1]) {
      case '>': return num > n
      case '>=': return num >= n
      case '<': return num < n
      case '<=': return num <= n
      default: return num === n
    }
  }
  const range = q.match(/^(-?[\d.]+)\s*-\s*(-?[\d.]+)$/)
  if (range && !Number.isNaN(num)) return num >= parseFloat(range[1]) && num <= parseFloat(range[2])
  // Un número pelado en una columna numérica es "de acá para arriba", no una
  // coincidencia de texto. Nadie escribe ">300": escribe 300 y espera ver lo que
  // llega a 300. Antes esto caía al includes() de abajo y "22073".includes("300")
  // es false, así que la tabla se vaciaba entera con un filtro perfectamente
  // razonable. Para el valor exacto queda "=300". (Frank, 2026-07-30)
  const pelado = q.match(/^(-?[\d.]+)$/)
  if (pelado && typeof value === 'number') return value >= parseFloat(pelado[1])
  // Tres operadores, que es lo que hace falta para limpiar una master sin pasar
  // tres veces por la misma columna:
  //   coma  → o      `goth, decor`        las que digan goth O decor
  //   más   → y      `goth + decor`       las que digan goth Y decor
  //   guion → saca   `-witch`             fuera las que digan witch
  // Se combinan: `goth + decor, skull + lamp, -witch` son dos grupos unidos por
  // O, cada uno exigiendo sus dos palabras, y witch afuera de todo.
  // El guion solo cuenta al PRINCIPIO del término, para no romper `t-shirt`.
  // (Frank, 2026-07-30)
  const texto = String(value ?? '').toLowerCase()
  const fuera = []
  const grupos = []
  q.toLowerCase().split(',').map((s) => s.trim()).filter(Boolean).forEach((parte) => {
    if (parte.startsWith('-')) {
      const s = parte.slice(1).trim()
      if (s) fuera.push(s)
      return
    }
    const y = parte.split('+').map((s) => s.trim()).filter(Boolean)
    if (y.length) grupos.push(y)
  })
  if (fuera.some((s) => texto.includes(s))) return false
  if (grupos.length === 0) return true
  return grupos.some((g) => g.every((s) => texto.includes(s)))
}

/**
 * Ordena por la columna elegida. `get` existe porque no todo dato vive plano en la
 * fila: el rank de un competidor cuelga de r.ranks[ASIN]. Sin key no toca el orden,
 * así cada tabla puede arrancar mostrando el orden en que vino la data.
 */
function sortRows(rows, sort, get) {
  if (!sort || !sort.key) return rows
  const val = get || ((r, k) => r[k])
  const m = sort.dir === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const va = val(a, sort.key)
    const vb = val(b, sort.key)
    if (typeof va === 'string' || typeof vb === 'string') return m * String(va ?? '').localeCompare(String(vb ?? ''))
    return m * ((va ?? 0) - (vb ?? 0))
  })
}

// Valor de una celda de la tabla de keywords para FILTRAR. Los ranks por competidor
// viven anidados y cambian según se miren orgánicos o patrocinados.
/**
 * Columnas cuyo valor guardado NO es el que se ve: se guardan 0-1 y se muestran
 * como porcentaje. El filtro tiene que comparar contra lo que el usuario ve —si
 * escribe "desde 50" está pensando en el 50 de la pantalla, no en 0,5— y hasta
 * ahora comparaba contra el crudo, así que "≥ 50" no devolvía NADA.
 * (Frank, 2026-07-31)
 */
const COMO_PORCENTAJE = new Set(['fit', 'price_fit'])

function valorCol(k, key, rankMode) {
  if (key === 'serp') return serpTexto(k)
  if (key.startsWith('rank:')) {
    const asin = key.slice(5)
    const r = rankMode === 'sponsored' ? (k.sranks || {})[asin] : k.ranks[asin]
    return r == null ? '' : r
  }
  if (COMO_PORCENTAJE.has(key)) {
    return k[key] == null ? null : Math.round(k[key] * 100)
  }
  // KW CVR se muestra como porcentaje con dos decimales sobre una base de 1.000.
  if (key === 'compra_mil') return k[key] == null ? null : k[key] / 10
  return k[key]
}

// Mismo valor pero para ORDENAR: el que no rankea tiene que caer al fondo, no
// adelante, así que vale peor que el peor puesto posible.
function ordenCol(k, key, rankMode) {
  if (key === 'serp') return (k.sbv ? 1 : 0) + (k.choice ? 1 : 0) + (k.sp ? 1 : 0)
  if (key.startsWith('rank:')) {
    const v = valorCol(k, key, rankMode)
    return v === '' ? S.max_rank + 1 : v
  }
  return k[key]
}

/**
 * Agrupa columnas CONSECUTIVAS de la misma familia para la fila de grupos del
 * header. Si el usuario mueve una columna y parte una familia, salen dos tramos
 * con el mismo nombre — que es la verdad de lo que está viendo.
 */
function tramosDeGrupo(cols) {
  const out = []
  cols.forEach((c) => {
    const g = c.grupo || ''
    const ult = out[out.length - 1]
    if (ult && ult.grupo === g) ult.n += 1
    else out.push({ grupo: g, n: 1 })
  })
  return out
}

// Mediana clásica: con impares es el del medio, con pares el promedio de los dos.
function mediana(xs) {
  const v = xs.filter((n) => n != null).sort((a, b) => a - b)
  if (!v.length) return null
  const m = Math.floor(v.length / 2)
  const r = v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2
  return Math.round(r * 10) / 10
}

// La fuerza es una lectura del share, no un dato aparte: por eso se recalcula con
// el MKL de ahora. Los cortes están calibrados contra el snapshot del JSON —
// con la asignación original devuelven exactamente las etiquetas que traía.
const fuerza = (share) => (share >= 75 ? 'Muy fuerte' : share >= 50 ? 'Fuerte' : share >= 35 ? 'Media' : 'Débil')

// Filas del panel de competidores: qué se muestra, de dónde sale y cómo se ordena.
// 🔴 LA FOTO, LA MARCA Y EL ASIN YA NO SON FILAS: VIVEN EN LA CABECERA.
//
// Eran cuatro filas —Producto, Marca, Título, ASIN— y ocupaban el sitio de los
// datos. Con el título completo dentro de una celda, la tabla se iba de ancho y
// en pantalla entraban DOS competidores de nueve.
//
// Así lo hace el MKL que ya entregamos: identificación arriba de cada columna,
// en pequeño, y el cuerpo solo métricas. Ahí entran los diez de un vistazo, que
// es el único modo en que una tabla de comparación sirve de algo.
//
// 📌 El título no se pierde: sigue en el globo de ayuda de la cabecera, entero.
const COMP_ROWS_BASE = [
  { k: 'strength', label: 'Fuerza', med: null, badge: true, sortVal: (c) => STRENGTH_ORD[c.strength] || 0, info: 'Lectura rápida del share: Muy fuerte ≥75% · Fuerte ≥50% · Media ≥35% · Débil abajo de eso. Se recalcula con los buckets de ahora.' },
  { k: 'share', label: 'SV en P1 (share of voice)', med: 'share', fmt: (v) => `${v}%`, bar: true, info: 'Del volumen total del MKL de ahora, qué porcentaje cubre este competidor desde página 1. Es la métrica de dominio del nicho.' },
  { k: 'kws_p1', label: 'Keywords en P1', med: 'kws_p1', fmt: (v) => miles(v), info: `Cuántas keywords del MKL actual tiene en página 1 (rank ≤${S.p1_rank}).` },
  { k: 'kws_p1_pct', label: '% de keywords en P1', med: 'kws_p1_pct', fmt: (v) => (v == null ? '—' : `${v}%`), info: 'Esas keywords sobre el total del MKL de ahora. Un competidor puede tener pocas keywords y mucho volumen: este número separa amplitud de peso.' },
  { k: 'sv_p1', label: 'Volumen en P1', med: 'sv_p1', fmt: (v) => miles(v), info: 'Suma del SV de esas keywords en página 1.' },
  { k: 'outlier_kws', label: 'Keywords de Outliers', med: null, fmt: (v) => miles(v), info: 'Cuántas keywords del bucket Outliers tiene en página 1. Si es 0, no está peleando lo uncontested.' },
  { k: 'outlier_sv', label: 'Volumen de Outliers', med: null, fmt: (v) => miles(v), info: 'Volumen que el competidor ya cubre dentro del bucket Outliers de ahora. Si es 0, ese hueco sigue libre.' },
  { k: 'precio', label: 'Precio', med: 'precio', fmt: (v) => (v == null ? '—' : `$${v}`), info: 'Precio de venta actual (Keepa). No depende del MKL.' },
  { k: 'piezas', label: 'Piezas del pack', med: 'piezas', fmt: (v) => (v == null ? '—' : v), info: 'Cuántas unidades trae (Keepa). Sin esto, un set de 4 parece caro al lado de una pieza suelta.' },
  { k: 'precio_unidad', label: 'Precio por unidad', med: 'precio_unidad', fmt: (v) => (v == null ? '—' : `$${v}`), info: 'Precio ÷ piezas. Es el único precio comparable entre productos: es el que usa el price-fit de las keywords.' },
  { k: 'rating', label: 'Rating', med: 'rating', fmt: (v) => (v == null ? '—' : v), info: 'Promedio de estrellas (Keepa).' },
  { k: 'reviews', label: 'Reseñas', med: 'reviews', fmt: (v) => miles(v), info: 'Cantidad de reseñas acumuladas (Keepa). Es la barrera de entrada más dura del nicho.' },
  { k: 'edad', label: 'Edad del listing', med: null, fmt: (v) => v || '—', sortVal: (c) => c.edad_meses, info: 'Hace cuánto existe el listing (Keepa). Un “+” al final significa que Keepa no tiene la fecha de alta y ese número es el piso: el listing es de ESA fecha o más viejo. Se ordena por meses.' },
  { k: 'ventas30', label: 'Actividad de venta 30d', med: 'ventas30', fmt: (v) => miles(v), info: 'Veces que le cayó el BSR en 30 días (evento de venta observado). NO son unidades vendidas.' },
  { k: 'ingresos30', label: 'Actividad × precio 30d', med: 'ingresos30', fmt: (v) => (v == null ? '—' : `$${miles(v)}`), info: 'Actividad de venta × precio. Sirve para ordenar competidores por peso económico, no para leerlo como facturación: hereda la advertencia de la fila de arriba.' },
  { k: 'variaciones', label: 'Variaciones', med: 'variaciones', fmt: (v) => miles(v), info: 'Cuántas variaciones tiene el listing (color, tamaño). Más variaciones = más reseñas compartidas.' },
  { k: 'categoria', label: 'Categoría', med: null, fmt: (v) => v || '—', info: 'Categoría principal del producto (Keepa).' },
]

/**
 * El "?" en círculo. Reemplaza al title= del navegador por dos motivos: el nativo
 * no aparece si llegás a la columna con el teclado, y no se ve que exista ayuda
 * hasta que pasas el mouse por encima.
 */
/**
 * El "?" de los encabezados. El panel lo dibuja Radix en un portal colgado del
 * body: fuera del `th` sticky, y por eso ya no puede quedar tapado por la fila
 * de filtros — que fue el bug que costó tres vueltas el 2026-07-30.
 */
function Ayuda({ texto }) {
  if (!texto) return null
  return (
    <TooltipRadix texto={texto}>
      <button
        type="button"
        className="rsch-ayuda"
        aria-label={`Ayuda: ${texto}`}
        // Vive dentro de headers que ordenan al hacer clic: cortamos la propagación
        // para que pedir ayuda no reordene la tabla por atrás.
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden="true">?</span>
      </button>
    </TooltipRadix>
  )
}

/**
 * Header con las tres cosas que va toda tabla de AGTA: nombre, ayuda y sorter.
 * Si recibe `mover`, además se puede arrastrar para reordenar la columna — cada
 * uno mira el MKL en el orden que le sirve.
 */
// `align` llega desde la definición de la columna y manda sobre las CELDAS, no
// sobre el encabezado: el header va SIEMPRE centrado aunque la columna sea de
// texto a la izquierda o numérica a la derecha. (Regla de Frank, 2026-07-31)
function Th({ label, ayuda, align, orden, sort, onSort, style, className = '', origen, mover, arrastrando, setArrastrando }) {
  const ordenable = Boolean(orden && onSort)
  const activo = ordenable && sort && sort.key === orden
  const movible = Boolean(mover && orden)
  const [encima, setEncima] = useState(false)
  // Sin `title` nativo en el <th>: al pasar el mouse por el "?" salían DOS
  // tooltips a la vez y el del navegador se montaba encima del nuestro,
  // tapándole el título. El origen ya se ve por el color de fondo (amarillo
  // AGTA / azul Helium 10) y va escrito al final de cada ayuda.
  return (
    <th
      scope="col"
      className={`mkl-th${ordenable ? ' mkl-sortth' : ''}${activo ? ' active' : ''}${className ? ` ${className}` : ''}`
        + `${movible && arrastrando === orden ? ' rsch-dragging' : ''}${encima ? ' rsch-dropzone' : ''}`}
      style={{ textAlign: 'center', ...style }}
      data-origen={origen}
      onClick={ordenable ? () => onSort(orden) : undefined}
      aria-sort={activo ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
      draggable={movible || undefined}
      onDragStart={movible ? (e) => { setArrastrando(orden); e.dataTransfer.effectAllowed = 'move' } : undefined}
      onDragEnd={movible ? () => { setArrastrando(null); setEncima(false) } : undefined}
      onDragOver={movible ? (e) => { e.preventDefault(); if (arrastrando && arrastrando !== orden) setEncima(true) } : undefined}
      onDragLeave={movible ? () => setEncima(false) : undefined}
      onDrop={movible ? (e) => { e.preventDefault(); setEncima(false); if (arrastrando && arrastrando !== orden) mover(arrastrando, orden) } : undefined}
    >
      {label}

      <Ayuda texto={ayuda} />
      {ordenable && (
        <span className={`mkl-sortcaret${activo ? '' : ' dim'}`} aria-hidden="true">
          {activo ? (sort.dir === 'desc' ? '▾' : '▴') : '⇅'}
        </span>
      )}
    </th>
  )
}

/**
 * Celda de la fila de filtros. El control depende del TIPO de dato: una columna
 * de valores cerrados (Match, Tier, Prio, Veredicto) se tilda de una lista —
 * "solo exact", o "exact + phrase" — en vez de escribir el texto a mano y no
 * saber si existe. Las numéricas siguen aceptando >100 / <50 / 100-500.
 */
function FiltroTh({ campo, etiqueta, valor, onChange, numerico, opciones, corte }) {
  return (
    <th className={`mkl-th${corte ? ' mkl-corte' : ''}`} style={{ padding: '3px 5px' }}>
      {opciones ? (
        <FiltroOpciones campo={campo} etiqueta={etiqueta} valor={valor} onChange={onChange} opciones={opciones} />
      ) : numerico ? (
        <FiltroNumerico campo={campo} etiqueta={etiqueta} valor={valor} onChange={onChange} />
      ) : (
        <FiltroPalabras campo={campo} etiqueta={etiqueta} valor={valor} onChange={onChange} />
      )}
    </th>
  )
}

/** El filtro de Excel: los valores que EXISTEN en esta columna, para tildar. */
function FiltroOpciones({ campo, etiqueta, valor, onChange, opciones }) {
  const [lang] = useMavraLanguage()
  const tr = (t) => traducir(t, lang)
  const sel = Array.isArray(valor) ? valor : []
  const alternar = (v) => onChange(campo, sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v])
  // ⚠️ El rótulo del botón se ve SIEMPRE, con filtro o sin él: era lo primero
  // que delataba la página en castellano estando en inglés. (2026-09-16)
  const texto = sel.length === 0 ? tr('Todos') : sel.length === 1 ? sel[0] : `${sel.length} ${tr('valores')}`
  return (
    <MenuRadix boton={<>{texto} <span aria-hidden="true">▾</span></>} etiqueta={`${tr('Filtrar por')} ${etiqueta}`} activo={sel.length > 0}>
      {opciones.map((o) => (
        <label key={o} className="rsch-opts-item">
          <input type="checkbox" checked={sel.includes(o)} onChange={() => alternar(o)} />
          {o || '(vacío)'}
        </label>
      ))}
      {sel.length > 0 && (
        <button type="button" className="rsch-opts-todos" onClick={() => onChange(campo, [])}>{tr('Ver todos')}</button>
      )}
    </MenuRadix>
  )
}

/**
 * Filtro de columna numérica. Antes era una caja de texto con una sintaxis que
 * había que adivinar —`>300`, `<10`, `5-20`— y Frank tenía razón en que eso de
 * UX no tiene nada: el usuario escribe `300`, no ve nada y no sabe por qué.
 *
 * Ahora es un desplegable con **desde** y **hasta**, que es como se piensa un
 * rango. El botón muestra el filtro puesto, así se ve de un vistazo cuál columna
 * está filtrando sin abrir nada.
 *
 * NO dice hasta cuánto llega la columna (Frank lo sacó, 2026-07-30): además de
 * sobrar, el número engañaba — se calculaba sobre TODAS las keywords y no sobre
 * el bucket que estás mirando, así que en el MKL decía "de 0 a 403.035" cuando
 * ahí el mínimo es 300.
 */
/**
 * Filtro de palabras SIN comandos. Frank: *"dame una forma de filtrar por
 * palabras que no sea aprendiéndome comandos"*. Tenía razón: la coma, el más y
 * el guion resolvían el problema pero se los tenía que aprender de memoria, y
 * un filtro que hay que estudiar no es un filtro, es una consola.
 *
 * Se escribe la palabra y se aprieta Enter: aparece como etiqueta. Un clic en
 * la etiqueta la pasa de "que la tenga" a "que NO la tenga" y al revés. Y arriba
 * se elige si con una palabra alcanza o si tienen que estar todas. Eso cubre lo
 * mismo que la sintaxis, y no hay nada que recordar.
 */
function FiltroPalabras({ campo, etiqueta, valor, onChange }) {
  // El hook lee el mismo selector que el resto del sitio: este componente vive
  // fuera de ResearchPanel y traduce por su cuenta en vez de recibir el idioma
  // por prop, que habria obligado a pasarlo por cuatro niveles de JSX.
  const [lang] = useMavraLanguage()
  const tr = (t) => traducir(t, lang)
  const [escrito, setEscrito] = useState('')
  const v = (valor && typeof valor === 'object' && !Array.isArray(valor)) ? valor : {}
  const inc = v.incluye || []
  const exc = v.excluye || []
  const modo = v.modo || 'alguna'
  const emitir = (n) => {
    const limpio = { modo: n.modo, incluye: n.incluye.filter(Boolean), excluye: n.excluye.filter(Boolean) }
    onChange(campo, (limpio.incluye.length || limpio.excluye.length) ? limpio : undefined)
  }
  const agregar = () => {
    const s = escrito.trim().toLowerCase()
    if (!s || inc.includes(s) || exc.includes(s)) { setEscrito(''); return }
    emitir({ modo, incluye: [...inc, s], excluye: exc })
    setEscrito('')
  }
  const alternar = (s) => inc.includes(s)
    ? emitir({ modo, incluye: inc.filter((x) => x !== s), excluye: [...exc, s] })
    : emitir({ modo, incluye: [...inc, s], excluye: exc.filter((x) => x !== s) })
  const borrar = (s) => emitir({ modo, incluye: inc.filter((x) => x !== s), excluye: exc.filter((x) => x !== s) })

  const total = inc.length + exc.length
  const boton = total === 0 ? tr('Todas')
    : total === 1 ? (inc[0] || `${tr('Sin')} ${exc[0]}`)
    : `${total} ${tr('palabras')}`

  /** Una palabra puesta. Se clickea para invertirla; la × solo aparece encima. */
  const Etiqueta = ({ s, saca }) => (
    <span
      className={`group inline-flex items-center gap-[0.15rem] border py-[0.05rem] pl-[0.35rem] pr-[0.15rem] text-[0.66rem] leading-[1.5] normal-case tracking-normal
        ${saca ? 'border-copper/30 bg-transparent text-fg/40' : 'border-copper-bright/45 bg-copper-bright/10 text-fg/90'}`}
    >
      <button
        type="button"
        onClick={() => alternar(s)}
        className={`bg-transparent p-0 text-inherit ${saca ? 'line-through' : ''}`}
        title={saca ? tr('Ahora las saca. Clic para volver a pedirla.') : tr('Ahora la pide. Clic para sacarla.')}
      >
        {s}
      </button>
      <button
        type="button"
        onClick={() => borrar(s)}
        aria-label={`Quitar ${s}`}
        className="flex h-[13px] w-[13px] items-center justify-center bg-transparent p-0 text-[0.7rem] leading-none text-copper/0 transition-colors group-hover:text-copper hover:!text-fg"
      >
        &times;
      </button>
    </span>
  )

  const Grupo = ({ titulo, palabras, saca }) => (
    <div className="mt-[0.55rem]">
      <p className="m-0 mb-[0.3rem] text-[0.52rem] uppercase tracking-[0.1em] text-copper/70">{titulo}</p>
      <div className="flex flex-wrap gap-[0.25rem]">
        {palabras.map((s) => <Etiqueta key={s} s={s} saca={saca} />)}
      </div>
    </div>
  )

  return (
    <MenuRadix boton={<>{boton} <span aria-hidden="true">&#9662;</span></>} etiqueta={`${tr('Filtrar por')} ${etiqueta}`} activo={total > 0} ancho="min-w-[212px]">
      {/* Escribir y Enter. El signo + a la derecha está para que se entienda que
          suma una más y no reemplaza a la anterior. */}
      <div className="flex items-center border border-copper/40 bg-bg/60 focus-within:border-copper-bright/80">
        <input
          value={escrito}
          onChange={(e) => setEscrito(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregar() } }}
          onBlur={agregar}
          placeholder={tr('Escribe una palabra')}
          className="min-w-0 flex-1 border-0 bg-transparent px-[0.4rem] py-[0.28rem] font-sans text-[0.72rem] normal-case leading-[1.4] tracking-normal text-fg outline-none"
        />
        <button
          type="button"
          onClick={agregar}
          aria-label={tr('Agregar palabra')}
          title={tr('Agregar (o Enter)')}
          className="bg-transparent px-[0.35rem] py-0 text-[0.8rem] leading-none text-copper hover:text-fg"
        >
          +
        </button>
      </div>

      {inc.length > 1 && (
        <div className="mt-[0.45rem] flex overflow-hidden border border-copper/30 text-[0.6rem] normal-case tracking-normal">
          {[['alguna', tr('Cualquiera')], ['todas', tr('Todas')]].map(([k, rot]) => (
            <button
              key={k}
              type="button"
              onClick={() => emitir({ modo: k, incluye: inc, excluye: exc })}
              title={k === 'alguna' ? tr('Basta con que tenga una de las palabras') : tr('Tiene que tenerlas todas')}
              className={`flex-1 px-[0.3rem] py-[0.18rem] ${modo === k ? 'bg-copper-bright/20 text-fg' : 'bg-transparent text-fg/45 hover:text-fg/75'}`}
            >
              {rot}
            </button>
          ))}
        </div>
      )}

      {inc.length > 0 && <Grupo titulo={tr("Que tengan")} palabras={inc} />}
      {exc.length > 0 && <Grupo titulo={tr("Que no tengan")} palabras={exc} saca />}

      {total > 0 && (
        <div className="mt-[0.55rem] flex justify-end border-t border-copper/20 pt-[0.4rem]">
          <button
            type="button"
            className="bg-transparent p-0 text-[0.6rem] normal-case tracking-normal text-fg/45 underline-offset-2 hover:text-fg hover:underline"
            onClick={() => onChange(campo, undefined)}
          >
            Quitar filtro
          </button>
        </div>
      )}
    </MenuRadix>
  )
}

function FiltroNumerico({ campo, etiqueta, valor, onChange }) {
  const [lang] = useMavraLanguage()
  const tr = (t) => traducir(t, lang)
  const v = (valor && typeof valor === 'object') ? valor : {}
  const set = (k) => (e) => {
    const x = e.target.value
    const n = { ...v, [k]: x === '' ? undefined : Number(x) }
    if (n.min === undefined && n.max === undefined) onChange(campo, undefined)
    else onChange(campo, n)
  }
  const puesto = v.min !== undefined || v.max !== undefined
  const texto = v.min !== undefined && v.max !== undefined ? `${miles(v.min)}–${miles(v.max)}`
    : v.min !== undefined ? `≥ ${miles(v.min)}`
    : v.max !== undefined ? `≤ ${miles(v.max)}`
    : tr('Todos')
  return (
    <MenuRadix boton={<>{texto} <span aria-hidden="true">▾</span></>} etiqueta={`${tr('Filtrar por')} ${etiqueta}`} activo={puesto}>
      <div className="flex gap-[0.45rem]">
        {[['min', tr('Desde'), tr('Mín')], ['max', tr('Hasta'), tr('Máx')]].map(([k, rot, ph]) => (
          <label key={k} className="flex flex-1 flex-col gap-[0.18rem] text-micro uppercase tracking-[0.08em] text-copper/85">
            <span>{rot}</span>
            <input
              type="number"
              inputMode="numeric"
              value={v[k] ?? ''}
              onChange={set(k)}
              placeholder={ph}
              className="w-full border border-copper/45 bg-bg/60 px-[0.4rem] py-[0.28rem] font-sans text-[0.74rem] normal-case tracking-normal text-fg tabular-nums outline-none focus:border-copper-bright/90"
            />
          </label>
        ))}
      </div>
      {puesto && (
        <button type="button" className="rsch-opts-todos" onClick={() => onChange(campo, undefined)}>{tr('Ver todos')}</button>
      )}
    </MenuRadix>
  )
}

/**
 * Menú para esconder columnas. La primera columna de cada tabla no entra: es la
 * que identifica la fila y sin ella la tabla no se lee.
 */
function MenuColumnas({ etiqueta, fija, opciones, ocultas, setOcultas }) {
  const [lang] = useMavraLanguage()
  const tr = (t) => traducir(t, lang)
  const rotulo = etiqueta ?? tr('Columnas')
  const alternar = (k) => setOcultas((s) => {
    const n = new Set(s)
    if (n.has(k)) n.delete(k)
    else n.add(k)
    return n
  })
  const visibles = opciones.filter((o) => !ocultas.has(o.k)).length
  return (
    <MenuRadix
      etiqueta={rotulo}
      activo={visibles < opciones.length}
      ancho="min-w-[220px]"
      boton={<>{rotulo} {visibles + 1}/{opciones.length + 1} <span aria-hidden="true">&#9662;</span></>}
    >
      <p className="rsch-cols-fija">{fija} &middot; siempre visible</p>
      {opciones.map((o, i) => (
        <Fragment key={o.k}>
          {/* 🔴 EL SEPARADOR NO PASABA POR EL DICCIONARIO. Con la página en inglés
              decía «COMPETIDORES» — lo vio Frank abriendo el menú (2026-09-16).
              Y no se veía en ningún barrido: el contenido de un desplegable
              CERRADO no está en la pantalla. Es el mismo escondite que el
              placeholder del buscador y que los estados vacíos. */}
          {o.grupo && o.grupo !== (opciones[i - 1] || {}).grupo && <span className="rsch-cols-sep">{tr(o.grupo)}</span>}
          <label className="rsch-cols-item">
            <input type="checkbox" checked={!ocultas.has(o.k)} onChange={() => alternar(o.k)} />
            {o.label}
          </label>
        </Fragment>
      ))}
      <div className="rsch-cols-acts">
        <button type="button" className="rsch-bulk-clear" onClick={() => setOcultas(new Set())}>{tr('Mostrar todas')}</button>
        <button type="button" className="rsch-bulk-clear" onClick={() => setOcultas(new Set(opciones.map((o) => o.k)))}>{tr('Ocultar todas')}</button>
      </div>
    </MenuRadix>
  )
}

/** Sorter compartido: primer clic ordena, segundo clic sobre lo mismo invierte. */
function useSorter(inicial) {
  const [sort, setSort] = useState(inicial)
  const onSort = (key) => setSort((s) => (s.key === key
    ? { key, dir: s.dir === 'desc' ? 'asc' : 'desc' }
    : { key, dir: COLS_TEXTO.has(key) ? 'asc' : 'desc' }))
  // setSort sale afuera para poder volver al orden en que vino la data.
  return [sort, onSort, setSort]
}

/**
 * El nombre del producto para leer, sin el prefijo de marca ni el código.
 *
 * El dataset lo trae como «MAVRA Skull Lamp (LMP)». La marca es la misma en los
 * tres —no distingue— y el código ya va en su propia insignia al lado, así que
 * repetirlo dentro del nombre lo hace más largo sin decir nada nuevo.
 */
const nombreDe = (p) => DATASETS[p].meta.product
  .replace(/^MAVRA\s+/i, '')
  .replace(/\s*\([A-Z]{2,4}\)\s*$/, '')

// Selector de producto: cada MKL es un dive independiente, así que al cambiar de
// producto se remonta el panel entero (key={prod}) y los buckets arrancan limpios.
export default function Research() {
  const [lang] = useMavraLanguage()
  const tr = (t) => traducir(t, lang)
  const [prod, setProd] = useState('LMP')
  const meta = DATASETS[prod].meta
  return (
    <>
      {/* 🔴 El nombre del producto manda, y el código es una insignia.
          Antes esto era una línea de 12px donde «MAVRA Skull Lamp (LMP)» iba al
          final, del mismo tamaño que el resto, y los botones decían solo LMP /
          CND / SWD: para saber qué estabas mirando había que traducir un código
          de tres letras de memoria. Frank, 2026-09-16: «mejora el header de esa
          sección, la selección del producto con el nombre del mismo». */}
      <header className="rsch-prodbar">
        <div className="rsch-prodbar-id">
          <span className="rsch-prodbar-rotulo">{tr('PRODUCTO')}</span>
          <h2 className="rsch-prodbar-nombre">
            {nombreDe(prod)}
            <span className="rsch-prodbar-sku">{prod}</span>
          </h2>
          <p className="rsch-prodbar-meta">
            {meta.n_comp} {tr('competidores')} · {miles(meta.total)} {tr('keywords analizadas')}
          </p>
        </div>
        <div className="rsch-prodsel" role="group" aria-label={tr('Elegir producto')}>
          {Object.keys(DATASETS).map((p) => (
            <button
              key={p}
              onClick={() => setProd(p)}
              // `is-active` no existía en el CSS —la clase es `active`— así que el
              // selector NUNCA se veía marcado. Frank trabajó 678 correcciones en
              // CND creyendo que estaba en LMP. Un typo de una palabra.
              // (2026-07-31)
              className={p === prod ? 'rsch-prodtab active' : 'rsch-prodtab'}
              aria-pressed={p === prod}
              title={DATASETS[p].meta.product}
            >
              <span className="rsch-prodtab-nombre">{nombreDe(p)}</span>
              <span className="rsch-prodtab-sku">{p}</span>
            </button>
          ))}
        </div>
      </header>
      <ResearchPanel key={prod} prod={prod} data={DATASETS[prod]} ukl={UKL[prod]} />
    </>
  )
}

/**
 * Lo que el usuario mueve a mano se GUARDA. Sin esto, corregir la master y
 * recargar la página borraba el trabajo entero — y corregirla a mano es
 * justamente para lo que existe esta tabla.
 *
 * Se guarda **por keyword, no por índice**: los JSON se regeneran seguido y el
 * orden cambia de una corrida a otra. Guardando `assign[i]` las correcciones
 * caerían sobre keywords distintas después de cada regeneración, que es peor
 * que no guardar nada — el error sería silencioso.
 *
 * Solo se persiste el TRABAJO (movimientos de bucket, orden y visibilidad de
 * columnas, precio, modo de rank). Los filtros y la selección no: son de
 * momento, y encontrarse la tabla filtrada al abrirla se lee como que faltan
 * datos.
 */
/**
 * El fit de una keyword de la UKL, con el mismo criterio que usa el motor en
 * `dashboard_dataset.py`. Se replica acá —y no se toma del JSON— porque la UKL
 * viene de otra fuente (Magnet) y nunca pasó por ese motor.
 *
 * Si algún día cambia el criterio, cambia en los dos lados. Vale la pena la
 * duplicación: la alternativa era dejar la columna vacía, que es peor.
 */
const FIT_AEST = /(goth|gothic|skull|skeleton|raven|crow|witch|witchy|witchcraft|wicca|occult|bat|spooky|halloween|dark academia|whimsigoth|whimsygoth|macabre|pirate|horror|grunge|emo|alternative|morbid|creepy|eerie|haunted|ghost|spell|ritual|cauldron|coffin|grim|reaper|voodoo|santa muerte|dia de los muertos|vela|velas|craneo|calavera|esqueleto)/i
const FIT_BUY = /(for|home|bedroom|room|desk|office|nightstand|bedside|table|gift|decor|set)/i
const FIT_ANYPROD = /(lamp|lamps|light|lights|lantern|sconce|bulb|candle|candles|tealight|votive|wax|taper|warmer|mirror|rug|curtain|pillow|blanket|tapestry|poster|print|canvas|painting|art|sign|sticker|decal|mural|banner|clock|shelf|hook|garland|wreath|figurine|statue|sculpture|bust|vase|bowl|plate|mug|cup|tumbler|jar|box|coaster|tray|frame|plaque|doormat|towel|bedding|holder|stand|jewelry|ring|necklace|costume|shirt|hoodie|dress|hat|mask|bag|keychain|magnet|book|toy|plush|diffuser|incense|soap|planter|pot|table|chair|desk|bed|nightstand|wallpaper)/i

function fitDe(kw, meta) {
  const prod = meta?.settings?.prod ? new RegExp(meta.settings.prod, 'i') : null
  const self = meta?.settings?.self ? new RegExp(meta.settings.self, 'i') : null
  let f = 0.5
  const diceProducto = prod ? prod.test(kw) : false
  if (diceProducto) f += 0.15
  if (self && self.test(kw)) f += 0.30
  if (FIT_AEST.test(kw) && !FIT_ANYPROD.test(kw)) f += 0.25
  if (FIT_BUY.test(kw)) f += 0.10
  if (kw.split(' ').length >= 3) f += 0.05
  f = Math.min(f, 1)
  if (!FIT_AEST.test(kw)) f = f * 0.5
  return Math.round(f * 100) / 100
}

const LS_CLAVE = (prod) => `mavra_research_${prod}`

function leerGuardado(prod) {
  try {
    const raw = localStorage.getItem(LS_CLAVE(prod))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function ResearchPanel({ prod, data: dataRaw, ukl }) {
  const guardado = useMemo(() => leerGuardado(prod), [prod])
  /**
   * Las keywords de la UKL entran al mismo array que las del reverse-ASIN, con
   * `bucket: 'UKL'`. Los campos que dependen de los competidores van en null y
   * no en cero: en la UKL ningún competidor la tiene, y un cero ahí se leería
   * como "medido y da cero" en vez de "no aplica".
   */
  const data = useMemo(() => {
    const ya = new Set(dataRaw.kws.map((k) => k.kw_lower))
    const extra = (ukl?.kws || []).filter((k) => !ya.has(k.kw_lower)).map((k) => ({
      ...k,
      norm: k.kw_lower, root: 'universo', sales: 0,
      // El fit SI se calcula: depende de la keyword y del producto, no de los
      // competidores. Lo había metido en la misma bolsa que rel/IDN/tier por
      // descuido y quedaba vacío para las 324. (Frank lo cazó, 2026-07-31)
      n: 0, p1: 0, rel: null, fit: fitDe(k.kw, dataRaw.meta), idn: null,
      seasonal: false, mism: false, propio: false,
      sbv: 0, choice: 0, sp: 0,
      ranks: {}, bucket: 'UKL', tier: null, prio: null, match: null,
      fuente: 'ukl',
    }))
    return { ...dataRaw, kws: [...dataRaw.kws, ...extra] }
  }, [dataRaw, ukl])

  // Uso en el listing: se calcula una vez por keyword contra el copy del producto
  // activo, y viaja en la fila como use_T / use_B / … para que ordene y filtre
  // igual que cualquier otra columna.
  const usos = useMemo(() => {
    const copy = LISTING_COPY[prod] || {}
    const cache = new Map()
    return (kw) => {
      if (!cache.has(kw)) {
        const v = {}
        USAGE_FIELDS.forEach((f) => { v[`use_${f.key}`] = usageValor(kw, copy[f.key]) })
        cache.set(kw, v)
      }
      return cache.get(kw)
    }
  }, [prod])
  const [assign, setAssign] = useState(() =>
    data.kws.map((k) => guardado.buckets?.[k.kw_lower] ?? k.bucket))
  const [tab, setTab] = useState('MKL')
  const [q, setQ] = useState('')
  const [negOn, setNegOn] = useState(false)
  const [sel, setSel] = useState(() => new Set())
  const [showComp, setShowComp] = useState(() => guardado.showComp ?? true)
  const [rootSel, setRootSel] = useState(() => new Set())
  const [rootMode, setRootMode] = useState('norm')
  // Un sorter y un juego de filtros por tabla. Viven en el componente, así que
  // cambiar de tab y volver no borra lo que el usuario configuró.
  const [sort, onSort] = useSorter({ key: 'idn', dir: 'desc' })
  const [rootSort, onRootSort] = useSorter({ key: null, dir: 'desc' })
  const [rkSort, onRkSort] = useSorter({ key: 'vol', dir: 'desc' })
  const [normSort, onNormSort] = useSorter({ key: null, dir: 'desc' })
  const [compSort, onCompSort, setCompSort] = useSorter({ key: null, dir: 'desc' })
  const [colF, setColF] = useState({})        // filtros de la tabla de keywords
  const [rootF, setRootF] = useState({})      // filtros de Roots (izquierda)
  const [rkF, setRkF] = useState({})          // filtros de las keywords del root (derecha)
  const [normF, setNormF] = useState({})      // filtros del Normalizer
  const [compQ, setCompQ] = useState('')      // filtro de competidores por marca/ASIN
  // Columnas escondidas por tabla. Mismo motivo que arriba: sobreviven al cambio de tab.
  const [kwHid, setKwHid] = useState(() => new Set(guardado.kwHid || []))
  const [rootHid, setRootHid] = useState(() => new Set())
  const [rkHid, setRkHid] = useState(() => new Set())
  const [normHid, setNormHid] = useState(() => new Set())
  const [compHid, setCompHid] = useState(() => new Set())
  // Toggle Organic / Sponsored, como el de DataDive. El SR sale del MCP de H10
  // (sponsored_rank por ASIN) — no de scrapear el SERP.
  const [rankMode, setRankMode] = useState(() => guardado.rankMode || 'organic')
  // Orden de las columnas de la tabla de keywords. Arranca en null = el orden en
  // que están definidas; se llena la primera vez que alguien arrastra una.
  const [kwOrden, setKwOrden] = useState(() => guardado.kwOrden ?? null)
  const [arrastrando, setArrastrando] = useState(null)
  // Apagar Helium 10 deja a la vista SOLO lo que agrega AGTA. Keyword y Vol
  // nunca se van: sin ellas la tabla no se puede leer.
  const [verH10, setVerH10] = useState(() => guardado.verH10 ?? true)
  // Las keywords de marca ajena. Como en DataDive, NO se sacan del bucket: se
  // marcan y se pueden apagar en la tabla que estés mirando. (2026-07-31)
  const [verMarcas, setVerMarcas] = useState(() => guardado.verMarcas ?? true)
  const [verLeyenda, setVerLeyenda] = useState(false)
  /**
   * A qué precio pensás vender. El price-fit y medio veredicto dependen de esto,
   * y un MKL no siempre tiene un precio cerrado: se corre para investigar un
   * nicho, para lanzar o para sostener un producto que ya vende. Por eso el
   * precio es un dato editable y no una constante del código — y si se deja
   * vacío, los veredictos que dependen del precio no se muestran.
   */
  const [miPrecio, setMiPrecio] = useState(() => {
    if (guardado.miPrecio !== undefined) return guardado.miPrecio
    const m = data.meta?.senales
    return m?.precio_unitario_propio ?? m?.mi_precio ?? ''
  })
  // 🔑 El idioma sale del mismo selector que el resto del sitio (`useMavraLanguage`,
  // localStorage + evento), no de una copia local: así el toggle del encabezado
  // cambia esta página igual que cambia Home o Case Study.
  const [lang] = useMavraLanguage()
  const TAB_DESC = TAB_DESC_I18N[lang] || TAB_DESC_I18N.es
  const INFO = INFO_I18N[lang] || INFO_I18N.es
  // 🔑 `T` traduce por el texto castellano. Ver el porqué en `researchI18n.js`:
  // cuando falta una traducción sale el castellano, que se ve; una clave rota
  // saldría como hueco, que no se ve hasta que alguien abre esa pestaña.
  const T = useCallback((t) => traducir(t, lang), [lang])
  // Las columnas y las filas de competidores se declaran fuera del componente
  // (se arman una sola vez) y por eso traen el castellano dentro: acá se les
  // traduce lo que se dibuja —grupo, etiqueta y ayuda— sin tocar las claves,
  // que son lo que ordena, filtra y guarda el orden de columnas.
  const COLS = useMemo(
    () => COLS_BASE.map((c) => ({ ...c, grupo: T(c.grupo), label: T(c.label) })),
    [T])
  const COMP_ROWS = useMemo(
    () => COMP_ROWS_BASE.map((r) => ({ ...r, label: T(r.label), info: T(r.info) })),
    [T])
  const ov = data.overview

  const counts = useMemo(() => {
    const c = { MKL: 0, Outliers: 0, Residue: 0, Negatives: 0, Trash: 0 }
    assign.forEach((b) => { c[b] = (c[b] || 0) + 1 })
    return c
  }, [assign])

  /**
   * Competidores en vivo. La cobertura de un competidor no es un dato fijo: depende
   * de qué keywords están hoy en cada bucket. Si se mueven keywords con el
   * multi-move, share, cobertura y fuerza se recalculan acá. Lo de Keepa (precio,
   * rating, reseñas, edad, variaciones, categoría) no se toca: describe al
   * producto, no al MKL.
   */
  const comps = useMemo(() => {
    const mkl = []
    const outl = []
    data.kws.forEach((k, i) => {
      if (assign[i] === 'MKL') mkl.push(k)
      else if (assign[i] === 'Outliers') outl.push(k)
    })
    const svMkl = mkl.reduce((s, k) => s + k.vol, 0)
    return data.competitors.map((c) => {
      const enP1 = mkl.filter((k) => (k.ranks[c.asin] || Infinity) <= S.p1_rank)
      const outP1 = outl.filter((k) => (k.ranks[c.asin] || Infinity) <= S.p1_rank)
      const svP1 = enP1.reduce((s, k) => s + k.vol, 0)
      const share = svMkl ? Math.round((svP1 / svMkl) * 1000) / 10 : 0
      // La ficha del competidor (foto, marca, título, precio, reseñas) NO viene del
      // reverse-ASIN: ese solo trae ASIN y ranks. Se completa por ASIN desde Helium 10.
      // Lo que ya venga cargado manda; esto solo llena los huecos.
      const info = COMP_INFO[c.asin] || {}
      return {
        ...c,
        imagen: c.imagen || info.img || null,
        brand: c.brand && c.brand !== c.asin ? c.brand : (info.brand || c.asin),
        titulo: c.titulo || info.title || null,
        precio: c.precio ?? (info.price != null ? Math.round(info.price) / 100 : null),
        rating: c.rating ?? (info.rating || null),
        reviews: c.reviews ?? (info.reviews ?? null),
        kws_p1: enP1.length,
        kws_p1_pct: mkl.length ? Math.round((enP1.length / mkl.length) * 1000) / 10 : 0,
        sv_p1: svP1,
        share,
        outlier_kws: outP1.length,
        outlier_sv: outP1.reduce((s, k) => s + k.vol, 0),
        strength: fuerza(share),
      }
    })
  }, [assign])

  // La mediana del nicho se mueve con los competidores en lo que sale del MKL.
  // Lo de Keepa queda como vino: el precio mediano del nicho no cambia porque
  // alguien reordene keywords.
  const med = useMemo(() => ({
    ...(data.niche_median || {}),
    kws_p1: mediana(comps.map((c) => c.kws_p1)),
    sv_p1: mediana(comps.map((c) => c.sv_p1)),
    share: mediana(comps.map((c) => c.share)),
  }), [comps])

  const isTable = BUCKETS.includes(tab) || tab === 'Trash'
  // Root ya NO se saca sola en el MKL. Que una columna apareciera y desapareciera
  // al cambiar de pestaña era el motivo de que la tabla saltara: cambiaba la
  // cantidad de columnas y se recalculaba todo el ancho. Si molesta se esconde
  // desde el menú de columnas, como cualquier otra — que es lo que Frank pidió.
  // (2026-07-30)
  const baseCols = COLS
  // El orden que eligió el usuario manda; las columnas que no estén en su lista
  // (porque cambió de bucket y apareció Root) caen al final, no desaparecen.
  const colsOrdenadas = useMemo(() => {
    if (!kwOrden) return baseCols
    const pos = new Map(kwOrden.map((k, i) => [k, i]))
    return [...baseCols].sort((a, b) => (pos.has(a.k) ? pos.get(a.k) : 999) - (pos.has(b.k) ? pos.get(b.k) : 999))
  }, [baseCols, kwOrden])
  // Sin Helium 10 las columnas NO desaparecen: se muestran tapadas. Esconderlas
  // ocultaría justo lo que hay que ver — cuánto del análisis depende de tener la
  // herramienta conectada.
  const visCols = colsOrdenadas.filter((c) => c.k === 'kw' || !kwHid.has(c.k))
  // Ancho fijo por columna. Sin esto el navegador lo reparte según el contenido:
  // basta una keyword más larga en otra pestaña para que TODAS las columnas se
  // corran y la tabla parezca otra. Con estos anchos, cambiar de pestaña o
  // esconder una columna no mueve nada de lugar.
  // 🔴 LAS NUMÉRICAS PASAN DE 78 A 96 PX, Y NO ES HOLGURA DE GUSTO.
  //
  // Con 78 px «224,160» se dibujaba «224,1…» y «100,000» como «100,0…»: la
  // celda pedía 81 px y tenía 78. Un número cortado no es un número incómodo,
  // es OTRO número — «224,1…» se lee doscientos veinticuatro coma uno.
  //
  // ⚠️ Y solo se ve mirando la pantalla: en el árbol el texto está entero, el
  // recorte lo hace el CSS al pintar. Medirlo desde el DOM tampoco sirve —
  // measureText sobre la celda ya recortada mide el texto CORTADO y devuelve
  // que cabe. Se mide el dato más largo del set, no lo que se ve.
  //
  // 96 = «1,333,788» (el mayor de Competing Products) a 15,68px con Inter, más
  // los 16 px de padding y los 2 del borde de grupo, que también restan ancho.
  const anchoDe = (c) => (c.k === 'kw' ? 250 : c.k === 'match' ? 150
    : c.k === 'veredicto' ? 112 : c.tipo === 'opciones' ? 86 : 96)
  // `table-layout: fixed` solo respeta el colgroup si la tabla tiene un ancho
  // declarado. Con `width: auto` el navegador vuelve al reparto automático y el
  // colgroup queda de adorno — que fue lo que pasó en el primer intento.
  const anchoTabla = 30 + visCols.reduce((s, c) => s + anchoDe(c), 0)
    + (!kwHid.has('serp') ? 76 : 0) + (showComp ? comps.filter((c) => !kwHid.has(c.asin)).length * 66 : 0)
  // Tapar todo lo que NO existe sin Helium 10: sus datos crudos y también los
  // cálculos de AGTA que se alimentan de ellos (compras x 1.000 sale de dividir
  // dos columnas suyas; relevancy y P1 salen de su reverse-ASIN).
  const tapada = (c) => !verH10 && c.k !== 'kw' && (c.origen === 'mercado' || c.necesitaH10)
  /** Suelta la columna arrastrada justo antes de aquella sobre la que cayó. */
  const moverCol = (desde, hasta) => setKwOrden(() => {
    const actual = (kwOrden || baseCols.map((c) => c.k)).filter((k) => k !== desde)
    const i = actual.indexOf(hasta)
    actual.splice(i < 0 ? actual.length : i, 0, desde)
    return actual
  })
  /**
   * El veredicto, recalculado contra el precio de referencia de ahora. El JSON
   * trae el price-fit medido contra un precio base; acá se reescala al que el
   * usuario tenga escrito. Sin precio, las dos evaluaciones que dependen de él
   * (PREMIUM y OTRO SEGMENTO) no se emiten: no se inventa lo que no se sabe.
   */
  const kwsEval = useMemo(() => {
    const base = data.meta?.senales?.precio_unitario_propio ?? data.meta?.senales?.mi_precio
    const precio = parseFloat(String(miPrecio).replace(',', '.'))
    const hayPrecio = !Number.isNaN(precio) && precio > 0
    const factor = hayPrecio && base ? base / precio : 1
    const compras = data.kws.map((k) => k.compra_mil).filter((c) => c)
    const med = compras.length ? [...compras].sort((a, b) => a - b)[Math.floor(compras.length / 2)] : 0
    return data.kws.map((k) => {
      const pf = k.price_fit == null ? null : Math.round(k.price_fit * factor * 100) / 100
      let v = null
      let motivo = ''
      if (hayPrecio && pf != null && pf < 0.6) { v = 'PRECIO INFERIOR'; motivo = `el precio promedio del término es el ${Math.round(pf * 100)}% del tuyo` }
      else if (k.trend >= 80) { v = 'ESTACIONAL'; motivo = `su volumen se dispara ${Math.round(k.trend)}% en la temporada` }
      else if (med && k.compra_mil < med * 0.4) { v = 'CVR BAJO'; motivo = `KW CVR ${(k.compra_mil / 10).toFixed(2)}%, contra ${(med / 10).toFixed(2)}% del nicho` }
      else if (hayPrecio && pf != null && pf > 1.6) { v = 'PRECIO SUPERIOR'; motivo = `el precio promedio del término es el ${Math.round(pf * 100)}% del tuyo` }
      else if (hayPrecio) { v = 'ATACAR'; motivo = 'precio y conversión en rango' }
      else if (k.compra_mil) { v = 'ATACAR'; motivo = 'conversión en rango — el precio no está definido' }
      return { ...k, price_fit: hayPrecio ? pf : null, veredicto: v, motivo }
    })
  }, [data, miPrecio])

  // Los valores que EXISTEN en cada columna cerrada, para el filtro de tildar.
  // Salen de la data, no de una lista escrita a mano: si el motor inventa un
  // veredicto nuevo, aparece solo.
  const opcionesCol = useMemo(() => {
    const out = {}
    COLS.filter((c) => c.tipo === 'opciones').forEach((c) => {
      out[c.k] = [...new Set(kwsEval.map((k) => String(k[c.k] ?? '')).filter(Boolean))].sort()
    })
    return out
  }, [kwsEval])
  const verSerp = !kwHid.has('serp')
  const kwComps = showComp ? comps.filter((c) => !kwHid.has(c.asin)) : []
  const kwOpciones = [
    ...baseCols.slice(1).map((c) => ({ k: c.k, label: c.label })),
    { k: 'serp', label: 'SERP' },
    ...(showComp ? comps.map((c) => ({ k: c.asin, label: c.brand || c.asin, grupo: 'Competidores' })) : []),
  ]

  // El buscador de arriba usa el MISMO motor que los filtros de columna. Frank
  // escribió `goth + decor` acá y le devolvió cero: hacía includes() de la
  // cadena literal, así que buscaba una keyword que dijera "goth + decor" tal
  // cual. Si la sintaxis existe en un lado tiene que existir en todos.
  const query = q.trim()
  const rows = useMemo(() => {
    if (!isTable) return []
    // Una columna escondida no puede seguir filtrando por atrás: sería un filtro
    // invisible. Solo se aplican los filtros de columnas que están a la vista.
    const vis = new Set([
      ...visCols.map((c) => c.k),
      ...(verSerp ? ['serp'] : []),
      ...kwComps.map((c) => `rank:${c.asin}`),
    ])
    // Un filtro de opciones sin nada tildado es un array vacío: existe pero no
    // filtra. Si no se descarta acá, no dejaría pasar ninguna fila.
    const activos = Object.entries(colF)
      .filter(([k, v]) => vis.has(k) && (Array.isArray(v) ? v.length > 0 : Boolean(v)))
    return sortRows(
      kwsEval
        .map((k, i) => ({ ...k, _i: i, _b: assign[i], ...usos(k.kw) }))
        .filter((k) => k._b === tab
          && (verMarcas || !k.branded)
          && (!query || matchFilter(k.kw, query))
          && activos.every(([key, expr]) => matchFilter(valorCol(k, key, rankMode), expr))),
      sort,
      (r, key) => ordenCol(r, key, rankMode)
    )
  }, [assign, tab, query, sort, isTable, colF, rankMode, kwHid, showComp, verSerp, kwsEval, verMarcas, usos])

  // Las keywords que HOY están en el MKL. Roots y Normalizer se arman sobre esto y
  // no sobre el bucket congelado del JSON: si mueves una keyword con el multi-move,
  // las dos herramientas se mueven con ella.
  const mklKws = useMemo(() => data.kws.filter((k, i) => assign[i] === 'MKL'), [assign])

  /**
   * Índice de roots: n-gramas de 1 a 3 palabras sobre el MKL actual, igual que
   * DataDive. Un root que aparece en una sola keyword no es un root, y la misma
   * keyword no cuenta dos veces aunque repita el n-grama.
   * Es un Map root → keywords porque la lista de la izquierda y las keywords de la
   * derecha salen del MISMO lugar: así no pueden contradecirse.
   */
  const rootIdx = useMemo(() => {
    const campo = rootMode === 'norm' ? 'norm' : 'kw_lower'
    const bolsa = new Map()
    mklKws.forEach((k) => {
      const toks = (k[campo] || '').split(' ').filter(Boolean)
      const vistos = new Set()
      for (const largo of [1, 2, 3]) {
        for (let i = 0; i + largo <= toks.length; i++) {
          const r = toks.slice(i, i + largo).join(' ')
          if (vistos.has(r)) continue
          vistos.add(r)
          if (!bolsa.has(r)) bolsa.set(r, [])
          bolsa.get(r).push(k)
        }
      }
    })
    return bolsa
  }, [mklKws, rootMode])

  // Frecuencia = en cuántas keywords aparece · Vol. broad = SV sumado de todas ellas.
  const rootBase = useMemo(() => {
    const out = []
    rootIdx.forEach((kws, root) => {
      if (kws.length < 2) return
      out.push({ root, kws: kws.length, sv: kws.reduce((s, k) => s + k.vol, 0), words: root.split(' ').length })
    })
    out.sort((a, b) => (b.sv - a.sv) || (b.kws - a.kws))
    return out.slice(0, TOPE_ROOTS)
  }, [rootIdx])

  const rootList = useMemo(() => {
    const filtrado = rootBase.filter((r) =>
      matchFilter(r.root, rootF.root)
      && (rootHid.has('kws') || matchFilter(r.kws, rootF.kws))
      && (rootHid.has('sv') || matchFilter(r.sv, rootF.sv)))
    return sortRows(filtrado, rootSort)
  }, [rootBase, rootF, rootSort, rootHid])
  const maxRootSv = rootList.reduce((m, r) => Math.max(m, r.sv), 0) || 1

  const rootKws = useMemo(() => {
    if (!rootSel.size) return []
    // Unión de los roots tildados: una keyword que está en dos roots va una sola vez.
    const union = new Map()
    rootSel.forEach((r) => (rootIdx.get(r) || []).forEach((k) => union.set(k.kw, k)))
    const base = [...union.values()].filter((k) => matchFilter(k.kw, rkF.kw)
      && (rkHid.has('vol') || matchFilter(k.vol, rkF.vol))
      && (rkHid.has('rel') || matchFilter(k.rel, rkF.rel)))
    return sortRows(base, rkSort)
  }, [rootSel, rootIdx, rkF, rkSort, rkHid])
  const rootKwsSv = rootKws.reduce((s, k) => s + k.vol, 0)

  /**
   * Normalizer sobre el MKL actual. El SV de cada forma es la SUMA de las keywords
   * que colapsaron en ella: antes se armaba con un diccionario forma→volumen y la
   * última keyword pisaba a la anterior, así que el volumen quedaba subestimado
   * (con esta data, 35% abajo del real). `n` es cuántas variantes colapsaron.
   */
  const normBase = useMemo(() => {
    const bolsa = new Map()
    mklKws.forEach((k) => {
      const b = bolsa.get(k.norm) || { kw: k.norm, sv: 0, n: 0, variantes: [] }
      b.sv += k.vol
      b.n += 1
      b.variantes.push(k.kw)
      bolsa.set(k.norm, b)
    })
    return [...bolsa.values()].sort((a, b) => b.sv - a.sv)
  }, [mklKws])

  const normList = useMemo(() => {
    const base = normBase.filter((n) => matchFilter(n.kw, normF.kw)
      && (normHid.has('sv') || matchFilter(n.sv, normF.sv))
      && (normHid.has('n') || matchFilter(n.n, normF.n)))
    return sortRows(base, normSort)
  }, [normBase, normF, normSort, normHid])
  const normSv = normList.reduce((s, n) => s + n.sv, 0)


  const compVis = useMemo(() => {
    const busca = compQ.trim().toLowerCase()
    const base = comps.filter((c) => !compHid.has(c.asin)
      && (!busca || `${c.brand || ''} ${c.asin}`.toLowerCase().includes(busca)))
    if (!compSort.key) return base
    const row = COMP_ROWS.find((r) => r.k === compSort.key)
    return sortRows(base, compSort, (c, k) => (row && row.sortVal ? row.sortVal(c) : c[k]))
  }, [comps, compHid, compQ, compSort])
  const compOpciones = [
    // 🔴 EL LABEL PASA POR EL DICCIONARIO. Salia «Mediana del nicho» dentro del
    // menu de columnas con la pagina en ingles — y solo se veia abriendolo.
    { k: '__med', label: T('Mediana del nicho') },
    ...comps.map((c) => ({ k: c.asin, label: c.brand || c.asin, grupo: 'Competidores' })),
  ]
  const verMed = !compHid.has('__med')

  const toggle = (i) => setSel((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  const allShown = rows.length > 0 && rows.every((r) => sel.has(r._i))
  const toggleAll = () => setSel((s) => {
    const n = new Set(s)
    if (allShown) rows.forEach((r) => n.delete(r._i))
    else rows.forEach((r) => n.add(r._i))
    return n
  })
  const moveSel = (to) => {
    setAssign((a) => { const n = [...a]; sel.forEach((i) => { n[i] = to }); return n })
    setSel(new Set())
  }

  // Las keywords que el usuario movió a mano: las que hoy están en un bucket
  // distinto del que calculó el motor. Es lo único que hay que guardar de
  // `assign` — guardar los 6.179 valores enteros haría que una regeneración del
  // JSON pisara el cálculo nuevo con el viejo.
  const movidas = useMemo(() => {
    const m = {}
    data.kws.forEach((k, i) => { if (assign[i] !== k.bucket) m[k.kw_lower] = assign[i] })
    return m
  }, [assign])

  /**
   * Al abrir, lo guardado en Supabase manda sobre lo del navegador: es el estado
   * compartido, el que ve Tecki y el que sobrevive si Frank cambia de máquina.
   * El localStorage queda como respaldo para cuando la red no responde.
   */
  const [sincronizado, setSincronizado] = useState(false)
  useEffect(() => {
    let vivo = true
    traerCorrecciones(prod).then((remoto) => {
      if (!vivo) return
      if (remoto && Object.keys(remoto).length) {
        setAssign(data.kws.map((k) => remoto[k.kw_lower] ?? k.bucket))
      }
      setSincronizado(true)
    })
    return () => { vivo = false }
  }, [prod, data])

  // Guardado. Va en un efecto y no en cada handler para no repetir la escritura
  // en los quince lugares que tocan estos estados.
  useEffect(() => {
    try {
      localStorage.setItem(LS_CLAVE(prod), JSON.stringify({
        buckets: movidas,
        kwHid: [...kwHid],
        kwOrden,
        miPrecio,
        rankMode,
        verH10,
        verMarcas,
        showComp,
        guardadoEl: new Date().toISOString(),
      }))
    } catch {
      /* cuota llena o modo privado: se pierde el guardado, no la sesión */
    }
  }, [prod, movidas, kwHid, kwOrden, miPrecio, rankMode, verH10, verMarcas, showComp])

  /**
   * Y a Supabase, medio segundo después del último clic. Sin esa espera, mover
   * diez keywords seguidas dispararía diez sincronizaciones completas.
   * No sube hasta haber leído: si escribiera antes, un arranque con la red
   * lenta borraría en la nube lo que todavía no llegó al navegador.
   */
  useEffect(() => {
    if (!sincronizado) return
    const meta = {}
    data.kws.forEach((k) => { if (movidas[k.kw_lower]) meta[k.kw_lower] = { orig: k.bucket, vol: k.vol } })
    const t = setTimeout(() => { guardarCorrecciones(prod, movidas, meta) }, 500)
    return () => clearTimeout(t)
  }, [prod, movidas, sincronizado, data])

  /**
   * Los cambios viven en el localStorage de ESTE navegador: nadie más los ve, ni
   * yo desde el otro lado. Este botón los saca en texto plano para pegarlos en
   * el chat, que es como Frank me muestra su criterio hasta que el guardado
   * viva en Supabase.
   */
  const copiarCambios = () => {
    const por = {}
    data.kws.forEach((k, i) => {
      if (assign[i] === k.bucket) return
      const destino = assign[i]
      ;(por[destino] = por[destino] || []).push(`${k.kw}  (${miles(k.vol)}, venía de ${k.bucket})`)
    })
    const texto = [
      `MKL ${data.meta.product} — ${Object.keys(movidas).length} correcciones a mano`,
      ...Object.entries(por).flatMap(([destino, kws]) => [``, `→ ${destino} (${kws.length})`, ...kws.map((x) => `   ${x}`)]),
    ].join('\n')
    navigator.clipboard.writeText(texto)
  }

  const descartarCambios = () => {
    if (!window.confirm(`Vas a descartar ${Object.keys(movidas).length} movimientos y volver a lo que calculó el motor. ¿Seguro?`)) return
    setAssign(data.kws.map((k) => k.bucket))
    setSel(new Set())
  }
  const toggleRoot = (r) => setRootSel((s) => { const n = new Set(s); n.has(r) ? n.delete(r) : n.add(r); return n })
  const setF = (setter) => (key, val) => setter((f) => ({ ...f, [key]: val }))

  /**
   * El encabezado pegado son tres filas: grupos, títulos y filtros. Cada una
   * tiene que arrancar donde termina la anterior, y sus altos dependen de la
   * tipografía — con un valor fijo en el CSS, al cambiar la fuente el
   * encabezado se montaba encima de la primera fila de datos. Se miden acá y
   * el CSS los lee de estas variables.
   */
  const panelRef = useRef(null)
  const medirEncabezado = useCallback(() => {
    const nodo = panelRef.current
    if (!nodo) return
    const filas = nodo.querySelectorAll('.mkl-thead tr')
    if (filas.length < 2) return
    nodo.style.setProperty('--mkl-th1', `${Math.round(filas[0].getBoundingClientRect().height)}px`)
    nodo.style.setProperty('--mkl-th2', `${Math.round(filas[1].getBoundingClientRect().height)}px`)
  }, [])
  useLayoutEffect(() => {
    medirEncabezado()
    window.addEventListener('resize', medirEncabezado)
    return () => window.removeEventListener('resize', medirEncabezado)
  }, [medirEncabezado, tab, kwHid, kwOrden, showComp, verH10])
  const filtroActivo = Object.values(colF).some((v) => (Array.isArray(v) ? v.length > 0 : Boolean(v)))

  return (
    // Siempre a pantalla completa: el MKL se trabaja con todo el ancho, como
    // DataDive, y el resto de las pestañas usa el MISMO contenedor para que
    // cambiar de pestaña no mueva la interfaz de lugar. Lo que se lee (el
    // veredicto) se limita solo, adentro, al ancho de lectura.
    <ProveedorAyuda>
    <main className="rsch rsch-full" ref={panelRef}>
      {/* 🔑 UNA SOLA FILA (Frank, 2026-09-16: «esto a una sola línea»). Eran dos
          tiras —los cuatro buckets arriba, las herramientas debajo— y ocupaban
          dos renglones para siete botones. El corte entre «grupos de keywords» y
          «herramientas» se sigue viendo, pero por el separador, no por la fila. */}
      <div className="rsch-tabs">
        {BUCKETS.map((t) => (
          <button key={t} type="button" className={`rsch-tab${tab === t ? ' active' : ''}`} onClick={() => { setTab(t); setSel(new Set()) }}>
            {T(t)} <span className="rsch-tab-n">{counts[t]}</span>
          </button>
        ))}
        {TOOLS.map((t, i) => (
          <button
            key={t}
            type="button"
            className={`rsch-tab${tab === t ? ' active' : ''}${i === 0 ? ' rsch-tab-corte' : ''}`}
            onClick={() => setTab(t)}
          >
            {T(t)}{' '}
            {t !== 'Veredicto' && (
              <span className="rsch-tab-n">
                {t === 'Roots' ? rootList.length : t === 'Normalizer' ? normList.length : compVis.length}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* 🔴 EL PÁRRAFO DE DESCRIPCIÓN DE LA PESTAÑA SALE DE LA PANTALLA (Frank,
          2026-09-16: «quita los textos que están debajo del selector de tabla»).
          Ocupaba dos renglones fijos encima de la tabla en todas las pestañas.
          📌 El texto NO se borra: sigue en `TAB_DESC` y lo lleva la pestaña en su
          `title`, así que se lee pasando el ratón por encima. Borrarlo habría
          perdido la única explicación de qué es cada bucket. */}

      {/* 🔴 EL CARTEL DE «KEYWORDS MOVIDAS A MANO» SALE DE LA PANTALLA.
          Existía para que quien movía keywords viera que su trabajo quedaba
          guardado. Pero esta página la lee alguien de fuera, y ahí ese cartel
          cuenta cómo se hizo la salchicha: cuántas se tocaron a mano, que hay
          un bot mirando, y dos botones para deshacerlo.
          Frank, 2026-09-15: «quita eso».
          ⚠️ Lo que se va es el AVISO. `movidas`, `copiarCambios` y
          `descartarCambios` siguen vivos: los cambios se guardan igual y el
          multi-move sigue funcionando. */}

      {/* ── Veredicto del nicho: el informe, aparte de la herramienta ──────── */}
      {tab === 'Veredicto' && (
        <div className="rsch-informe">
          {/* El titular: el veredicto en grande y la lectura al lado, a todo el
              ancho. Es lo único que hay que leer si no se lee nada más. */}
          <header className="rsch-inf-hero" style={{ '--ver': VER_COLOR[ov.veredicto] }}>
            <div className="rsch-inf-fallo">
              <span className="rsch-inf-eyebrow">{T('Veredicto del nicho')}</span>
              <strong>{T(ov.veredicto)}</strong>
              <span className="rsch-inf-prod">{data.meta.product}</span>
            </div>
            {/* 🔴 EL VEREDICTO NARRADO VIENE DENTRO DEL DATO, no de esta página:
                lo escribe el motor de nichos al armar el MKL, con los números ya
                calculados. Por eso el toggle no lo tocaba — un diccionario de aquí no
                puede traducir una frase que se generó allá. Desde el 2026-09-16 el
                motor la manda en los dos idiomas y aquí solo se elige.
                El castellano es el respaldo: si algún día falta la inglesa, se ve la
                castellana —que se nota— en vez de un hueco. */}
            <p className="rsch-inf-lectura">{(lang === 'en' && ov.lectura_en) || ov.lectura}</p>
          </header>

          {/* 🔴 LAS SEIS CIFRAS IBAN DEL MISMO TAMAÑO, ASÍ QUE NINGUNA MANDABA.
              Un veredicto de nicho contesta UNA pregunta —¿queda sitio para mí?— y
              dos de las seis la contestan: cuánto del nicho tiene ya el líder, y
              cuánto volumen no tiene dueño. Las otras cuatro son el contexto que se
              mira DESPUÉS, si la primera lectura invita a seguir.
              Puestas todas iguales, había que leer seis para encontrar las dos. */}
          <div className="rsch-inf-clave">
            <div className="rsch-inf-cifra rsch-inf-cifra-xl">
              <b>{ov.lider_share}%</b>
              <span>{T('del nicho ya es del líder')}</span>
              <em>{T('su parte en primera página — cuanto más alto, menos sitio queda')}</em>
            </div>
            <div className="rsch-inf-cifra rsch-inf-cifra-xl">
              <b>{miles(ov.sv_uncontested)}</b>
              <span>{T('búsquedas al mes sin dueño')}</span>
              <em>{T('las rankean 2 competidores o menos — por ahí se entra')}</em>
            </div>
          </div>

          {/* El contexto, en pequeño: de qué tamaño es el nicho y sobre qué se midió. */}
          <div className="rsch-inf-cifras">
            {[
              [miles(ov.n_niche), T('keywords del producto'), `${miles(ov.sv_niche)} ${lang === 'en' ? 'searches/mo' : 'búsquedas/mes'}`],
              [miles(counts.MKL), T('en el núcleo'), T('las que pelea el nicho')],
              [miles(counts.Outliers), 'Outliers', T('volumen que nadie domina')],
              [miles(data.meta.n_comp), T('competidores'), T('sobre los que se midió todo')],
            ].map(([v, t, sub]) => (
              <div key={t} className="rsch-inf-cifra">
                <b>{v}</b>
                <span>{t}</span>
                <em>{sub}</em>
              </div>
            ))}
          </div>

          <div className="rsch-inf-cols">
            <section className="rsch-inf-bloque">
              <h2 className="rsch-inf-h2">{T('Por qué')}</h2>
              <ul className="rsch-inf-razones">
                {((lang === 'en' && ov.razones_en) || ov.razones).map((r) => <li key={r}>{r}</li>)}
              </ul>
              <p className="rsch-inf-nota">{(lang === 'en' && ov.falta_en) || ov.falta}</p>
            </section>

            {ov.top_libres?.length > 0 && (
              <section className="rsch-inf-bloque rsch-inf-entrada">
                <h2 className="rsch-inf-h2">{T('Por dónde se entra')}</h2>
                <table className="rsch-inf-tabla">
                  <tbody>
                    {ov.top_libres.map((k) => (
                      <tr key={k.kw}>
                        <td>{k.kw}</td>
                        <td>{miles(k.vol)}<small>{lang === 'en' ? '/mo' : '/mes'}</small></td>
                        <td>{k.n}<small> {T('comp.')}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="rsch-inf-nota">
                  {T('Términos del producto que rankean 2 competidores o menos. Son la puerta: ahí no hay con quién pelear.')}
                </p>
              </section>
            )}
          </div>

          <p className="rsch-foot">
            {lang === 'en' ? (
              <>
                Read this <b>once</b>, before you decide whether to enter the niche. The MKL is what you work on
                every day: it is in the <b>MKL</b> tab, full screen.
                {' '}Core from {S.min_comp} competitors on page 1 and {S.min_sv} searches · outliers from {miles(S.outlier_min_sv)}.
                {' '}Source: {data.meta.source}.
              </>
            ) : (
              <>
                Esto se lee <b>una vez</b>, antes de decidir si entras al nicho. El MKL es lo que se trabaja
                todos los días: está en la pestaña <b>MKL</b>, a pantalla completa.
                {' '}Núcleo desde {S.min_comp} competidores en primera página y {S.min_sv} búsquedas · outliers desde {miles(S.outlier_min_sv)}.
                {' '}Fuente: {data.meta.source}.
              </>
            )}
          </p>
        </div>
      )}

      {/* ── Competidores (estilo Competitor Details de DD) ─────────────────── */}
      {tab === 'Competidores' && (
        <>
          <div className="rsch-bar">
            {/* ⛔ El filtro de competidores salió de la barra (Frank, 2026-09-16).
                Con nueve competidores en pantalla, un buscador sobra: se ven
                todos de un vistazo. `compQ` se queda vacío. */}
            <MenuColumnas fija={T('Métrica')} opciones={compOpciones} ocultas={compHid} setOcultas={setCompHid} />
            {compSort.key && (
              <span className="rsch-bulk">
                <span className="rsch-bulk-n">
                  {T('ordenado por')} {(COMP_ROWS.find((r) => r.k === compSort.key) || {}).label} ({compSort.dir === 'desc' ? T('mayor a menor') : T('menor a mayor')})
                </span>
                <button type="button" className="rsch-bulk-clear" onClick={() => setCompSort({ key: null, dir: 'desc' })}>
                  {T('volver al orden original')}
                </button>
              </span>
            )}
          </div>
          <div className="mkl-scroll">
            <table className="mkl-table mkl-comp" style={{ width: 'auto', minWidth: '1100px' }}>
              <thead className="mkl-thead">
                {/* ⛔ SIN AYUDAS EN ESTA TABLA (Frank, 2026-09-16: «los hover de los
                    competidores no están traducidos, ni los traduzcas, quítalos»).
                    Eran cuatro: las dos cabeceras de la izquierda, la de cada
                    competidor y la de cada fila de métrica (`COMP_ROWS.info`).
                    Las tres últimas estaban escritas solo en castellano y no
                    pasaban por el diccionario, así que en inglés salían tal cual.
                    Los textos siguen en `COMP_ROWS` e `INFO` por si vuelven. */}
                <tr>
                  <Th label={`${T('Competidores')} ${compVis.length}`} align="left" style={{ minWidth: 210 }} />
                  {verMed && <Th label={T('Mediana del nicho')} align="left" style={{ minWidth: 140 }} />}
                  {compVis.map((c) => (
                    <Th
                      key={c.asin}
                      className="mkl-th-comp rsch-th-comp"
                      /* La foto va ARRIBA de la marca, no en una fila aparte: es
                         lo primero que dice si ese competidor se parece al tuyo,
                         y en una fila obligaba a bajar la vista por cada uno. */
                      label={(
                        <span className="rsch-comp-id">
                          {c.imagen
                            ? <img src={c.imagen} alt="" className="rsch-comp-foto" loading="lazy" />
                            : <span className="rsch-comp-foto rsch-comp-foto-vacia" aria-hidden="true" />}
                          <span className="rsch-comp-marca">{(c.brand || c.asin).slice(0, 14)}</span>
                        </span>
                      )}
                      style={{ minWidth: 118 }}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMP_ROWS.map((row) => {
                  const activo = compSort.key === row.k
                  return (
                    <tr key={row.k} className="mkl-krow">
                      <td className="mkl-kw">
                        {/* La tabla está transpuesta: cada fila es una métrica, así que
                            el sorter de columnas vive en el nombre de la fila. */}
                        <button
                          type="button"
                          className={`rsch-rowsort${activo ? ' active' : ''}`}
                          onClick={() => onCompSort(row.k)}
                          aria-label={`${lang === 'en' ? 'Sort competitors by' : 'Ordenar competidores por'} ${row.label}`}
                        >
                          {row.label}
                          <span className={`mkl-sortcaret${activo ? '' : ' dim'}`} aria-hidden="true">
                            {activo ? (compSort.dir === 'desc' ? '▾' : '▴') : '⇅'}
                          </span>
                        </button>
                      </td>
                      {verMed && (
                        <td className="mkl-num-cell" style={{ opacity: 0.75 }}>
                          {row.med && med[row.med] != null ? (row.fmt ? row.fmt(med[row.med]) : med[row.med]) : '—'}
                        </td>
                      )}
                      {compVis.map((c) => {
                        const v = c[row.k]
                        return (
                          <td key={c.asin} className={['brand', 'asin', 'categoria', 'edad', 'titulo', 'imagen'].includes(row.k) ? '' : 'mkl-num-cell'}>
                            {row.foto ? (
                              v ? (
                                <a href={`https://www.amazon.com/dp/${c.asin}`} target="_blank" rel="noreferrer" title={c.titulo || c.asin}>
                                  <img src={v} alt={c.titulo || c.asin} className="rsch-comp-foto" loading="lazy" />
                                </a>
                              ) : <span style={{ opacity: 0.4 }}>—</span>
                            ) : row.k === 'titulo' ? (
                              <span className="rsch-comp-titulo" title={v || ''}>{v || '—'}</span>
                            ) : row.badge ? (
                              <span style={{ background: STRENGTH_COLOR[v] || 'transparent', color: '#14150f', padding: '1px 7px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                                {T(v)}
                              </span>
                            ) : row.bar ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 34, height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden' }}>
                                  <span style={{ display: 'block', width: `${Math.min(100, v || 0)}%`, height: '100%', background: '#e0a94c' }} />
                                </span>
                                {row.fmt(v)}
                              </span>
                            ) : (
                              row.fmt ? row.fmt(v) : v
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {compVis.length === 0 && (
            <p className="rsch-tabdesc" style={{ marginTop: 10 }}>{T('Ningún competidor pasa el filtro.')}</p>
          )}
          <p className="rsch-foot">
            {lang === 'en' ? (
              <>
                Coverage, share, strength and Outlier volume come from the <b>current MKL</b>: they recalculate
                automatically when you move keywords between buckets, and so does the median of those three rows.
                Price, rating, reviews, age, variations and category come from <b>Keepa</b> and do not depend on the MKL.
                <br />
                ⚠️ <b>“Sales activity 30d” is NOT a unit count:</b> they are the number of times its BSR dropped in 30 days
                (observed sales event). Other tools show <i>estimated</i> units from a curve; we prefer the hard number
                until the BSR→sales curve is calibrated against real sales from connected accounts. Use it to compare
                competitors with each other, not as a “sold N” figure.
              </>
            ) : (
              <>
                Cobertura, share, fuerza y volumen de Outliers salen del <b>MKL de ahora</b>: se recalculan solos
                cuando mueves keywords entre buckets, igual que la mediana de esas tres filas. Precio, rating,
                reseñas, edad, variaciones y categoría salen de <b>Keepa</b> y no dependen del MKL.
                <br />
                ⚠️ <b>“Actividad de venta 30d” NO son unidades:</b> son las veces que le cayó el BSR en 30 días
                (evento de venta observado). Otras herramientas muestran unidades <i>estimadas</i> con una curva; nosotros
                preferimos el dato duro hasta tener la curva BSR→ventas calibrada con ventas reales de cuentas
                conectadas. Sirve para comparar competidores entre sí, no para leerlo como “vendió N”.
              </>
            )}
          </p>
        </>
      )}

      {/* ── Roots ─────────────────────────────────────────────────────────── */}
      {tab === 'Roots' && (
        <>
          <div className="rsch-bar">
            <button type="button" className="rsch-bulk-btn" onClick={() => { setRootMode((m) => (m === 'norm' ? 'raw' : 'norm')); setRootSel(new Set()) }}>
              {T('Mostrar:')} {rootMode === 'norm' ? T('roots normalizados') : T('roots crudos')}
            </button>
            <MenuColumnas
              etiqueta={T('Columnas de roots')}
              fija={T('Root')}
              opciones={[{ k: 'kws', label: T('Frec.') }, { k: 'sv', label: T('Vol. broad') }]}
              ocultas={rootHid}
              setOcultas={setRootHid}
            />
            {rootSel.size > 0 && (
              <MenuColumnas
                etiqueta={T('Columnas de keywords')}
                fija={T('Keyword')}
                opciones={[{ k: 'vol', label: 'Vol' }, { k: 'rel', label: T('Rel %') }]}
                ocultas={rkHid}
                setOcultas={setRkHid}
              />
            )}
            {rootSel.size > 0 && (
              <span className="rsch-bulk">
                <span className="rsch-bulk-n">{rootSel.size} root(s) · {rootKws.length} keywords · {miles(rootKwsSv)} SV</span>
                <button type="button" className="rsch-bulk-clear" onClick={() => setRootSel(new Set())}>{T('limpiar')}</button>
              </span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)', gap: 16, alignItems: 'start' }}>
            <div className="mkl-scroll">
              <table className="mkl-table" style={{ width: '100%' }}>
                <thead className="mkl-thead">
                  <tr>
                    <th className="mkl-th"></th>
                    <Th label={`Root (${rootList.length})`} ayuda={INFO.root_root} align="left" orden="root" sort={rootSort} onSort={onRootSort} />
                    {!rootHid.has('kws') && <Th label={T('Frec.')} ayuda={INFO.root_frec} align="right" orden="kws" sort={rootSort} onSort={onRootSort} />}
                    {!rootHid.has('sv') && <Th label={T('Vol. broad')} ayuda={INFO.root_sv} align="right" orden="sv" sort={rootSort} onSort={onRootSort} />}
                  </tr>
                  <tr>
                    <th className="mkl-th"></th>
                    <FiltroTh campo="root" etiqueta={T('root')} valor={rootF.root} onChange={setF(setRootF)} />
                    {!rootHid.has('kws') && <FiltroTh campo="kws" etiqueta={T('frecuencia')} valor={rootF.kws} onChange={setF(setRootF)} numerico />}
                    {!rootHid.has('sv') && <FiltroTh campo="sv" etiqueta={T('volumen broad')} valor={rootF.sv} onChange={setF(setRootF)} numerico />}
                  </tr>
                </thead>
                <tbody>
                  {rootList.map((r) => (
                    <tr key={r.root} className={`mkl-krow${rootSel.has(r.root) ? ' rsch-selrow' : ''}`}>
                      <td className="rsch-chk">
                        <input type="checkbox" checked={rootSel.has(r.root)} onChange={() => toggleRoot(r.root)} aria-label={`Seleccionar ${r.root}`} />
                      </td>
                      <td className="mkl-kw">
                        <span style={{ background: rootBg(r.words), padding: '1px 6px', borderRadius: 6 }}>{r.root}</span>
                      </td>
                      {!rootHid.has('kws') && <td className="mkl-num-cell">{r.kws}</td>}
                      {!rootHid.has('sv') && (
                        <td className="mkl-num-cell">
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 46, height: 6, background: 'rgba(255,255,255,0.10)', borderRadius: 3, overflow: 'hidden' }}>
                              <span style={{ display: 'block', width: `${(r.sv / maxRootSv) * 100}%`, height: '100%', background: '#e0a94c' }} />
                            </span>
                            {miles(r.sv)}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                  {rootList.length === 0 && <tr><td colSpan={4} className="mkl-empty">{T('Ningún root pasa el filtro.')}</td></tr>}
                </tbody>
              </table>
            </div>


            <div className="mkl-scroll">
              {rootSel.size === 0 ? (
                <p className="rsch-tabdesc" style={{ margin: 0, padding: '0.8rem' }}>
                  {/* 🔴 El ÚNICO texto de la página que seguía en castellano con el toggle
                      en inglés: es un estado VACÍO, así que no se ve a menos que no haya
                      ningún root marcado — y por eso pasó nueve revisiones. Los estados
                      vacíos son el sitio donde se esconde lo que no se tradujo.
                      Y de paso sale el voseo: «te indexás» no va para un cliente. */}
                  {lang === 'en'
                    ? 'Select one or more roots to see their keywords here. Adding roots widens your coverage: write two of them into your listing and you get indexed for both sets of keywords.'
                    : 'Marca uno o varios roots para ver aquí sus keywords. Sumar roots amplía la cobertura: si escribes los dos en el listing, te indexas por las keywords de ambos.'}
                </p>
              ) : (
                <table className="mkl-table" style={{ width: 'auto', minWidth: '100%' }}>
                  <thead className="mkl-thead">
                    <tr>
                      {/* minWidth: sin esto la columna se comprime hasta mostrar una
                          sola letra por keyword. El header de Vol trae el total
                          formateado —"Vol (158,896)"— y se lleva todo el ancho.
                          (Frank lo cazó con el root `decor`, 2026-08-01) */}
                      <Th label={`Keywords (${rootKws.length})`} ayuda={INFO.root_kws} align="left" orden="kw" sort={rkSort} onSort={onRkSort} style={{ minWidth: 240 }} />
                      {!rkHid.has('vol') && <Th label={`Vol (${miles(rootKwsSv)})`} ayuda={INFO.vol} align="right" orden="vol" sort={rkSort} onSort={onRkSort} />}
                      {!rkHid.has('rel') && <Th label={T('Rel %')} ayuda={INFO.rel} align="right" orden="rel" sort={rkSort} onSort={onRkSort} />}
                    </tr>
                    {/* Los filtros faltaban acá: con varios roots tildados la lista se hace
                        larga y sin filtro no hay forma de bajarla. */}
                    <tr>
                      <FiltroTh campo="kw" etiqueta={T('keyword')} valor={rkF.kw} onChange={setF(setRkF)} />
                      {!rkHid.has('vol') && <FiltroTh campo="vol" etiqueta={T('volumen')} valor={rkF.vol} onChange={setF(setRkF)} numerico />}
                      {!rkHid.has('rel') && <FiltroTh campo="rel" etiqueta={T('relevancy')} valor={rkF.rel} onChange={setF(setRkF)} numerico />}
                    </tr>
                  </thead>
                  <tbody>
                    {rootKws.map((k) => (
                      <tr key={k.kw} className="mkl-krow">
                        <td className="mkl-kw">{k.kw}</td>
                        {!rkHid.has('vol') && <td className="mkl-num-cell">{miles(k.vol)}</td>}
                        {!rkHid.has('rel') && <td className="mkl-num-cell">{k.rel}%</td>}
                      </tr>
                    ))}
                    {rootKws.length === 0 && <tr><td colSpan={3} className="mkl-empty">{T('Ninguna keyword pasa el filtro.')}</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <p className="rsch-foot">
            {lang === 'en' ? (
              <>
                Roots are built live from the <b>{miles(mklKws.length)} keywords currently in the MKL</b>:
                phrases of 1 to 3 words, and anything appearing in a single keyword does not count as a root.
                Move keywords between buckets and frequency and broad volume recalculate automatically.
                {' '}<b>This is how PPC gets built:</b> one campaign per root, one root at a time — not from the
                Normalizer, which is text cleanup. Green background = 2- and 3-word roots, the ones that actually work.
              </>
            ) : (
              <>
                Los roots se arman en vivo sobre las <b>{miles(mklKws.length)} keywords que hoy están en el MKL</b>:
                frases de 1 a 3 palabras, y las que aparecen en una sola keyword no cuentan como root. Si mueves
                keywords entre buckets, frecuencia y volumen broad se recalculan solos.
                {' '}<b>Así se arma el PPC:</b> una campaña por root, de a un root por vez — no desde el Normalizer,
                que es limpieza de texto. Fondo verde = roots de 2 y 3 palabras, que son los que sirven de verdad.
              </>
            )}
          </p>
        </>
      )}

      {/* ── Normalizer ────────────────────────────────────────────────────── */}
      {/* ── UKL: el universo del nicho, otra fuente que el MKL ───────────────── */}

      {tab === 'Normalizer' && (
        <>
          <div className="rsch-bar">
            <button
              type="button"
              className="rsch-activate"
              onClick={() => navigator.clipboard.writeText(normList.map((n) => n.kw).join('\n'))}
            >
              Copiar {normList.length} keywords normalizadas
            </button>
            <MenuColumnas
              fija={T('Forma normalizada')}
              opciones={[{ k: 'sv', label: 'SV' }, { k: 'n', label: 'Variantes' }]}
              ocultas={normHid}
              setOcultas={setNormHid}
            />
            <span className="rsch-tabdesc">
              Salen de las {counts.MKL} keywords del MKL: se les quitan plurales y conjunciones, y las que
              quedan iguales se agrupan sumando su volumen. El botón copia lo que estés viendo, filtro incluido.
            </span>
          </div>
          <div className="mkl-scroll">
            <table className="mkl-table" style={{ width: 'auto', minWidth: '620px' }}>
              <thead className="mkl-thead">
                <tr>
                  <Th label={T('Forma normalizada')} ayuda={INFO.norm_kw} align="left" orden="kw" sort={normSort} onSort={onNormSort} style={{ minWidth: 320 }} />
                  {!normHid.has('sv') && <Th label={`SV (${miles(normSv)})`} ayuda={INFO.norm_sv} align="right" orden="sv" sort={normSort} onSort={onNormSort} style={{ minWidth: 130 }} />}
                  {!normHid.has('n') && <Th label={T('Variantes')} ayuda={INFO.norm_n} align="right" orden="n" sort={normSort} onSort={onNormSort} style={{ minWidth: 110 }} />}
                </tr>
                <tr>
                  <FiltroTh campo="kw" etiqueta={T('forma normalizada')} valor={normF.kw} onChange={setF(setNormF)} />
                  {!normHid.has('sv') && <FiltroTh campo="sv" etiqueta="SV" valor={normF.sv} onChange={setF(setNormF)} numerico />}
                  {!normHid.has('n') && <FiltroTh campo="n" etiqueta={T('variantes')} valor={normF.n} onChange={setF(setNormF)} numerico />}
                </tr>
              </thead>
              <tbody>
                {normList.map((n) => (
                  <tr key={n.kw} className="mkl-krow">
                    <td className="mkl-kw">{n.kw}</td>
                    {!normHid.has('sv') && <td className="mkl-num-cell">{miles(n.sv)}</td>}
                    {!normHid.has('n') && (
                      // El title lista las variantes: si dice 3, se ven cuáles son las 3.
                      <td className="mkl-num-cell" title={n.variantes.join(' · ')}>
                        {n.n > 1 ? <b style={{ color: '#e0a94c' }}>{n.n}</b> : n.n}
                      </td>
                    )}
                  </tr>
                ))}
                {normList.length === 0 && <tr><td colSpan={3} className="mkl-empty">{T('Ninguna keyword pasa el filtro.')}</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="rsch-foot">
            {lang === 'en' ? (
              <>
                {miles(normList.length)} normalised forms · {miles(normSv)} SV, over the {miles(mklKws.length)} keywords
                in the current MKL. In <b style={{ color: '#e0a94c' }}>gold</b>, the forms where more than one keyword
                collapsed: those are variants that compete with each other in PPC. Hover the number to see them.
                {' '}Each row&apos;s SV is the <b>sum</b> of the keywords that collapsed, not that of a single one.
                {' '}This is text cleanup: campaigns are built by root, in the Roots tab.
              </>
            ) : (
              <>
                {miles(normList.length)} formas normalizadas · {miles(normSv)} SV, sobre las {miles(mklKws.length)} keywords
                del MKL de ahora. En <b style={{ color: '#e0a94c' }}>dorado</b>, las formas donde colapsó más de una
                keyword: ahí tienes variantes que en PPC te compiten entre sí. Pasa el mouse por el número para verlas.
                {' '}El SV de cada fila es la <b>suma</b> de las keywords que colapsaron, no la de una sola.
                {' '}Esto es limpieza de texto: las campañas se arman por root, en la pestaña Roots.
              </>
            )}
          </p>
        </>
      )}

      {/* ── Tablas de keywords ────────────────────────────────────────────── */}
      {isTable && (tab === 'Negatives' && !negOn ? (
        <div className="rsch-gate">
          <p>
            {lang === 'en' ? (
              <>
                <strong>Negatives is turned off.</strong> Negatives are <em>product-aware</em>: the MKL only knows what to
                negate if it knows the product. They are populated from the ASIN&apos;s <strong>latest Listing Audit</strong>
                {' '}(or one is run if there is none). MAVRA has not launched yet → these are the preliminary
                <em> product-fit filter</em> (battery / cordless / warmer).
              </>
            ) : (
              <>
                <strong>Negatives está desactivado.</strong> Los negativos son <em>product-aware</em>: el MKL sabe qué negar solo si conoce el producto.
                Se poblan desde el <strong>último Listing Audit</strong> del ASIN (o se corre si no hay). MAVRA aún no está lanzado → estos son el
                <em> product-fit filter</em> preliminar (battery / cordless / warmer).
              </>
            )}
          </p>
          <button type="button" className="rsch-activate" onClick={() => setNegOn(true)}>{T('Activar Negatives (preview)')}</button>
        </div>
      ) : (
        <>
          <div className="rsch-bar">
            {/* ⛔ El buscador salió de la barra (Frank, 2026-09-16: «puedes quitar
                el filtro de búsqueda que ya está en la columna»). La columna
                Keyword tiene su propio filtro de palabras —con incluir, sacar y
                el modo «alguna / todas»—, que hace lo mismo y más. `q` se queda
                vacío, así que no filtra nada. */}
            <MenuColumnas fija={T('Keyword')} opciones={kwOpciones} ocultas={kwHid} setOcultas={setKwHid} />
            {/* Los interruptores: mismo tamaño, solo ícono, y el estado se ve
                encendido. Antes eran botones de texto corrido que competían con
                el buscador por la atención. */}
            {/* La explicación larga vive en el tooltip y no como párrafo debajo
                de la barra: ocupaba cuatro renglones fijos para algo que solo
                importa mientras se mira el modo apagado. (Frank, 2026-07-31) */}
            {/* ⛔ El botón «Sin herramienta» salió de la barra (Frank, 2026-09-16). Era una
                demo: enseñaba qué columnas se caen si el usuario no tiene Helium 10
                conectado. El interruptor `verH10` se queda —lo usan las columnas y
                el guardado— con su valor de siempre: TODO a la vista. */}
            {/* ⛔ El boton «Con marcas / Sin marcas» salio de la barra (Frank,
                2026-09-16). `verMarcas` se queda en true: se ven todas. */}
            <Boton
              icono={Iconos.Users}
              activo={showComp}
              onClick={() => setShowComp((v) => !v)}
              titulo={T('Mostrar u ocultar la columna de cada competidor con su puesto')}
            >
              {T('Competidores')}
            </Boton>
            {/* ⛔ El botón «Orgánico / Pagado» salió de la barra (Frank, 2026-09-16).
                `rankMode` se queda en `organic`, que es dónde rankea cada competidor
                sin pagar — que es la pregunta que responde esta tabla. Los ranks
                patrocinados siguen en el dato (`sranks`) por si vuelve. */}
            {(kwOrden || kwHid.size > 0 || !verH10) && (
              <Boton
                icono={Iconos.RotateCcw}
                onClick={() => { setKwOrden(null); setKwHid(new Set()); setVerH10(true) }}
                titulo={T('Volver al orden y a las columnas de fábrica')}
              />
            )}
            {/* ⛔ «tu precio» salio de la barra (Frank, 2026-09-16: «tu precio
                quitalo»). Alimentaba la columna Precio y la Evaluacion de cada
                keyword — y la Evaluacion no se muestra en esta tabla, asi que el
                campo pedia un dato para dos cosas que ya no se ven. `miPrecio`
                se queda con su valor guardado. */}
            {filtroActivo && (
              <Boton icono={Iconos.FilterX} onClick={() => setColF({})} titulo={T('Quitar todos los filtros de columna')}>
                {T('Limpiar filtros')}
              </Boton>
            )}
            {/* La ayuda al final: es lo último que se busca, no compite. */}
            <Boton
              icono={Iconos.HelpCircle}
              activo={verLeyenda}
              onClick={() => setVerLeyenda((v) => !v)}
              titulo={T('Qué significa cada color y cada marca de la tabla')}
            >
              {T('Cómo se lee')}
            </Boton>
            {sel.size > 0 && (
              <span className="rsch-bulk">
                <span className="rsch-bulk-n">{sel.size} {T('seleccionadas → mover a')}</span>
                {BUCKETS.filter((t) => t !== tab).map((t) => (
                  <button key={t} type="button" className="rsch-bulk-btn" onClick={() => moveSel(t)}>{T(t)}</button>
                ))}
                <button type="button" className="rsch-bulk-clear" onClick={() => setSel(new Set())}>{T('limpiar')}</button>
              </span>
            )}
          </div>
          {/* Leyenda: en dos bloques separados y detrás de un botón. Todo junto
              en una fila corrida mezclaba dos cosas que no se parecen —el puesto
              de un competidor y el veredicto de una keyword— y confundía. */}
          {verLeyenda && (
            <div className="rsch-leyenda">
              <div className="rsch-ley-g">
                <span className="rsch-ley-t">{T('De dónde sale el dato')}</span>
                <span className="rsch-ley-i"><span className="rsch-ley-h10" /> {T('viene así del dato de mercado')}</span>
                <span className="rsch-ley-i"><span className="rsch-ley-agta" /> {T('lo calcula AGTA')}</span>
                <span className="rsch-ley-i" style={{ opacity: 0.6 }}>{T('hay cálculos de AGTA que igual necesitan datos de mercado')}</span>
              </div>
              <div className="rsch-ley-g">
                <span className="rsch-ley-t">{T('Dónde rankea')}</span>
                <span className="rsch-ley-i"><b style={{ color: '#e0a94c' }}>9</b> {T('top 10 orgánico')}</span>
                <span className="rsch-ley-i"><span style={{ color: '#a78bfa', fontWeight: 600 }}>4</span> {T('top 10 pago')}</span>
              </div>
              {/* ⛔ El bloque «Evaluación de la keyword» salió de esta leyenda el
                  2026-09-16: explicaba cinco colores de una columna que ya no se
                  muestra. Una leyenda de algo invisible es peor que no tenerla. */}
              <div className="rsch-ley-g">
                <span className="rsch-ley-t">SERP</span>
                <span className="rsch-ley-i"><span className="rsch-flag sbv">SBV</span> {T('video patrocinado')}</span>
                <span className="rsch-ley-i"><span className="rsch-flag ch">AC</span> Amazon&apos;s Choice</span>
                <span className="rsch-ley-i"><span className="rsch-flag sp">SP</span> {T('anuncio patrocinado')}</span>
              </div>
            </div>
          )}
          <div className="mkl-scroll">
            <table className="mkl-table mkl-fija" style={{ width: anchoTabla, minWidth: anchoTabla }}>
              {/* Los anchos se declaran acá y no los decide el contenido: así
                  cambiar de pestaña, esconder una columna o encontrarse una
                  keyword más larga no corre nada de lugar. */}
              <colgroup>
                <col style={{ width: 30 }} />
                {visCols.map((c) => <col key={c.k} style={{ width: anchoDe(c) }} />)}
                {verSerp && <col style={{ width: 76 }} />}
                {kwComps.map((c) => <col key={c.asin} style={{ width: 66 }} />)}
              </colgroup>
              <thead className="mkl-thead">
                {/* Fila de familias: con 20 columnas, saber que se esta mirando
                    ANTES de leer el nombre de cada una. Los tramos se calculan
                    desde las columnas visibles, asi que aguantan que el usuario
                    reordene o esconda. */}
                <tr className="mkl-grupos">
                  <th className="mkl-th" />
                  {tramosDeGrupo(visCols).map((g, i) => (
                    <th key={`${g.grupo}-${i}`} className="mkl-th mkl-grupo-th" colSpan={g.n}>{g.grupo}</th>
                  ))}
                  {verSerp && <th className="mkl-th mkl-grupo-th">SERP</th>}
                  {kwComps.length > 0 && (
                    <th className="mkl-th mkl-grupo-th" colSpan={kwComps.length}>
                      {lang === 'en' ? 'Ranks per competitor' : 'Ranks por competidor'} · {rankMode === 'organic' ? T('orgánicos') : T('patrocinados')}
                    </th>
                  )}
                </tr>
                <tr>
                  <th className="mkl-th"><input type="checkbox" checked={allShown} onChange={toggleAll} aria-label={T('Seleccionar todas')} /></th>
                  {visCols.map((c, i) => (
                    <Th
                      key={c.k}
                      label={c.label}
                      ayuda={INFO[c.k]}
                      align={c.align}
                      orden={c.k}
                      sort={sort}
                      onSort={onSort}
                      origen={c.origen}
                      className={i > 0 && visCols[i - 1].grupo !== c.grupo ? 'mkl-corte' : ''}
                      mover={moverCol}
                      arrastrando={arrastrando}
                      setArrastrando={setArrastrando}
                    />
                  ))}
                  {verSerp && <Th label="SERP" ayuda={INFO.serp} orden="serp" sort={sort} onSort={onSort} />}
                  {kwComps.map((c) => (
                    <Th
                      key={c.asin}
                      className="mkl-th-comp rsch-th-comp"
                      label={(c.brand || c.asin).slice(0, 8)}
                      orden={`rank:${c.asin}`}
                      sort={sort}
                      onSort={onSort}
                    />
                  ))}
                </tr>
                {/* Fila de filtros por columna (como DataDive): texto, >100, <50, 100-500 */}
                <tr>
                  <th className="mkl-th"></th>
                  {visCols.map((c, i) => (
                    <FiltroTh
                      key={c.k}
                      corte={i > 0 && visCols[i - 1].grupo !== c.grupo}
                      campo={c.k}
                      etiqueta={c.label}
                      valor={colF[c.k]}
                      onChange={setF(setColF)}
                      numerico={c.tipo === 'num'}
                      opciones={c.tipo === 'opciones' ? opcionesCol[c.k] : undefined}
                    />
                  ))}
                  {verSerp && <FiltroTh campo="serp" etiqueta="SERP" valor={colF.serp} onChange={setF(setColF)} />}
                  {kwComps.map((c) => (
                    <FiltroTh
                      key={c.asin}
                      campo={`rank:${c.asin}`}
                      etiqueta={`rank de ${c.brand || c.asin}`}
                      valor={colF[`rank:${c.asin}`]}
                      onChange={setF(setColF)}
                      numerico
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 600).map((r) => (
                  <tr key={r._i} className={`mkl-krow${sel.has(r._i) ? ' rsch-selrow' : ''}`}>
                    <td className="rsch-chk"><input type="checkbox" checked={sel.has(r._i)} onChange={() => toggle(r._i)} /></td>
                    {visCols.map((c, i) => (
                      <td
                        key={c.k}
                        className={`${c.align === 'right' ? 'mkl-num-cell' : c.k === 'kw' ? 'mkl-kw' : ''}`
                          + `${i > 0 && visCols[i - 1].grupo !== c.grupo ? ' mkl-corte' : ''}`}
                        data-origen={c.origen}
                        style={c.align === 'center' ? { textAlign: 'center' } : c.k === 'root' ? { textAlign: 'left' } : undefined}
                        // Cualquier celda puede cortar con puntos suspensivos; el valor
                        // entero queda en el tooltip. Sin esto, un root de dos palabras
                        // hacía esa fila el doble de alta que las demás.
                        title={typeof r[c.k] === 'string' ? r[c.k] : undefined}
                      >
                        {tapada(c) ? (
                          <span className="mkl-tapada" title={T('Este dato lo trae la herramienta de keywords: sin ella conectada, no está.')}>{T('sin herramienta')}</span>
                        ) : c.k === 'kw' ? (
                          // el texto completo queda en el title: la celda puede cortar
                          <span title={r.kw}>{r.kw}</span>
                        ) : c.k === 'veredicto' && r.veredicto ? (
                          <span
                            title={r.motivo || ''}
                            style={{ color: VEREDICTO_COLOR[r.veredicto] || 'inherit', fontWeight: 600, fontSize: 11 }}
                          >
                            {T(r.veredicto)}
                          </span>
                        ) : c.k.startsWith('use_') ? (
                          <UsoDot valor={r[c.k]} campo={c.label} />
                        ) : c.fmt ? c.fmt(r[c.k]) : r[c.k]}
                      </td>
                    ))}
                    {verSerp && (
                      <td className="rsch-serp">
                        {r.sbv ? <span className="rsch-flag sbv" title={T('Sponsored Brand Video presente')}>SBV</span> : null}
                        {r.choice ? <span className="rsch-flag ch" title={T("Amazon's Choice en este término")}>AC</span> : null}
                        {r.sp ? <span className="rsch-flag sp" title={T('Sponsored Product presente')}>SP</span> : null}
                      </td>
                    )}
                    {kwComps.map((c) => {
                      const sponsored = rankMode === 'sponsored'
                      const rk = sponsored ? (r.sranks || {})[c.asin] : r.ranks[c.asin]
                      return (
                        <td key={c.asin} className="mkl-rank-cell">
                          {rk ? (
                            <span
                              className={sponsored ? undefined : rk <= 10 ? 'mkl-rank-good' : 'mkl-rank-mid'}
                              style={sponsored ? { color: rk <= 3 ? '#a78bfa' : rk <= 10 ? '#8b7ae0' : '#6b6b8a', fontWeight: 600 } : undefined}
                              title={sponsored ? T('Puesto en el que aparece pagando (Sponsored Rank)') : T('Puesto orgánico')}
                            >
                              {rk}
                            </span>
                          ) : (
                            <span className="mkl-rank-none">·</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={visCols.length + 1 + (verSerp ? 1 : 0) + kwComps.length} className="mkl-empty">{T('Sin keywords con esos filtros.')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* El conteo es dato y se queda; la leyenda es ayuda y se pliega.
              Estaba todo suelto acá abajo y eran seis renglones fijos que
              empujaban la tabla fuera de la pantalla: con la lista larga se
              perdían las últimas filas justo cuando hay que revisarlas de a
              muchas. La ayuda se lee una vez, las filas se miran siempre. */}
          <p className="rsch-foot">
            {miles(rows.length)} {lang === 'en' ? 'keywords in' : 'keywords en'} {tab === 'Trash' ? T('Descartadas') : tab}{rows.length > 600 ? (lang === 'en' ? ' (showing the first 600)' : ' (se muestran las primeras 600)') : ''}. {T('Marca el checkbox y mueve varias de un bucket a otro.')}
            {data.meta.sponsored?.asins_sin_data?.length > 0 && ` ${lang === 'en' ? 'No SR data yet' : 'Sin data de SR todavía'}: ${data.meta.sponsored.asins_sin_data.join(', ')}.`}
          </p>
          <details className="rsch-foot-fold">
            <summary>{T('cómo leer esta tabla')}</summary>
            <p className="rsch-foot">
              {lang === 'en' ? (
                <>
                  Each filter works the way its column does: numeric ones accept <code>&gt;100</code>, <code>&lt;50</code> or <code>100-500</code>;
                  {' '}Match, Tier, Prio and Verdict are <b>picked from a list</b> (you can see exact only, or exact + phrase). Use “Columns” to hide the
                  ones you are not looking at, and <b>drag a header</b> to reorder them.
                  Rank per competitor: <span className="mkl-rank-top">solid gold</span> = ≤3 · <b style={{ color: '#e0a94c' }}>gold</b> = ≤10 · grey = 11+ · · = does not rank (or outside the top {S.max_rank}).
                  {' '}In <b style={{ color: '#a78bfa' }}>violet</b>, the <b>sponsored</b> ranks (where it ranks when paying): they come from the reverse-ASIN, not from scraping the SERP.
                </>
              ) : (
                <>
                  Cada filtro habla el idioma de su columna: las numéricas aceptan <code>&gt;100</code>, <code>&lt;50</code> o <code>100-500</code>;
                  {' '}Match, Tier, Prio y Veredicto se <b>marcan de una lista</b> (puedes ver solo exact, o exact + phrase). Con “Columnas” escondes las que no
                  estés mirando, y <b>arrastrando el encabezado</b> las reordenas.
                  Rank por competidor: <span className="mkl-rank-top">dorado sólido</span> = ≤3 · <b style={{ color: '#e0a94c' }}>dorado</b> = ≤10 · gris = 11+ · · = no rankea (o fuera del top {S.max_rank}).
                  {' '}En <b style={{ color: '#a78bfa' }}>violeta</b>, los ranks <b>patrocinados</b> (dónde aparece pagando): salen del reverse-ASIN, no de scrapear el SERP.
                </>
              )}
            </p>
          </details>
        </>
      ))}

      <p className="rsch-foot" style={{ marginTop: 18 }}>
        {miles(counts.Trash)} {lang === 'en' ? `discarded keywords (nobody in the niche ranks even in the top ${S.max_rank}).` : `keywords descartadas (nadie del nicho rankea ni en el top ${S.max_rank}).`}{' '}
        <button type="button" className="rsch-bulk-clear" onClick={() => { setTab(tab === 'Trash' ? 'MKL' : 'Trash'); setSel(new Set()) }}>
          {tab === 'Trash' ? T('volver al MKL') : T('ver descartadas')}
        </button>
      </p>
    </main>
    </ProveedorAyuda>
  )
}
