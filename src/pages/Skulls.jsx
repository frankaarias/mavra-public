import { useTranslation } from '../i18n/TranslationProvider.jsx'
import { Link } from 'react-router-dom'
import brand from '../brand/brand.json'

const { products, identity } = brand
import useReveal from '../components/useReveal.js'

export default function Skulls() {
  const { text: trText } = useTranslation()

  useReveal()

  return (
    <>
      <div className="page-header">
        <h1>{trText("Productos ")}{trText(identity.name)}</h1>
        <p className="page-subtitle">{trText("La colección — Wall Skulls · Skull Candle Set · Skull Lamp")}</p>
      </div>

      <div style={pageStyle}>

        {/* ── Intro band ─────────────────────────────────────────────── */}
        <div className="reveal" style={introStyle}>
          <div style={eyebrowStyle}>{trText("La colección · 3 piezas")}</div>
          <p style={introBodyStyle}>{trText("Tres objetos, un mismo idioma: la oscuridad como forma de maestría, no de miedo. Decoración gótica permanente — hecha para los 365 días, nunca para una temporada.")}</p>
          <div style={dividerStyle}>
            <span style={dividerLineStyle} />
            <span style={diamondStyle}>{"◆"}</span>
            <span style={dividerLineStyle} />
          </div>
          <p style={taglineStyle}>{trText("Inhabit your shadow.")}</p>
        </div>

        {/* ── Product cards ──────────────────────────────────────────── */}
        {products.map((prod) => (
          <ProductCard key={prod.id} prod={prod} />
        ))}

        {/* ── Reference links ────────────────────────────────────────── */}
        <div className="reveal" style={refRowStyle}>
          <Link to="/listings-briefs" className="skull-reflink" style={refLinkStyle}>{trText("Ver Listing Briefs")}</Link>
          <Link to="/aplus-briefs" className="skull-reflink" style={refLinkStyle}>{trText("Ver A+ Content")}</Link>
          <Link to="/scenography" className="skull-reflink" style={refLinkStyle}>{trText("Ver Escenografía")}</Link>
        </div>

      </div>

      <div className="global-footer">{trText(identity.name)}{trText(" — Productos · ")}<a href="/">{trText("Home")}</a></div>
    </>
  )
}

