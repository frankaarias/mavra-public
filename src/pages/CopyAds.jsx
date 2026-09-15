import { useEffect } from 'react'
import brand from '../brand/brand.json'

const { identity } = brand

const stages = [
  ['Discover', 'Map the language of the category, the jobs buyers are trying to complete and the gaps the product can credibly own.'],
  ['Encode', 'Translate the strategy into listing copy, image claims and a semantic structure that makes the product understandable to Amazon and customers.'],
  ['Activate', 'Launch search and product-discovery activity around the same territories used by the listing, so paid and organic learning reinforce each other.'],
  ['Learn', 'Use conversion and search-term signals to refine positioning, creative emphasis and the next group of scalable targets.'],
]

const s = {
  page: { maxWidth: '1280px', margin: '0 auto', padding: '70px clamp(20px, 4vw, 52px)' },
  eyebrow: { color: 'var(--copper)', fontSize: '0.67rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 },
  title: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontSize: 'clamp(2.4rem, 6vw, 4.8rem)', fontWeight: 400, lineHeight: 1, letterSpacing: '0.04em', margin: '16px 0 0' },
  lead: { color: 'rgba(var(--fg-rgb),0.62)', fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1.25rem', lineHeight: 1.55, maxWidth: '760px', margin: '22px 0 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(245px,1fr))', gap: '14px', marginTop: '30px' },
  card: { padding: '26px', minHeight: '190px', border: '1px solid rgba(var(--copper-rgb),0.23)', background: 'rgba(255,255,255,0.02)' },
  number: { color: 'var(--copper)', fontSize: '0.65rem', letterSpacing: '0.18em' },
  h3: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontWeight: 400, fontSize: '1.22rem', letterSpacing: '0.06em', margin: '15px 0 0' },
  body: { color: 'rgba(var(--fg-rgb),0.58)', fontSize: '0.87rem', lineHeight: 1.7, margin: '12px 0 0' },
}

export default function CopyAds() {
  useEffect(() => { document.title = `${identity.name} — Search & Growth Architecture` }, [])
  return (
    <main style={s.page}>
      <header>
        <p style={s.eyebrow}>Case study evidence · Search and growth</p>
        <h1 style={s.title}>One demand system,<br />not separate tactics.</h1>
        <p style={s.lead}>MAVRA connects market language, listing decisions and launch activity into a single learning loop. The objective is not activity for its own sake; it is clearer product-market fit at every customer touchpoint.</p>
      </header>
      <section style={{ marginTop: '64px' }}>
        <p style={s.eyebrow}>Operating model</p>
        <div style={s.grid}>
          {stages.map(([title, text], index) => <article key={title} style={s.card}><span style={s.number}>0{index + 1}</span><h2 style={s.h3}>{title}</h2><p style={s.body}>{text}</p></article>)}
        </div>
      </section>
      <section style={{ marginTop: '72px', padding: '30px', border: '1px solid rgba(var(--copper-rgb),0.23)', background: 'rgba(var(--copper-rgb),0.04)' }}>
        <p style={s.eyebrow}>What this demonstrates</p>
        <p style={{ ...s.body, marginBottom: 0, maxWidth: '800px', fontSize: '0.98rem' }}>Brand strategy is made operational when the same customer language informs SEO, retail copy, image architecture and acquisition. The public case study documents this system without publishing proprietary campaign settings, market exports or operational account data.</p>
      </section>
    </main>
  )
}
