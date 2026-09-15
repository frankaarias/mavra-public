import { useEffect } from 'react'
import brand from '../brand/brand.json'

const { identity } = brand
const cards = [
  ['Main image', 'Establish material, silhouette and what is included with one immediate product read.'],
  ['Proof images', 'Use every secondary frame to answer a distinct buyer question: scale, construction, use, presentation or setup.'],
  ['Emotional context', 'Show the object inside a permanent interior so the product becomes a credible expression of the buyer’s identity.'],
  ['Collection logic', 'Connect related products only after the individual product has earned understanding and trust.'],
]
const s = {
  page: { maxWidth: '1280px', margin: '0 auto', padding: '70px clamp(20px, 4vw, 52px)' },
  eyebrow: { color: 'var(--copper)', fontSize: '0.67rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 },
  title: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontSize: 'clamp(2.4rem, 6vw, 4.8rem)', fontWeight: 400, lineHeight: 1, letterSpacing: '0.04em', margin: '16px 0 0' },
  lead: { color: 'rgba(var(--fg-rgb),0.62)', fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1.25rem', lineHeight: 1.55, maxWidth: '740px', margin: '22px 0 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '14px', marginTop: '30px' },
  card: { padding: '26px', minHeight: '175px', border: '1px solid rgba(var(--copper-rgb),0.23)', background: 'rgba(255,255,255,0.02)' },
  number: { color: 'var(--copper)', fontSize: '0.65rem', letterSpacing: '0.18em' },
  h3: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontWeight: 400, fontSize: '1.22rem', letterSpacing: '0.06em', margin: '15px 0 0' },
  body: { color: 'rgba(var(--fg-rgb),0.58)', fontSize: '0.87rem', lineHeight: 1.7, margin: '12px 0 0' },
}

export default function Listings() {
  useEffect(() => { document.title = `${identity.name} — Listing Architecture` }, [])
  return (
    <main style={s.page}>
      <header>
        <p style={s.eyebrow}>Case study evidence · Amazon PDP</p>
        <h1 style={s.title}>A listing is a<br />retail experience.</h1>
        <p style={s.lead}>MAVRA’s listing architecture is built around decision friction. Every image earns its place by making a product truth easier to see, understand or want.</p>
      </header>
      <section style={{ marginTop: '64px' }}>
        <p style={s.eyebrow}>Image system</p>
        <div style={s.grid}>
          {cards.map(([title, text], index) => <article key={title} style={s.card}><span style={s.number}>0{index + 1}</span><h2 style={s.h3}>{title}</h2><p style={s.body}>{text}</p></article>)}
        </div>
      </section>
      <section style={{ marginTop: '72px', padding: '30px', border: '1px solid rgba(var(--copper-rgb),0.23)', background: 'rgba(var(--copper-rgb),0.04)' }}>
        <p style={s.eyebrow}>The principle</p>
        <p style={{ ...s.body, marginBottom: 0, maxWidth: '800px', fontSize: '0.98rem' }}>The strongest PDPs do not make the customer decode a mood board. They connect a product attribute to a real buying decision while preserving the emotional world that makes the product memorable.</p>
      </section>
    </main>
  )
}
