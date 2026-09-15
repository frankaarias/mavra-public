// Los textos de /research en inglés.
//
// 🔴 POR QUÉ EL CASTELLANO ES LA CLAVE Y NO UN CÓDIGO TIPO `verdict.title`.
// Esta página se escribió entera en castellano y tiene ~130 textos sueltos
// repartidos por 2.200 líneas de JSX. Inventar una clave para cada uno
// significa tocar las 130 líneas DOS veces —una para la clave, otra para el
// texto— y que un error de tipeo en una clave devuelva `undefined` en pantalla.
//
// Con el castellano de clave, el reemplazo es de una sola pasada y **el fallo
// es visible pero no roto**: si falta una traducción, sale el castellano. Un
// texto en el idioma equivocado se ve; un `undefined` es un hueco que nadie
// reporta hasta que alguien mira esa pestaña.
//
// ⚠️ LO QUE ESTO NO TRADUCE, y hay que saberlo: el veredicto narrado
// (`overview.lectura`, `.razones`, `.falta`) viene ESCRITO EN CASTELLANO
// DENTRO DEL DATASET — lo genera el motor de nichos en Python, no esta página.
// En inglés esas frases siguen saliendo en castellano hasta que se traduzcan
// las plantillas del generador. Las etiquetas del veredicto (Lanzar / Riesgoso
// / Evitar) sí, porque son un set cerrado y viven acá.

