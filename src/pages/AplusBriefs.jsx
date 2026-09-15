import { useEffect } from 'react'
import brand from '../brand/brand.json'

const { identity } = brand

const modules = [
  ['01', 'Set the world', 'The opening establishes MAVRA as permanent dark-home design before the visitor is asked to compare product features.'],
  ['02', 'Make scale tangible', 'Human context, dimensional proof and room placement make the product easier to picture and less risky to buy.'],
  ['03', 'Turn details into reasons', 'Material, construction and product-specific attributes are framed as answers to the questions a buyer has before conversion.'],
  ['04', 'Show the product in use', 'The image system moves from object proof to atmosphere, demonstrating how each piece changes a room.'],
  ['05', 'Connect the collection', 'Cross-product context increases perceived value and positions MAVRA as a world to collect rather than one isolated SKU.'],
  ['06', 'Close with identity', 'The final module returns to the brand promise, so the customer leaves with an emotional reason to remember the product.'],
]

const s = {
  page: { maxWidth: '1280px', margin: '0 auto', padding: '70px clamp(20px, 4vw, 52px)' },
  eyebrow: { color: 'var(--copper)', fontSize: '0.67rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 },
  title: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontSize: 'clamp(2.4rem, 6vw, 4.8rem)', fontWeight: 400, lineHeight: 1, letterSpacing: '0.04em', margin: '16px 0 0' },
  lead: { color: 'rgba(var(--fg-rgb),0.62)', fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1.25rem', lineHeight: 1.55, maxWidth: '720px', margin: '22px 0 0' },
  intro: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1px', margin: '56px 0 72px', background: 'rgba(var(--copper-rgb),0.2)', border: '1px solid rgba(var(--copper-rgb),0.2)' },
  introItem: { padding: '22px', background: 'var(--bg)' },
  small: { display: 'block', color: 'var(--copper)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '8px' },
  number: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontSize: '1.3rem', letterSpacing: '0.08em' },
  sectionTitle: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontSize: '2rem', fontWeight: 400, letterSpacing: '0.05em', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(275px,1fr))', gap: '14px', marginTop: '28px' },
  card: { padding: '26px', border: '1px solid rgba(var(--copper-rgb),0.24)', background: 'rgba(255,255,255,0.02)' },
  cardNo: { color: 'var(--copper)', fontFamily: 'var(--font-sans)', fontSize: '0.64rem', letterSpacing: '0.18em' },
  cardTitle: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontWeight: 400, fontSize: '1.2rem', letterSpacing: '0.06em', margin: '14px 0 0' },
  body: { color: 'rgba(var(--fg-rgb),0.58)', fontSize: '0.88rem', lineHeight: 1.7, margin: '12px 0 0' },
}

export default function AplusBriefs() {
  useEffect(() => { document.title = `${identity.name} — Amazon Retail Experience` }, [])

  return (
    <main style={s.page}>
      <header>
        <p style={s.eyebrow}>Case study evidence · Amazon retail experience</p>
        <h1 style={s.title}>A+ as a product<br />decision system.</h1>
        <p style={s.lead}>For MAVRA, A+ is not a gallery added after the listing. It is the visual layer that answers buying questions in the order a customer needs them answered.</p>
      </header>

      <section style={s.intro} aria-label="A+ system principles">
        {[
          ['One narrative', 'Brand and product proof move together.'],
          ['Six decisions', 'Each module has one clear customer job.'],
          ['Retail first', 'The sequence reduces uncertainty before it adds atmosphere.'],
          ['Collection logic', 'Every product can lead naturally to the next.'],
        ].map(([label, text]) => <div key={label} style={s.introItem}><span style={s.small}>{label}</span><span style={{ color: 'rgba(var(--fg-rgb),0.58)', fontSize: '0.82rem', lineHeight: 1.5 }}>{text}</span></div>)}
      </section>

      <section>
        <p style={s.eyebrow}>Module architecture</p>
        <h2 style={s.sectionTitle}>The customer journey, translated into images.</h2>
        <div style={s.grid}>
          {modules.map(([number, title, text]) => <article key={number} style={s.card}><span style={s.cardNo}>{number}</span><h3 style={s.cardTitle}>{title}</h3><p style={s.body}>{text}</p></article>)}
        </div>
      </section>

      <section style={{ marginTop: '72px', paddingTop: '28px', borderTop: '1px solid rgba(var(--copper-rgb),0.2)' }}>
        <p style={s.eyebrow}>What the work demonstrates</p>
        <p style={{ ...s.body, maxWidth: '780px', fontSize: '0.98rem' }}>The A+ architecture connects product positioning, visual direction, conversion priorities and portfolio strategy. It is documented here as a customer-facing system; source assets and production materials remain outside the public case study.</p>
      </section>
    </main>
  )
}
