/**
 * CÓMO SE VA A VER CADA ANUNCIO DE SPONSORED BRANDS, ANTES DE CREARLO.
 *
 * Frank: *"quiero ver en el repo de mavra la visual de cómo va a quedar SBv"*.
 *
 * Un headline se aprueba leyéndolo en una lista y después aparece en pantalla
 * al lado de un video, compitiendo con el movimiento, cortado por el ancho de
 * la tarjeta y con el logo encima. Son dos cosas distintas, y la segunda es la
 * que ve el comprador.
 *
 * La maqueta respeta lo que Amazon hace de verdad, verificado leyendo los ads
 * que ya sirven impresiones en la cuenta:
 *
 *   VIDEO       + página de producto  →  SIN headline. Amazon no lo ofrece ahí.
 *   BRAND_VIDEO + Store               →  logo + headline + video
 *   COLLECTION  + Store               →  logo + headline + tres productos
 *
 * Por eso las de PDP salen acá sin texto: no es un olvido, es que ese formato
 * no lo tiene.
 */
import { useState } from 'react'
import brand from '../brand/brand.json'

const { campaigns, identity } = brand

/** Límite duro de Amazon. Los conteos van medidos, no estimados. */
const MAX_HEADLINE = 50

const PRODUCTOS = {
  SWD: { asin: 'B0GGJG2WFR', nombre: '3 Skulls Wall Decor', color: '#8B7355' },
  LMP: { asin: 'B0GGJMDB32', nombre: 'Skull Lamp', color: '#6B5B7B' },
  CND: { asin: 'B0GGJN8FKK', nombre: 'Skull Candle Set', color: '#4A5859' },
}

/**
 * Las campañas: las 5 que ya existen y las 4 que faltan.
 * Los headlines son los que quedaron acordados el 4-ago — Collection largos
 * (33-37) y TOS cortos (16-26), con el bracket de volumen en el nombre.
 */


/** La tarjeta del anuncio, al ancho real que Amazon le da arriba de la SERP. */
function Anuncio({ c, headline, etiqueta }) {
  const p = PRODUCTOS[c.prod]
  const sinHeadline = c.destino === 'Producto'
  return (
    <div style={{ flex: '1 1 340px', minWidth: 300 }}>
      <div style={{ fontSize: 11, color: '#7a7a7a', marginBottom: 6, letterSpacing: '.04em' }}>
        {etiqueta}
        {headline && (
          <span style={{ marginLeft: 8, color: headline.length > MAX_HEADLINE ? '#F87171' : '#4a4a4a' }}>
            {headline.length}/{MAX_HEADLINE}
          </span>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 6, padding: 12, color: '#0F1111',
                    fontFamily: '"Amazon Ember", Arial, sans-serif', border: '1px solid #d5d9d9' }}>
        <div style={{ fontSize: 10, color: '#565959', marginBottom: 8 }}>Patrocinado</div>

        {/* Logo + headline. Solo cuando el anuncio aterriza en la Store. */}
        {!sinHeadline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 4, background: '#111',
                          color: '#fff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 9, letterSpacing: '.1em',
                          flexShrink: 0 }}>
              {identity.name}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25 }}>
              {headline || <span style={{ color: '#c00' }}>— sin headline —</span>}
            </div>
          </div>
        )}

        {/* El creativo: video o los tres productos. */}
        {c.formato === 'Video' ? (
          <div style={{ aspectRatio: '16/9', background: `linear-gradient(135deg, ${p.color}, #1a1a1a)`,
                        borderRadius: 4, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff9', fontSize: 12 }}>
            ▶ video de {c.prod}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.values(PRODUCTOS).map((x) => (
              <div key={x.asin} style={{ flex: 1, aspectRatio: '1', borderRadius: 4,
                                         background: `linear-gradient(135deg, ${x.color}, #1a1a1a)`,
                                         display: 'flex', alignItems: 'flex-end', padding: 4,
                                         color: '#fff9', fontSize: 9 }}>
                {x.nombre}
              </div>
            ))}
          </div>
        )}

        {sinHeadline && (
          <div style={{ marginTop: 8, fontSize: 11, color: '#565959' }}>
            Este formato <b>no lleva headline</b>: el video manda a la página del producto.
          </div>
        )}
      </div>
    </div>
  )
}

export default function SbPreview() {
  const [filtro, setFiltro] = useState('por crear')
  const lista = campaigns.sponsoredBrands.filter((c) => filtro === 'todas' || c.estado === filtro)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#EDEDED',
                  fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', padding: '36px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', margin: '0 0 4px' }}>
          Sponsored Brands — cómo se va a ver
        </h1>
        <p style={{ color: '#9a9a9a', fontSize: 14, margin: '0 0 4px' }}>
          Cada anuncio con su headline real, al ancho que le da Amazon. El A/B compara
          dos versiones del <b>mismo argumento</b>, con todo lo demás igual.
        </p>
        <p style={{ color: '#6f6f6f', fontSize: 12, margin: '0 0 22px' }}>
          El formato manda: un video que aterriza en la <b>página de producto</b> no lleva
          headline — Amazon no lo ofrece ahí. Por eso el A/B solo corre en los que van a la Store.
        </p>

        <div style={{ display: 'flex', gap: 6, marginBottom: 26 }}>
          {['por crear', 'activa', 'todas'].map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                       border: '1px solid ' + (filtro === f ? '#FFE600' : '#2a2a2a'),
                       background: filtro === f ? '#FFE60015' : 'transparent',
                       color: filtro === f ? '#FFE600' : '#9a9a9a' }}>
              {f === 'por crear' ? 'Por crear' : f === 'activa' ? 'Ya activas' : 'Todas'}
              {' '}({campaigns.sponsoredBrands.filter((c) => f === 'todas' || c.estado === f).length})
            </button>
          ))}
        </div>

        {lista.map((c) => (
          <section key={c.id} style={{ marginBottom: 34, paddingBottom: 26,
                                       borderBottom: '1px solid #1e1e1e' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
                          marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{c.prod}</span>
              <span style={{ fontSize: 12, color: '#9a9a9a' }}>
                {c.formato} → {c.destino}
                {c.bracket !== '—' && ` · ${c.bracket}`}
              </span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999,
                             background: c.estado === 'activa' ? '#4ADE8018' : '#FFE60018',
                             color: c.estado === 'activa' ? '#4ADE80' : '#FFE600' }}>
                {c.estado}
              </span>
              <span style={{ fontSize: 11, color: '#6f6f6f', fontFamily: 'ui-monospace, monospace' }}>
                {c.kws.join(' · ')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Anuncio c={c} headline={c.a} etiqueta={c.b ? 'A' : 'único'} />
              {/* La B solo cuando hay A/B de verdad: dos formulaciones del
                  mismo argumento, no dos ideas distintas. */}
              {c.b && <Anuncio c={c} headline={c.b} etiqueta="B" />}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