export const EN = {
  // ── Pestañas y navegación ────────────────────────────────────────────────
  Veredicto: 'Verdict',
  Descartadas: 'Discarded',

  // ── Veredictos del nicho (set cerrado) ───────────────────────────────────
  Lanzar: 'Launch',
  Riesgoso: 'Risky',
  Evitar: 'Avoid',

  // ── Fuerza del competidor (set cerrado) ──────────────────────────────────
  'Muy fuerte': 'Very strong',
  Fuerte: 'Strong',
  Media: 'Medium',
  'Débil': 'Weak',

  // ── COLS · grupos de columna ─────────────────────────────────────────────
  'Término': 'Term',
  Demanda: 'Demand',
  Competencia: 'Competition',
  'Tu producto': 'Your product',
  'Uso en el listing': 'Used in the listing',

  // ── COLS · etiquetas ─────────────────────────────────────────────────────
  Vtas: 'Sales',
  'Relev.': 'Relev.',
  Puja: 'Bid',
  Precio: 'Price',

  // ── COMP_ROWS · etiquetas ────────────────────────────────────────────────
  Fuerza: 'Strength',
  'SV en P1 (share of voice)': 'P1 SV (share of voice)',
  'Keywords en P1': 'Keywords on P1',
  '% de keywords en P1': '% of keywords on P1',
  'Volumen en P1': 'Volume on P1',
  'Keywords de Outliers': 'Outlier keywords',
  'Volumen de Outliers': 'Outlier volume',
  'Piezas del pack': 'Units per pack',
  'Precio por unidad': 'Price per unit',
  'Reseñas': 'Reviews',
  'Edad del listing': 'Listing age',
  'Actividad de venta 30d': 'Sales activity 30d',
  'Actividad × precio 30d': 'Activity × price 30d',
  Variaciones: 'Variations',
  'Categoría': 'Category',
  'Mediana del nicho': 'Niche median',
  'Métrica': 'Metric',

  // ── COMP_ROWS · ayudas ───────────────────────────────────────────────────
  'Lectura rápida del share: Muy fuerte ≥75% · Fuerte ≥50% · Media ≥35% · Débil abajo de eso. Se recalcula con los buckets de ahora.':
    'Quick read of share: Very strong ≥75% · Strong ≥50% · Medium ≥35% · Weak below that. Recalculated from the buckets as they stand now.',
  'Del volumen total del MKL de ahora, qué porcentaje cubre este competidor desde página 1. Es la métrica de dominio del nicho.':
    'Of the current MKL total volume, what share this competitor covers from page 1. This is the niche dominance metric.',
  'Esas keywords sobre el total del MKL de ahora. Un competidor puede tener pocas keywords y mucho volumen: este número separa amplitud de peso.':
    'Those keywords over the current MKL total. A competitor can hold few keywords and a lot of volume: this number separates breadth from weight.',
  'Suma del SV de esas keywords en página 1.': 'Sum of search volume for those page-1 keywords.',
  'Cuántas keywords del bucket Outliers tiene en página 1. Si es 0, no está peleando lo uncontested.':
    'How many Outlier-bucket keywords it holds on page 1. If it is 0, it is not contesting the open ground.',
  'Volumen que el competidor ya cubre dentro del bucket Outliers de ahora. Si es 0, ese hueco sigue libre.':
    'Volume this competitor already covers inside the current Outliers bucket. If it is 0, that gap is still open.',
  'Precio de venta actual (Keepa). No depende del MKL.': 'Current selling price (Keepa). Independent of the MKL.',
  'Cuántas unidades trae (Keepa). Sin esto, un set de 4 parece caro al lado de una pieza suelta.':
    'How many units it contains (Keepa). Without this, a 4-pack looks expensive next to a single item.',
  'Precio ÷ piezas. Es el único precio comparable entre productos: es el que usa el price-fit de las keywords.':
    'Price ÷ units. The only price comparable across products: it is what the keyword price-fit uses.',
  'Promedio de estrellas (Keepa).': 'Average star rating (Keepa).',
  'Cantidad de reseñas acumuladas (Keepa). Es la barrera de entrada más dura del nicho.':
    'Lifetime review count (Keepa). The hardest entry barrier in the niche.',
  'Veces que le cayó el BSR en 30 días (evento de venta observado). NO son unidades vendidas.':
    'Times its BSR dropped in 30 days (observed sales event). These are NOT units sold.',
  'Actividad de venta × precio. Sirve para ordenar competidores por peso económico, no para leerlo como facturación: hereda la advertencia de la fila de arriba.':
    'Sales activity × price. Use it to rank competitors by economic weight, not to read as revenue: it carries the caveat from the row above.',
  'Cuántas variaciones tiene el listing (color, tamaño). Más variaciones = más reseñas compartidas.':
    'How many variations the listing has (colour, size). More variations = more shared reviews.',
  'Categoría principal del producto (Keepa).': 'Main product category (Keepa).',

  // ── Barra de herramientas y filtros ──────────────────────────────────────
  'Ver todos': 'Show all',
  'Mostrar todas': 'Show all',
  'Ocultar todas': 'Hide all',
  Columnas: 'Columns',
  'Columnas de roots': 'Root columns',
  'Columnas de keywords': 'Keyword columns',
  limpiar: 'clear',
  'Escribe una palabra': 'Type a word',
  'Agregar palabra': 'Add word',
  'Agregar (o Enter)': 'Add (or Enter)',
  '(vacío)': '(empty)',
  'Filtrar competidor (marca o ASIN)…': 'Filter competitor (brand or ASIN)…',
  'sin definir': 'not set',
  'Producto:': 'Product:',
  'Seleccionar todas': 'Select all',
  'volver al orden original': 'back to the original order',
  'mayor a menor': 'high to low',
  'menor a mayor': 'low to high',
  'ordenado por': 'sorted by',
  'Ahora las saca. Clic para volver a pedirla.': 'Now excluding it. Click to require it again.',
  'Ahora la pide. Clic para sacarla.': 'Now requiring it. Click to exclude it.',

  // ── Estados vacíos ───────────────────────────────────────────────────────
  'Ningún competidor pasa el filtro.': 'No competitor matches the filter.',
  'Ningún root pasa el filtro.': 'No root matches the filter.',
  'Ninguna keyword pasa el filtro.': 'No keyword matches the filter.',
  'Sin keywords con esos filtros.': 'No keywords match those filters.',

  // ── Veredicto del nicho ──────────────────────────────────────────────────
  'Veredicto del nicho': 'Niche verdict',
  'del nicho ya es del líder': 'of the niche already belongs to the leader',
  'su parte en primera página — cuanto más alto, menos sitio queda':
    'its page-1 share — the higher it is, the less room is left',
  'búsquedas al mes sin dueño': 'monthly searches with no owner',
  'las rankean 2 competidores o menos — por ahí se entra':
    'ranked by 2 competitors or fewer — that is the way in',
  'keywords del producto': 'product keywords',
  'en el núcleo': 'in the core',
  'las que pelea el nicho': 'the ones the niche fights over',
  'volumen que nadie domina': 'volume nobody dominates',
  competidores: 'competitors',
  'sobre los que se midió todo': 'everything was measured against these',
  'Por qué': 'Why',
  'Por dónde se entra': 'Where to enter',
  'comp.': 'comp.',
  'una vez': 'once',
  'Términos del producto que rankean 2 competidores o menos. Son la puerta: ahí no hay con quién pelear.':
    'Product terms ranked by 2 competitors or fewer. This is the door: there is nobody to fight there.',

  // ── Roots ────────────────────────────────────────────────────────────────
  'Frec.': 'Freq.',
  'Vol. broad': 'Broad vol.',
  'Rel %': 'Rel %',
  root: 'root',
  frecuencia: 'frequency',
  'volumen broad': 'broad volume',
  keyword: 'keyword',
  volumen: 'volume',
  relevancy: 'relevancy',
  'Así se arma el PPC:': 'This is how PPC gets built:',
  'roots normalizados': 'normalised roots',
  'roots crudos': 'raw roots',
  'Mostrar:': 'Show:',

  // ── Normalizer ───────────────────────────────────────────────────────────
  'Forma normalizada': 'Normalised form',
  'forma normalizada': 'normalised form',
  Variantes: 'Variants',
  variantes: 'variants',

  // ── Negatives (preview) ──────────────────────────────────────────────────
  'Negatives está desactivado.': 'Negatives is turned off.',
  'Los negativos son': 'Negatives are',
  'product-aware': 'product-aware',
  'último Listing Audit': 'latest Listing Audit',
  'product-fit filter': 'product-fit filter',
  'Activar Negatives (preview)': 'Turn on Negatives (preview)',

  // ── Leyenda «cómo leer esta tabla» ───────────────────────────────────────
  'cómo leer esta tabla': 'how to read this table',
  'De dónde sale el dato': 'Where the data comes from',
  'viene así de Helium 10': 'comes straight from Helium 10',
  'lo calcula AGTA': 'calculated by AGTA',
  'hay cálculos de AGTA que igual necesitan datos de Helium 10':
    'some AGTA calculations still need Helium 10 data',
  'Dónde rankea': 'Where it ranks',
  'top 10 orgánico': 'organic top 10',
  'top 10 pago': 'paid top 10',
  'Evaluación de la keyword': 'Keyword assessment',
  'ATACAR — precio y conversión en rango': 'ATTACK — price and conversion in range',
  'PRECIO SUPERIOR — el promedio del término está por encima del tuyo':
    'PRICE ABOVE — the term average sits above yours',
  'PRECIO INFERIOR — el promedio del término está por debajo del tuyo':
    'PRICE BELOW — the term average sits below yours',
  'CVR BAJO — el KW CVR está muy por debajo del nicho':
    'LOW CVR — the KW CVR is far under the niche',
  'ESTACIONAL — el volumen se dispara en una época':
    'SEASONAL — volume spikes in one season',
  'video patrocinado': 'sponsored video',
  "Amazon's Choice": "Amazon's Choice",
  'anuncio patrocinado': 'sponsored ad',
  'Al lado de la keyword': 'Next to the keyword',
  libre: 'open',
  'la rankean 2 competidores o menos': 'ranked by 2 competitors or fewer',
  'marcan de una lista': 'are picked from a list',
  'arrastrando el encabezado': 'by dragging the header',
  'dorado sólido': 'solid gold',
  dorado: 'gold',
  violeta: 'violet',
  'volver al MKL': 'back to the MKL',
  'ver descartadas': 'see discarded',
  'sin H10': 'no H10',
  'Este dato lo trae Helium 10: sin la herramienta conectada, no está.':
    'This figure comes from Helium 10: without the tool connected, it is not there.',
  'Sin dueño: 2 competidores o menos y es de tu producto':
    'No owner: 2 competitors or fewer, and it belongs to your product',
  'Sponsored Brand Video presente': 'Sponsored Brand Video present',
  'Sponsored Product presente': 'Sponsored Product present',
  'MKL de ahora': 'the current MKL',
  Keepa: 'Keepa',
  estimadas: 'estimated',
  'SIN VENTAS': 'NO SALES',
  suma: 'adds up to',
  // ── Barra de herramientas de la tabla de keywords ────────────────────────
  'Cómo se lee': 'How to read it',
  'Qué significa cada color y cada marca de la tabla': 'What each colour and each mark in the table means',
  'seleccionadas → mover a': 'selected → move to',
  'Con marcas': 'With brands',
  'Sin marcas': 'No brands',
  'Mostrar u ocultar la columna de cada competidor con su puesto':
    'Show or hide each competitor column with its rank',
  'Orgánico': 'Organic',
  Pagado: 'Paid',
  'Orgánico = dónde rankea gratis · Patrocinado = en qué puesto aparece pagando':
    'Organic = where it ranks for free · Sponsored = at what position it shows up paying',
  'Volver al orden y a las columnas de fábrica': 'Back to the default order and columns',
  'Quitar todos los filtros de columna': 'Clear every column filter',
  'Limpiar filtros': 'Clear filters',
  'tu precio': 'your price',
  'A qué precio POR UNIDAD piensas vender. De acá salen la columna Precio y la Evaluación. Si lo dejas vacío, no se emiten los veredictos que dependen del precio.':
    'The price PER UNIT you plan to sell at. The Price column and the Assessment come from this. Leave it empty and the verdicts that depend on price are not issued.',
  'Marca el checkbox y mueve varias de un bucket a otro.': 'Tick the checkbox and move several from one bucket to another.',
  "Amazon's Choice en este término": "Amazon's Choice for this term",
  'Puesto en el que aparece pagando (Sponsored Rank)': 'Position where it shows up paying (Sponsored Rank)',
  'Puesto orgánico': 'Organic position',
  'Que tengan': 'Must contain',
  'Que no tengan': 'Must not contain',
  Root: 'Root',
  Keyword: 'Keyword',
  // ── Veredicto por keyword (set cerrado; la CLAVE del color sigue en castellano) ──
  ATACAR: 'ATTACK',
  'PRECIO SUPERIOR': 'PRICE ABOVE',
  'PRECIO INFERIOR': 'PRICE BELOW',
  'CVR BAJO': 'LOW CVR',
  ESTACIONAL: 'SEASONAL',
  // ── Pestañas y barra ─────────────────────────────────────────────────────
  Roots: 'Roots',
  Residue: 'Residue',
  Outliers: 'Outliers',
  MKL: 'MKL',
  UKL: 'UKL',
  Negatives: 'Negatives',
  Trash: 'Discarded',
  'Sin H10': 'No H10',
  'Con H10': 'With H10',
  'Ver qué queda del análisis si el usuario no tiene Helium 10 conectado.':
    'See what is left of the analysis if the user has no Helium 10 connected.',
  'orgánicos': 'organic',
  patrocinados: 'sponsored',
  Competidores: 'Competitors',
}


/** Traduce un texto de la página. El castellano es la clave; si falta, se devuelve tal cual. */
export function traducir(texto, lang) {
  if (lang !== 'en') return texto
  return EN[texto] ?? texto
}
