/**
 * DICCIONARIOS POR NICHO — lo único que cambia entre marcas.
 *
 * El motor de selección (motorSeleccion.js) es genérico. Lo que NO es genérico
 * es el vocabulario: qué palabras significan "es de mi nicho", cuáles son los
 * falsos amigos, en qué marketplace vendo y quiénes son mis competidores.
 *
 * Para una marca nueva se agrega una entrada acá y el motor funciona igual.
 */

export const NICHOS = {
  gothic_home_decor: {
    label: 'Decoración gótica de hogar',
    marca: 'MAVRA',
    marketplace: 'amazon.com',

    /** La bio tiene que nombrar al menos una de estas para que el encaje sea DECLARADO. */
    encaje: ['home', 'decor', 'interior', 'house', 'room', 'manor', 'haus', 'apartment', 'shelf'],

    /**
     * 🔴 Los falsos amigos: palabras que PARECEN del nicho y no lo son.
     * En este nicho el caso fue "witchy": en TikTok es mayormente brujería y
     * tarot, no decoración. Metió 7 cuentas, tres de ellas de más de 400K.
     * Cada nicho tiene el suyo, y no se sabe cuál es hasta abrir ~80 perfiles.
     */
    falsosAmigos: ['tarot', 'spell', 'reading', 'witchcraft', 'folk witch', 'coven', 'psychic'],

    /** Competidores conocidos. Salen del análisis de competencia, no hay que inventarlos. */
    competidores: [
      'skullstores.com', 'spiraldirect.com', 'moodygoods.com',
      'paintedblackdecor.com', 'theblackenedteeth',
    ],

    /** Marketplaces que descalifican: su audiencia no compra donde vendemos. */
    marketplacesAjenos: ['.co.uk', '.com.au', 'amazon.de', 'amazon.ca'],

    /** Debajo de esto, el ratio de alcance es ruido. */
    pisoSeguidores: 5000,
  },

  // Plantilla para la próxima marca:
  //
  // mi_nicho: {
  //   label: '', marca: '', marketplace: 'amazon.com',
  //   encaje: [],            // palabras que confirman el nicho en la bio
  //   falsosAmigos: [],      // las que parecen del nicho y no lo son
  //   competidores: [],      // dominios y handles
  //   marketplacesAjenos: [], pisoSeguidores: 5000,
  // },
}

/** Países / señales que descalifican cuando se vende en amazon.com. */
export const GEO_FUERA_DE_US =
  /germany|deutschland|balkan|croatia|hrvatska|türkiye|turkiye|italia|agcom|essex|united kingdom|\buk\b|australia|españa|méxico|colombia/i

export const NICHO_POR_DEFECTO = 'gothic_home_decor'