// ── Product card ────────────────────────────────────────────────────────────
function ProductCard({ prod }) {
  const { text: trText } = useTranslation()

  return (
    <div className="reveal skull-card" style={cardStyle}>
      <span style={ghostIndexStyle} aria-hidden="true">{trText(prod.index)}</span>

      {/* header */}
      <div style={cardHeaderStyle}>
        <div style={skuStyle}>{trText(prod.sku)}</div>
        <h2 style={cardTitleStyle}>{trText(prod.title)}</h2>
        <p style={conceptStyle}>{trText(prod.concept)}</p>
      </div>

      {/* differentiator */}
      <div style={diffStyle}>
        <span style={diffLabelStyle}>{trText("El diferenciador")}</span>
        <div style={diffHeadlineStyle}>{trText(prod.diff.headline)}</div>
        <p style={diffSupportStyle}>{trText(prod.diff.support)}</p>
      </div>

      {/* spec grid */}
      <div className="skull-spec-grid" style={{ marginTop: '1.75rem' }}>
        {prod.specs.map((s) => (
          <div key={s.label}>
            <div style={fieldLabelStyle}>{trText(s.label)}</div>
            <div style={fieldValueStyle}>{trText(s.value)}</div>
          </div>
        ))}
      </div>

      {/* stat pills */}
      <div style={statRowStyle}>
        {prod.stats.map((st) => (
          <span key={st} className="skull-stat" style={statStyle}>{trText(st)}</span>
        ))}
      </div>

      {/* approved listing claims */}
      <div style={claimsBlockStyle}>
        <span style={claimsLabelStyle}>{trText("En el listing")}</span>
        <div style={claimsRowStyle}>
          {prod.claims.map((c) => (
            <span key={c} style={claimStyle}>{trText(c)}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Product data ────────────────────────────────────────────────────────────


// ── Styles ──────────────────────────────────────────────────────────────────
const pageStyle = { maxWidth: '1600px', margin: '0 auto', padding: '3.5rem clamp(1.25rem, 4vw, 3rem) 6rem' }

const introStyle = { textAlign: 'center', marginBottom: '4rem' }
const eyebrowStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.7)', marginBottom: '1.25rem' }
const introBodyStyle = { fontFamily: "'Basilia',serif", fontSize: '1rem', color: 'rgba(var(--fg-rgb),0.62)', lineHeight: 1.85, maxWidth: '620px', margin: '0 auto' }
const dividerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '2rem auto 1.25rem', maxWidth: '260px' }
const dividerLineStyle = { flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(var(--copper-rgb),0.5), transparent)' }
const diamondStyle = { color: 'rgba(var(--copper-bright-rgb),0.85)', fontSize: '0.7rem' }
const taglineStyle = { fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '1.2rem', color: 'rgba(var(--fg-rgb),0.72)', letterSpacing: '0.02em' }

const cardStyle = { position: 'relative', overflow: 'hidden', padding: '2.5rem 2.5rem 2.25rem', marginBottom: '2.5rem' }
const ghostIndexStyle = { position: 'absolute', top: '-0.9rem', right: '1.25rem', fontFamily: "'Cinzel',serif", fontSize: 'clamp(4rem,11vw,7rem)', color: 'rgba(var(--copper-rgb),0.09)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }

const cardHeaderStyle = { position: 'relative', marginBottom: '1.75rem' }
const skuStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.65)', marginBottom: '0.6rem' }
const cardTitleStyle = { fontFamily: "'Cinzel',serif", fontSize: 'clamp(1.5rem,3.4vw,2.15rem)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }
const conceptStyle = { fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '0.98rem', color: 'rgba(var(--fg-rgb),0.52)', lineHeight: 1.7, maxWidth: '640px' }

const diffStyle = { padding: '1.25rem 1.5rem', background: 'rgba(var(--burgundy-rgb),0.14)', borderLeft: '2px solid rgba(var(--copper-bright-rgb),0.7)' }
const diffLabelStyle = { display: 'block', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.56rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(var(--copper-bright-rgb),0.85)', marginBottom: '0.6rem' }
const diffHeadlineStyle = { fontFamily: "'Cinzel',serif", fontSize: '1.05rem', color: 'var(--fg)', letterSpacing: '0.03em', marginBottom: '0.55rem' }
const diffSupportStyle = { fontFamily: "'Basilia',serif", fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.68)', lineHeight: 1.7 }

const fieldLabelStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.62)', marginBottom: '0.4rem' }
const fieldValueStyle = { fontFamily: "'Basilia',serif", fontSize: '0.9rem', color: 'rgba(var(--fg-rgb),0.78)', lineHeight: 1.6 }

const statRowStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '2rem' }
const statStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(var(--fg-rgb),0.6)', padding: '0.4rem 0.85rem', border: '1px solid rgba(var(--copper-rgb),0.28)', borderRadius: '2px' }

const claimsBlockStyle = { marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(var(--copper-rgb),0.15)' }
const claimsLabelStyle = { display: 'block', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.56rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.55)', marginBottom: '0.9rem' }
const claimsRowStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.75rem' }
const claimStyle = { fontFamily: "'Cinzel',serif", fontSize: '0.68rem', letterSpacing: '0.08em', color: 'rgba(var(--fg-rgb),0.62)', padding: '0.35rem 0.75rem', background: 'rgba(var(--copper-rgb),0.06)', border: '1px solid rgba(var(--copper-rgb),0.18)' }

const refRowStyle = { marginTop: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }
const refLinkStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper)', border: '1px solid rgba(var(--copper-rgb),0.35)', padding: '0.7rem 1.4rem', textDecoration: 'none', display: 'inline-block' }
