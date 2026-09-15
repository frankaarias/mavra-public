import useReveal from '../components/useReveal.js'
import brand from '../brand/brand.json'

const { identity, positioning, audience, competitors, visual, activation } = brand
const nav = brand.nav.brandGuidelines

export default function BrandGuidelines() {
  useReveal()

  return (
    <>
      <div className="page-header">
        <h1>Brand Guidelines</h1>
        <p className="page-subtitle">Estrategia, identidad y sistema visual completo.</p>
        <div style={docMetaStyle}>{identity.docVersion} {identity.name}</div>
      </div>

      <div style={layoutStyle}>
        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <p style={sidebarLabelStyle}>Contenido</p>
          {nav.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={link.driver ? driverLinkStyle : sidebarLinkStyle}
            >
              {link.label}
            </a>
          ))}
        </aside>

        {/* Content */}
        <div style={contentStyle}>

          {/* ══ Driver 1 ═══════════════════════════════════════════════ */}
          <section style={driverSectionStyle} id="d1">
            <p style={driverLabelStyle}>Driver 01</p>
            <h2 style={driverTitleStyle}>Análisis del Consumidor</h2>

            <H3 id="d1-dog">The Dog Matrix</H3>
            <div style={quadrantStyle}>
              <QCell label={"🛍️ " + audience.matrix.buyer.label}>
                {audience.matrix.buyer.body}
              </QCell>
              <QCell label={"🐕 " + audience.matrix.user.label}>
                {audience.matrix.user.body}
              </QCell>
              <QCell label={"👑 " + audience.matrix.aspiration.label}>
                {audience.matrix.aspiration.body}
              </QCell>
              <QCell label={"🐍 " + audience.matrix.lost.label}>
                {audience.matrix.lost.body}
              </QCell>
            </div>

            <H3 id="d1-feel">The Feel Map</H3>
            <DocTable
              headers={audience.feelMap.headers}
              rows={audience.feelMap.rows}
            />

            <H3 id="d1-canvas">Brand Desire Canvas</H3>
            <div style={quadrantStyle}>
              <QCell label={"🛍️ " + audience.desireCanvas[0].label}>
                {audience.desireCanvas[0].body}
              </QCell>
              <QCell label={"💥 " + audience.desireCanvas[1].label}>
                {audience.desireCanvas[1].body}
              </QCell>
              <QCell label={"❤️ " + audience.desireCanvas[2].label}>
                {audience.desireCanvas[2].body}
              </QCell>
              <QCell label={"🤪 " + audience.desireCanvas[3].label}>
                {audience.desireCanvas[3].body}
              </QCell>
            </div>

            <H3 id="d1-journey">Attitudinal Journey</H3>
            <DocTable
              headers={audience.journey.headers}
              rows={audience.journey.rows}
            />

            <H3 id="d1-ego">Brand Ego</H3>
            <p style={bodyTextStyle}>{audience.ego}</p>

            <H3 id="d1-conclusiones">Conclusiones D1</H3>
            <div style={conclusionBoxStyle}>
              <p style={bodyTextStyle}>{audience.conclusions[0]}</p>
              <p style={bodyTextStyle}><em>{audience.conclusions[1]}</em></p>
            </div>
          </section>

          {/* ══ Driver 2 ═══════════════════════════════════════════════ */}
          <section style={driverSectionStyle} id="d2">
            <p style={driverLabelStyle}>Driver 02</p>
            <h2 style={driverTitleStyle}>Análisis de Competencia</h2>

            <H3 id="d2-pyramid">Max Pyramid</H3>
            {positioning.pyramid.map((l, i) => (
              <div key={i} style={{ ...pyramidLevelStyle, ...(l.top ? pyramidTopStyle : l.mid ? pyramidMidStyle : {}) }}>
                <div style={pyramidLevelLabelStyle}>{l.label}</div>
                <p style={bodyTextStyle}>{l.body}</p>
              </div>
            ))}

            <H3 id="d2-territory">Brand Territory</H3>
            <p style={bodyTextStyle}>{positioning.territory}</p>

            <H3 id="d2-abc">ABC Roll Axis</H3>
            <DocTable
              headers={competitors.headers}
              rows={competitors.rows}
            />

            <H3 id="d2-revolution">Revolution Matrix — Mandamientos Anti-Competencia</H3>
            <ul style={{ listStyle: 'none' }}>
              {positioning.antiCompetition.map((r, i) => (
                <li key={i} style={{ ...bodyTextStyle, padding: '0.4rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' }}>
                  <span style={{ color: 'var(--copper)', marginRight: '0.75rem' }}>—</span>
                  {r}
                </li>
              ))}
            </ul>
          </section>

          {/* ══ Driver 3 ═══════════════════════════════════════════════ */}
          <section style={driverSectionStyle} id="d3">
            <p style={driverLabelStyle}>Driver 03</p>
            <h2 style={driverTitleStyle}>Plataforma de Marca</h2>

            <H3 id="d3-5qs">Los 5 Qués</H3>
            <DocTable
              headers={['Qué', identity.name]}
              rows={positioning.fiveWhats}
            />

            <H3 id="d3-core">Core Value</H3>
            <blockquote style={blockquoteStyle}>{positioning.coreValue}</blockquote>

            <H3 id="d3-positioning">Brand Positioning</H3>
            <p style={bodyTextStyle}>
              <strong>{positioning.statement}</strong>
            </p>

            <H3 id="d3-proposito">Propósito Check — Las 3 "P"</H3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', margin: '1.5rem 0' }}>
              {positioning.purpose.map((p) => (
                <div key={p.label} style={{ padding: '1.25rem', border: '1px solid rgba(var(--copper-rgb),0.2)' }}>
                  <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.6rem' }}>{p.label}</div>
                  <p style={bodyTextStyle}>{p.body}</p>
                </div>
              ))}
            </div>

            <H3 id="d3-mandamientos">Los 10 Mandamientos de Marca</H3>
            {positioning.commandments.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' }}>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: '0.75rem', color: 'rgba(var(--copper-rgb),0.5)', minWidth: '1.5rem', paddingTop: '0.1rem' }}>{i + 1}</span>
                <span style={{ ...bodyTextStyle, fontSize: '0.88rem' }} dangerouslySetInnerHTML={{ __html: m }} />
              </div>
            ))}

            <H3 id="d3-values">Brand Values</H3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', margin: '1.5rem 0' }}>
              {positioning.values.map((v) => (
                <div key={v.title} style={{ padding: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.25)', background: 'rgba(var(--burgundy-rgb),0.08)' }}>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: '0.8rem', color: 'var(--copper)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{v.title}</div>
                  <p style={{ ...bodyTextStyle, fontSize: '0.85rem' }}>{v.body}</p>
                </div>
              ))}
            </div>

            <H3 id="d3-conclusiones">Conclusiones D3</H3>
            <div style={conclusionBoxStyle}>
              <p style={bodyTextStyle}>{positioning.conclusions.platform}</p>
            </div>
          </section>

          {/* ══ Driver 4 ═══════════════════════════════════════════════ */}
          <section style={driverSectionStyle} id="d4">
            <p style={driverLabelStyle}>Driver 04</p>
            <h2 style={driverTitleStyle}>Identidad de Marca</h2>

            <H3 id="d4-symbol">Brand Symbol</H3>
            <p style={bodyTextStyle}>{identity.symbol.body}</p>

            <H3 id="d4-archetype">Brand Charisma — The Liberator</H3>
            <div style={{ padding: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.3)', background: 'rgba(var(--burgundy-rgb),0.08)', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.1rem', color: 'var(--copper)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>{identity.archetype.name}</div>
              <p style={bodyTextStyle}><em>{identity.archetype.quote}</em></p>
              <p style={{ ...bodyTextStyle, marginTop: '0.75rem' }}>{identity.archetype.body}</p>
            </div>

            <H3 id="d4-voice">Tone of Voice Path</H3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '1.5rem 0' }}>
              <div>
                <h4 style={h4Style}>Siempre</h4>
                <ul style={{ listStyle: 'none' }}>
                  {identity.voice.always.map((v) => <VoiceItem key={v}>{v}</VoiceItem>)}
                </ul>
              </div>
              <div>
                <h4 style={{ ...h4Style, color: 'rgba(var(--fg-rgb),0.35)' }}>Nunca</h4>
                <ul style={{ listStyle: 'none' }}>
                  {identity.voice.never.map((v) => <VoiceItem key={v}>{v}</VoiceItem>)}
                </ul>
              </div>
            </div>

            <H3 id="d4-board">Full Brand Board — Paleta de Colores</H3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', margin: '1.25rem 0' }}>
              {visual.palette.board.map((c) => (
                <div key={c.hex} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', border: '1px solid rgba(var(--fg-rgb),0.1)', flexShrink: 0, background: c.hex }} />
                  <div>
                    <div style={{ fontFamily: "'Josefin Sans',monospace", fontSize: '0.7rem', color: 'var(--fg)' }}>{c.name}</div>
                    <div style={{ fontFamily: "'Josefin Sans',monospace", fontSize: '0.7rem', color: 'rgba(var(--copper-rgb),0.65)' }}>{c.hex}</div>
                  </div>
                </div>
              ))}
            </div>

            <H3 id="d4-tagline">Tagline &amp; Slogan</H3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ padding: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.3)' }}>
                <div style={subLabelStyle}>Tagline</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.3rem', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{identity.tagline}</div>
              </div>
              <div style={{ padding: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.3)' }}>
                <div style={subLabelStyle}>Slogan</div>
                <div style={{ fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'rgba(var(--fg-rgb),0.7)' }}>{identity.slogan}</div>
              </div>
            </div>

            <H3 id="d4-sense">The Sense Square</H3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', margin: '1.5rem 0' }}>
              {visual.senses.map((s) => (
                <div key={s.label} style={{ padding: '1.25rem', border: '1px solid rgba(var(--copper-rgb),0.18)' }}>
                  <h4 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.75rem' }}>{s.label}</h4>
                  <p style={{ ...bodyTextStyle, fontSize: '0.85rem' }}>{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ Driver 5 ═══════════════════════════════════════════════ */}
          <section style={{ ...driverSectionStyle, borderBottom: 'none' }} id="d5">
            <p style={driverLabelStyle}>Driver 05</p>
            <h2 style={driverTitleStyle}>Activación de Marca</h2>

            <H3 id="d5-why">Why We</H3>
            <blockquote style={blockquoteStyle}>{positioning.whyWe}</blockquote>

            <H3 id="d5-narratives">Brand Narratives</H3>
            {positioning.narratives.map((n, i) => (
              <div key={i} style={{ marginBottom: '1.75rem', padding: '1.25rem 1.25rem 1.25rem 1.5rem', borderLeft: '2px solid rgba(var(--copper-rgb),0.3)' }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: '0.8rem', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>{n.title}</div>
                <p style={bodyTextStyle}>{n.body}</p>
              </div>
            ))}

            <H3 id="d5-golden">10 Golden Moments</H3>
            <ul style={{ listStyle: 'none' }}>
              {activation.goldenMoments.map((m, i) => (
                <li key={i} style={{ ...bodyTextStyle, padding: '0.5rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' }}>
                  <span style={{ color: 'var(--copper)', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', marginRight: '0.75rem', letterSpacing: '0.15em' }}>{String(i + 1).padStart(2, '0')}</span>
                  {m}
                </li>
              ))}
            </ul>

            <H3 id="d5-burn">Burn Pyramid — Escalera de Activación</H3>
            {activation.burnPyramid.map((l, i) => (
              <div key={i} style={{ padding: '1.1rem 1.5rem', border: '1px solid rgba(var(--copper-rgb),0.2)', marginBottom: '0.4rem', background: l.bg || 'transparent' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)' }}>{l.tier}</span>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: '0.75rem', color: 'var(--copper)', letterSpacing: '0.06em' }}>{l.action}</span>
                </div>
                <p style={{ ...bodyTextStyle, fontSize: '0.85rem' }}>{l.body}</p>
              </div>
            ))}

            <H3 id="d5-conclusiones">Conclusiones Totales</H3>
            <div style={conclusionBoxStyle}>
              <p style={bodyTextStyle}><strong>{positioning.conclusions.total[0]}</strong></p>
              <p style={bodyTextStyle}>{positioning.conclusions.total[1]}</p>
              <p style={bodyTextStyle}>{positioning.conclusions.total[2]}</p>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function H3({ id, children }) {
  return (
    <h3 id={id} style={{ fontFamily: "'Cinzel',serif", fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--copper)', margin: '2.5rem 0 1rem' }}>
      {children}
    </h3>
  )
}

function QCell({ label, children }) {
  return (
    <div style={{ padding: '1.25rem', border: '1px solid rgba(var(--copper-rgb),0.12)' }}>
      <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper)', display: 'block', marginBottom: '0.6rem' }}>{label}</span>
      <p style={{ fontFamily: "'Basilia',serif", fontSize: '0.9rem', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.75 }}>{children}</p>
    </div>
  )
}

function DocTable({ headers, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.85rem' }}>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--copper)', padding: '0.85rem 1rem', border: '1px solid rgba(var(--copper-rgb),0.3)', textAlign: 'left', background: 'rgba(var(--copper-rgb),0.06)' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ padding: '0.9rem 1rem', border: '1px solid rgba(var(--copper-rgb),0.15)', verticalAlign: 'top', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.7, fontFamily: "'Basilia',serif", background: ri % 2 === 1 ? 'rgba(var(--bg-rgb),0.2)' : 'transparent' }} dangerouslySetInnerHTML={{ __html: cell }} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function VoiceItem({ children }) {
  return (
    <li style={{ fontFamily: "'Basilia',serif", fontSize: '0.9rem', color: 'rgba(var(--fg-rgb),0.7)', padding: '0.35rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' }}>
      {children}
    </li>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const docMetaStyle = { marginTop: '1rem', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)' }
const layoutStyle = { display: 'grid', gridTemplateColumns: '220px 1fr', maxWidth: '1600px', margin: '0 auto' }
const sidebarStyle = { padding: '3rem 1.5rem 3rem 2rem', borderRight: '1px solid rgba(var(--copper-rgb),0.15)', position: 'sticky', top: '60px', height: 'fit-content' }
const sidebarLabelStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.5)', marginBottom: '1rem' }
const sidebarLinkStyle = { display: 'block', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(var(--fg-rgb),0.4)', textDecoration: 'none', padding: '0.3rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.08)', transition: 'color 0.2s' }
const driverLinkStyle = { ...sidebarLinkStyle, color: 'rgba(var(--copper-rgb),0.7)', fontWeight: 600, marginTop: '0.75rem', borderBottom: 'none' }
const contentStyle = { padding: '3rem 2.5rem 6rem' }
const driverSectionStyle = { marginBottom: '5rem', paddingBottom: '5rem', borderBottom: '1px solid rgba(var(--copper-rgb),0.2)' }
const driverLabelStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.75rem' }
const driverTitleStyle = { fontSize: 'clamp(1.3rem,3vw,2rem)', color: 'var(--fg)', marginBottom: '2rem' }
const bodyTextStyle = { fontFamily: "'Basilia',serif", fontSize: '0.9rem', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.75 }
const quadrantStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, margin: '1.5rem 0', border: '1px solid rgba(var(--copper-rgb),0.2)' }
const pyramidLevelStyle = { padding: '1.25rem 1.5rem', border: '1px solid rgba(var(--copper-rgb),0.2)', marginBottom: '0.5rem' }
const pyramidTopStyle = { background: 'rgba(var(--copper-rgb),0.12)', borderColor: 'rgba(var(--copper-rgb),0.4)' }
const pyramidMidStyle = { background: 'rgba(var(--burgundy-rgb),0.1)' }
const pyramidLevelLabelStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)', marginBottom: '0.5rem' }
const blockquoteStyle = { fontFamily: "'IMFell',serif", fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(var(--fg-rgb),0.75)', borderLeft: '2px solid rgba(var(--copper-rgb),0.5)', paddingLeft: '1.25rem', margin: '1.5rem 0' }
const conclusionBoxStyle = { background: 'rgba(var(--copper-rgb),0.05)', border: '1px solid rgba(var(--copper-rgb),0.2)', padding: '1.5rem', margin: '1.5rem 0' }
const h4Style = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.75rem' }
const subLabelStyle = { fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.55)', margin: '0 0 0.75rem' }

