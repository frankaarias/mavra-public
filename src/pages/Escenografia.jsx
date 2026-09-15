import { useState } from 'react'
import brand from '../brand/brand.json'

const { identity, visual, nav, productSetups } = brand
import useReveal from '../components/useReveal.js'

export default function Escenografia() {
  useReveal()

  return (
    <div className="reading-surface">
      <div id="scenography-top" className="page-header">
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--fg)', marginBottom: '0.25rem' }}>
          Guía de Escenografía
        </h1>
        <p className="page-subtitle">Ambientes, iluminación y composición de producto.</p>
      </div>

      <nav style={{ maxWidth: '1600px', margin: '0 auto', padding: '1.5rem clamp(1.25rem, 4vw, 3rem) 2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {nav.escenografia.map((s) => (
          <a key={s.id} href={`#${s.id}`} style={navItemStyle}>{s.label}</a>
        ))}
      </nav>

      <hr className="copper-line" />

      {/* Principios */}
      <div className="section-wrap" id="principios" style={sectionWrapStyle}>
        <blockquote style={principleStyle}>
          "La sombra no es el fondo. La sombra es el producto."
        </blockquote>
        <p style={{ fontFamily: "'Basilia',serif", fontSize: '0.9rem', color: 'rgba(var(--fg-rgb),0.6)', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '700px' }}>
          Todo asset visual de {identity.name} comunica una sola cosa: que la oscuridad es una forma de maestría, no de miedo. El fotógrafo no documenta un objeto — construye un santuario y lo captura.
        </p>
        <div className="section-label" style={sectionLabelStyle}>Las 5 Leyes</div>
        {visual.laws.map((law, i) => (
          <div key={i} style={lawCardStyle}>
            <div style={lawNumberStyle}>{visual.romanNumerals[i]}</div>
            <div>
              <h4 style={lawH4Style}>{law.title}</h4>
              <p style={bodyTextStyle}>{law.body}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="copper-line" />

      {/* Fondos */}
      <div className="section-wrap" id="fondos" style={sectionWrapStyle}>
        <div className="section-label" style={sectionLabelStyle}>2 — Paleta de Fondos y Superficies</div>
        <div style={twoColStyle}>
          <div style={listCardStyle}>
            <h4 style={listCardH4Style}>✓ Fondos Aprobados — Paredes</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.backgrounds.approved.map((f) => <ListItem key={f}>{f}</ListItem>)}
            </ul>
            <h4 style={{ ...listCardH4Style, marginTop: '1.5rem' }}>✓ Superficies</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.surfaces.approved.map((f) => <ListItem key={f}>{f}</ListItem>)}
            </ul>
          </div>
          <div style={{ ...listCardStyle, ...listCardProhibitedStyle }}>
            <h4 style={{ ...listCardH4Style, color: 'rgba(180,80,80,0.7)' }}>✕ Fondos Prohibidos</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.backgrounds.forbidden.map((f) => <ListItemX key={f}>{f}</ListItemX>)}
            </ul>
          </div>
        </div>
      </div>

      <hr className="copper-line" />

      {/* Iluminación */}
      <div className="section-wrap" id="iluminacion" style={sectionWrapStyle}>
        <div className="section-label" style={sectionLabelStyle}>3 — Iluminación</div>
        <div style={twoColStyle}>
          <div style={listCardStyle}>
            <h4 style={listCardH4Style}>✓ Fuentes Aprobadas</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.lighting.approved.map((f) => <ListItem key={f}>{f}</ListItem>)}
            </ul>
          </div>
          <div style={{ ...listCardStyle, ...listCardProhibitedStyle }}>
            <h4 style={{ ...listCardH4Style, color: 'rgba(180,80,80,0.7)' }}>✕ Fuentes Prohibidas</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.lighting.forbidden.map((f) => <ListItemX key={f}>{f}</ListItemX>)}
            </ul>
          </div>
        </div>
      </div>

      <hr className="copper-line" />

      {/* Props */}
      <div className="section-wrap" id="props" style={sectionWrapStyle}>
        <div className="section-label" style={sectionLabelStyle}>4 — Props Aprobados</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {visual.photography.props.approved.map((p) => (
            <div key={p.label} style={{ padding: '1.25rem', border: '1px solid rgba(var(--copper-rgb),0.2)', background: 'rgba(0,0,0,0.1)' }}>
              <h4 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.75rem' }}>{p.label}</h4>
              <ul style={{ listStyle: 'none' }}>
                {p.items.map((i) => <li key={i} style={{ fontFamily: "'Basilia',serif", fontSize: '0.82rem', color: 'rgba(var(--fg-rgb),0.65)', padding: '0.25rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' }}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ ...sectionLabelStyle, marginTop: 0 }}>Props Prohibidos</div>
        <div style={twoColStyle}>
          <div style={{ ...listCardStyle, ...listCardProhibitedStyle }}>
            <h4 style={{ ...listCardH4Style, color: 'rgba(180,80,80,0.7)' }}>✕ Por Asociación Estacional</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.props.forbidden.seasonal.map((f) => <ListItemX key={f}>{f}</ListItemX>)}
            </ul>
          </div>
          <div style={{ ...listCardStyle, ...listCardProhibitedStyle }}>
            <h4 style={{ ...listCardH4Style, color: 'rgba(180,80,80,0.7)' }}>✕ Por Material, Color o Concepto</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.props.forbidden.material.map((f) => <ListItemX key={f}>{f}</ListItemX>)}
            </ul>
          </div>
        </div>
      </div>

      <hr className="copper-line" />

      {/* Cámara */}
      <div className="section-wrap" id="camara" style={sectionWrapStyle}>
        <div className="section-label" style={sectionLabelStyle}>5 — Lenguaje de Cámara</div>
        <blockquote style={{ ...principleStyle, fontSize: '1rem' }}>
          La cámara no registra la escena — la interpreta. El ángulo es el argumento.
        </blockquote>

        <h4 style={lawH4Style}>Tamaño de Encuadre</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
          {visual.cameraLanguage.shotSizes.map((s) => <CameraCard key={s.term} {...s} />)}
        </div>

        <h4 style={{ ...lawH4Style, marginTop: '1.5rem' }}>Ángulo y Altura de Cámara</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
          {visual.cameraLanguage.angles.map((s) => <CameraCard key={s.term} {...s} />)}
        </div>

        <h4 style={{ ...lawH4Style, marginTop: '1.5rem' }}>Lente y Profundidad de Campo</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
          {visual.cameraLanguage.lensDepth.map((s) => <CameraCard key={s.term} {...s} />)}
        </div>

        <h4 style={{ ...lawH4Style, marginTop: '1.5rem' }}>Composición</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {visual.cameraLanguage.composition.map((s) => <CameraCard key={s.term} {...s} />)}
        </div>

        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <h4 style={{ ...lawH4Style, marginBottom: '0.5rem' }}>Cómo Dirigir a MavrO — Director's Brief</h4>
          <p style={{ fontFamily: "'Basilia',serif", fontStyle: 'italic', fontSize: '0.82rem', color: 'rgba(var(--fg-rgb),0.4)', marginBottom: '1.25rem' }}>
            No necesitas saber términos técnicos. Di esto → copia el prompt → pégalo en Freepik o Kling.
          </p>
          {visual.directorBrief.map((row, i) => (
            <BriefRow key={i} frank={row.frank} mavro={row.mavro} />
          ))}
        </div>
      </div>

      <hr className="copper-line" />

      {/* Setups */}
      <div className="section-wrap" id="setups" style={sectionWrapStyle}>
        <div className="section-label" style={sectionLabelStyle}>6 — Escenografías por Línea de Producto</div>
        {productSetups.map((prod) => (
          <div key={prod.title} style={{ border: '1px solid rgba(var(--copper-rgb),0.25)', marginBottom: '2rem' }}>
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(var(--copper-rgb),0.15)', background: 'rgba(var(--copper-rgb),0.05)' }}>
              <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg)', marginBottom: '0.25rem' }}>{prod.title}</h3>
              <p style={{ fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(var(--fg-rgb),0.5)' }}>{prod.concept}</p>
            </div>
            <div style={{ padding: '1.75rem' }}>
              {prod.sections.map((s) => (
                <div key={s.label}>
                  <h4 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--copper)', margin: '1.5rem 0 0.75rem' }}>{s.label}</h4>
                  <ul style={{ listStyle: 'none' }}>
                    {s.items.map((i) => (
                      <li key={i} style={{ fontFamily: "'Basilia',serif", fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.7)', padding: '0.3rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)', lineHeight: 1.5 }}>
                        — {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <hr className="copper-line" />

      {/* Avatares */}
      <div className="section-wrap" id="avatares" style={sectionWrapStyle}>
        <div className="section-label" style={sectionLabelStyle}>8 — Avatares en Escena</div>
        <blockquote style={{ ...principleStyle, fontSize: '1rem' }}>
          Los avatares no posan para {identity.name}. Los avatares evalúan, contemplan, cuidan.
        </blockquote>
        <div style={twoColStyle}>
          <div style={listCardStyle}>
            <h4 style={listCardH4Style}>✓ Posiciones Aprobadas</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.wardrobe.approved.map((f) => <ListItem key={f}>{f}</ListItem>)}
            </ul>
          </div>
          <div style={{ ...listCardStyle, ...listCardProhibitedStyle }}>
            <h4 style={{ ...listCardH4Style, color: 'rgba(180,80,80,0.7)' }}>✕ Posiciones Prohibidas</h4>
            <ul style={{ listStyle: 'none' }}>
              {visual.photography.wardrobe.forbidden.map((f) => <ListItemX key={f}>{f}</ListItemX>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="global-footer">{identity.name} · Guía de Escenografía · <a href="/">Home</a></div>
    </div>
  )
}

function ListItem({ children }) {
  return (
    <li style={{ fontFamily: "'Basilia',serif", fontSize: '0.85rem', color: 'rgba(var(--fg-rgb),0.7)', padding: '0.3rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)', lineHeight: 1.5 }}>
      ✓ {children}
    </li>
  )
}

function ListItemX({ children }) {
  return (
    <li style={{ fontFamily: "'Basilia',serif", fontSize: '0.85rem', color: 'rgba(var(--fg-rgb),0.7)', padding: '0.3rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)', lineHeight: 1.5 }}>
      ✕ {children}
    </li>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const sectionWrapStyle = { maxWidth: '1600px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 3rem) 4rem' }
const sectionLabelStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(var(--copper-rgb),0.2)' }
const principleStyle = { fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '1.2rem', color: 'rgba(var(--fg-rgb),0.65)', borderLeft: '3px solid var(--copper)', padding: '1rem 1.5rem', marginBottom: '2rem', background: 'rgba(var(--copper-rgb),0.05)' }
const lawCardStyle = { display: 'flex', gap: '1.5rem', padding: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.2)', background: 'rgba(0,0,0,0.15)', marginBottom: '1rem' }
const lawNumberStyle = { fontFamily: "'Cinzel',serif", fontSize: '1.5rem', color: 'rgba(var(--copper-rgb),0.3)', lineHeight: 1, flexShrink: 0, width: '2rem', textAlign: 'center' }
const lawH4Style = { fontFamily: "'Cinzel',serif", fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--copper)', marginBottom: '0.5rem' }
const bodyTextStyle = { fontFamily: "'Basilia',serif", fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.7 }
const twoColStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }
const listCardStyle = { padding: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.2)', background: 'rgba(0,0,0,0.1)' }
const listCardProhibitedStyle = {}
const listCardH4Style = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '1rem' }
const navItemStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)', border: '1px solid rgba(var(--copper-rgb),0.25)', padding: '0.3rem 0.7rem', textDecoration: 'none' }


function CameraCard({ term, desc, prompt }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ padding: '1rem 1.25rem', border: '1px solid rgba(var(--copper-rgb),0.2)', background: 'rgba(0,0,0,0.1)' }}>
      <span style={{ fontFamily: "'Cinzel',serif", fontSize: '0.78rem', color: 'var(--fg)', letterSpacing: '0.04em', display: 'block', marginBottom: '0.25rem' }}>{term}</span>
      {desc && <p style={{ fontFamily: "'Basilia',serif", fontStyle: 'italic', fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.35)', lineHeight: 1.4, marginBottom: '0.6rem' }}>{desc}</p>}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <code style={{ fontFamily: 'monospace', fontSize: '0.63rem', color: 'rgba(var(--fg-rgb),0.65)', background: 'rgba(var(--copper-rgb),0.07)', padding: '0.5rem 0.65rem', flex: 1, lineHeight: 1.6, border: '1px solid rgba(var(--copper-rgb),0.13)' }}>
          {prompt}
        </code>
        <button onClick={handleCopy} style={{ background: copied ? 'rgba(var(--copper-rgb),0.25)' : 'transparent', border: '1px solid rgba(var(--copper-rgb),0.3)', color: copied ? 'var(--copper-bright)' : 'rgba(var(--copper-rgb),0.5)', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', padding: '4px 8px', cursor: 'pointer', textTransform: 'uppercase', flexShrink: 0, transition: 'all 0.2s', marginTop: '2px' }}>
          {copied ? '✓' : 'copy'}
        </button>
      </div>
    </div>
  )
}

function BriefRow({ frank, mavro }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(mavro)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ padding: '0.85rem 1rem', border: '1px solid rgba(var(--copper-rgb),0.15)', background: 'rgba(0,0,0,0.08)', marginBottom: '0.5rem' }}>
      <p style={{ fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.65)', marginBottom: '0.5rem' }}>"{frank}"</p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <code style={{ fontFamily: 'monospace', fontSize: '0.63rem', color: 'rgba(var(--fg-rgb),0.6)', background: 'rgba(var(--copper-rgb),0.07)', padding: '0.45rem 0.65rem', flex: 1, lineHeight: 1.6, border: '1px solid rgba(var(--copper-rgb),0.13)' }}>
          {mavro}
        </code>
        <button onClick={handleCopy} style={{ background: copied ? 'rgba(var(--copper-rgb),0.25)' : 'transparent', border: '1px solid rgba(var(--copper-rgb),0.3)', color: copied ? 'var(--copper-bright)' : 'rgba(var(--copper-rgb),0.5)', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', padding: '4px 8px', cursor: 'pointer', textTransform: 'uppercase', flexShrink: 0, transition: 'all 0.2s', marginTop: '2px' }}>
          {copied ? '✓' : 'copy'}
        </button>
      </div>
    </div>
  )
}


















