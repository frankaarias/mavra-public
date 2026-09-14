import { useState } from 'react'
import brand from '../brand/brand.json'

const { currents, identity } = brand



export default function Corrientes() {
  const [active, setActive] = useState(null)

  return (
    <>
      <div className="page-header">
        <h1>Corrientes Góticas</h1>
        <p className="page-subtitle">Las seis estéticas que definen el universo {identity.name} — la base de marca y las cinco corrientes de buyer persona, con su genealogía, psicología y aplicación al hogar.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Sidebar */}
        <div style={{ padding: '3rem 1.5rem 3rem 2rem', borderRight: '1px solid rgba(var(--copper-rgb),0.15)', position: 'sticky', top: '60px', height: 'fit-content' }}>
          <div style={sidebarLabelStyle}>Corrientes</div>
          {currents.map((c) => (
            <a key={c.id} href={`#${c.id}`} style={sidebarLinkStyle}>{c.title}</a>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '3rem 2.5rem 6rem' }}>
          {currents.map((c) => (
            <div key={c.id} id={c.id} style={corrienteStyle}>
              <div style={corrienteTagStyle}>
                {c.tag}
                {c.badge && (
                  <span style={{
                    ...badgeStyle,
                    ...(c.badgeClass === 'popular' ? popularBadgeStyle : {}),
                  }}>{c.badge}</span>
                )}
              </div>
              <h2 style={corrienteTitleStyle}>{c.title}</h2>
              <p style={corrienteSubStyle}>{c.sub}</p>

              <h3 style={h3Style}>Identidad y Psicología</h3>
              <p style={bodyStyle}>{c.identity}</p>

              <h3 style={h3Style}>En el Hogar</h3>
              <ul style={{ listStyle: 'none' }}>
                {c.home.map((item) => (
                  <li key={item} style={{ ...bodyStyle, padding: '0.25rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' }}>
                    — {item}
                  </li>
                ))}
              </ul>

              <h3 style={h3Style}>Vestuario del Avatar</h3>
              <ul style={{ listStyle: 'none' }}>
                {c.wardrobe.map((item) => (
                  <li key={item} style={{ ...bodyStyle, padding: '0.25rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' }}>
                    — {item}
                  </li>
                ))}
              </ul>

              <h3 style={h3Style}>Paleta</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
                {c.palette.map((hex) => (
                  <div key={hex} style={{ textAlign: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: hex }} />
                    <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.6rem', color: 'rgba(var(--fg-rgb),0.4)', marginTop: '0.25rem', textAlign: 'center' }}>{hex}</div>
                  </div>
                ))}
              </div>

              <div style={mavraNote}>
                <div style={mavraNoteLabel}>Aplicación {identity.name}</div>
                <p style={{ ...bodyStyle, margin: 0, fontSize: '0.82rem', color: 'rgba(var(--fg-rgb),0.6)' }}>{c.mavraNote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="global-footer">{identity.name} — Corrientes Góticas · <a href="/">Home</a></div>
    </>
  )
}

const sidebarLabelStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.5)', marginBottom: '1rem' }
const sidebarLinkStyle = { display: 'block', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(var(--fg-rgb),0.4)', textDecoration: 'none', padding: '0.3rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.08)', transition: 'color 0.2s' }
const corrienteStyle = { marginBottom: '5rem', paddingBottom: '5rem', borderBottom: '1px solid rgba(var(--copper-rgb),0.2)' }
const corrienteTagStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }
const badgeStyle = { background: 'rgba(var(--copper-rgb),0.1)', border: '1px solid rgba(var(--copper-rgb),0.3)', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.55rem', letterSpacing: '0.2em' }
const popularBadgeStyle = { background: 'rgba(var(--copper-bright-rgb),0.12)', borderColor: 'rgba(var(--copper-bright-rgb),0.4)', color: 'var(--copper-bright)' }
const corrienteTitleStyle = { fontSize: 'clamp(1.3rem,3vw,2rem)', color: 'var(--fg)', marginBottom: '0.5rem' }
const corrienteSubStyle = { fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(var(--fg-rgb),0.5)', marginBottom: '2rem' }
const h3Style = { fontFamily: "'Cinzel',serif", fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--copper)', margin: '2.5rem 0 1rem' }
const bodyStyle = { fontFamily: "'Basilia',serif", fontSize: '0.9rem', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.75, maxWidth: '70ch' }
const mavraNote = { background: 'rgba(var(--copper-rgb),0.06)', border: '1px solid rgba(var(--copper-rgb),0.2)', borderRadius: '4px', padding: '1rem 1.25rem', marginTop: '1.5rem' }
const mavraNoteLabel = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.5rem' }
