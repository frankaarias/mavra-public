import { useEffect } from 'react'
import brand from '../brand/brand.json'

const { identity, positioning, visual } = brand
import { Link } from 'react-router-dom'
import useReveal from '../components/useReveal.js'

export default function Home() {
  useReveal()

  // Logo parallax
  useEffect(() => {
    const logo = document.getElementById('hero-logo')
    if (!logo) return
    function onScroll() {
      logo.style.transform = `translateY(${window.scrollY * 0.25}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Hero */}
      <div style={heroStyle}>
        <img src="/logo.png" alt={identity.name} style={heroLogoStyle} id="hero-logo" />
        <p style={taglineStyle}>Inhabit your shadow.</p>
        <p style={sloganStyle}>The darkness you deserved.</p>
      </div>

      <hr className="copper-line" />

      {/* 01 Archetype */}
      <section style={sectionStyle}>
        <div className="reveal">
          <p className="section-label" style={sectionLabelStyle}>01 — Archetype</p>
          <h2 style={h2Style}>The Liberator</h2>
          <div style={archetypeCardStyle}>
            <div style={archetypeNameStyle}>The Liberator</div>
            <p style={archetypeQuoteStyle}>"Aquí puedes ser quien realmente eres."</p>
            <p style={{ color: 'rgba(var(--fg-rgb),0.6)', fontSize: '0.95rem', marginTop: '1rem', fontFamily: "'Basilia', serif" }}>
              No depende de escasez. Depende de lo que el producto habilita — construir el espacio donde el cliente puede ser completamente él mismo.
            </p>
          </div>
        </div>
      </section>

      <hr className="copper-line" />

      {/* 02 Color Palette */}
      <section style={sectionStyle}>
        <div className="reveal">
          <p className="section-label" style={sectionLabelStyle}>02 — Color Palette</p>
          <h2 style={h2Style}>Darkness &amp; Warmth</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div>
              <p style={paletteVariantLabelStyle}>Paleta Principal</p>
              <div style={colorGridStyle}>
                {visual.palette.board.filter((c) => c.main).map((c) => (
                  <ColorCard key={c.hex} {...c} />
                ))}
              </div>
            </div>
            <div style={{ marginTop: '3rem' }}>
              <p style={paletteVariantLabelStyle}>Paleta de Interfaz — Mayor visibilidad sobre negro</p>
              <div style={colorGridStyle}>
                {visual.palette.ui.map((c) => (
                  <ColorCard key={c.hex} {...c} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="copper-line" />

      {/* 03 Voice & Tone */}
      <section style={sectionStyle}>
        <div className="reveal">
          <p className="section-label" style={sectionLabelStyle}>03 — Verbal Identity</p>
          <h2 style={h2Style}>Voice &amp; Tone</h2>
          <p style={{ color: 'rgba(var(--fg-rgb),0.65)', maxWidth: '560px', fontFamily: "'IMFell', serif", fontStyle: 'italic', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Sereno y seguro. Intelectual pero íntimo. La oscuridad no pide permiso.
          </p>
          <div style={voiceGridStyle}>
            <div className="voice-col yes" style={voiceColStyle}>
              <h3 style={{ ...voiceColH3Style, color: 'var(--copper)' }}>Siempre</h3>
              <ul style={{ listStyle: 'none' }}>
                {identity.voice.always.map((item) => <VoiceItem key={item}>{item}</VoiceItem>)}
              </ul>
            </div>
            <div className="voice-col no" style={voiceColStyle}>
              <h3 style={{ ...voiceColH3Style, color: 'rgba(var(--fg-rgb),0.4)' }}>Nunca</h3>
              <ul style={{ listStyle: 'none' }}>
                {identity.voice.never.map((item) => <VoiceItem key={item}>{item}</VoiceItem>)}
              </ul>
            </div>
          </div>
          <div style={keywordsStyle}>
            {identity.keywords.map((kw) => (
              <span key={kw} style={keywordTagStyle}>{kw}</span>
            ))}
          </div>
        </div>
      </section>

      <hr className="copper-line" />

      {/* 04 Brand Values */}
      <section style={sectionStyle}>
        <div className="reveal">
          <p className="section-label" style={sectionLabelStyle}>04 — Brand Values</p>
          <h2 style={h2Style}>What We Stand For</h2>
          <div style={valuesGridStyle}>
            {positioning.values.filter((v) => v.featured).map((v) => (
              <div key={v.title} style={valueCardStyle}>
                <div style={valueTitleStyle}>{v.title}</div>
                <div style={valueBodyStyle}>{v.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="copper-line" />

      {/* 05 Purpose */}
      <section style={sectionStyle}>
        <div className="reveal" style={{ textAlign: 'center', paddingBottom: '4rem' }}>
          <p className="section-label" style={{ ...sectionLabelStyle, justifyContent: 'center' }}>05 — Purpose</p>
          <blockquote style={{
            fontFamily: "'IMFell', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            color: 'rgba(var(--fg-rgb),0.8)',
            maxWidth: '700px',
            margin: '2rem auto',
            lineHeight: '1.8',
            border: 'none',
            padding: 0,
          }}>
            {positioning.whyWe}
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <div style={footerStyle}>
        <img src="/logo.png" alt={identity.name} style={footerLogoStyle} />
        <p style={footerTaglineStyle}>Inhabit your shadow.</p>
      </div>
    </>
  )
}

function ColorCard({ name, hex, border }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        height: '80px',
        borderRadius: '2px',
        border: border || '1px solid rgba(var(--fg-rgb),0.1)',
        marginBottom: '0.75rem',
        background: hex,
      }} />
      <div style={{ fontFamily: "'Basilia', serif", fontSize: '0.8rem', color: 'var(--fg)', marginBottom: '0.25rem' }}>{name}</div>
      <div style={{ fontFamily: "'Josefin Sans', monospace", fontSize: '0.7rem', color: 'rgba(var(--copper-rgb),0.7)', letterSpacing: '0.1em' }}>{hex}</div>
    </div>
  )
}

function VoiceItem({ children }) {
  return (
    <li style={{
      fontFamily: "'Basilia', serif",
      fontSize: '0.9rem',
      color: 'rgba(var(--fg-rgb),0.7)',
      padding: '0.4rem 0',
      borderBottom: '1px solid rgba(var(--copper-rgb),0.12)',
    }}>
      {children}
    </li>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────













// ── Styles ────────────────────────────────────────────────────────────────────

const heroStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  padding: '4rem 2rem',
}

const heroLogoStyle = {
  width: 'clamp(120px, 20vw, 200px)',
  marginBottom: '2rem',
}

const taglineStyle = {
  fontFamily: "'Cinzel', serif",
  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
  color: 'var(--fg)',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  marginBottom: '0.75rem',
}

const sloganStyle = {
  fontFamily: "'IMFell', serif",
  fontStyle: 'italic',
  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
  color: 'rgba(var(--fg-rgb),0.55)',
  marginBottom: '2.5rem',
}

const sectionStyle = {
  maxWidth: '1600px',
  margin: '0 auto',
  padding: '0 clamp(1.25rem, 4vw, 3rem) 5rem',
}

const sectionLabelStyle = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.72rem',
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: 'var(--copper)',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

const h2Style = {
  fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
  color: 'var(--fg)',
  marginBottom: '2rem',
}

const archetypeCardStyle = {
  border: '1px solid rgba(var(--copper-rgb),0.3)',
  padding: '2.5rem',
  background: 'rgba(var(--burgundy-rgb),0.1)',
}

const archetypeNameStyle = {
  fontFamily: "'Cinzel', serif",
  fontSize: '1.1rem',
  color: 'var(--copper)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '1rem',
}

const archetypeQuoteStyle = {
  fontFamily: "'IMFell', serif",
  fontStyle: 'italic',
  fontSize: '1.3rem',
  color: 'var(--fg)',
  lineHeight: '1.6',
}

const paletteVariantLabelStyle = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.65rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(var(--copper-rgb),0.6)',
  marginBottom: '1.5rem',
}

const colorGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem',
}

const voiceGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
  margin: '2rem 0',
}

const voiceColStyle = {}

const voiceColH3Style = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.75rem',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  marginBottom: '1rem',
}

const keywordsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '2rem',
}

const keywordTagStyle = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.7rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--copper)',
  border: '1px solid rgba(var(--copper-rgb),0.4)',
  padding: '0.3rem 0.75rem',
}

const valuesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1.5rem',
}

const valueCardStyle = {
  padding: '2rem',
  border: '1px solid rgba(var(--copper-rgb),0.2)',
}

const valueTitleStyle = {
  fontFamily: "'Cinzel', serif",
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--copper)',
  marginBottom: '0.75rem',
}

const valueBodyStyle = {
  fontFamily: "'Basilia', serif",
  fontSize: '0.9rem',
  color: 'rgba(var(--fg-rgb),0.65)',
  lineHeight: '1.7',
}

const footerStyle = {
  textAlign: 'center',
  padding: '5rem 2rem',
  borderTop: '1px solid rgba(var(--copper-rgb),0.2)',
}

const footerLogoStyle = {
  width: '80px',
  margin: '0 auto 1.5rem',
  display: 'block',
  filter: 'brightness(0.8)',
}

const footerTaglineStyle = {
  fontFamily: "'IMFell', serif",
  fontStyle: 'italic',
  fontSize: '0.9rem',
  color: 'rgba(var(--fg-rgb),0.35)',
  letterSpacing: '0.1em',
}
