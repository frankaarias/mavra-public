import { useTranslation } from '../i18n/TranslationProvider.jsx'
import useReveal from '../components/useReveal.js'
import brand from '../brand/brand.json'

const { identity, visual } = brand

export default function Tipografia() {
  const { text: trText, html: trHtml } = useTranslation()

  useReveal()

  return (
    <>
      <div className="page-header">
        <h1>{trText("Typography")}</h1>
        <p className="page-subtitle">{trText("Familias tipográficas, jerarquía y combinaciones de uso.")}</p>
      </div>

      <hr className="copper-line" />

      <div className="section-wrap" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 3rem) 5rem' }}>
        <div className="section-label" style={sectionLabelStyle}>{trText("Sistema Tipográfico")}</div>

        {/* Cinzel Headlines */}
        <div className="system-card reveal" style={systemCardStyle}>
          <div style={fontRoleStyle}>{trText("Headlines / Títulos")}</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 400, fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>{trText("Inhabit Your Shadow")}</div>
          <div style={fontMetaStyle}>{trText("Cinzel · 400 · Uppercase")}</div>
        </div>

        {/* Basilia Body */}
        <div className="system-card reveal" style={systemCardStyle}>
          <div style={fontRoleStyle}>{trText("Body / Cuerpo")}</div>
          <div style={{ fontFamily: "'Basilia',serif", fontWeight: 400, fontSize: '1rem', color: 'rgba(var(--fg-rgb),0.75)', lineHeight: 1.8, maxWidth: '600px' }}>{trText("Creemos en que la sombra es una forma superior de hacer hogar. Cada objeto que hacemos está construido para sobrevivir su ocasión. No se trata de tendencia. Se trata de permanencia.")}</div>
          <div style={fontMetaStyle}>{trText("Basilia · Regular 400 · 1rem · Line-height 1.8")}</div>
        </div>

        {/* IM Fell Italic */}
        <div className="system-card reveal" style={systemCardStyle}>
          <div style={fontRoleStyle}>{trText("Citas / Editorial")}</div>
          <div style={{ fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--fg)', lineHeight: 1.6 }}>{trText("\"mi espacio es mi santuario.\"")}</div>
          <div style={fontMetaStyle}>{trText("IM Fell English · Italic · 1.3rem")}</div>
        </div>

        {/* Josefin Callouts */}
        <div className="system-card reveal" style={systemCardStyle}>
          <div style={fontRoleStyle}>{trText("Callouts / Props / Etiquetas")}</div>
          <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.85rem', color: 'var(--fg)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.6 }}>{trText("DUAL MOUNT SYSTEM · ZERO WALL DAMAGE · SET OF 3")}</div>
          <div style={fontMetaStyle}>{trText("Josefin Sans · 300-400 · 0.85rem · Uppercase · 0.1em tracking")}</div>
        </div>
      </div>

      <hr className="copper-line" />

      {/* Preview in context */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 3rem) 5rem' }}>
        <div className="section-label" style={sectionLabelStyle}>{trText("Combinación en Contexto")}</div>

        <div className="reveal" style={{ padding: '3rem', border: '1px solid rgba(var(--copper-rgb),0.25)', background: 'rgba(0,0,0,0.25)', marginTop: '2rem' }}>
          <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.5)', marginBottom: '1.5rem' }}>{trText("✦ Wall Skulls · Set de 3")}</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>{trText("Inhabit Your Shadow")}</div>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(var(--copper-rgb),0.15)', margin: '1.5rem 0' }} />
          <div style={{ fontFamily: "'Basilia',serif", fontWeight: 400, fontSize: '0.95rem', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.8, maxWidth: '580px' }}>{trText("Creemos en que la sombra es una forma superior de hacer hogar. Cada objeto que hacemos está construido para sobrevivir su ocasión.")}</div>
          <div style={{ fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(var(--fg-rgb),0.45)', marginTop: '1rem', lineHeight: 1.6 }}>{trText("\"dark is not a season. it's a permanent state.\"")}</div>
          <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.75rem', color: 'rgba(var(--copper-rgb),0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1rem' }}>{trText("SKULL WALL SCONCE · ANATOMICAL · SET OF 3")}</div>
        </div>
      </div>

      {/* Color & Weight visual.typography.combos */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 3rem) 5rem' }}>
        <div className="section-label" style={sectionLabelStyle}>{trText("Combinaciones — Color & Peso")}</div>

        <div style={comboGrid}>
          {visual.typography.combos.map((c, i) => (
            <div key={i} style={{ border: '1px solid rgba(var(--copper-rgb),0.2)', padding: '1.75rem', ...(c.bg ? { background: c.bg } : {}) }}>
              <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.5)', marginBottom: '1rem' }}>{trText(c.label)}</div>
              <div dangerouslySetInnerHTML={{ __html: trHtml(c.content) }} />
            </div>
          ))}
        </div>
      </div>

      <div className="global-footer">{trText(identity.name)}{trText(" · Typography System · ")}<a href="/">{trText("Home")}</a></div>
    </>
  )
}

const sectionLabelStyle = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.72rem',
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: 'var(--copper)',
  marginBottom: '1.5rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid rgba(var(--copper-rgb),0.25)',
}

const systemCardStyle = {
  padding: '2.5rem',
  border: '1px solid rgba(var(--copper-rgb),0.4)',
  background: 'rgba(var(--copper-rgb),0.05)',
  marginBottom: '2rem',
}

const fontRoleStyle = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.65rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(var(--copper-rgb),0.6)',
  marginBottom: '0.75rem',
}

const fontMetaStyle = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '0.7rem',
  color: 'rgba(var(--copper-rgb),0.6)',
  marginTop: '0.75rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
}

const comboGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1.25rem',
  marginBottom: '1.25rem',
}

