import { useEffect, useState } from 'react'
import brand from '../brand/brand.json'

const { identity } = brand
const SECTIONS = ['marca', 'portfolio', 'visual-system', 'framework', 'principles']

const C = {
  background: 'var(--bg)', foreground: 'var(--fg)', copper: 'var(--copper)',
  muted: 'rgba(var(--fg-rgb),0.58)', border: 'rgba(var(--copper-rgb),0.22)',
}

const styles = {
  page: { maxWidth: '1360px', margin: '0 auto', padding: '60px clamp(20px, 4vw, 48px)' },
  hero: { maxWidth: '800px', padding: '64px 0 48px', borderBottom: `1px solid ${C.border}` },
  eyebrow: { margin: '0 0 14px', color: C.copper, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase' },
  title: { margin: 0, color: C.foreground, fontFamily: 'var(--font-condensed)', fontSize: 'clamp(2.3rem, 6vw, 4.8rem)', fontWeight: 400, lineHeight: 0.98, letterSpacing: '0.035em' },
  lead: { margin: '22px 0 0', color: C.muted, fontFamily: "'IM Fell English', Georgia, serif", fontSize: '1.25rem', fontStyle: 'italic', lineHeight: 1.55 },
  section: { marginTop: '72px' },
  label: { display: 'block', marginBottom: '9px', color: C.copper, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase' },
  h2: { margin: 0, color: C.foreground, fontFamily: 'var(--font-condensed)', fontSize: '2rem', fontWeight: 400, letterSpacing: '0.04em' },
  body: { margin: '14px 0 0', color: C.muted, fontSize: '0.95rem', lineHeight: 1.75, maxWidth: '760px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '28px' },
  card: { minHeight: '155px', padding: '24px', background: 'rgba(255,255,255,0.025)', border: `1px solid ${C.border}` },
  cardTitle: { margin: 0, color: C.foreground, fontFamily: 'var(--font-condensed)', fontSize: '1.15rem', fontWeight: 400, letterSpacing: '0.06em' },
  cardText: { margin: '12px 0 0', color: C.muted, fontSize: '0.84rem', lineHeight: 1.65 },
}

const PRODUCT_LINES = [
  ['Wall Skulls', 'A dimensional wall-decor system designed to make the permanent dark interior feel authored rather than seasonal.'],
  ['Skull Candle Set', 'A four-piece ritual object that combines sculptural detail, atmosphere and giftable presentation.'],
  ['Skull Lamp', 'A light object designed around shadow, modulation and an immediately recognizable room-level effect.'],
]

const PRINCIPLES = [
  ['Product fidelity', 'The product remains the visual source of truth. Every scene, crop and format is built to preserve its silhouette, scale and material character.'],
  ['Atmosphere serves proof', 'Mood is never decoration alone. Light, surfaces and composition are selected to make a product attribute easier to understand and desire.'],
  ['One visual system', 'Listing images, A+ content, campaign creative and social assets share the same visual grammar so each touchpoint reinforces the next.'],
  ['Evidence before claims', 'The visual stack answers practical buying questions — scale, materials, use, presentation and product relationships — before asking for conversion.'],
]

export default function Briefing() {
  const [active, setActive] = useState('marca')
  useEffect(() => { document.title = `${identity.name} — Creative Direction` }, [])

  const goTo = (id) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main style={styles.page}>
      <nav aria-label="Creative direction sections" style={{ position: 'sticky', top: '60px', zIndex: 30, display: 'flex', gap: '20px', overflowX: 'auto', padding: '12px 0', background: C.background, borderBottom: `1px solid ${C.border}` }}>
        {SECTIONS.map((id) => (
          <button key={id} type="button" onClick={() => goTo(id)} style={{ flex: '0 0 auto', padding: '4px 0', color: active === id ? C.copper : C.muted, background: 'none', border: 0, borderBottom: active === id ? `1px solid ${C.copper}` : '1px solid transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.64rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {id.replace('-', ' ')}
          </button>
        ))}
      </nav>

      <header style={styles.hero}>
        <p style={styles.eyebrow}>Case study evidence · Creative direction</p>
        <h1 style={styles.title}>A visual system<br />built for Amazon.</h1>
        <p style={styles.lead}>MAVRA's creative direction translates brand position, product truth and retail questions into one coherent visual experience.</p>
      </header>

      <section id="marca" style={styles.section}>
        <span style={styles.label}>01 — Brand point of view</span>
        <h2 style={styles.h2}>Darkness as a form of authorship.</h2>
        <p style={styles.body}>MAVRA is designed for people who treat their home as a personal world, not a temporary costume. The visual language is intentional, warm and precise: dark surfaces, controlled light and objects that feel collected rather than mass-decorated.</p>
      </section>

      <section id="portfolio" style={styles.section}>
        <span style={styles.label}>02 — Product architecture</span>
        <h2 style={styles.h2}>Three expressions, one brand world.</h2>
        <div style={styles.grid}>
          {PRODUCT_LINES.map(([title, text]) => <article key={title} style={styles.card}><h3 style={styles.cardTitle}>{title}</h3><p style={styles.cardText}>{text}</p></article>)}
        </div>
      </section>

      <section id="visual-system" style={styles.section}>
        <span style={styles.label}>03 — Visual system</span>
        <h2 style={styles.h2}>A repeatable aesthetic, not isolated images.</h2>
        <div style={styles.grid}>
          {[
            ['Light', 'Chiaroscuro, directional warmth and controlled shadow make form, finish and depth legible without losing atmosphere.'],
            ['Space', 'Permanent interiors, editorial surfaces and human-scale context position the products beyond seasonal decoration.'],
            ['Composition', 'Each frame has a job: establish the product, prove its details, communicate scale or place it inside a broader collecting world.'],
          ].map(([title, text]) => <article key={title} style={styles.card}><h3 style={styles.cardTitle}>{title}</h3><p style={styles.cardText}>{text}</p></article>)}
        </div>
      </section>

      <section id="framework" style={styles.section}>
        <span style={styles.label}>04 — Production framework</span>
        <h2 style={styles.h2}>Creative direction that connects to retail.</h2>
        <p style={styles.body}>The work is planned from the customer's decision journey outward: what they need to understand first, what objection follows, and which product proof earns the next moment of attention. This creates a single brief across listing imagery, A+ content, advertising and creator-facing assets.</p>
        <div style={styles.grid}>
          {['Brand territory', 'Product story', 'Image architecture', 'Retail execution'].map((label, index) => <article key={label} style={styles.card}><span style={styles.label}>0{index + 1}</span><h3 style={styles.cardTitle}>{label}</h3></article>)}
        </div>
      </section>

      <section id="principles" style={styles.section}>
        <span style={styles.label}>05 — Creative principles</span>
        <h2 style={styles.h2}>How the system stays coherent.</h2>
        <div style={styles.grid}>
          {PRINCIPLES.map(([title, text]) => <article key={title} style={styles.card}><h3 style={styles.cardTitle}>{title}</h3><p style={styles.cardText}>{text}</p></article>)}
        </div>
      </section>

      <footer style={{ marginTop: '76px', padding: '28px 0', borderTop: `1px solid ${C.border}` }}>
        <p style={{ ...styles.body, margin: 0, maxWidth: '680px', fontSize: '0.8rem' }}>This public case-study view documents the creative reasoning and selected outputs. Source files, production notes and working references remain outside the public experience.</p>
      </footer>
    </main>
  )
}
