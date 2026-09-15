import { useEffect } from 'react'
import brand from '../../brand/brand.json'

const { identity } = brand

const stages = [
  ['Discovery', 'Find creators whose audience, aesthetic and content format naturally fit the product world.'],
  ['Qualification', 'Assess audience relevance, content quality, storefront fit and the collaboration model before outreach.'],
  ['Activation', 'Build a clear product story, sensible measurement plan and creator-first collaboration brief.'],
  ['Learning', 'Use response and content signals to improve the next cohort rather than treating every outreach cycle as isolated.'],
]

const s = {
  page: { maxWidth: '1280px', margin: '0 auto', padding: '70px clamp(20px, 4vw, 52px)' },
  eyebrow: { color: 'var(--copper)', fontSize: '0.67rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 },
  title: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontSize: 'clamp(2.4rem, 6vw, 4.8rem)', fontWeight: 400, lineHeight: 1, letterSpacing: '0.04em', margin: '16px 0 0' },
  lead: { color: 'rgba(var(--fg-rgb),0.62)', fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1.25rem', lineHeight: 1.55, maxWidth: '760px', margin: '22px 0 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(245px,1fr))', gap: '14px', marginTop: '30px' },
  card: { padding: '26px', minHeight: '180px', border: '1px solid rgba(var(--copper-rgb),0.23)', background: 'rgba(255,255,255,0.02)' },
  number: { color: 'var(--copper)', fontSize: '0.65rem', letterSpacing: '0.18em' },
  h3: { color: 'var(--fg)', fontFamily: 'var(--font-condensed)', fontWeight: 400, fontSize: '1.22rem', letterSpacing: '0.06em', margin: '15px 0 0' },
  body: { color: 'rgba(var(--fg-rgb),0.58)', fontSize: '0.87rem', lineHeight: 1.7, margin: '12px 0 0' },
}

export default function Influencers() {
  useEffect(() => { document.title = `${identity.name} — Creator Operations` }, [])
  return (
    <main style={s.page}>
      <header>
        <p style={s.eyebrow}>Case study evidence · Creator operations</p>
        <h1 style={s.title}>Creator strategy is<br />a system of fit.</h1>
        <p style={s.lead}>MAVRA’s creator program is designed around relevance and repeatability: matching the product world to audiences that can make it credible, then learning from each activation.</p>
      </header>
      <section style={{ marginTop: '64px' }}>
        <p style={s.eyebrow}>Operating model</p>
        <div style={s.grid}>
          {stages.map(([title, text], index) => <article key={title} style={s.card}><span style={s.number}>0{index + 1}</span><h2 style={s.h3}>{title}</h2><p style={s.body}>{text}</p></article>)}
        </div>
      </section>
      <section style={{ marginTop: '72px', padding: '30px', border: '1px solid rgba(var(--copper-rgb),0.23)', background: 'rgba(var(--copper-rgb),0.04)' }}>
        <p style={s.eyebrow}>Documented scope</p>
        <p style={{ ...s.body, marginBottom: 0, maxWidth: '800px', fontSize: '0.98rem' }}>The MAVRA system mapped 126 potential creators, with 86 accounts manually verified and 41 qualified in the highest relevance tier. These are scope metrics, not campaign-performance claims. Individual creator records, contact details and outreach materials are not part of the public case study.</p>
      </section>
    </main>
  )
}
