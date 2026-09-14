import { useState, useRef, useEffect } from 'react'
// Matrices MKL de CND y SWD, generadas de sus MKL v3 (bucket MKL) para que los tres
// productos tengan la misma tabla que LMP. LMP conserva la suya, que trae las marcas
// de los competidores resueltas; en estas dos el competidor se identifica por ASIN.
import MKL_CND from '../data/mkl_matrix_cnd.json'
import MKL_SWD from '../data/mkl_matrix_swd.json'
// Títulos reescritos al tope de 75 caracteres + su Item Highlight de 125.
// El MKL mide la cobertura contra ESTOS, no contra el título largo de abajo, que
// quedó obsoleto: por encima de 75 Amazon no muestra el highlight.
import TITULOS_IH from '../data/titulos_ih.json'

const PROD_KEY = { 'skull-lamp': 'LMP', 'skull-candle': 'CND', 'wall-skulls': 'SWD' }

const SECTIONS = [
  { id: 'copy', label: 'Copy' },
  { id: 'keywords', label: 'Keywords' },
  { id: 'competencia', label: 'Competencia' },
  { id: 'sustento', label: 'Sustento' },
  { id: 'campanas', label: 'Campañas' },
]

export default function CopyAds() {
  const [active, setActive] = useState(products[0].id)
  const [activeSection, setActiveSection] = useState('copy')
  const shellRef = useRef(null)
  const p = products.find((x) => x.id === active) || products[0]

  // Reveal-on-scroll. Re-runs when the product changes so newly mounted content animates in.
  useEffect(() => {
    const els = document.querySelectorAll('.copy-shell .reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.06 }
    )
    els.forEach((el) => { el.classList.remove('visible'); obs.observe(el) })
    return () => obs.disconnect()
  }, [active])

  // Scroll-spy: highlight the section nav link for whatever section is in view.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { rootMargin: '-190px 0px -55% 0px', threshold: 0 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [active])

  function selectProduct(id) {
    if (id === active) return
    setActive(id)
    setActiveSection('copy')
    requestAnimationFrame(() => {
      if (!shellRef.current) return
      const y = shellRef.current.getBoundingClientRect().top + window.scrollY - 60
      window.scrollTo({ top: y, behavior: 'smooth' })
    })
  }

  return (
    <>
      <div className="page-header">
        <h1>Copy &amp; Ads</h1>
        <p className="page-subtitle">
          Listing copy + campañas de lanzamiento · keyword research LIVE Helium&nbsp;10 (US, 2026-07-25)
        </p>
      </div>

      <div className="copy-page">
        <div style={introStyle}>
          <div style={eyebrowStyle}>Vitrina · servicio hecho-para-ti · AGTA</div>
          <p style={introBodyStyle}>
            Cada producto lleva el título optimizado, las 5 viñetas, los backend search terms, el mapa de keywords
            con volúmenes reales de Helium&nbsp;10, el set completo de competidores del nicho y la estructura de
            campañas Sponsored Products + Sponsored Brands Video. Copy en inglés listo para Amazon US; los volúmenes
            son search volume mensual real.
          </p>
        </div>

        <div className="copy-shell" ref={shellRef}>
          <div className="copy-sticky">
            <div className="copy-tabs" role="tablist" aria-label="Producto">
              {products.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  role="tab"
                  aria-selected={active === prod.id}
                  className={`copy-tab${active === prod.id ? ' active' : ''}`}
                  onClick={() => selectProduct(prod.id)}
                >
                  <span className="copy-tab-sku">{prod.sku}</span>
                  <span className="copy-tab-name">{prod.name}</span>
                </button>
              ))}
            </div>
            <nav className="copy-secnav" aria-label="Secciones">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={activeSection === s.id ? 'active' : ''}>{s.label}</a>
              ))}
            </nav>
          </div>

          <ProductBlock key={p.id} p={p} />
        </div>
      </div>

      <div className="global-footer">MAVRA — Copy &amp; Ads · <a href="/">Home</a></div>
    </>
  )
}

// ── Product block ─────────────────────────────────────────────────────────────
function ProductBlock({ p }) {
  const mkl = p.id === 'skull-lamp' ? LMP_MKL : p.id === 'skull-candle' ? MKL_CND : p.id === 'wall-skulls' ? MKL_SWD : null
  return (
    <div className="copy-product">

      {/* HERO — Listing preview (el entregable) */}
      <section id="copy" className="copy-section copy-hero reveal">
        <div className="copy-hero-head">
          <div>
            <div style={skuStyle}>{p.sku}</div>
            <h2 style={productTitleStyle}>{p.name}</h2>
          </div>
          <div className="copy-hero-pills">
            <CountPill value={p.title.primary.count} max={200} unit="chars" label="Título" />
            <CountPill value={p.backend.bytes} max={250} unit="bytes" label="Backend" />
          </div>
        </div>
        <p style={oneLinerStyle}>{p.oneLiner}</p>

        <div className="copy-lp">
          <div className="copy-lp-tag">Listing preview · como se ve en Amazon</div>
          <h3 className="copy-lp-title">{p.title.primary.text}</h3>
          <div className="copy-lp-about">About this item</div>
          <ul className="copy-lp-bullets">
            {p.bullets.map((b, i) => (
              <li key={i} className="copy-lp-bullet">
                <span className="copy-lp-bhead">{b.headline}</span>{' '}
                <span className="copy-lp-btext">{b.body}</span>
                {b.note && <span className="copy-lp-note">{b.note}</span>}
              </li>
            ))}
          </ul>
        </div>

        <details className="copy-details">
          <summary>Alternativa keyword-first</summary>
          <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
            <div style={{ ...titleCardTopStyle, marginBottom: '0.75rem' }}>
              <span style={titleCardTagStyle}>{p.title.alt.label}</span>
              <CountPill value={p.title.alt.count} max={200} unit="chars" />
            </div>
            <div style={{ ...titleTextStyle, opacity: 0.85 }}>{p.title.alt.text}</div>
          </div>
        </details>
      </section>

      {/* Keyword + Competencia — MKL chart unificado (LMP) o grid clásico (CND/SWD) */}
      {mkl ? (
        <section id="keywords" className="copy-section reveal">
          <TituloIH k={PROD_KEY[p.id]} />
          <MklChart mkl={mkl} competitors={p.competitors} fields={listingFields(p)} />
          {p.headerRec && (
            <div style={headerRecStyle}>
              <span style={headerRecLabelStyle}>Cabecera recomendada — van en el título</span>
              <p style={headerRecBodyStyle}>{p.headerRec}</p>
            </div>
          )}
          {p.negatives && (
            <div style={negativesStyle}>
              <span style={negLabelStyle}>Negativos permanentes — desde día 1</span>
              <p style={negBodyStyle}>{p.negatives}</p>
            </div>
          )}
          <div className="copy-backend-block">
            <div className="copy-backend-head">
              <span style={titleCardTagStyle}>Backend search terms · sin marca · cero palabras del título</span>
              <CountPill value={p.backend.bytes} max={250} unit="bytes" />
            </div>
            <code style={backendCodeStyle}>{p.backend.text}</code>
          </div>
        </section>
      ) : (
        <div className="copy-grid">
          <section id="keywords" className="copy-section copy-col reveal">
            <SubLabel>Keyword strategy · Helium 10 (US, 2026-07-25)</SubLabel>
            <div className="copy-table-wrap">
              <table className="copy-kw-table">
                <thead>
                  <tr>
                    <th>Keyword</th>
                    <th>Vol H10</th>
                    <th>cp / td</th>
                    <th>Intención</th>
                    <th>Destino</th>
                  </tr>
                </thead>
                <tbody>
                  {p.keywordClusters.map((cluster) => (
                    <ClusterRows key={cluster.label} cluster={cluster} />
                  ))}
                </tbody>
              </table>
            </div>
            {p.headerRec && (
              <div style={headerRecStyle}>
                <span style={headerRecLabelStyle}>Cabecera recomendada — van en el título</span>
                <p style={headerRecBodyStyle}>{p.headerRec}</p>
              </div>
            )}
            {p.negatives && (
              <div style={negativesStyle}>
                <span style={negLabelStyle}>Negativos permanentes — desde día 1</span>
                <p style={negBodyStyle}>{p.negatives}</p>
              </div>
            )}
            <div className="copy-backend-block">
              <div className="copy-backend-head">
                <span style={titleCardTagStyle}>Backend search terms · sin marca · cero palabras del título</span>
                <CountPill value={p.backend.bytes} max={250} unit="bytes" />
              </div>
              <code style={backendCodeStyle}>{p.backend.text}</code>
            </div>
          </section>

          <section id="competencia" className="copy-section copy-col reveal">
            {p.competitors && <Competidores c={p.competitors} />}
          </section>
        </div>
      )}

      {/* SUSTENTO — 3 patas por claim */}
      {p.sustento && (
        <section id="sustento" className="copy-section reveal">
          <Sustento s={p.sustento} />
        </section>
      )}

      {/* CAMPAÑAS */}
      <section id="campanas" className="copy-section reveal">
        <Campanas c={p.campaigns} notes={p.notes} />
      </section>

    </div>
  )
}

// ── Campañas ──────────────────────────────────────────────────────────────────
function Campanas({ c, notes }) {
  return (
    <>
      <SubLabel>Campañas de lanzamiento</SubLabel>
      <p style={{ ...methodologyStyle, maxWidth: '960px' }}>{c.methodology}</p>

      <div style={campGroupLabelStyle}>Sponsored Products — {c.sp.length} campañas</div>
      <div className="copy-camp-list">
        {c.sp.map((camp) => (
          <CampaignCard key={camp.code} c={camp} />
        ))}
      </div>

      <details className="copy-details">
        <summary>Lógica de harvesting — el loop de AdsCrafted</summary>
        <ol style={harvestListStyle}>
          {c.harvesting.map((step, i) => (
            <li key={i} style={harvestItemStyle}>{step}</li>
          ))}
        </ol>
      </details>

      <div style={{ ...campGroupLabelStyle, marginTop: '2rem' }}>Sponsored Brands — Video</div>
      <div className="copy-camp-list">
        {c.sbv.map((camp) => (
          <SbvCard key={camp.code} c={camp} />
        ))}
      </div>

      <div style={budgetBannerStyle}>
        <span style={budgetLabelStyle}>Presupuesto total de lanzamiento</span>
        <span style={budgetValueStyle}>{c.budget}</span>
      </div>

      {notes && (
        <details className="copy-details" style={{ marginTop: '1.5rem' }}>
          <summary>COSMO gap &amp; notas</summary>
          <div style={{ padding: '0.5rem 1.25rem 1.5rem' }}>
            {notes.map((n, i) => (
              <div key={i} style={{ marginTop: '1.1rem' }}>
                <div style={noteHeadStyle}>{n.head}</div>
                <p style={noteBodyStyle}>{n.body}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SubLabel({ children }) {
  return <div style={subLabelStyle}><span style={subLabelLineStyle} />{children}</div>
}

function CountPill({ value, max, unit, label }) {
  const over = value > max
  return (
    <span className={`copy-count${over ? ' over' : ''}`}>
      {label && <span className="copy-count-label">{label}</span>}
      <span className="copy-num">{value}</span>
      <span className="copy-count-max">/ {max} {unit}</span>
    </span>
  )
}

function isTitleDest(dest) {
  return /(^|[^A-Za-z])T([^A-Za-z]|$)/.test(dest)
}

function ClusterRows({ cluster }) {
  return (
    <>
      <tr className="copy-cluster-head">
        <td colSpan={5}>{cluster.label}{cluster.note ? ` — ${cluster.note}` : ''}</td>
      </tr>
      {cluster.rows.map((r, i) => {
        const title = isTitleDest(r.dest)
        return (
          <tr key={i}>
            <td style={{
              fontFamily: "var(--font-sans)",
              fontWeight: title ? 600 : 400,
              color: title ? 'var(--fg)' : 'rgba(var(--fg-rgb),0.72)',
              fontSize: '0.82rem',
              letterSpacing: 0,
            }}>{r.kw}</td>
            <td><span className="copy-num">{r.vol}</span></td>
            <td style={{ color: 'rgba(var(--copper-rgb),0.75)', fontFamily: "var(--font-sans)", fontSize: '0.68rem', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>{r.cptd}</td>
            <td>{r.intent}</td>
            <td style={{ color: title ? 'var(--copper)' : 'rgba(var(--fg-rgb),0.6)', fontFamily: "var(--font-sans)", fontSize: '0.68rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{r.dest}</td>
          </tr>
        )
      })}
    </>
  )
}

function CampaignCard({ c }) {
  return (
    <div className="copy-camp-card">
      <div className="copy-camp-aside">
        <span style={campCodeStyle}>{c.code}</span>
        <span style={campNameStyle}>{c.name}</span>
        {c.tag && <div style={campTagStyle}>{c.tag}</div>}
      </div>
      <div className="copy-camp-body">
        <div className="copy-camp-fields">
          {c.fields.map((f, i) => (
            <div key={i}>
              <span style={campFieldLabelStyle}>{f.label}</span>
              <div style={campFieldValueStyle}>{f.value}</div>
            </div>
          ))}
        </div>
        {c.asins && (
          <div className="copy-camp-asins">
            <span style={campFieldLabelStyle}>ASINs objetivo (LIVE H10)</span>
            <div className="copy-camp-asin-list">
              {c.asins.map((a, i) => (
                <div key={i} style={asinRowStyle}>
                  <span style={asinCodeStyle}>{a.asin}</span>
                  <span style={asinDescStyle}>{a.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SbvCard({ c }) {
  return (
    <div className="copy-camp-card">
      <div className="copy-camp-aside">
        <span style={campCodeStyle}>{c.code}</span>
        <span style={campNameStyle}>{c.name}</span>
        {c.tag && <div style={campTagStyle}>{c.tag}</div>}
      </div>
      <div className="copy-camp-body">
        <div className="copy-camp-fields">
          <div>
            <span style={campFieldLabelStyle}>Keywords</span>
            <div style={campFieldValueStyle}>{c.keywords}</div>
          </div>
          <div>
            <span style={campFieldLabelStyle}>Ángulo del video</span>
            <div style={campFieldValueStyle}>{c.angle}</div>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <span style={campFieldLabelStyle}>Bid</span>
              <div style={campFieldValueStyle}>{c.bid}</div>
            </div>
            <div>
              <span style={campFieldLabelStyle}>Budget</span>
              <div style={campFieldValueStyle}>{c.budget}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Competidores del nicho (set completo H10) ─────────────────────────────────
function tipoKind(token) {
  const t = token.toLowerCase()
  if (/l[íi]der/.test(t)) return 'lider'
  if (/directo/.test(t)) return 'directo'
  if (/sustituto/.test(t)) return 'sustituto'
  if (/adyacente/.test(t)) return 'adyacente'
  if (/conquistable/.test(t)) return 'conquistable'
  return 'default'
}

function TipoChips({ tipo }) {
  const tokens = tipo.split('/').map((s) => s.trim()).filter(Boolean)
  return (
    <span className="copy-comp-chips">
      {tokens.map((tok, i) => (
        <span key={i} className={`copy-comp-chip copy-comp-chip-${tipoKind(tok)}`}>{tok}</span>
      ))}
    </span>
  )
}

function CompRow({ r, isVoc }) {
  return (
    <>
      <tr className={isVoc ? 'copy-comp-main copy-comp-row-voc' : 'copy-comp-main'}>
        <td>
          <div className="copy-comp-brand">{r.brand}</div>
          <div className="copy-comp-title">{r.title}</div>
          <span className="copy-comp-asin">{r.asin}</span>
        </td>
        <td><span className="copy-num">{r.price}</span></td>
        <td><span className="copy-num">{r.sales}</span></td>
        <td><span className="copy-num copy-comp-rev">{r.revenue}</span></td>
        <td>
          <span className="copy-num">{r.reviews}</span>
          {isVoc && (
            <span className="copy-comp-voc" title="Top para VOC — uno de los mayores pools de reseñas del nicho (mina de Voice of Customer)">VOC</span>
          )}
        </td>
        <td><span className="copy-num copy-comp-rating">{r.rating}<span className="copy-comp-star">★</span></span></td>
        <td><TipoChips tipo={r.tipo} /></td>
      </tr>
      <tr className="copy-comp-winrow">
        <td colSpan={7}>
          <span className="copy-comp-win-label">Cómo ganarle</span>
          <span className="copy-comp-win-text">{r.win}</span>
        </td>
      </tr>
    </>
  )
}

function Competidores({ c }) {
  const vocSet = new Set(c.topVoc || [])
  return (
    <>
      <SubLabel>Competencia · Helium 10 (US, 2026-07-25)</SubLabel>
      <p style={compIntroStyle}>
        Set completo del nicho rankeado por revenue mensual (estimado H10, Product Research LIVE). Cada fila lleva
        su tipo competitivo con chip de color y la jugada para ganarle; el badge{' '}
        <span className="copy-comp-voc-inline">VOC</span> marca los pools de reseñas más grandes — la mina de Voice
        of Customer del nicho (el ASIN propio aún tiene 0 reseñas).
      </p>
      <div className="copy-table-wrap">
        <table className="copy-kw-table copy-comp-table">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Precio</th>
              <th>Ventas/mo</th>
              <th>Rev/mo</th>
              <th>Reviews</th>
              <th>Rating</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <CompRow key={r.asin} r={r} isVoc={vocSet.has(r.asin)} />
            ))}
          </tbody>
        </table>
      </div>
      <div style={compSourceStyle}>{c.source}</div>
      {c.footnote && <p className="copy-comp-foot">{c.footnote}</p>}
    </>
  )
}

// ── Sustento de aceptación (A9-A10 · COSMO · VOC) ─────────────────────────────
const PATA_INFO = {
  a910: 'A9-A10 relevancia. A9 es el algoritmo de relevancia de Amazon: cruza el TEXTO del listing (título/viñetas/backend) con las ventas para decidir qué rankea. A10 suma señales de comportamiento (CTR, conversión, tráfico externo). Acá se mide con dato, no con intuición: volumen de búsqueda real de Helium 10, title density (td) = cuántos competidores ponen la keyword en su título (a menor td, más ganable la relevancia de texto) y competing products (cp).',
  cosmo: 'COSMO. El motor semántico de Amazon va más allá del match literal de palabras: entiende el CONTEXTO e intención de la búsqueda y premia el listing cuyo atributo real resuelve esa intención, aunque no repita la palabra exacta. Acá se explica por qué el intent de la query conecta causalmente con un atributo verdadero del producto.',
  voc: 'VOC (Voice of Customer). La cita textual (verbatim) de una reseña REAL de un competidor del nicho que respalda el claim/keyword. Como el ASIN propio aún no tiene reseñas, el VOC es del mercado (2,409 reviews minadas vía Apify, ronda 1 + ronda 2). Si un claim no tiene respaldo, se marca "sin VOC directo" — nunca se inventa una cita.',
}
const PATA_SHORT = {
  a910: 'Volumen + title density + qué competidores rankean/titulan la keyword.',
  cosmo: 'El fit semántico: cómo el intent de la query conecta con el atributo real.',
  voc: 'La cita verbatim REAL de reviews del nicho que respalda el claim.',
}

function InfoDot({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="copy-info">
      <button
        type="button"
        className="copy-info-dot"
        title={text}
        aria-label="Qué es esta pata"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 140)}
      >i</button>
      {open && <span className="copy-info-pop" role="tooltip">{text}</span>}
    </span>
  )
}

function Leg({ tag, cls, info, metrics, text, isVoc, vocNote }) {
  return (
    <div className="copy-sustento-leg">
      <div className="copy-sustento-leg-head">
        <span className={`copy-pata-tag ${cls}`}>{tag}</span>
        <InfoDot text={info} />
      </div>
      {metrics && <div className="copy-sustento-metrics">{metrics}</div>}
      {isVoc
        ? (text
            ? <p className="copy-sustento-voc">{text}</p>
            : (
              <>
                <p className="copy-sustento-novoc">Sin VOC directo</p>
                {vocNote && <p className="copy-sustento-vocnote">{vocNote}</p>}
              </>
            ))
        : <p className="copy-sustento-text">{text}</p>}
    </div>
  )
}

function SustentoCard({ it }) {
  return (
    <div className="copy-sustento-card">
      <div className="copy-sustento-kw">{it.label}</div>
      <div className="copy-sustento-legs">
        <Leg tag="A9-A10" cls="copy-pata-a9" info={PATA_INFO.a910} metrics={it.metrics} text={it.a910} />
        <Leg tag="COSMO" cls="copy-pata-cosmo" info={PATA_INFO.cosmo} text={it.cosmo} />
        <Leg tag="VOC" cls="copy-pata-voc" info={PATA_INFO.voc} text={it.voc} isVoc vocNote={it.vocNote} />
      </div>
    </div>
  )
}

function Sustento({ s }) {
  return (
    <>
      <SubLabel>Sustento de aceptación · A9-A10 · COSMO · VOC</SubLabel>
      <p className="reveal" style={sustentoIntroStyle}>
        La capa de evidencia que sostiene cada keyword del título y cada claim de las viñetas —
        el estándar MKL de #agta-julzen. Cada fila lleva las 3 patas. Tocá el círculo <span style={{ fontStyle: 'italic' }}>i</span> de
        cada pata para ver qué es. Volúmenes = Helium&nbsp;10 LIVE · VOC = citas reales de reviews del nicho (el ASIN propio aún tiene 0 reseñas).
      </p>

      <div className="reveal copy-sustento-legend">
        <div className="copy-sustento-legend-item">
          <span className="copy-pata-tag copy-pata-a9">A9-A10 relevancia</span>
          <InfoDot text={PATA_INFO.a910} />
          <span className="copy-sustento-legend-def">{PATA_SHORT.a910}</span>
        </div>
        <div className="copy-sustento-legend-item">
          <span className="copy-pata-tag copy-pata-cosmo">COSMO</span>
          <InfoDot text={PATA_INFO.cosmo} />
          <span className="copy-sustento-legend-def">{PATA_SHORT.cosmo}</span>
        </div>
        <div className="copy-sustento-legend-item">
          <span className="copy-pata-tag copy-pata-voc">VOC</span>
          <InfoDot text={PATA_INFO.voc} />
          <span className="copy-sustento-legend-def">{PATA_SHORT.voc}</span>
        </div>
      </div>

      <details className="copy-details" open>
        <summary>Sustento por keyword del título — {s.titleKeywords.length}</summary>
        <div className="copy-sustento-body">
          {s.titleKeywords.map((it, i) => <SustentoCard key={i} it={it} />)}
        </div>
      </details>

      <details className="copy-details">
        <summary>Sustento por claim de las viñetas — {s.claims.length}</summary>
        <div className="copy-sustento-body">
          {s.claims.map((it, i) => <SustentoCard key={i} it={it} />)}
        </div>
      </details>
    </>
  )
}

const sustentoIntroStyle = { fontFamily: "var(--font-sans)", fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.6)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '720px' }
const compIntroStyle = { fontFamily: "var(--font-sans)", fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.6)', lineHeight: 1.75, marginBottom: '1.25rem', maxWidth: '720px' }
const compSourceStyle = { marginTop: '0.9rem', fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.7)' }

// ══════════════════════════════════════════════════════════════════════════════
// DATA — verbatim de LMP_COPY_CAMPAIGNS.md · CND_COPY_CAMPAIGNS.md · SWD_COPY_CAMPAIGNS.md
// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// MKL CHART — DataDive-style reverse-ASIN matrix (solo Skull Lamp)
// ══════════════════════════════════════════════════════════════════════════════
const MKL_INFO = {
  reverse: 'Las keywords NACEN de los competidores: unión reverse-ASIN de los 12 competidores del nicho (Helium 10 Cerebro, get_keywords_by_asin). Cada columna es un competidor y cada celda su organic_rank REAL para esa keyword (≤50); "—" = no rankea en el top 50. "Matriz completa" = las 120 kws como filas planas ordenables por cualquier columna (principal, estilo DataDive); "Por root" = las mismas agrupadas por raíz para leer la cosecha por familia.',
  relevancia: 'Relevancia REAL (proxy calculado por AGTA, NO la reportada por terceros): 0.5·cobertura (nº de competidores que rankean /12) + 0.5·calidad de rank (peso por posición). Mide cuánta de la relevancia de texto es realmente ganable.',
  idn: 'IDN — Índice de Demanda del Nicho (proxy): volumen de búsqueda × relevancia. Rankea las keywords por demanda real Y relevancia ganable; es el ordenador de la matriz dentro de cada root.',
  tier: 'Tier (proxy): CORE = cabeza ganable · SEC = secundaria · LONG = cola larga. Se asigna por volumen + relevancia.',
  prioridad: 'Prioridad (proxy): P1 = top 15% por IDN · P2 = siguiente 35% · P3 = el resto. Es el orden de ataque en el lanzamiento.',
  match: 'Match sugerido (proxy): exact / phrase / broad, según nº de palabras, volumen y los hijos del root.',
  n: 'n = de cuántos de los 12 competidores rankea esa keyword (organic_rank ≤ 50). Pocos competidores = keyword más ownable.',
}

const TIER_ABBR = { CORE: 'CORE', SECONDARY: 'SEC', 'LONG-TAIL': 'LONG' }
const TIER_CHIP = { CORE: 'mkl-tier-core', SECONDARY: 'mkl-tier-sec', 'LONG-TAIL': 'mkl-tier-long' }
const TIER_KW = { CORE: 'mkl-kw-core', SECONDARY: 'mkl-kw-sec', 'LONG-TAIL': 'mkl-kw-long' }
const TIER_ORD = { CORE: 0, SECONDARY: 1, 'LONG-TAIL': 2 }
const MATCH_ORD = { exact: 0, phrase: 1, broad: 2 }

// Ordena las filas planas por cualquier columna. key '@ASIN' = ordenar por el rank de ese competidor.
function mklSortRows(rows, sort) {
  const { key, dir } = sort
  const mul = dir === 'asc' ? 1 : -1
  const val = (ch) => {
    if (key === 'kw') return ch.kw
    if (key === 'tier') return TIER_ORD[ch.tier]
    if (key === 'match') return MATCH_ORD[ch.match]
    if (key === 'prio') return ch.prio
    if (key[0] === '@') { const r = ch.ranks[key.slice(1)]; return r == null ? 999 : r }
    return ch[key]
  }
  return [...rows].sort((a, b) => {
    const va = val(a), vb = val(b)
    if (typeof va === 'string') return mul * va.localeCompare(vb)
    return mul * (va - vb)
  })
}

function mklShortBrand(b) {
  return b.split(' ')[0].slice(0, 9)
}

// El título de 75 y su Item Highlight, que es contra lo que el MKL mide T e IH.
function TituloIH({ k }) {
  const t = TITULOS_IH[k]
  if (!t) return null
  return (
    <div className="tih">
      <div className="tih-head">
        <span className="tih-lbl">Título ≤75 + Item Highlight</span>
        <span className="tih-nota">
          Amazon solo muestra el Item Highlight si el título baja de 75 caracteres, y el highlight no puede
          repetir texto del título. Van juntos. El título largo de arriba quedó obsoleto por ese tope.
        </span>
      </div>
      <div className="tih-row">
        <span className="tih-tag">T</span>
        <code>{t.titulo}</code>
        <span className="tih-count">{t.titulo_len}/75</span>
      </div>
      <div className="tih-row">
        <span className="tih-tag">IH</span>
        <code>{t.ih}</code>
        <span className="tih-count">{t.ih_len}/125</span>
      </div>
      <div className="tih-row tih-vivo">
        <span className="tih-tag tih-tag-off">hoy</span>
        <code>{t.vivo_hoy}</code>
        <span className="tih-count">{t.vivo_hoy.length} chars · lo que Amazon tiene vivo</span>
      </div>
    </div>
  )
}

// ── Usage por campo del listing — las columnas T/B/D/GK/IH de DataDive ────────
// Verde = exact (la frase aparece contigua, tal cual) · naranja = broad (están todas
// las palabras pero separadas) · anillo hueco = la variante plural/singular · gris =
// no está en ese campo. Amazon NO hace stemming, así que solo se acepta la variación
// de plural (s/es): `goth` nunca cuenta como `gothic`.
const USAGE_FIELDS = [
  { key: 'T', label: 'Título' },
  { key: 'B', label: 'Viñetas' },
  { key: 'D', label: 'Descripción' },
  { key: 'GK', label: 'Generic Keywords (backend)' },
  { key: 'IH', label: 'Item Highlight' },
]

const usageWords = (s) => (s || '').toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, ' ').split(' ').filter(Boolean)
const usageSing = (w) =>
  w.length > 4 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w

function fieldMatch(kw, text) {
  const hay = usageWords(text)
  const needle = usageWords(kw)
  if (!needle.length || !hay.length) return null
  const contiguo = (cmp) => {
    for (let i = 0; i + needle.length <= hay.length; i++) {
      if (needle.every((w, j) => cmp(w, hay[i + j]))) return true
    }
    return false
  }
  const eq = (a, b) => a === b
  const eqPlr = (a, b) => usageSing(a) === usageSing(b)
  if (contiguo(eq)) return 'exact'
  if (contiguo(eqPlr)) return 'exactplr'
  if (needle.every((w) => hay.some((h) => eq(w, h)))) return 'broad'
  if (needle.every((w) => hay.some((h) => eqPlr(w, h)))) return 'broadplr'
  return null
}

// Los 5 campos indexables, tomados del copy propuesto de este producto.
// D e IH todavía no existen como entregable → se pintan como "sin dato", no como "no está".
function listingFields(p) {
  const t = TITULOS_IH[PROD_KEY[p.id]] || {}
  return {
    T: t.titulo || p.title?.primary?.text || '',
    B: (p.bullets || []).map((b) => `${b.headline} ${b.body}`).join(' '),
    D: p.descripcion || '',
    GK: p.backend?.text || '',
    IH: t.ih || '',
  }
}

const USAGE_WHAT = {
  exact: 'exact — la frase completa está tal cual',
  exactplr: 'exact plural — está contigua, cambia singular/plural',
  broad: 'broad — están todas las palabras, separadas',
  broadplr: 'broad plural — todas las palabras, separadas y con cambio de plural',
}

function UsageCells({ kw, fields }) {
  return (
    <>
      {USAGE_FIELDS.map((f) => {
        const texto = fields ? fields[f.key] : ''
        const m = texto ? fieldMatch(kw, texto) : null
        return (
          <td key={f.key} className="mkl-use-cell">
            <span
              className={`mkl-dot${m ? ' mkl-dot-' + m : ''}${texto ? '' : ' mkl-dot-na'}`}
              title={
                texto
                  ? `${f.label} — ${m ? USAGE_WHAT[m] : 'la keyword no está en este campo'}`
                  : `${f.label} — todavía no hay ${f.label.toLowerCase()} en el copy propuesto, así que no se puede medir`
              }
            />
          </td>
        )
      })}
    </>
  )
}

const USAGE_INFO =
  'Dónde está usada cada keyword dentro del listing, con la misma lectura que DataDive. ' +
  'T = título · B = viñetas · D = descripción · GK = Generic Keywords (los search terms del backend) · ' +
  'IH = Item Highlight (el campo de 125 caracteres que Amazon muestra bajo el título cuando el título baja de 75). ' +
  'Verde = exact, la frase aparece tal cual. Naranja = broad, están todas las palabras pero separadas. ' +
  'El anillo hueco marca que el match es por plural/singular. Gris = no está. ' +
  'El match es literal: Amazon no hace stemming, así que "goth" no cuenta como "gothic". ' +
  'D e IH se ven apagados porque el copy propuesto todavía no los incluye.'

function MklRank({ rank }) {
  if (rank == null) return <span className="mkl-rank-none">—</span>
  let cls = 'mkl-rank-mid'
  if (rank <= 3) cls = 'mkl-rank-top'
  else if (rank <= 10) cls = 'mkl-rank-good'
  return <span className={cls}>{rank}</span>
}

function MklRootGroup({ r, open, onToggle, cols, ncomp, fields }) {
  return (
    <>
      <tr className={`mkl-root${open ? ' open' : ''}`} onClick={onToggle}>
        <td className="mkl-sticky mkl-l-kw mkl-root-c" colSpan={6}>
          <div className="mkl-root-inner">
            <span className="mkl-caret">{open ? '▾' : '▸'}</span>
            <span className="mkl-root-name">{r.root}</span>
            <span className="mkl-root-vol">{r.volume.toLocaleString('en-US')}</span>
            <span className="mkl-root-meta">{r.kids.length}{r.kids.length !== r.n ? '/' + r.n : ''} kw</span>
          </div>
        </td>
        <td className="mkl-root-fill" colSpan={ncomp + USAGE_FIELDS.length} />
      </tr>
      {open && r.kids.map((ch) => (
        <tr key={ch.kw} className="mkl-krow">
          <td className={`mkl-sticky mkl-l-kw mkl-kw ${TIER_KW[ch.tier]}`}>{ch.kw}</td>
          <td className="mkl-sticky mkl-l-vol mkl-num-cell">{ch.vol.toLocaleString('en-US')}</td>
          <td className="mkl-sticky mkl-l-n">
            <span className="mkl-nwrap">
              <span className="mkl-nbar"><span style={{ width: (ch.n / Math.max(ncomp, 1)) * 100 + '%' }} /></span>
              <span className="mkl-nval">{ch.n}</span>
            </span>
          </td>
          <td className="mkl-sticky mkl-l-tier"><span className={`mkl-chip ${TIER_CHIP[ch.tier]}`}>{TIER_ABBR[ch.tier]}</span></td>
          <td className="mkl-sticky mkl-l-prio"><span className={`mkl-chip mkl-prio-${ch.prio.toLowerCase()}`}>{ch.prio}</span></td>
          <td className="mkl-sticky mkl-l-match mkl-shadow"><span className={`mkl-chip mkl-match-${ch.match}`}>{ch.match}</span></td>
          <UsageCells kw={ch.kw} fields={fields} />
          {cols.map((c) => (
            <td key={c.asin} className="mkl-rank-cell"><MklRank rank={ch.ranks[c.asin]} /></td>
          ))}
        </tr>
      ))}
    </>
  )
}

function MklSortTh({ k, sort, onSort, children, className = '', title }) {
  const active = sort.key === k
  return (
    <th
      className={`mkl-th mkl-sortth${active ? ' active' : ''}${className ? ' ' + className : ''}`}
      onClick={() => onSort(k)}
      title={title}
    >
      {children}
      <span className="mkl-sortcaret">{active ? (sort.dir === 'desc' ? '▾' : '▴') : ''}</span>
    </th>
  )
}

// Tabla PRINCIPAL — matriz plana estilo DataDive: 1 fila por keyword, ordenable por cualquier columna.
function MklFlatTable({ rows, cols, sort, onSort, total, fields }) {
  return (
    <div className="mkl-scroll">
      <table className="mkl-table mkl-flat">
        <colgroup>
          <col style={{ width: '200px' }} />
          <col style={{ width: '58px' }} />
          <col style={{ width: '54px' }} />
          <col style={{ width: '54px' }} />
          <col style={{ width: '54px' }} />
          <col style={{ width: '66px' }} />
          <col style={{ width: '56px' }} />
          <col style={{ width: '54px' }} />
          <col style={{ width: '66px' }} />
          {USAGE_FIELDS.map((f) => <col key={f.key} style={{ width: '30px' }} />)}
          {cols.map((c) => <col key={c.asin} style={{ width: '44px' }} />)}
        </colgroup>
        <thead className="mkl-thead">
          <tr>
            <MklSortTh k="kw" sort={sort} onSort={onSort} className="mkl-sticky mkl-l-kw mkl-th-left" title="Keyword. Clic para ordenar A→Z.">Keyword</MklSortTh>
            <MklSortTh k="vol" sort={sort} onSort={onSort} title="Vol — search volume mensual REAL (Helium 10). Cuánta gente busca ese término.">Vol</MklSortTh>
            <MklSortTh k="sales" sort={sort} onSort={onSort} title="Vtas — kw_sales: unidades/semana que el mercado vende por esa keyword (Helium 10). '·' = sin dato.">Vtas</MklSortTh>
            <MklSortTh k="n" sort={sort} onSort={onSort} title={MKL_INFO.n}>n</MklSortTh>
            <MklSortTh k="rel" sort={sort} onSort={onSort} title={MKL_INFO.relevancia}>Rel</MklSortTh>
            <MklSortTh k="idn" sort={sort} onSort={onSort} title={MKL_INFO.idn}>IDN</MklSortTh>
            <MklSortTh k="tier" sort={sort} onSort={onSort} title={MKL_INFO.tier}>Tier</MklSortTh>
            <MklSortTh k="prio" sort={sort} onSort={onSort} title={MKL_INFO.prioridad}>Prio</MklSortTh>
            <MklSortTh k="match" sort={sort} onSort={onSort} className="mkl-shadow" title={MKL_INFO.match}>Match</MklSortTh>
            {USAGE_FIELDS.map((f) => (
              <th key={f.key} className="mkl-th mkl-th-use" title={`${f.label} — ${USAGE_INFO}`}>{f.key}</th>
            ))}
            {cols.map((c) => (
              <th
                key={c.asin}
                className={`mkl-th mkl-th-comp mkl-sortth${sort.key === '@' + c.asin ? ' active' : ''}`}
                onClick={() => onSort('@' + c.asin)}
                title={`${c.brand} · ${c.asin} · rankea en ${c.coverage} kws · click = ordenar por su rank`}
              >
                <span className="mkl-comp-brand">{mklShortBrand(c.brand)}</span>
                <span className="mkl-comp-cov">{c.coverage}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((ch) => (
            <tr key={ch.kw} className="mkl-krow">
              <td className={`mkl-sticky mkl-l-kw mkl-kw ${TIER_KW[ch.tier]}`}>{ch.kw}</td>
              <td className="mkl-num-cell">{ch.vol.toLocaleString('en-US')}</td>
              <td className="mkl-num-cell mkl-vtas">{ch.sales ? ch.sales.toLocaleString('en-US') : '·'}</td>
              <td>
                <span className="mkl-nwrap">
                  <span className="mkl-nbar"><span style={{ width: (ch.n / Math.max(cols.length, 1)) * 100 + '%' }} /></span>
                  <span className="mkl-nval">{ch.n}</span>
                </span>
              </td>
              <td className="mkl-num-cell mkl-rel">{Math.round(ch.rel * 100)}</td>
              <td className="mkl-num-cell mkl-idncell">{ch.idn.toLocaleString('en-US')}</td>
              <td><span className={`mkl-chip ${TIER_CHIP[ch.tier]}`}>{TIER_ABBR[ch.tier]}</span></td>
              <td><span className={`mkl-chip mkl-prio-${ch.prio.toLowerCase()}`}>{ch.prio}</span></td>
              <td className="mkl-shadow"><span className={`mkl-chip mkl-match-${ch.match}`}>{ch.match}</span></td>
              <UsageCells kw={ch.kw} fields={fields} />
              {cols.map((c) => (
                <td key={c.asin} className="mkl-rank-cell"><MklRank rank={ch.ranks[c.asin]} /></td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="mkl-empty" colSpan={9 + USAGE_FIELDS.length + cols.length}>Sin keywords para ese filtro.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function MklChart({ mkl, competitors, fields }) {
  const [q, setQ] = useState('')
  const [tierF, setTierF] = useState(null)
  const [prioF, setPrioF] = useState(null)
  const [soloCore, setSoloCore] = useState(false)
  const [mode, setMode] = useState('flat')
  const [sort, setSort] = useState({ key: 'idn', dir: 'desc' })
  const [collapsed, setCollapsed] = useState(() => {
    const s = new Set()
    mkl.roots.forEach((r, i) => { if (i >= 6) s.add(r.root) })
    return s
  })

  const cols = mkl.competitors
  const meta = {}
  if (competitors && competitors.rows) competitors.rows.forEach((r) => { meta[r.asin] = r })

  const query = q.trim().toLowerCase()
  const effTier = soloCore ? 'CORE' : tierF
  const kwPass = (ch) => {
    if (query && !ch.kw.includes(query)) return false
    if (effTier && ch.tier !== effTier) return false
    if (prioF && ch.prio !== prioF) return false
    return true
  }
  const roots = mkl.roots
    .map((r) => ({ ...r, kids: r.children.filter(kwPass) }))
    .filter((r) => r.kids.length > 0)
  const shown = roots.reduce((s, r) => s + r.kids.length, 0)

  const flatRows = mklSortRows(mkl.roots.flatMap((r) => r.children).filter(kwPass), sort)
  const onSort = (key) =>
    setSort((s) => {
      if (s.key === key) return { key, dir: s.dir === 'desc' ? 'asc' : 'desc' }
      const asc = key === 'kw' || key === 'tier' || key === 'prio' || key === 'match' || key[0] === '@'
      return { key, dir: asc ? 'asc' : 'desc' }
    })

  const toggleRoot = (name) =>
    setCollapsed((prev) => {
      const n = new Set(prev)
      if (n.has(name)) n.delete(name); else n.add(name)
      return n
    })
  const expandAll = () => setCollapsed(new Set())
  const collapseAll = () => setCollapsed(new Set(mkl.roots.map((r) => r.root)))

  const leader = cols[0]
  const isConq = (asin) => {
    const m = meta[asin]
    const rating = m ? parseFloat(m.rating) : NaN
    return !Number.isNaN(rating) && rating <= 4.3
  }

  return (
    <>
      <SubLabel>MKL · matriz reverse-ASIN · Helium 10 Cerebro (US, 2026-07-26)</SubLabel>
      <p className="mkl-intro">
        Las keywords <strong>nacen de los competidores</strong>: unión reverse-ASIN de 12 competidores del nicho.
        Cada columna es un competidor y cada celda su <em>rank orgánico real</em> (≤50). Encima del research crudo,
        AGTA apila los add-ons del estándar MKL — relevancia real, IDN, tier, prioridad y match.
        <InfoDot text={MKL_INFO.reverse} />
      </p>

      <div className="mkl-summary">
        <div className="mkl-stat"><span className="mkl-stat-num">{mkl.totals.keywords}</span><span className="mkl-stat-lbl">keywords</span></div>
        <div className="mkl-stat"><span className="mkl-stat-num">{mkl.totals.roots}</span><span className="mkl-stat-lbl">roots</span></div>
        <div className="mkl-stat"><span className="mkl-stat-num">{mkl.totals.competitors}</span><span className="mkl-stat-lbl">competidores</span></div>
      </div>

      <div id="competencia" className="mkl-cov" style={{ scrollMarginTop: '200px' }}>
        <div className="mkl-cov-head">
          <span className="mkl-cov-title">Cobertura por competidor — quién rankea cuántas de las {mkl.totals.keywords}</span>
          <span className="mkl-cov-note">líder <strong>{leader.brand} {leader.coverage}/{mkl.totals.keywords}</strong> · verde = conquistable (rating ≤ 4.3)</span>
        </div>
        <div className="mkl-cov-grid">
          {cols.map((c) => {
            const m = meta[c.asin]
            const conq = isConq(c.asin)
            const pct = Math.round((c.coverage / mkl.totals.keywords) * 100)
            return (
              <div
                key={c.asin}
                className={`mkl-cov-row${conq ? ' conq' : ''}${c.asin === leader.asin ? ' lead' : ''}`}
                title={`${c.brand} · ${c.asin}${m ? ' · ' + m.rating + '★ · ' + m.tipo : ''} · rankea en ${c.coverage}/${mkl.totals.keywords}`}
              >
                <span className="mkl-cov-brand">{c.brand}</span>
                <span className="mkl-cov-bar"><span style={{ width: pct + '%' }} /></span>
                <span className="mkl-cov-val">{c.coverage}{m && <em> {m.rating}★</em>}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mkl-legend">
        <span className="mkl-legend-lbl">Add-ons MKL</span>
        <span className="mkl-legend-item">relevancia real <InfoDot text={MKL_INFO.relevancia} /></span>
        <span className="mkl-legend-item">IDN <InfoDot text={MKL_INFO.idn} /></span>
        <span className="mkl-legend-item">tier <InfoDot text={MKL_INFO.tier} /></span>
        <span className="mkl-legend-item">prioridad <InfoDot text={MKL_INFO.prioridad} /></span>
        <span className="mkl-legend-item">match <InfoDot text={MKL_INFO.match} /></span>
        <span className="mkl-legend-item">n <InfoDot text={MKL_INFO.n} /></span>
      </div>

      <div className="mkl-legend">
        <span className="mkl-legend-lbl">Uso en el listing</span>
        <span className="mkl-legend-item"><span className="mkl-dot mkl-dot-exact" /> exact</span>
        <span className="mkl-legend-item"><span className="mkl-dot mkl-dot-exactplr" /> exact plural</span>
        <span className="mkl-legend-item"><span className="mkl-dot mkl-dot-broad" /> broad</span>
        <span className="mkl-legend-item"><span className="mkl-dot mkl-dot-broadplr" /> broad plural</span>
        <span className="mkl-legend-item"><span className="mkl-dot" /> no está</span>
        <span className="mkl-legend-item"><span className="mkl-dot mkl-dot-na" /> campo sin escribir</span>
        <span className="mkl-legend-item">T·B·D·GK·IH <InfoDot text={USAGE_INFO} /></span>
      </div>

      <div className="mkl-controls">
        <div className="mkl-modetog" role="tablist" aria-label="Vista de la matriz">
          <button type="button" className={mode === 'flat' ? 'active' : ''} onClick={() => setMode('flat')}>Matriz completa</button>
          <button type="button" className={mode === 'root' ? 'active' : ''} onClick={() => setMode('root')}>Por root</button>
        </div>
        <input
          className="mkl-search"
          type="search"
          value={q}
          placeholder="Buscar keyword…"
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="mkl-fgroup">
          {['CORE', 'SECONDARY', 'LONG-TAIL'].map((t) => (
            <button
              key={t}
              type="button"
              className={`mkl-fchip${tierF === t && !soloCore ? ' active' : ''}`}
              onClick={() => { setSoloCore(false); setTierF(tierF === t ? null : t) }}
            >{TIER_ABBR[t]}</button>
          ))}
        </div>
        <div className="mkl-fgroup">
          {['P1', 'P2', 'P3'].map((pp) => (
            <button
              key={pp}
              type="button"
              className={`mkl-fchip${prioF === pp ? ' active' : ''}`}
              onClick={() => setPrioF(prioF === pp ? null : pp)}
            >{pp}</button>
          ))}
        </div>
        <button
          type="button"
          className={`mkl-fchip solo${soloCore ? ' active' : ''}`}
          onClick={() => { setSoloCore(!soloCore); setTierF(null) }}
        >solo CORE</button>
        <div className="mkl-ctl-right">
          {mode === 'root' && (
            <>
              <button type="button" className="mkl-textbtn" onClick={expandAll}>expandir</button>
              <button type="button" className="mkl-textbtn" onClick={collapseAll}>colapsar</button>
            </>
          )}
          <span className="mkl-count">{shown} / {mkl.totals.keywords}</span>
        </div>
      </div>

      {mode === 'flat' ? (
        <MklFlatTable rows={flatRows} cols={cols} sort={sort} onSort={onSort} total={mkl.totals.keywords} fields={fields} />
      ) : (
      <div className="mkl-scroll">
        <table className="mkl-table">
          <colgroup>
            <col style={{ width: '188px' }} />
            <col style={{ width: '58px' }} />
            <col style={{ width: '52px' }} />
            <col style={{ width: '60px' }} />
            <col style={{ width: '46px' }} />
            <col style={{ width: '62px' }} />
            {USAGE_FIELDS.map((f) => <col key={f.key} style={{ width: '30px' }} />)}
            {cols.map((c) => <col key={c.asin} style={{ width: '44px' }} />)}
          </colgroup>
          <thead className="mkl-thead">
            <tr>
              <th className="mkl-sticky mkl-l-kw mkl-th mkl-th-left">Keyword</th>
              <th className="mkl-sticky mkl-l-vol mkl-th" title="Vol — search volume mensual REAL (Helium 10).">Vol</th>
              <th className="mkl-sticky mkl-l-n mkl-th" title={MKL_INFO.n}>n</th>
              <th className="mkl-sticky mkl-l-tier mkl-th" title={MKL_INFO.tier}>Tier</th>
              <th className="mkl-sticky mkl-l-prio mkl-th" title={MKL_INFO.prioridad}>Prio</th>
              <th className="mkl-sticky mkl-l-match mkl-th mkl-shadow" title={MKL_INFO.match}>Match</th>
              {USAGE_FIELDS.map((f) => (
                <th key={f.key} className="mkl-th mkl-th-use" title={`${f.label} — ${USAGE_INFO}`}>{f.key}</th>
              ))}
              {cols.map((c) => (
                <th
                  key={c.asin}
                  className="mkl-th mkl-th-comp"
                  title={`${c.brand} · ${c.asin} · rankea en ${c.coverage}/${mkl.totals.keywords}`}
                >
                  <span className="mkl-comp-brand">{mklShortBrand(c.brand)}</span>
                  <span className="mkl-comp-cov">{c.coverage}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roots.map((r) => (
              <MklRootGroup
                key={r.root}
                r={r}
                open={!collapsed.has(r.root)}
                onToggle={() => toggleRoot(r.root)}
                cols={cols}
                ncomp={cols.length}
                fields={fields}
              />
            ))}
            {roots.length === 0 && (
              <tr><td className="mkl-empty" colSpan={6 + cols.length}>Sin keywords para ese filtro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      )}
      <div className="mkl-foot">
        Fuente: Helium 10 Cerebro reverse-ASIN (LIVE 2026-07-26). REAL = volumen, rank de competidores, kw_sales · PROXY calculado por AGTA = relevancia, IDN, tier, prioridad, match. 61 keywords quedaron fuera por IDN (cap 120). Rank ≤ 3 resaltado en dorado sólido; ≤ 10 en dorado.
      </div>
    </>
  )
}

// ── MKL DATA (reverse-ASIN matrix) — generado de _copy/LMP_MKL.json · H10 Cerebro LIVE 2026-07-26 ──
// 120 keywords · 29 roots · 12 competidores. 100% del JSON, sin edicion manual.
const LMP_MKL = {"totals":{"keywords":120,"roots":29,"competitors":12},"competitors":[{"asin":"B0C9PV8KTG","brand":"Shandaglo","coverage":99},{"asin":"B0C3714GZ7","brand":"OVANUS","coverage":91},{"asin":"B0DZWTBRJ1","brand":"ehuoyan","coverage":84},{"asin":"B0GFPBVVLQ","brand":"Nomnu","coverage":63},{"asin":"B0CKSBTPWG","brand":"EPPARA","coverage":26},{"asin":"B0G7F5DT8Y","brand":"liveMAX","coverage":19},{"asin":"B0BTB3TC4Z","brand":"Vela Lanterns","coverage":16},{"asin":"B08S6YF1Q2","brand":"Tradeopia","coverage":7},{"asin":"B0H1NVL75G","brand":"YR YRHH-PET","coverage":4},{"asin":"B0CY1ZFZ9Q","brand":"YYZZH","coverage":3},{"asin":"B0CR45Z9D9","brand":"YYZZH","coverage":2},{"asin":"B0DBJ8L3CB","brand":"Suck UK","coverage":1}],"roots":[{"root":"gothic decor","volume":50389,"n":22,"children":[{"kw":"gothic decor","vol":22073,"sales":130,"n":3,"avg":18,"best":5,"rel":0.475,"idn":10485,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0GFPBVVLQ":5,"B0DZWTBRJ1":9,"B0BTB3TC4Z":40}},{"kw":"gothic home decor","vol":8940,"sales":35,"n":3,"avg":19.7,"best":13,"rel":0.417,"idn":3728,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0DZWTBRJ1":13,"B0GFPBVVLQ":14,"B0C9PV8KTG":32}},{"kw":"gothic room decor","vol":3214,"sales":13,"n":4,"avg":27.5,"best":11,"rel":0.392,"idn":1260,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0GFPBVVLQ":11,"B0C9PV8KTG":18,"B0C3714GZ7":38,"B0DZWTBRJ1":43}},{"kw":"gothic bedroom decor","vol":2893,"sales":14,"n":3,"avg":24,"best":21,"rel":0.35,"idn":1013,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0DZWTBRJ1":21,"B0C3714GZ7":23,"B0C9PV8KTG":28}},{"kw":"gothic decor for home","vol":1261,"sales":1,"n":4,"avg":14,"best":1,"rel":0.535,"idn":675,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":1,"B0DZWTBRJ1":15,"B0C3714GZ7":20,"B0C9PV8KTG":20}},{"kw":"gothic halloween decor","vol":1615,"sales":2,"n":3,"avg":29,"best":16,"rel":0.35,"idn":565,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0DZWTBRJ1":16,"B0C9PV8KTG":31,"B0C3714GZ7":40}},{"kw":"gothic office decor","vol":1615,"sales":10,"n":3,"avg":31.3,"best":24,"rel":0.317,"idn":512,"tier":"SECONDARY","prio":"P2","match":"phrase","ranks":{"B0C9PV8KTG":24,"B0DZWTBRJ1":32,"B0C3714GZ7":38}},{"kw":"gothic decor for bedroom","vol":988,"sales":1,"n":3,"avg":23,"best":4,"rel":0.408,"idn":403,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0DZWTBRJ1":4,"B0C9PV8KTG":25,"B0C3714GZ7":40}},{"kw":"gothic house decor","vol":669,"sales":1,"n":3,"avg":23.3,"best":5,"rel":0.442,"idn":296,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":5,"B0DZWTBRJ1":15,"B0C9PV8KTG":50}},{"kw":"victorian gothic decor","vol":892,"sales":1,"n":2,"avg":33,"best":18,"rel":0.308,"idn":275,"tier":"SECONDARY","prio":"P2","match":"phrase","ranks":{"B0C9PV8KTG":18,"B0DZWTBRJ1":48}},{"kw":"gothic desk decor","vol":659,"sales":4,"n":4,"avg":27.5,"best":9,"rel":0.417,"idn":275,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":9,"B0C9PV8KTG":30,"B0C3714GZ7":34,"B0DZWTBRJ1":37}},{"kw":"gothic table decor","vol":573,"sales":4,"n":4,"avg":18,"best":12,"rel":0.467,"idn":268,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0DZWTBRJ1":12,"B0C3714GZ7":19,"B0C9PV8KTG":20,"B0GFPBVVLQ":21}},{"kw":"dark gothic decor","vol":504,"sales":0,"n":3,"avg":12.7,"best":3,"rel":0.508,"idn":256,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0DZWTBRJ1":3,"B0C9PV8KTG":15,"B0C3714GZ7":20}},{"kw":"gothic bookshelf decor","vol":541,"sales":1,"n":4,"avg":22.5,"best":5,"rel":0.46,"idn":249,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0DZWTBRJ1":5,"B0GFPBVVLQ":13,"B0C3714GZ7":32,"B0C9PV8KTG":40}},{"kw":"gothic living room decor","vol":615,"sales":1,"n":2,"avg":22.5,"best":1,"rel":0.396,"idn":244,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":1,"B0C9PV8KTG":44}},{"kw":"gothic shelf decor","vol":561,"sales":3,"n":3,"avg":21.3,"best":8,"rel":0.417,"idn":234,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":8,"B0DZWTBRJ1":26,"B0C3714GZ7":30}},{"kw":"gothic victorian decor","vol":568,"sales":1,"n":2,"avg":22,"best":10,"rel":0.408,"idn":232,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0C9PV8KTG":10,"B0DZWTBRJ1":34}},{"kw":"gothic room decor for bedroom","vol":647,"sales":1,"n":3,"avg":33,"best":30,"rel":0.35,"idn":226,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":30,"B0DZWTBRJ1":34,"B0C9PV8KTG":35}},{"kw":"halloween gothic decor","vol":519,"sales":1,"n":4,"avg":28.8,"best":5,"rel":0.41,"idn":213,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":5,"B0C9PV8KTG":26,"B0C3714GZ7":41,"B0DZWTBRJ1":43}},{"kw":"gothic library decor","vol":502,"sales":1,"n":3,"avg":20.7,"best":12,"rel":0.417,"idn":209,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":12,"B0DZWTBRJ1":20,"B0C9PV8KTG":30}},{"kw":"gothic home decor aesthetic","vol":485,"sales":1,"n":4,"avg":27.2,"best":6,"rel":0.417,"idn":202,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":6,"B0C9PV8KTG":19,"B0C3714GZ7":42,"B0DZWTBRJ1":42}},{"kw":"gothic furniture and decor","vol":55,"sales":0,"n":4,"avg":32,"best":1,"rel":0.385,"idn":21,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":1,"B0DZWTBRJ1":38,"B0C9PV8KTG":42,"B0BTB3TC4Z":47}}]},{"root":"goth decor","volume":18482,"n":14,"children":[{"kw":"goth decor","vol":4588,"sales":33,"n":3,"avg":11.7,"best":5,"rel":0.508,"idn":2331,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0GFPBVVLQ":5,"B0DZWTBRJ1":12,"B0C9PV8KTG":18}},{"kw":"goth room decor","vol":2979,"sales":11,"n":4,"avg":18.5,"best":6,"rel":0.467,"idn":1391,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0GFPBVVLQ":6,"B0C3714GZ7":15,"B0C9PV8KTG":16,"B0DZWTBRJ1":37}},{"kw":"goth home decor","vol":2536,"sales":2,"n":4,"avg":18,"best":3,"rel":0.504,"idn":1278,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0DZWTBRJ1":3,"B0GFPBVVLQ":5,"B0C9PV8KTG":23,"B0C3714GZ7":41}},{"kw":"whimsy goth decor","vol":1679,"sales":1,"n":4,"avg":30.5,"best":3,"rel":0.41,"idn":688,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0BTB3TC4Z":3,"B0C3714GZ7":27,"B0C9PV8KTG":43,"B0DZWTBRJ1":49}},{"kw":"goth bedroom decor","vol":1170,"sales":1,"n":2,"avg":27,"best":19,"rel":0.358,"idn":419,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0C3714GZ7":19,"B0C9PV8KTG":35}},{"kw":"goth decor home","vol":740,"sales":1,"n":4,"avg":17.5,"best":8,"rel":0.492,"idn":364,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":8,"B0DZWTBRJ1":15,"B0C9PV8KTG":20,"B0C3714GZ7":27}},{"kw":"goth office decor","vol":890,"sales":1,"n":3,"avg":35.7,"best":32,"rel":0.317,"idn":282,"tier":"SECONDARY","prio":"P2","match":"phrase","ranks":{"B0C3714GZ7":32,"B0C9PV8KTG":34,"B0DZWTBRJ1":41}},{"kw":"goth house decor","vol":639,"sales":1,"n":3,"avg":29.3,"best":7,"rel":0.383,"idn":245,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":7,"B0DZWTBRJ1":34,"B0C3714GZ7":47}},{"kw":"goth halloween decor","vol":519,"sales":0,"n":4,"avg":26.2,"best":1,"rel":0.435,"idn":226,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":1,"B0DZWTBRJ1":29,"B0C9PV8KTG":35,"B0C3714GZ7":40}},{"kw":"goth decor bedroom","vol":580,"sales":1,"n":3,"avg":24.7,"best":19,"rel":0.383,"idn":222,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":19,"B0C9PV8KTG":21,"B0DZWTBRJ1":34}},{"kw":"goth desk decor","vol":534,"sales":2,"n":3,"avg":25.7,"best":6,"rel":0.383,"idn":205,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":6,"B0C9PV8KTG":28,"B0C3714GZ7":43}},{"kw":"whimsical goth decor","vol":583,"sales":0,"n":2,"avg":27,"best":15,"rel":0.308,"idn":180,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":15,"B0DZWTBRJ1":39}},{"kw":"goth living room decor","vol":504,"sales":1,"n":3,"avg":34,"best":27,"rel":0.283,"idn":143,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":27,"B0C3714GZ7":37,"B0DZWTBRJ1":38}},{"kw":"goth room decor for bedroom","vol":541,"sales":0,"n":2,"avg":36.5,"best":25,"rel":0.258,"idn":140,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":25,"B0DZWTBRJ1":48}}]},{"root":"halloween lamp","volume":11297,"n":3,"children":[{"kw":"halloween lamp","vol":10203,"sales":44,"n":3,"avg":19.7,"best":7,"rel":0.45,"idn":4591,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0GFPBVVLQ":7,"B0C3714GZ7":10,"B0C9PV8KTG":42}},{"kw":"halloween table lamp","vol":743,"sales":1,"n":3,"avg":14.7,"best":4,"rel":0.475,"idn":353,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0C3714GZ7":4,"B0C9PV8KTG":11,"B0GFPBVVLQ":29}},{"kw":"halloween desk lamp","vol":351,"sales":0,"n":5,"avg":23.4,"best":6,"rel":0.493,"idn":173,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":6,"B0GFPBVVLQ":14,"B0C3714GZ7":16,"B0DZWTBRJ1":33,"B0G7F5DT8Y":48}}]},{"root":"halloween (otros)","volume":9804,"n":5,"children":[{"kw":"halloween lamps","vol":5050,"sales":20,"n":2,"avg":9.5,"best":9,"rel":0.508,"idn":2565,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0C3714GZ7":9,"B0GFPBVVLQ":10}},{"kw":"halloween candle holder","vol":2979,"sales":23,"n":2,"avg":17,"best":13,"rel":0.358,"idn":1066,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0GFPBVVLQ":13,"B0DZWTBRJ1":21}},{"kw":"halloween candle holders","vol":671,"sales":5,"n":2,"avg":28.5,"best":9,"rel":0.358,"idn":240,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":9,"B0DZWTBRJ1":48}},{"kw":"halloween crows and ravens decor","vol":642,"sales":5,"n":3,"avg":26.7,"best":21,"rel":0.35,"idn":225,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0DZWTBRJ1":21,"B0C3714GZ7":26,"B0C9PV8KTG":33}},{"kw":"halloween 3 wick candle holder","vol":462,"sales":0,"n":2,"avg":25,"best":8,"rel":0.358,"idn":165,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0BTB3TC4Z":8,"B0DZWTBRJ1":42}}]},{"root":"witch lamp","volume":7839,"n":5,"children":[{"kw":"witch lamp","vol":5718,"sales":24,"n":4,"avg":32.2,"best":16,"rel":0.392,"idn":2241,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0C9PV8KTG":16,"B0GFPBVVLQ":20,"B0C3714GZ7":44,"B0DZWTBRJ1":49}},{"kw":"witch table lamp","vol":617,"sales":1,"n":2,"avg":19,"best":3,"rel":0.446,"idn":275,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0C3714GZ7":3,"B0C9PV8KTG":35}},{"kw":"witch light lamp","vol":507,"sales":0,"n":2,"avg":19.5,"best":10,"rel":0.408,"idn":207,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":10,"B0C9PV8KTG":29}},{"kw":"3d witch lamp","vol":625,"sales":1,"n":2,"avg":33,"best":32,"rel":0.308,"idn":192,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":32,"B0C9PV8KTG":34}},{"kw":"cracker barrel witch lamp","vol":372,"sales":4,"n":3,"avg":18.3,"best":9,"rel":0.45,"idn":167,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":9,"B0C3714GZ7":11,"B0GFPBVVLQ":35}}]},{"root":"gothic lamp","volume":6994,"n":6,"children":[{"kw":"gothic lamp","vol":4143,"sales":18,"n":5,"avg":20.4,"best":4,"rel":0.508,"idn":2105,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0GFPBVVLQ":4,"B0C3714GZ7":12,"B0C9PV8KTG":14,"B0DZWTBRJ1":27,"B0BTB3TC4Z":45}},{"kw":"gothic desk lamp","vol":612,"sales":2,"n":4,"avg":13,"best":1,"rel":0.573,"idn":351,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0C9PV8KTG":1,"B0C3714GZ7":4,"B0GFPBVVLQ":5,"B0CKSBTPWG":42}},{"kw":"gothic floor lamp","vol":1612,"sales":1,"n":2,"avg":37,"best":36,"rel":0.208,"idn":335,"tier":"SECONDARY","prio":"P2","match":"phrase","ranks":{"B0GFPBVVLQ":36,"B0C9PV8KTG":38}},{"kw":"gothic standing lamp","vol":475,"sales":0,"n":2,"avg":28,"best":25,"rel":0.308,"idn":146,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":25,"B0C9PV8KTG":31}},{"kw":"bat lamp gothic","vol":119,"sales":0,"n":4,"avg":11.5,"best":7,"rel":0.542,"idn":64,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":7,"B0G7F5DT8Y":8,"B0C9PV8KTG":14,"B0DZWTBRJ1":17}},{"kw":"gothic bat lamp","vol":33,"sales":0,"n":4,"avg":19.8,"best":14,"rel":0.442,"idn":15,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":14,"B0C9PV8KTG":15,"B0G7F5DT8Y":21,"B0GFPBVVLQ":29}}]},{"root":"raven (otros)","volume":5801,"n":9,"children":[{"kw":"raven decor","vol":2553,"sales":19,"n":3,"avg":8.7,"best":5,"rel":0.542,"idn":1384,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0DZWTBRJ1":5,"B0C3714GZ7":8,"B0C9PV8KTG":13}},{"kw":"raven statue","vol":1170,"sales":8,"n":3,"avg":35.7,"best":27,"rel":0.317,"idn":371,"tier":"SECONDARY","prio":"P2","match":"phrase","ranks":{"B0C9PV8KTG":27,"B0DZWTBRJ1":34,"B0C3714GZ7":46}},{"kw":"raven halloween decor","vol":448,"sales":1,"n":3,"avg":15,"best":8,"rel":0.45,"idn":202,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0DZWTBRJ1":8,"B0C9PV8KTG":13,"B0C3714GZ7":24}},{"kw":"raven candle holder","vol":492,"sales":3,"n":2,"avg":20.5,"best":6,"rel":0.408,"idn":201,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0DZWTBRJ1":6,"B0C9PV8KTG":35}},{"kw":"black raven decor","vol":443,"sales":4,"n":3,"avg":21.7,"best":11,"rel":0.383,"idn":170,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0DZWTBRJ1":11,"B0C9PV8KTG":22,"B0C3714GZ7":32}},{"kw":"raven decorations","vol":330,"sales":0,"n":3,"avg":16.3,"best":13,"rel":0.45,"idn":148,"tier":"SECONDARY","prio":"P3","match":"phrase","ranks":{"B0DZWTBRJ1":13,"B0C3714GZ7":17,"B0C9PV8KTG":19}},{"kw":"raven decor for home","vol":191,"sales":0,"n":4,"avg":13.8,"best":2,"rel":0.529,"idn":101,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0DZWTBRJ1":2,"B0C9PV8KTG":3,"B0C3714GZ7":12,"B0CKSBTPWG":38}},{"kw":"raven lamps","vol":113,"sales":0,"n":4,"avg":14.2,"best":1,"rel":0.529,"idn":60,"tier":"LONG-TAIL","prio":"P3","match":"phrase","ranks":{"B0C3714GZ7":1,"B0C9PV8KTG":3,"B0CKSBTPWG":17,"B0DZWTBRJ1":36}},{"kw":"raven lantern","vol":61,"sales":0,"n":5,"avg":15.2,"best":7,"rel":0.533,"idn":33,"tier":"CORE","prio":"P3","match":"phrase","ranks":{"B0C3714GZ7":7,"B0C9PV8KTG":8,"B0BTB3TC4Z":14,"B0DZWTBRJ1":21,"B0CKSBTPWG":26}}]},{"root":"crow (otros)","volume":5461,"n":6,"children":[{"kw":"crow decor","vol":2549,"sales":14,"n":3,"avg":10.3,"best":6,"rel":0.517,"idn":1318,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0DZWTBRJ1":6,"B0C3714GZ7":8,"B0C9PV8KTG":17}},{"kw":"crow light","vol":647,"sales":7,"n":3,"avg":2.7,"best":1,"rel":0.625,"idn":404,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0C3714GZ7":1,"B0C9PV8KTG":3,"B0CKSBTPWG":4}},{"kw":"crow decorations","vol":561,"sales":8,"n":3,"avg":17.3,"best":10,"rel":0.45,"idn":252,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0DZWTBRJ1":10,"B0C3714GZ7":19,"B0C9PV8KTG":23}},{"kw":"crow candle holder","vol":610,"sales":1,"n":2,"avg":23,"best":19,"rel":0.358,"idn":218,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0DZWTBRJ1":19,"B0C3714GZ7":27}},{"kw":"crow halloween decor","vol":504,"sales":1,"n":3,"avg":21.7,"best":20,"rel":0.383,"idn":193,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0DZWTBRJ1":20,"B0C9PV8KTG":22,"B0C3714GZ7":23}},{"kw":"crow figurine","vol":590,"sales":7,"n":2,"avg":33.5,"best":23,"rel":0.258,"idn":152,"tier":"SECONDARY","prio":"P3","match":"phrase","ranks":{"B0DZWTBRJ1":23,"B0C3714GZ7":44}}]},{"root":"gothic (otros)","volume":5052,"n":10,"children":[{"kw":"gothic lamps","vol":991,"sales":3,"n":7,"avg":23.6,"best":2,"rel":0.595,"idn":590,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0C9PV8KTG":2,"B0GFPBVVLQ":5,"B0C3714GZ7":15,"B0DZWTBRJ1":20,"B0CKSBTPWG":32,"B0G7F5DT8Y":44,"B0BTB3TC4Z":47}},{"kw":"gothic desk accessories","vol":1261,"sales":6,"n":2,"avg":37.5,"best":35,"rel":0.258,"idn":325,"tier":"SECONDARY","prio":"P2","match":"phrase","ranks":{"B0C9PV8KTG":35,"B0C3714GZ7":40}},{"kw":"gothic lighting","vol":553,"sales":1,"n":4,"avg":19.8,"best":3,"rel":0.504,"idn":279,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0C9PV8KTG":3,"B0C3714GZ7":4,"B0BTB3TC4Z":34,"B0DZWTBRJ1":38}},{"kw":"gothic decorations","vol":553,"sales":1,"n":2,"avg":13,"best":9,"rel":0.458,"idn":253,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0C9PV8KTG":9,"B0DZWTBRJ1":17}},{"kw":"gothic candle holders","vol":485,"sales":1,"n":3,"avg":15.3,"best":6,"rel":0.45,"idn":218,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":6,"B0DZWTBRJ1":12,"B0BTB3TC4Z":28}},{"kw":"gothic candle","vol":485,"sales":1,"n":3,"avg":19.7,"best":5,"rel":0.442,"idn":214,"tier":"SECONDARY","prio":"P3","match":"phrase","ranks":{"B0DZWTBRJ1":5,"B0GFPBVVLQ":15,"B0BTB3TC4Z":39}},{"kw":"gothic lights","vol":453,"sales":1,"n":4,"avg":24.5,"best":16,"rel":0.417,"idn":189,"tier":"SECONDARY","prio":"P3","match":"phrase","ranks":{"B0C9PV8KTG":16,"B0C3714GZ7":23,"B0DZWTBRJ1":25,"B0CKSBTPWG":34}},{"kw":"gothic lamps for bedrooms","vol":174,"sales":0,"n":6,"avg":14.8,"best":4,"rel":0.587,"idn":102,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0G7F5DT8Y":4,"B0C9PV8KTG":11,"B0GFPBVVLQ":12,"B0C3714GZ7":15,"B0BTB3TC4Z":16,"B0DZWTBRJ1":31}},{"kw":"raven gothic lantern","vol":56,"sales":0,"n":4,"avg":13.5,"best":8,"rel":0.542,"idn":30,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":8,"B0DZWTBRJ1":9,"B0C3714GZ7":10,"B0CKSBTPWG":27}},{"kw":"gothic table lamps","vol":41,"sales":0,"n":7,"avg":14.9,"best":5,"rel":0.656,"idn":27,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":5,"B0C9PV8KTG":9,"B0C3714GZ7":10,"B0G7F5DT8Y":15,"B0BTB3TC4Z":16,"B0CKSBTPWG":17,"B0DZWTBRJ1":32}}]},{"root":"crow lamp","volume":2845,"n":5,"children":[{"kw":"crow lamp","vol":1679,"sales":14,"n":3,"avg":3.3,"best":1,"rel":0.6,"idn":1007,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0C3714GZ7":1,"B0C9PV8KTG":2,"B0CKSBTPWG":7}},{"kw":"crow lamp holding light bulb","vol":526,"sales":6,"n":4,"avg":10,"best":2,"rel":0.554,"idn":291,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0C9PV8KTG":2,"B0C3714GZ7":3,"B0CKSBTPWG":11,"B0DZWTBRJ1":24}},{"kw":"crow table lamp","vol":321,"sales":0,"n":3,"avg":4.7,"best":1,"rel":0.567,"idn":182,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":1,"B0C9PV8KTG":2,"B0CKSBTPWG":11}},{"kw":"crow light lamp","vol":219,"sales":0,"n":4,"avg":14.8,"best":1,"rel":0.573,"idn":125,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":1,"B0C9PV8KTG":3,"B0CKSBTPWG":5,"B0DZWTBRJ1":50}},{"kw":"black crow lamp","vol":100,"sales":0,"n":4,"avg":3.8,"best":1,"rel":0.648,"idn":65,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":1,"B0CKSBTPWG":3,"B0C3714GZ7":5,"B0DZWTBRJ1":6}}]},{"root":"skeleton lamp","volume":2827,"n":4,"children":[{"kw":"skeleton lamp","vol":1895,"sales":5,"n":5,"avg":14.4,"best":5,"rel":0.568,"idn":1076,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0C9PV8KTG":5,"B0GFPBVVLQ":6,"B0C3714GZ7":12,"B0H1NVL75G":20,"B0G7F5DT8Y":29}},{"kw":"skeleton floor lamp","vol":632,"sales":1,"n":4,"avg":11.2,"best":2,"rel":0.579,"idn":366,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":2,"B0C9PV8KTG":5,"B0C3714GZ7":8,"B0CKSBTPWG":30}},{"kw":"skeleton lamp floor","vol":266,"sales":0,"n":4,"avg":10,"best":2,"rel":0.554,"idn":147,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":2,"B0C9PV8KTG":5,"B0C3714GZ7":12,"B0CKSBTPWG":21}},{"kw":"skeleton lamps","vol":34,"sales":0,"n":6,"avg":15.7,"best":4,"rel":0.604,"idn":21,"tier":"CORE","prio":"P3","match":"phrase","ranks":{"B0GFPBVVLQ":4,"B0C9PV8KTG":7,"B0H1NVL75G":10,"B0G7F5DT8Y":11,"B0C3714GZ7":15,"B0CKSBTPWG":47}}]},{"root":"goth (otros)","volume":2390,"n":4,"children":[{"kw":"goth lamps","vol":615,"sales":1,"n":4,"avg":12,"best":1,"rel":0.579,"idn":356,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0GFPBVVLQ":1,"B0C9PV8KTG":5,"B0C3714GZ7":9,"B0G7F5DT8Y":33}},{"kw":"goth desk accessories","vol":991,"sales":8,"n":2,"avg":33,"best":32,"rel":0.308,"idn":305,"tier":"SECONDARY","prio":"P2","match":"phrase","ranks":{"B0C9PV8KTG":32,"B0C3714GZ7":34}},{"kw":"goth decorations","vol":519,"sales":0,"n":3,"avg":36.7,"best":23,"rel":0.283,"idn":147,"tier":"SECONDARY","prio":"P3","match":"phrase","ranks":{"B0C3714GZ7":23,"B0C9PV8KTG":42,"B0DZWTBRJ1":45}},{"kw":"goth lights","vol":265,"sales":0,"n":4,"avg":21.8,"best":9,"rel":0.442,"idn":117,"tier":"SECONDARY","prio":"P3","match":"phrase","ranks":{"B0C3714GZ7":9,"B0C9PV8KTG":16,"B0GFPBVVLQ":23,"B0CKSBTPWG":39}}]},{"root":"raven lamp","volume":2211,"n":3,"children":[{"kw":"raven lamp","vol":1892,"sales":17,"n":4,"avg":12.2,"best":1,"rel":0.535,"idn":1012,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0C3714GZ7":1,"B0C9PV8KTG":6,"B0CKSBTPWG":17,"B0DZWTBRJ1":25}},{"kw":"raven wall lamp","vol":230,"sales":0,"n":4,"avg":18.8,"best":3,"rel":0.51,"idn":117,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0CKSBTPWG":3,"B0C3714GZ7":6,"B0C9PV8KTG":16,"B0DZWTBRJ1":50}},{"kw":"raven table lamp","vol":89,"sales":0,"n":4,"avg":7.8,"best":1,"rel":0.598,"idn":53,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":1,"B0C9PV8KTG":2,"B0CKSBTPWG":5,"B0DZWTBRJ1":23}}]},{"root":"goth lamp","volume":1766,"n":3,"children":[{"kw":"goth lamp","vol":1175,"sales":1,"n":5,"avg":19.6,"best":6,"rel":0.513,"idn":603,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0GFPBVVLQ":6,"B0C9PV8KTG":13,"B0C3714GZ7":16,"B0BTB3TC4Z":19,"B0DZWTBRJ1":44}},{"kw":"goth floor lamp","vol":548,"sales":0,"n":2,"avg":23,"best":19,"rel":0.358,"idn":196,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0CKSBTPWG":19,"B0GFPBVVLQ":27}},{"kw":"goth desk lamp","vol":43,"sales":0,"n":5,"avg":13.8,"best":1,"rel":0.583,"idn":25,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":1,"B0C3714GZ7":5,"B0GFPBVVLQ":7,"B0CKSBTPWG":22,"B0DZWTBRJ1":34}}]},{"root":"skull lamp","volume":1615,"n":1,"children":[{"kw":"skull lamp","vol":1615,"sales":4,"n":5,"avg":19,"best":1,"rel":0.508,"idn":820,"tier":"CORE","prio":"P1","match":"phrase","ranks":{"B0GFPBVVLQ":1,"B0C9PV8KTG":12,"B0G7F5DT8Y":23,"B0C3714GZ7":25,"B08S6YF1Q2":34}}]},{"root":"skull (otros)","volume":1608,"n":5,"children":[{"kw":"skull lamps","vol":448,"sales":0,"n":5,"avg":19.6,"best":4,"rel":0.508,"idn":228,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0GFPBVVLQ":4,"B0G7F5DT8Y":11,"B0C9PV8KTG":12,"B0C3714GZ7":34,"B08S6YF1Q2":37}},{"kw":"skull candle holder","vol":531,"sales":0,"n":2,"avg":21,"best":3,"rel":0.396,"idn":210,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":3,"B0DZWTBRJ1":39}},{"kw":"skull lights","vol":406,"sales":0,"n":3,"avg":28.3,"best":3,"rel":0.408,"idn":166,"tier":"SECONDARY","prio":"P3","match":"phrase","ranks":{"B0GFPBVVLQ":3,"B08S6YF1Q2":34,"B0G7F5DT8Y":48}},{"kw":"skull lamps for adults","vol":153,"sales":0,"n":4,"avg":26.8,"best":3,"rel":0.41,"idn":63,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":3,"B0G7F5DT8Y":23,"B0DBJ8L3CB":39,"B0CY1ZFZ9Q":42}},{"kw":"skull lamps for nightstand","vol":70,"sales":0,"n":7,"avg":21,"best":2,"rel":0.595,"idn":42,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":2,"B0G7F5DT8Y":5,"B0CY1ZFZ9Q":19,"B0C9PV8KTG":23,"B08S6YF1Q2":26,"B0CR45Z9D9":27,"B0C3714GZ7":45}}]},{"root":"gothic candle holder","volume":1259,"n":1,"children":[{"kw":"gothic candle holder","vol":1259,"sales":7,"n":3,"avg":17,"best":8,"rel":0.45,"idn":567,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":8,"B0DZWTBRJ1":11,"B0BTB3TC4Z":32}}]},{"root":"bat lamp","volume":988,"n":1,"children":[{"kw":"bat lamp","vol":988,"sales":6,"n":4,"avg":23.8,"best":6,"rel":0.442,"idn":437,"tier":"CORE","prio":"P2","match":"phrase","ranks":{"B0G7F5DT8Y":6,"B0C3714GZ7":20,"B0C9PV8KTG":21,"B0DZWTBRJ1":48}}]},{"root":"gothic table lamp","volume":708,"n":2,"children":[{"kw":"gothic table lamp","vol":671,"sales":6,"n":4,"avg":22,"best":7,"rel":0.467,"idn":313,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0GFPBVVLQ":7,"B0C3714GZ7":8,"B0C9PV8KTG":26,"B0DZWTBRJ1":47}},{"kw":"table lamp gothic","vol":37,"sales":0,"n":6,"avg":16,"best":2,"rel":0.604,"idn":22,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0G7F5DT8Y":2,"B0C3714GZ7":7,"B0C9PV8KTG":10,"B0BTB3TC4Z":20,"B0DZWTBRJ1":23,"B0CKSBTPWG":34}}]},{"root":"otros","volume":625,"n":1,"children":[{"kw":"crows decor","vol":625,"sales":13,"n":3,"avg":19.7,"best":17,"rel":0.417,"idn":261,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0DZWTBRJ1":17,"B0C9PV8KTG":20,"B0C3714GZ7":22}}]},{"root":"bat (otros)","volume":625,"n":1,"children":[{"kw":"bat candle holder","vol":625,"sales":4,"n":2,"avg":35,"best":30,"rel":0.258,"idn":161,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0DZWTBRJ1":30,"B0GFPBVVLQ":40}}]},{"root":"raven light","volume":583,"n":1,"children":[{"kw":"raven light","vol":583,"sales":3,"n":4,"avg":6.8,"best":1,"rel":0.604,"idn":352,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0C3714GZ7":1,"B0C9PV8KTG":2,"B0CKSBTPWG":6,"B0DZWTBRJ1":18}}]},{"root":"gothic light","volume":571,"n":2,"children":[{"kw":"gothic light fixture","vol":519,"sales":0,"n":2,"avg":34,"best":33,"rel":0.308,"idn":160,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0C3714GZ7":33,"B0C9PV8KTG":35}},{"kw":"gothic light","vol":52,"sales":0,"n":6,"avg":18.7,"best":1,"rel":0.567,"idn":29,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0C9PV8KTG":1,"B0GFPBVVLQ":5,"B0C3714GZ7":12,"B0DZWTBRJ1":21,"B0BTB3TC4Z":32,"B0CKSBTPWG":41}}]},{"root":"spooky (otros)","volume":568,"n":1,"children":[{"kw":"spooky lamp","vol":568,"sales":1,"n":4,"avg":14.5,"best":2,"rel":0.573,"idn":325,"tier":"CORE","prio":"P2","match":"exact","ranks":{"B0C3714GZ7":2,"B0C9PV8KTG":3,"B0GFPBVVLQ":5,"B0DZWTBRJ1":48}}]},{"root":"skull night light","volume":460,"n":1,"children":[{"kw":"skull night light","vol":460,"sales":5,"n":3,"avg":27.7,"best":9,"rel":0.383,"idn":176,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0H1NVL75G":9,"B0GFPBVVLQ":31,"B08S6YF1Q2":43}}]},{"root":"gothic candle warmer lamp","volume":453,"n":1,"children":[{"kw":"gothic candle warmer lamp","vol":453,"sales":2,"n":2,"avg":18.5,"best":1,"rel":0.396,"idn":179,"tier":"LONG-TAIL","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":1,"B0DZWTBRJ1":36}}]},{"root":"skull light","volume":448,"n":1,"children":[{"kw":"skull light","vol":448,"sales":1,"n":4,"avg":24.8,"best":1,"rel":0.435,"idn":195,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":1,"B08S6YF1Q2":18,"B0H1NVL75G":39,"B0G7F5DT8Y":41}}]},{"root":"skull candle warmer lamp","volume":355,"n":1,"children":[{"kw":"skull lamp warmer","vol":355,"sales":3,"n":2,"avg":16.5,"best":1,"rel":0.446,"idn":158,"tier":"SECONDARY","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":1,"B0G7F5DT8Y":32}}]},{"root":"skull table lamp","volume":103,"n":1,"children":[{"kw":"skull table lamp","vol":103,"sales":0,"n":7,"avg":26.6,"best":5,"rel":0.542,"idn":56,"tier":"CORE","prio":"P3","match":"exact","ranks":{"B0GFPBVVLQ":5,"B0G7F5DT8Y":11,"B0C9PV8KTG":23,"B08S6YF1Q2":25,"B0CY1ZFZ9Q":33,"B0C3714GZ7":41,"B0CR45Z9D9":48}}]}]}

const products = [
  // ── SKULL LAMP (LMP) ────────────────────────────────────────────────────────
  {
    id: 'skull-lamp',
    sku: 'MAVRA-LMP',
    name: 'Skull Lamp',
    oneLiner: `Metal wireframe skull shade 5.4"W × 12.2"H · 3 shade modes Matte/Glitter/Naked, both veils included · touch-dimmer 3 niveles Soft/Medium/High · bombillo E26 estándar incluido (compatible con cualquier E26) · shadow projection en la pared · base circular sólida.`,
    title: {
      primary: {
        count: 199,
        text: `MAVRA Skull Lamp - Gothic Table Lamp, Shadow Projection, 3-Level Touch Dimmer & Standard E26 Bulb, 3 Shade Modes (Matte, Glitter, Naked Cage), Goth Room Decor for Bedside Nightstand, Skull Decor Gift`,
      },
      alt: {
        label: 'Alternativa keyword-first (197 chars)',
        count: 197,
        text: `Skull Lamp - MAVRA Gothic Table Lamp, Shadow Projection, 3-Level Touch Dimmer, 3 Shade Modes (Matte/Glitter/Naked Cage), Standard E26 Bulb, Goth Room Decor & Skull Decor Gift for Bedside Nightstand`,
      },
    },
    bullets: [
      {
        headline: 'CAST THE SKULL ONTO YOUR WALL — Shadow Projection',
        body: `Your room doesn't just hold a lamp — it holds a presence. The faceted wireframe skull shade throws a crisp skull shadow across your wall, turning bare plaster into permanent gothic atmosphere. This is year-round decor for people who live in the dark aesthetic — not a Halloween prop you box up in November.`,
        note: `driver #1 shadow projection · objeción: "¿esto es solo para Halloween?" → NO, permanente`,
      },
      {
        headline: 'THREE LAMPS IN ONE — Both Veils Included',
        body: `Set the mood three ways from the same lamp: slip on the Matte veil for a soft solid glow, the Glitter veil for a warm shimmering cast, or run the Naked metal cage bare for the sharpest shadow projection. Both veils ship in the box — no add-ons to buy, no guessing what's included.`,
        note: `feature: 3 shade modes · objeción: "¿qué necesito comprar aparte?" → nada, ambas veils incluidas`,
      },
      {
        headline: 'COMMAND THE DARKNESS WITH A TOUCH — 3-Level Dimmer',
        body: `One touch on the solid base steps the warm glow through Soft → Medium → High. Dial it down to an ember for late-night reading on the nightstand, or up to a full gothic wash for the whole room. No fumbling for a switch in the dark — the light answers your hand.`,
        note: `feature: touch-dimmer 3 niveles + bombillo E26 estándar · uso: bedside/nightstand · beneficio: control`,
      },
      {
        headline: 'BUILT SOLID, ARRIVES READY — No Fragile Guesswork',
        body: `A heavy circular base and a real geometric metal shade frame — not thin flimsy plastic. Measuring 5.4" wide and 12.2" tall, it lands as a substantial statement piece that fits a nightstand, shelf, desk or console, and it arrives exactly as shown. A standard E26 bulb is included, and the socket fits any E26 — swap in your favorite bulb, brightness or color.`,
        note: `objeción: "¿es frágil?" + "¿qué tamaño llega?" + "¿qué compro aparte?" → base sólida, metal, dimensiones, bulb incluido`,
      },
      {
        headline: `ASSEMBLES IN UNDER A MINUTE — Then It's Permanent`,
        body: `Unscrew the ring, seat the shade, lock it in, bring the dark — four simple steps, no tools, no wiring. Once it's up, it stays up: MAVRA builds gothic home decor as a permanent identity, not a seasonal costume. A collectible-grade skull lamp and a striking goth gift for anyone who arranges their darkness with intention.`,
        note: `objeción: "¿cómo se arma?" → 4 pasos sin herramientas · gift angle · reafirma permanencia`,
      },
    ],
    backend: {
      bytes: 247,
      text: `calavera lampara skeleton cranium witchy whimsigoth dark academia macabre occult coffin raven memento mori calaca moody accent ambient mood lighting reading desk light dimmable e27 apartment dorm shelf aesthetic pirate crossbones gothik skul witch`,
    },
    keywordClusters: [
      {
        label: 'Cluster A — Cabeza de producto (front-load, máxima prioridad)',
        rows: [
          { kw: 'skull lamp', vol: '1,615', cptd: '1,000 / 4', intent: 'Producto exacto', dest: 'T + B' },
          { kw: 'gothic lamp', vol: '4,143', cptd: '2,000 / 0', intent: 'Producto exacto (estética)', dest: 'T + B' },
          { kw: 'goth lamp', vol: '1,175', cptd: '424 / 0', intent: 'Producto exacto', dest: 'T + BK' },
          { kw: 'skull lamps', vol: '448', cptd: '1,000 / 0', intent: 'Producto (plural)', dest: 'B' },
          { kw: 'skull light', vol: '448', cptd: '10,000 / 4', intent: 'Producto', dest: 'B' },
          { kw: 'skeleton lamp', vol: '1,895', cptd: '646 / 4', intent: 'Producto adyacente', dest: 'BK / PPC' },
          { kw: 'skull table lamp', vol: '103', cptd: '430 / 3', intent: 'Producto + forma', dest: 'T + B' },
          { kw: 'gothic table lamp', vol: '671', cptd: '1,000 / 0', intent: 'Producto + forma', dest: 'T + B' },
          { kw: 'gothic desk lamp', vol: '612', cptd: '966 / 1', intent: 'Producto + forma', dest: 'PPC' },
          { kw: 'gothic floor lamp', vol: '1,612', cptd: '1,000 / 1', intent: 'Adyacente (forma distinta)', dest: 'PPC (phrase, watch CVR)' },
        ],
      },
      {
        label: 'Cluster B — Estética / decor (ancla de categoría, alto volumen)',
        rows: [
          { kw: 'gothic decor', vol: '22,073', cptd: '30,000 / 5', intent: 'Estética', dest: 'B + A + PPC broad' },
          { kw: 'goth', vol: '27,651', cptd: '40,000 / 18', intent: 'Estética (muy amplio)', dest: 'PPC auto only' },
          { kw: 'skull decor', vol: '4,136', cptd: '993 / 6', intent: 'Estética skull (baja comp)', dest: 'T + B' },
          { kw: 'gothic home decor', vol: '8,940', cptd: '30,000 / 4', intent: 'Estética', dest: 'B + BK' },
          { kw: 'goth home decor', vol: '2,536', cptd: '571 / 0', intent: 'Estética', dest: 'B' },
          { kw: 'gothic room decor', vol: '3,214', cptd: '20,000 / 2', intent: 'Estética + habitación', dest: 'A + PPC' },
          { kw: 'goth room decor', vol: '2,979', cptd: '537 / 0', intent: 'Estética + habitación', dest: 'T + B' },
          { kw: 'gothic bedroom decor', vol: '2,893', cptd: '527 / 0', intent: 'Uso: dormitorio', dest: 'B + PPC' },
          { kw: 'goth bedroom decor', vol: '1,170', cptd: '481 / 0', intent: 'Uso: dormitorio', dest: 'PPC' },
          { kw: 'skull decor for home', vol: '988', cptd: '624 / 0', intent: 'Estética skull', dest: 'B' },
          { kw: 'skull home decor', vol: '482', cptd: '624 / 0', intent: 'Estética skull', dest: 'B' },
          { kw: 'spooky home decor', vol: '4,561', cptd: '973 / 0', intent: 'Estética', dest: 'BK / PPC' },
          { kw: 'witchy home decor', vol: '10,203', cptd: '4,000 / 5', intent: 'Estética adyacente', dest: 'BK / PPC' },
          { kw: 'dark academia decor', vol: '14,267', cptd: '6,000 / 4', intent: 'Estética adyacente', dest: 'BK + A' },
          { kw: 'whimsigoth decor', vol: '3,726', cptd: '385 / 1', intent: 'Estética adyacente (baja comp)', dest: 'BK / PPC' },
          { kw: 'gothic office decor', vol: '1,615', cptd: '423 / 2', intent: 'Uso: oficina', dest: 'PPC' },
        ],
      },
      {
        label: 'Cluster C — Caso de uso / forma (table/bedside — broad, gran volumen, alta comp)',
        rows: [
          { kw: 'table lamp', vol: '112,346', cptd: '50,000 / 34', intent: 'Forma (genérico)', dest: 'T (una vez) + PPC broad/auto' },
          { kw: 'touch lamp', vol: '27,145', cptd: '50,000 / 4', intent: 'Feature: touch', dest: 'B + PPC (con negativos)' },
          { kw: 'bedside lamp', vol: '32,956', cptd: '20,000 / 9', intent: 'Uso: mesa de noche', dest: 'T + B + PPC' },
          { kw: 'nightstand lamp', vol: '29,179', cptd: '10,000 / 10', intent: 'Uso: mesa de noche', dest: 'T + B' },
          { kw: 'table lamp for bedroom', vol: '6,020', cptd: '30,000 / 12', intent: 'Uso', dest: 'PPC' },
          { kw: 'small table lamp', vol: '26,316', cptd: '50,000 / 6', intent: 'Tamaño (verificar CVR)', dest: 'PPC phrase' },
          { kw: 'dimmable lamp', vol: '4,146', cptd: '60,000 / 1', intent: 'Feature: dimmer', dest: 'B + BK' },
          { kw: 'bedside table lamp', vol: '8,925', cptd: '20,000 / 12', intent: 'Uso + forma', dest: 'PPC' },
          { kw: 'nightstand decor', vol: '6,497', cptd: '40,000 / 0', intent: 'Uso + estética', dest: 'PPC' },
        ],
      },
      {
        label: 'Cluster D — Feature / material (cualificado, bajo volumen)',
        rows: [
          { kw: 'edison lamp', vol: '988', cptd: '10,000 / 4', intent: 'Feature: Edison', dest: 'B + BK' },
          { kw: 'edison table lamp', vol: '512', cptd: '4,000 / 2', intent: 'Feature + forma', dest: 'BK' },
          { kw: 'edison bulb lamp', vol: '657', cptd: '10,000 / 0', intent: 'Feature', dest: 'BK' },
          { kw: 'shadow lamp', vol: '507', cptd: '10,000 / 5', intent: 'Feature: shadow', dest: 'BK / PPC (baja)' },
        ],
      },
      {
        label: 'Cluster E — Regalo (gift buyers)',
        rows: [
          { kw: 'witchy gifts', vol: '3,369', cptd: '746 / 15', intent: 'Regalo estética', dest: 'BK / PPC' },
          { kw: 'goth gifts', vol: '1,261', cptd: '775 / 1', intent: 'Regalo estética', dest: 'BK' },
          { kw: 'gothic gifts for women', vol: '1,072', cptd: '644 / 1', intent: 'Regalo', dest: 'BK / PPC' },
          { kw: 'skull gifts for women', vol: '630', cptd: '535 / 2', intent: 'Regalo skull', dest: 'BK' },
          { kw: 'skull gifts', vol: '598', cptd: '654 / 3', intent: 'Regalo skull', dest: 'B (una vez)' },
          { kw: 'skull gifts for men', vol: '563', cptd: '412 / 2', intent: 'Regalo skull', dest: 'BK' },
          { kw: 'halloween gifts for women', vol: '1,895', cptd: '515 / 6', intent: 'Regalo estacional', dest: 'PPC (temporada)' },
        ],
      },
    ],
    headerRec: `skull lamp · gothic lamp / gothic table lamp · skull decor · goth room decor · nightstand/bedside · + features (shadow projection, touch dimmer, standard E26 bulb, 3 shade modes).`,
    negatives: `rechargeable · cordless · battery operated · candle warmer · wax melt · wax warmer · car · door projector · welcome light · night light for kids · medical model. (MAVRA es corded E26 estándar, no warmer.)`,
    competitors: {
      source: 'Helium 10 Product Research (Black Box) LIVE · US · 2026-07-25 · deduplicado por ASIN · rankeado por revenue/mo',
      topVoc: ['B0BTB3TC4Z', 'B0H1NVL75G', 'B0C3714GZ7', 'B0C9PV8KTG', 'B0FV2Q25NF', 'B00K2B5K7U', 'B0DBJ8L3CB', 'B0DZWTBRJ1', 'B08S6YF1Q2', 'B0CR45Z9D9'],
      rows: [
        { asin: 'B0GFPBVVLQ', brand: 'Nomnu', title: 'Skull Candle Warmer Lamp (timer+dimmer)', price: '$74.97', sales: '1,304', revenue: '$92,075', reviews: '152', rating: '4.8', tipo: 'Líder / Sustituto', win: 'Rey de tráfico de "skull lamp" pero es wax warmer, candles NOT included. Interceptar al que quiere una lámpara real con luz Edison, no un calienta-velas.' },
        { asin: 'B0H1NVL75G', brand: 'YR YRHH-PET', title: 'Skeleton Lamp / Skull Night Light', price: '$16.69', sales: '2,808', revenue: '$48,284', reviews: '954', rating: '4.8', tipo: 'Adyacente', win: 'Mayor volumen del nicho skull-light, pero es night light barato para niños. Ganamos por escala premium, metal, shadow projection y voz adulta gótica.' },
        { asin: 'B0BTB3TC4Z', brand: 'Vela Lanterns', title: 'Gothic Candle Holder Lamp (Purple, L)', price: '$24.99', sales: '2,076', revenue: '$47,125', reviews: '10,409', rating: '4.6', tipo: 'Líder categoría / Sustituto', win: 'Gigante gótico (10k reseñas = VOC gold). Es candle-holder lamp, no table lamp eléctrica. Su review-pool es la mina #1 del comprador gótico de iluminación.' },
        { asin: 'B0C3714GZ7', brand: 'OVANUS', title: 'Crow/Raven Lamp Gothic Decor', price: '$27.99', sales: '692', revenue: '$21,713', reviews: '844', rating: '4.4', tipo: 'Directo', win: 'Gothic table lamp (raven). Rating 4.4 = conquistable; ganamos con skull + shadow projection + 3 shade modes vs. su cuervo estático.' },
        { asin: 'B0C9PV8KTG', brand: 'Shandaglo', title: 'Raven Lamp Gothic Decor', price: '$29.99', sales: '821', revenue: '$21,764', reviews: '759', rating: '4.4', tipo: 'Directo', win: 'Análogo de posicionamiento (gothic table lamp permanente). 4.4 conquistable. Mismo precio-band que MAVRA target.' },
        { asin: 'B0DZWTBRJ1', brand: 'ehuoyan', title: 'Gothic Crow Lamp w/ Tealight Holder', price: '$49.99', sales: '689', revenue: '$19,273', reviews: '329', rating: '4.7', tipo: 'Directo', win: 'Gothic table lamp bien ejecutado (4.7). Es lámpara + tealight; MAVRA gana en luz eléctrica real + shadow.' },
        { asin: 'B0FV2Q25NF', brand: 'CoolGift Mart', title: 'Skull Night Light, silicone touch', price: '$18.99', sales: '694', revenue: '$12,829', reviews: '495', rating: '4.8', tipo: 'Adyacente (cordless)', win: 'Skull touch lamp USB recargable. Segmento de regalo barato; MAVRA es pieza de decor premium corded.' },
        { asin: 'B0GZK61NCQ', brand: 'NUODITOS', title: 'Tiffany Bat-in-Moon Stained Glass Table Lamp', price: '$70.98', sales: '97', revenue: '$7,355', reviews: '62', rating: '4.8', tipo: 'Sustituto', win: 'Gothic table lamp premium (vitral). Mismo band de precio; diferente estética (Tiffany vs. skull escultórico).' },
        { asin: 'B00K2B5K7U', brand: 'Zeckos', title: 'Dragon Table Lamp "Gothic Guardians" 19"', price: '$89.99', sales: '40', revenue: '$3,602', reviews: '467', rating: '4.7', tipo: 'Adyacente', win: 'Lámpara figural gótica premium (dragón). Prueba de que el comprador paga $90 por lámpara gótica escultórica.' },
        { asin: 'B0CR45Z9D9', brand: 'YYZZH', title: 'Pirate/Nautical Skull Table Lamp', price: '$27.99', sales: '189', revenue: '$5,256', reviews: '160', rating: '4.2', tipo: 'Directo / Conquistable', win: 'Skull table lamp de forma directa. 4.2 = débil; ganamos por ejecución, escala y shadow projection.' },
        { asin: 'B0DBJ8L3CB', brand: 'Suck UK', title: 'Skull Lamp / Skull Light Bulb', price: '$29.95', sales: '28', revenue: '$1,029', reviews: '439', rating: '4.2', tipo: 'Directo / Conquistable (cordless)', win: 'Marca de diseño con el nombre literal "Skull Lamp" (bombilla-cráneo). 4.2 conquistable; MAVRA da lámpara completa + shadow, no solo un bulbo.' },
        { asin: 'B08S6YF1Q2', brand: 'Tradeopia', title: 'LED Skull Table Lamp (3×AAA)', price: '$29.99', sales: '5', revenue: '$162', reviews: '287', rating: '4.4', tipo: 'Directo (battery)', win: 'Skull table lamp directa pero a pilas y de bajo momentum. Ejecución/corded/dimmer nos separan.' },
        { asin: 'B0CY1ZFZ9Q', brand: 'YYZZH', title: 'Pirate Skull & Crossbones Nightstand Lamp', price: '$27.99', sales: '92', revenue: '$2,527', reviews: '33', rating: '4.4', tipo: 'Directo', win: 'Skull table lamp para nightstand — forma directa, marca débil. Espacio para robar la búsqueda "skull nightstand lamp".' },
        { asin: 'B0CKSBTPWG', brand: 'EPPARA', title: 'Raven Table Lamp Gothic Crow', price: '$29.99', sales: '63', revenue: '$1,916', reviews: '129', rating: '4.2', tipo: 'Directo / Conquistable', win: 'Otro raven table lamp gótico, 4.2. Nicho de "gothic table lamp" fragmentado y ganable.' },
        { asin: 'B0G7F5DT8Y', brand: 'liveMAX', title: 'Skull & Crossbones Table Lamp', price: '$50.99', sales: '39', revenue: '$1,617', reviews: '10', rating: '3.8', tipo: 'Directo / Conquistable', win: 'Análogo de forma más cercano (skull table lamp con shade) y el más débil (3.8★, 10 reseñas). Objetivo #1 de conquest por imagen/ejecución.' },
      ],
    },
    campaigns: {
      methodology: `Base: AdsCrafted (Discovery → Harvest → Scale, con separación de match types y optimización de placement/top-of-search) + Chris Rawlings / Sophie Society (dominar top-of-search de la hero keyword para forzar ranking orgánico; ranking-first bidding en lanzamiento, luego pivote a profit). Precio de referencia del segmento premium ~$45–65 (Nomnu $75 / liveMAX $51 arriba; Shandaglo raven $30 / Vela $25 abajo).`,
      sp: [
        {
          code: 'C1', name: 'SP Exact "Hero / Ranking"', tag: 'ranking-first, Rawlings',
          fields: [
            { label: 'Keywords (SKAG, una por ad group)', value: 'skull lamp · gothic lamp · skull table lamp · gothic table lamp · goth room decor · skull decor' },
            { label: 'Objetivo', value: 'Dominar top-of-search de la cabeza ganable (td 0–4). Bid agresivo + Top-of-Search bid modifier +50% a +100%.' },
            { label: 'Bid', value: '$0.90–$1.60 (subir el modifier antes que el base bid)' },
            { label: 'Budget', value: '$25–$40/día (el grueso del lanzamiento)' },
            { label: 'ACOS objetivo', value: 'Tolerar 60–100% las primeras 2–3 semanas (comprando ranking), luego bajar a profit.' },
          ],
        },
        {
          code: 'C2', name: 'SP Phrase "Expansion"',
          fields: [
            { label: 'Keywords', value: 'gothic decor · goth home decor · gothic home decor · gothic bedroom decor · bedside lamp · nightstand lamp · touch lamp · dimmable lamp · gothic floor lamp · skeleton lamp' },
            { label: 'Bid / Budget', value: '$0.70–$1.20 · $12–$20/día' },
            { label: 'Nota', value: 'Long-tails de estética/forma. Vigilar gothic floor lamp / small table lamp (mismatch de forma) → negativo si CVR bajo.' },
          ],
        },
        {
          code: 'C3', name: 'SP Broad "Discovery"', tag: '+ modificador',
          fields: [
            { label: 'Keywords broad', value: 'gothic decor · goth · skull decor · dark academia decor · witchy home decor · spooky home decor · bedside lamp' },
            { label: 'Bid / Budget', value: '$0.45–$0.80 · $10–$15/día · dynamic bids down-only al inicio' },
            { label: 'Nota', value: 'Broad MODIFICADO (+palabra) para no regalar spend a sinónimos (MAG/Rawlings). Motor de cosecha de search terms — su producto es el reporte de términos, no el ACOS.' },
          ],
        },
        {
          code: 'C4', name: 'SP Auto "Discovery"',
          fields: [
            { label: 'Targeting', value: 'Las 4 targeting groups (close match, loose match, complements, substitutes)' },
            { label: 'Bid / Budget', value: '$0.40–$0.75 · $10–$15/día (bids bajos)' },
            { label: 'Nota', value: 'Segundo motor de cosecha. Prender ~día 7–10 (Brandon Young: al inicio Amazon "no sabe por qué indexarte" y el auto sesga la data). Complements/substitutes descubre ASINs de competidores para C6.' },
          ],
        },
        {
          code: 'C5', name: 'SP Auto/Broad "Halloween Seasonal"', tag: 'solo Sep–Oct, apagada el resto del año',
          fields: [
            { label: 'Recoge', value: 'Pico estacional (halloween lamp, halloween decor, witch hat lamp, halloween gifts for women) SIN tocar la voz de marca — mismo listing permanente.' },
            { label: 'Bid / Budget', value: '$0.60–$1.10 · $15–$30/día solo en ventana · Pausar 1-nov' },
          ],
        },
        {
          code: 'C6', name: 'SP Product/ASIN "Competitor Conquest"',
          fields: [
            { label: 'Bid / Budget', value: '$0.75–$1.40 (más alto en ASINs con rating <4.3) · $10–$18/día' },
            { label: 'Nota', value: 'Placement en la página del competidor = interceptar al comprador que ya quiere una lámpara gótica.' },
          ],
          asins: [
            { asin: 'B0GFPBVVLQ', desc: 'Nomnu Skull Candle Warmer Lamp — $74.97 · 1,304/mo · 4.8★ (líder revenue)' },
            { asin: 'B0C9PV8KTG', desc: 'Shandaglo Raven Lamp Gothic Decor — $29.99 · 821/mo · 4.4★' },
            { asin: 'B0G7F5DT8Y', desc: 'liveMAX Skull & Crossbones Table Lamp — $50.99 · 39/mo · 3.8★ (conquistable)' },
            { asin: 'B0BTB3TC4Z', desc: 'Vela Lanterns Gothic Candle Holder Lamp — $24.99 · 2,076/mo · 4.6★' },
            { asin: 'B0CY1ZFZ9Q / B0CR45Z9D9', desc: 'YYZZH Pirate/Skull Table Lamp — $27.99 (forma directa)' },
            { asin: 'B0H6WCCSJM', desc: 'Stained-glass Witch Hat Lamp (Generic) — segmento adyacente de gran volumen' },
          ],
        },
      ],
      harvesting: [
        'Cadencia: cada 3–4 días, search term report de las campañas de descubrimiento (C3 broad, C4 auto, C5 seasonal).',
        'Graduación (G1): search term con Orders ≥ 2 (o 1 si el ACoS ya se disparó) → duplicar a C1 Exact. Bid de arranque = RPC = (Revenue / Clicks) × Target ACoS. La graduación es SIEMPRE a exact.',
        'Negar-vs-ladder (raíz-vs-cerrado): si el término es una RAÍZ con hijos por descubrir → NO se niega en la fuente; se re-siembra el ladder de match (exact 100% · phrase 0.75× · broad 0.5×, convención de industria) para seguir cosechando sus hijos. Si es un término CERRADO (long-tail de compra, sin hijos) → se aísla el exact + negative-exact en la fuente.',
        'Negativizador (N1): término con clics ≥ piso por tipo (SP 30 · SD 12 · SBV 15) Y (spend ≥ 1.5–2× CPA objetivo ó ACoS ≫ target) con 0 órdenes → negative exact. El piso por tipo es intención/CPC del canal, no significancia estadística.',
        'Word-level (N2): una palabra con ≥ 50 clics acumulados y 0 órdenes → negative phrase a nivel de cuenta.',
        'Negativos permanentes desde día 1 (mal-calificados): rechargeable, cordless, battery operated, candle warmer, wax melt, wax warmer, car, door projector, welcome light, night light for kids, medical model.',
        'Semanal: subir bid/modifier de los exact que rankean top-5 orgánico; al llegar a top-3 en la hero → bajar bid (Rawlings: ya no pagás por el ranking ganado).',
        'Todos los umbrales (30/12/15 clics, ≥2 órdenes, ≥50 word-level, 1.5–2× CPA) son defaults editables por el usuario.',
      ],
      sbv: [
        {
          code: 'SBV-1', name: '"Shadow Hook"', tag: 'categoría/estética, ofensiva',
          keywords: 'skull lamp · gothic lamp · gothic decor · goth room decor · skull decor · dark academia decor · bedside lamp',
          angle: `Primeros 2 s en oscuro total → un touch enciende la lámpara → la sombra del cráneo se proyecta nítida sobre la pared. Quick-cuts: los 3 shade modes (matte → glitter → naked) → touch-dimmer subiendo Soft→High → plano de mesa de noche real. Cierre en wordmark MAVRA + "Inhabit Your Shadow". Música dark-ambient, texto mínimo, silencioso-first (autoplay muted).`,
          bid: '$0.80–$1.50', budget: '$12–$20/día',
        },
        {
          code: 'SBV-2', name: '"Defensive / Conquest"', tag: 'defensiva + intercepción',
          keywords: 'skull lamp · gothic table lamp · gothic candle holder · + targeting a ASINs de C6 (Nomnu, Shandaglo, liveMAX, witch hat lamp)',
          angle: `Mismo shadow hook, pero cierra en comparación implícita — "3 shade modes · both veils included · touch dimmer · solid metal" (lo que los competidores no tienen). Defiende búsquedas de marca/categoría y aparece sobre el video del competidor.`,
          bid: '$0.70–$1.30', budget: '$8–$15/día',
        },
      ],
      budget: `~$90–$150/día en la ventana de ranking (primeras 3–4 semanas), 45–55% en C1 (Exact Hero) + SBV-1. Fuera de ventana: ~$45–70/día en modo profit.`,
    },
    notes: [
      { head: 'Supuestos', body: 'Precio no confirmado en briefs → se asume rango premium $45–65. Confirmar precio real con Frank para calibrar bids/ACOS. ASIN propio del Skull Lamp no estaba en los briefs → no se corrió Cerebro sobre el listing live; si Frank pasa el ASIN, correr get_keywords_by_asin para auditar cobertura y sembrar negativos.' },
      { head: 'COSMO gap — imágenes vs. copy', body: 'Las imágenes YA cubren shadow projection, 3 shade modes + both veils, escala 5.4×12.2, construcción metal, 3-level dimmer, bedside touch, armado 4 pasos. El copy refuerza lo que la imagen NO dice: bombillo E26 estándar incluido (compatible con cualquier E26, no propietario), keywords de estética/uso (gothic/goth room decor, nightstand, dark academia, dimmable), el ángulo permanente-no-Halloween explícito, y el ángulo regalo.' },
      { head: 'Pendiente H10 / no bloqueado', body: 'Todas las llamadas H10 corrieron OK (Magnet ×5 seeds, Product Research ×2, Cerebro ×2), cero errores de auth, volúmenes reales. Único no medido: CPC exacto por keyword (los bids son rangos por competencia del nicho, no CPC medido — refinar con el primer reporte de términos del launch).' },
    ],
    sustento: {
      titleKeywords: [
        {
          label: 'skull lamp',
          metrics: 'Vol 1,615/mo · td 4 · cp 1,000',
          a910: `Solo 4 competidores la titulan = cabeza exacta ganable. El líder del término "skull lamp" (Nomnu) es un candle-warmer, no una lámpara: hueco para una table lamp real. Front-load en título (posición 2) + bullets.`,
          cosmo: `La query es intención de objeto-iluminación con forma de cráneo; COSMO conecta ese intent con el atributo real (metal wireframe skull shade que proyecta sombra), separándonos del warmer que domina el término literal pero no es lámpara.`,
          voc: `"The skull design is super unique and has that perfect spooky vibe without looking cheap or overly Halloween-y… the way the light shines through the eyes and nose just looks cool." (Nomnu, 5★)`,
        },
        {
          label: 'gothic table lamp (gothic lamp)',
          metrics: 'gothic table lamp 671/mo · td 0 · cp 1,000 · gothic lamp 4,143 · td 0',
          a910: `td 0 = nadie titula por ella → relevancia de texto ownable de inmediato. El análogo de forma (liveMAX Skull & Crossbones) rankea pobre (39/mo, 3.8★).`,
          cosmo: `Intención estética + forma; COSMO matchea el contexto de decoración gótica permanente con el ángulo no-Halloween, por encima de lámparas genéricas que solo comparten "table lamp".`,
          voc: `"gives off that gothic, cozy vibe I was hoping for… warm and moody, perfect for evenings." (Nomnu, 5★) + análogo directo (lámpara de mesa gótica): "adds a cool, moody vibe to the room. The design is perfect for anyone who loves gothic or vintage decor." (OVANUS, 5★)`,
        },
        {
          label: 'shadow projection (driver, no keyword)',
          metrics: 'Relevancia REAL vs reportada · shadow lamp solo 507/mo · td 5',
          a910: `NO es keyword de ranking ("shadow projection" sin volumen). Alto valor de conversión (driver emocional #1) pero cero demanda de búsqueda → se vende en imagen/bullet/A+; en título va como beneficio, no para posicionar.`,
          cosmo: `Aunque nadie busca "shadow projection", COSMO puede asociar la intención de "mood / gothic atmosphere" con el atributo de proyección de sombra, reforzando relevancia contextual sin ser término literal.`,
          voc: `"the way the light shines through the eyes and nose just looks cool, kind of like a prop from a darker fantasy movie. Definitely the kind of piece people notice the second they walk in." (Nomnu, 5★)`,
        },
        {
          label: '3-level touch dimmer (touch lamp / dimmable)',
          metrics: 'touch lamp 27,145/mo · td 4 · dimmable lamp 4,146 · td 1 · cp 60,000',
          a910: `Feature de alto volumen; td bajo en dimmable = ownable. Va en bullet + backend, no en cabeza de título por genérico.`,
          cosmo: `El intent implícito "no me quiero encandilar / mood lighting" conecta con el atributo touch-dimmer 3 niveles — que es justo el gap del rival de bombillo fijo cegador.`,
          voc: `El dimmer es el feature #1 elogiado del segmento (validación central): "the dimmer switch really allows you to pick a very dim setting and have it provide ample light without being overbearing." (OVANUS, 5★) + gap del rival de bombillo fijo: "the bulb is so damn bright. You can't have it on and in front of you." (Shandaglo, 3★)`,
        },
        {
          label: 'standard E26 bulb',
          metrics: 'keywords: edison lamp 988/mo · td 4 · edison table lamp 512 · td 2 · edison bulb lamp 657 · td 0',
          a910: `Bajo volumen, muy cualificado; td 0-4. Va en bullet + backend. El comprador tipea "edison/vintage lamp" por el look cálido, pero lo que se entrega y se posiciona es el bombillo E26 estándar (no un bombillo propietario).`,
          cosmo: `La query de bombillo vintage/cálido señala glow ámbar; COSMO lo liga al bombillo E26 ESTÁNDAR incluido y corded — compatible con CUALQUIER E26, así que se puede cambiar por brillo o color. Resuelve la objeción "¿qué compro aparte?" y el gap del rival de bombillo europeo imposible de reemplazar / batería que muere a las 3h.`,
          voc: `Gap NUEVO y limpio — bombillo raro imposible de reemplazar: "it's some sort of a European bulb so I guess I won't be able to have the light bulb… I went to a specialty bulb store." (OVANUS, 2★) + "replacement bulbs VERY hard to find." (OVANUS, 3★). Corded vs. cordless del rival: "only lasts three hours when fully charged? What a joke." (Suck UK, 1★)`,
        },
        {
          label: '3 shade modes (Matte / Glitter / Naked Cage)',
          metrics: 'Diferenciador de producto · sin keyword de volumen',
          a910: `Nadie busca "shade modes"; va en título por relevancia de atributo, no por demanda. Nadie más en el nicho ofrece 3 modos = señal de diferenciación.`,
          cosmo: `Intención de versatilidad/personalización; COSMO puede relacionar "mood lighting" con el atributo de veils intercambiables.`,
          voc: null,
          vocNote: `Ningún competidor ofrece veils intercambiables; no hay reseña que lo mencione. Adyacente (versatilidad de luz): "has 3 light settings that are perfect." (Nomnu, 5★)`,
        },
        {
          label: 'goth room decor',
          metrics: 'Vol 2,979/mo · td 0 · cp 537',
          a910: `td 0 = ownable, baja competencia. Ancla estética en título + bullets.`,
          cosmo: `Intención de decoración permanente de habitación; COSMO entiende el contexto no-Halloween / year-round y lo matchea con el ángulo de marca permanente, separándonos del tráfico estacional.`,
          voc: `"It fits my aesthetic perfectly without being too kitschy." (Nomnu, 5★)`,
        },
        {
          label: 'bedside / nightstand',
          metrics: 'bedside lamp 32,956/mo · td 9 · nightstand lamp 29,179 · td 10',
          a910: `Volumen enorme de USO; td medio (competido) pero muy relevante para la forma real (table lamp de mesa de noche).`,
          cosmo: `El intent "lámpara para la mesa de noche / lectura nocturna" conecta con el tamaño real (5.4×12.2) y el dimmer para bajar a ember — atributo que resuelve el uso, no solo la palabra.`,
          voc: `"looks perfect on my bedside table and is great for late night reading and movie watching." (Shandaglo, 5★)`,
        },
        {
          label: 'skull decor',
          metrics: 'Vol 4,136/mo · td 6 · cp solo 993 (baja competencia real)',
          a910: `Alta demanda estética-skull con poca oferta → oro para exact/título.`,
          cosmo: `Intención de decoración con motivo cráneo; COSMO liga el contexto "skull as decor object" con la pieza escultórica-funcional, más allá de props baratos de Halloween.`,
          voc: `"It's hard to find QUALITY and not 'cheesy Halloween-y' gothic home goods outside of spooky season." (Nomnu, 5★)`,
        },
        {
          label: 'skull decor gift (gift)',
          metrics: 'skull gifts 598/mo · td 3 · gothic gifts for women 1,072 · td 1 · witchy gifts 3,369',
          a910: `Segmento regalo con volumen propio; una vez en bullet + backend.`,
          cosmo: `"skull gift" es intención de regalo temático; COSMO conecta con el framing statement/collectible (conversation piece) que lo hace regalable.`,
          voc: null,
          vocNote: `El VOC lista destinatarios (skull collector, goth, teenager, pareja) sin quote textual de compra-regalo. Adyacente statement-piece: "the kind of piece people notice the second they walk in." (Nomnu, 5★)`,
        },
      ],
      claims: [
        {
          label: '1. CAST THE SKULL ONTO YOUR WALL — Shadow Projection',
          metrics: 'Conversión + relevancia semántica (no ranking)',
          a910: `Refuerza "shadow projection" (driver, no keyword: shadow lamp 507 · td 5) y ancla la permanencia. El bullet busca conversión + relevancia de "gothic atmosphere / year-round decor".`,
          cosmo: `El intent "gothic atmosphere permanente" se conecta con el atributo sombra-de-cráneo + el ángulo no-Halloween; COSMO premia el fit contexto-atributo por encima del match literal.`,
          voc: `"the way the light shines through the eyes and nose just looks cool, kind of like a prop from a darker fantasy movie." (Nomnu, 5★) + "Who says it only has to be during Halloween, why not year round." (Nomnu, 5★)`,
        },
        {
          label: '2. THREE LAMPS IN ONE — Both Veils Included',
          metrics: 'Feature de diferenciación · sin keyword de volumen',
          a910: `Resuelve la objeción "¿qué compro aparte?" (both veils included), que impacta CVR = señal A10. Nadie más ofrece veils intercambiables.`,
          cosmo: `Intención de versatilidad/valor; COSMO asocia "mood lighting" a los 3 modos = atributo único del producto.`,
          voc: null,
          vocNote: `Ningún competidor tiene veils intercambiables. Adyacente (versatilidad de luz): "has 3 light settings that are perfect." (Nomnu, 5★)`,
        },
        {
          label: '3. COMMAND THE DARKNESS WITH A TOUCH — 3-Level Dimmer',
          metrics: 'touch lamp 27,145 · td 4 · dimmable lamp 4,146 · td 1',
          a910: `Feature de alto volumen; el bullet lo eleva a promesa central (gap del rival).`,
          cosmo: `El intent "controlar el brillo / no encandilarme" conecta con el atributo touch-dimmer Soft→High + el glow cálido del bombillo E26 estándar. Resuelve causalmente la queja #1 del nicho.`,
          voc: `"the dimmer switch really allows you to pick a very dim setting and have it provide ample light without being overbearing." (OVANUS, 5★) + gap: "the included bulb is so obnoxiously bright white it looks ridiculous." (Shandaglo, 3★)`,
        },
        {
          label: '4. BUILT SOLID, ARRIVES READY — No Fragile Guesswork',
          metrics: 'Resuelve objeciones material/fragilidad (señal A10)',
          a910: `No keyword; impacto directo en reviews/CVR. Refuerza atributos "metal real + base sólida + dimensiones 5.4×12.2".`,
          cosmo: `El intent "que no sea plástico barato / que no se vuelque" conecta con el atributo metal + base circular pesada; COSMO premia el listing cuyo atributo real cubre el miedo del comprador.`,
          voc: `"black plastic, not metal… a noticeable mold seam… reeks of cheapness." (OVANUS, 4★) + "So Cute But Not Weighted… slipped off the table and broke." (OVANUS, 3★). Bombillo que el rival dice incluir y no llega: "says 'Bulb is included,' which it not!" (Zeckos, 4★)`,
        },
        {
          label: `5. ASSEMBLES IN UNDER A MINUTE — Then It's Permanent`,
          metrics: 'Objeción de armado + permanencia + gift (señal A10)',
          a910: `No keyword; menos fricción = mejor rating. Reafirma permanencia + gift angle.`,
          cosmo: `El intent "fácil de armar, sin herramientas" conecta con el atributo 4 pasos sin tools + bombillo E26 estándar incluido; y "permanente no-Halloween" con el posicionamiento de marca.`,
          voc: `"we are keeping them out all year. They are more than a halloween decoration." (ehuoyan, 5★) + "I like this product for more than Halloween… keep permanently in my living room." (ehuoyan, 5★). Fricción de armado del rival que MAVRA evita: bombillo "10 minutes of swearing" (Nomnu).`,
        },
      ],
    },
  },

  // ── SKULL CANDLE SET (CND) ──────────────────────────────────────────────────
  {
    id: 'skull-candle',
    sku: 'MAVRA-CND',
    name: 'Skull Candle Set',
    oneLiner: `Set gótico de 4 piezas: skull candle + spine candle (diferenciador único — nadie más lo empareja) + 2 votivas · parafina negra real (pigmentada al núcleo, no blanquea) · aroma Pine & Moss · burn Skull 12 hrs / Spine 6 hrs · Skull 4.53"W × 3.39" · sutura anatómica esculpida · llega en caja de regalo.`,
    title: {
      primary: {
        count: 195,
        text: `MAVRA Skull Candle Set - Gothic Candles, Real Black Paraffin Skull & Spine Candle + 2 Votives, Pine & Moss Scented, Sculpted Goth Room Decor, Witchy Ritual Candle Gift for Dark Home & Skull Decor`,
      },
      alt: {
        label: 'Alternativa keyword-first (195 chars)',
        count: 195,
        text: `Skull Candle Set - MAVRA Gothic Candles with Real Black Paraffin Skull & Spine Candle + 2 Votives, Pine & Moss Scented, Sculpted Witchy Goth Room Decor, Ritual Candle Gift Box for Dark Home Decor`,
      },
    },
    bullets: [
      {
        headline: 'A COMPLETE RITUAL, NOT A LONE CANDLE — Skull + Spine + 2 Votives',
        body: `Most sellers hand you a single skull and call it a set. MAVRA gives you the whole altar: a sculpted skull candle, a standing spine candle almost no one pairs with it, and two votives to frame them — four black pieces that light as one composition. The spine is the piece your shelf has been missing.`,
        note: `diferenciador #1: el spine + el set de 4 · objeción: "¿qué trae realmente?" → 4 piezas, no una`,
      },
      {
        headline: `TRUE BLACK, ALL THE WAY DOWN — Real Black Paraffin That Won't Bleach`,
        body: `Cheap black candles burn down to a chalky grey-white and ruin the whole look. Ours are genuine black paraffin pigmented through the core, so the wax stays true black to the last pour and burns with a clean, even flame — no white bleed, no ashy bloom. What you light is what you keep looking at.`,
        note: `feature: parafina negra real · objeción: "¿quema limpio o gotea/queda blanco?" → negro hasta el final, sin blanqueo`,
      },
      {
        headline: 'HOURS OF SLOW BURN, BUILT AT REAL SCALE — Skull 12 hrs · Spine 6 hrs',
        body: `The skull throws a warm 12-hour burn; the spine glows for 6. And the skull stands a full 4.53" wide × 3.39" — a hold-it-in-your-hand centerpiece, not a shrunk-down novelty. Substantial enough to anchor a nightstand, mantel or altar, and sized to actually be seen across the room.`,
        note: `feature: burn time + tamaño real del skull · objeción: "¿cuánto dura?" + "¿qué tamaño?" → 12h/6h, 4.53" (sin afirmar altura del spine)`,
      },
      {
        headline: 'SCULPTED, NOT STAMPED — Anatomical Detail & a Pine & Moss Scent',
        body: `Look close and you'll find cranial sutures, cheekbones and a jaw with real anatomical depth — hand-finished, not pressed from a flat mold. Each piece carries a Pine & Moss scent: cool forest resin and damp earth, never sugary or seasonal — so the set reads as intentional decor whether it's lit or resting dark.`,
        note: `feature: esculpido + aroma · objeción: "¿detalle real o molde genérico?" → suturas/esculpido a mano · aroma descrito, no solo nombrado`,
      },
      {
        headline: 'ARRIVES GIFT-READY, STAYS ALL YEAR — Boxed Gothic Home Decor',
        body: `The set ships in a protective gift box, so it lands ready to hand over — a goth gift that needs no wrapping. And it's no Halloween prop you retire in November: MAVRA builds gothic home decor as a permanent identity. Keep it on the shelf in July as proudly as October — your dark aesthetic, year-round.`,
        note: `feature: caja de regalo · objeción: "¿sirve de regalo?" → sí, viene en caja · reafirma permanencia no-Halloween`,
      },
    ],
    backend: {
      bytes: 245,
      text: `calavera vela velas negras esqueleto columna vertebral espina dorsal hueso calaca parafina regalo memento mori macabre occult wiccan witch pagan altar coffin raven apothecary whimsigoth academia vertebrae mantel shelf tabletop gothik skul gotico`,
    },
    keywordClusters: [
      {
        label: 'Cluster A — Producto exacto: vela skull/gothic/spine (front-load)',
        rows: [
          { kw: 'skull candle', vol: '907', cptd: '804 / 11', intent: 'Producto exacto', dest: 'T + B' },
          { kw: 'skull candles', vol: '342', cptd: '932 / 10', intent: 'Producto (plural)', dest: 'B' },
          { kw: 'skull candle set', vol: '~0*', cptd: '914 / 1', intent: 'Producto exacto (set)', dest: 'T + B' },
          { kw: 'gothic candles', vol: '654', cptd: '2,000 / 3', intent: 'Producto (estética)', dest: 'T + B' },
          { kw: 'gothic candle', vol: '485', cptd: '2,000 / 3', intent: 'Producto', dest: 'B' },
          { kw: 'goth candles', vol: '462', cptd: '788 / 1', intent: 'Producto', dest: 'T + BK' },
          { kw: 'goth candle', vol: '282', cptd: '581 / 1', intent: 'Producto', dest: 'BK' },
          { kw: 'spine candle', vol: '531', cptd: '203 / 3', intent: 'Diferenciador único', dest: 'T + B' },
          { kw: 'spine candles', vol: '114', cptd: '180 / 2', intent: 'Diferenciador (plural)', dest: 'B' },
          { kw: 'black skull candle', vol: '132', cptd: '366 / 1', intent: 'Producto + color', dest: 'B' },
          { kw: 'gothic skull candles', vol: '~0', cptd: '0 / 0', intent: 'Producto exacto', dest: 'B / PPC' },
        ],
        note: '* frase exacta sin volumen medido, pero es el producto literal y de baja competencia → va en título por relevancia',
      },
      {
        label: 'Cluster B — Ritual / witch / decorativas (intención adyacente caliente)',
        rows: [
          { kw: 'witch candles', vol: '1,259', cptd: '1,000 / 1', intent: 'Ritual/witch', dest: 'B + PPC' },
          { kw: 'ritual candles', vol: '991', cptd: '6,000 / 1', intent: 'Ritual', dest: 'B + PPC' },
          { kw: 'witchcraft candles', vol: '794', cptd: '779 / 1', intent: 'Ritual', dest: 'BK' },
          { kw: 'witchy candles', vol: '573', cptd: '413 / 0', intent: 'Estética/ritual', dest: 'B' },
          { kw: 'wiccan candles', vol: '433', cptd: '495 / 0', intent: 'Ritual', dest: 'BK' },
          { kw: 'decorative candles', vol: '4,141', cptd: '40,000 / 7', intent: 'Decorativa (genérico)', dest: 'BK / PPC' },
          { kw: 'aesthetic candles', vol: '634', cptd: '535 / 3', intent: 'Estética', dest: 'BK' },
        ],
      },
      {
        label: 'Cluster C — Decor / estética (ancla de categoría, alto volumen)',
        rows: [
          { kw: 'gothic decor', vol: '22,073', cptd: '30,000 / 5', intent: 'Estética', dest: 'B + A + PPC broad' },
          { kw: 'dark academia decor', vol: '14,267', cptd: '6,000 / 4', intent: 'Estética adyacente', dest: 'BK + A' },
          { kw: 'witchy home decor', vol: '10,203', cptd: '4,000 / 5', intent: 'Estética adyacente', dest: 'BK / PPC' },
          { kw: 'gothic home decor', vol: '8,940', cptd: '30,000 / 4', intent: 'Estética', dest: 'B + BK' },
          { kw: 'goth decor', vol: '4,588', cptd: '887 / 2', intent: 'Estética (baja comp)', dest: 'T + B' },
          { kw: 'witchy decor', vol: '4,281', cptd: '848 / 2', intent: 'Estética', dest: 'PPC' },
          { kw: 'skull decor', vol: '4,136', cptd: '993 / 6', intent: 'Estética skull (baja comp)', dest: 'T + B' },
          { kw: 'whimsigoth decor', vol: '3,726', cptd: '385 / 1', intent: 'Estética (baja comp)', dest: 'BK' },
          { kw: 'gothic room decor', vol: '3,214', cptd: '20,000 / 2', intent: 'Estética + habitación', dest: 'A + PPC' },
          { kw: 'goth room decor', vol: '2,979', cptd: '537 / 0', intent: 'Estética + habitación', dest: 'T + B' },
          { kw: 'gothic bedroom decor', vol: '2,893', cptd: '10,000 / 0', intent: 'Uso: dormitorio', dest: 'PPC' },
          { kw: 'goth home decor', vol: '2,536', cptd: '571 / 0', intent: 'Estética', dest: 'B' },
          { kw: 'skull decor for home', vol: '988', cptd: '624 / 0', intent: 'Estética skull', dest: 'B' },
          { kw: 'skull home decor', vol: '482', cptd: '624 / 0', intent: 'Estética skull', dest: 'B' },
        ],
      },
      {
        label: 'Cluster D — Regalo (gift buyers)',
        rows: [
          { kw: 'witchy gifts for women', vol: '4,588', cptd: '658 / 8', intent: 'Regalo estética', dest: 'PPC' },
          { kw: 'witchy gifts', vol: '3,369', cptd: '9,000 / 11', intent: 'Regalo estética', dest: 'BK / PPC' },
          { kw: 'candle gift set', vol: '1,259', cptd: '445 / 11', intent: 'Regalo (forma)', dest: 'B' },
          { kw: 'goth gifts', vol: '1,261', cptd: '775 / 1', intent: 'Regalo estética', dest: 'BK' },
          { kw: 'gothic gifts', vol: '1,072', cptd: '798 / 1', intent: 'Regalo', dest: 'BK' },
          { kw: 'gothic gifts for women', vol: '1,072', cptd: '644 / 1', intent: 'Regalo', dest: 'BK / PPC' },
          { kw: 'goth gifts for women', vol: '988', cptd: '684 / 0', intent: 'Regalo', dest: 'BK' },
          { kw: 'candle gifts for women', vol: '649', cptd: '656 / 4', intent: 'Regalo (forma)', dest: 'BK' },
          { kw: 'skull gifts for women', vol: '630', cptd: '535 / 2', intent: 'Regalo skull', dest: 'BK' },
          { kw: 'skull gifts', vol: '598', cptd: '654 / 3', intent: 'Regalo skull', dest: 'B (una vez)' },
          { kw: 'skull gifts for men', vol: '563', cptd: '412 / 2', intent: 'Regalo skull', dest: 'BK' },
        ],
      },
      {
        label: 'Cluster E — Aroma / material / feature (drivers, no ranking)',
        rows: [
          { kw: 'pine candle', vol: '1,175', cptd: '4,000 / 3', intent: 'Aroma', dest: 'B + BK' },
          { kw: 'pine scented candles', vol: '647', cptd: '2,000 / 3', intent: 'Aroma', dest: 'BK' },
          { kw: 'cedar candle', vol: '671', cptd: '2,000 / 1', intent: 'Aroma adyacente', dest: 'BK' },
          { kw: 'woodsy candle', vol: '411', cptd: '396 / 0', intent: 'Aroma adyacente', dest: 'BK' },
          { kw: 'forest candle', vol: '453', cptd: '3,000 / 0', intent: 'Aroma adyacente', dest: 'BK' },
          { kw: 'Pine & Moss (aroma exacto)', vol: '~0', cptd: '—', intent: 'Driver de calidad', dest: 'B + A (no ranking)' },
          { kw: 'black paraffin / true black', vol: '~0', cptd: '—', intent: 'Driver anti-objeción', dest: 'B + A (no ranking)' },
        ],
      },
      {
        label: 'Cluster F — Halloween (SOLO PPC estacional Sep–Oct — nunca en copy visible)',
        rows: [
          { kw: 'halloween candles', vol: '6,512', cptd: '10,000 / 2', intent: 'Estacional', dest: 'PPC (temporada)' },
          { kw: 'halloween candle', vol: '2,202', cptd: '10,000 / 3', intent: 'Estacional', dest: 'PPC (temporada)' },
          { kw: 'halloween skulls', vol: '740', cptd: '30,000 / 4', intent: 'Estacional', dest: 'PPC (temporada)' },
          { kw: 'halloween skull', vol: '615', cptd: '30,000 / 9', intent: 'Estacional', dest: 'PPC (temporada)' },
          { kw: 'gothic halloween decor', vol: '1,615', cptd: '10,000 / 2', intent: 'Estacional', dest: 'PPC (temporada)' },
        ],
      },
    ],
    headerRec: `skull candle set · gothic candles / goth candles · spine candle (diferenciador) · skull candle · black (parafina negra) · goth room decor / skull decor (ancla) · witchy · ritual candle · gift · features (real black paraffin, Pine & Moss, sculpted, 2 votives).`,
    negatives: `warmer · candle warmer · warmer lamp · wax melt · wax warmer · candles not included · mold · resin mold · silicone mold · wall art · canvas · candelabra · candlestick holder · candle holder · sconce · lighter · planter · vase · scrunchies · cutting dies · birthday number candles · taper candles · unity candle. (MAVRA es vela real, no calentador/molde/portavelas.)`,
    competitors: {
      source: 'Helium 10 Product Research (Black Box) + Competitor Benchmark LIVE · US · 2026-07-25 · deduplicado por ASIN · rankeado por revenue/mo',
      topVoc: ['B0BTB3TC4Z', 'B08Y981X34', 'B0B7GQ6K7X', 'B0DWJW1DV5', 'B0DZBHZS3J', 'B0FB8DFJY6', 'B0FQC81Q33', 'B0C8T92RLR', 'B09CGSDVS8', 'B0D4C149BT'],
      footnote: '* Ventas mensuales actuales = 0 (agotado / fuera de temporada en julio). Retenido por ser análogo de SET directo con 36 reseñas 4.8.',
      rows: [
        { asin: 'B0FB8DFJY6', brand: 'DRACIT', title: 'Gothic Skull Framed Canvas Wall Art Set', price: '$104.99', sales: '1,857', revenue: '$172,310', reviews: '253', rating: '4.5', tipo: 'Líder revenue / Adyacente', win: 'Rey de revenue del "gótico-skull" pero es print plano. Su comprador ya decora en dark → cross-category: ofrecerle vela escultórica real 3D.' },
        { asin: 'B0BTB3TC4Z', brand: 'Vela Lanterns', title: 'Gothic Candle Holder Lamp (Purple, L)', price: '$24.99', sales: '2,076', revenue: '$47,125', reviews: '10,409', rating: '4.6', tipo: 'Líder categoría / Sustituto', win: 'Gigante de velas/holders góticos (10k reseñas = VOC gold). Es holder, no vela real esculpida ni set.' },
        { asin: 'B0FQC81Q33', brand: 'CULACEE', title: '"Season of the Witch" Ritual Candle (Samhain/Pagan)', price: '$14.29', sales: '1,280', revenue: '$21,231', reviews: '196', rating: '4.5', tipo: 'Adyacente', win: 'Vela ritual/witch de alto volumen. Comparte comprador altar/ritual; MAVRA gana con set completo skull+spine + parafina negra real.' },
        { asin: 'B0D4C149BT', brand: 'Luminara', title: 'Skeleton Hands Flameless LED Candle', price: '$54.99', sales: '26', revenue: '$1,316', reviews: '110', rating: '4.8', tipo: 'Sustituto de formato', win: 'Vela flameless figural premium ($55). Prueba el ticket alto; MAVRA da llama real + set + spine único.' },
        { asin: 'B08Y981X34', brand: 'GUTE', title: 'Skull Candle R.I.P. Coffin, quema 12h', price: '$24.99', sales: '18', revenue: '$343', reviews: '739', rating: '4.6', tipo: 'Directo', win: 'Vela skull real más reseñada (739 = VOC gold del producto exacto). Pieza única; MAVRA gana con el set de 4 + spine + aroma.' },
        { asin: 'B0B7GQ6K7X', brand: 'Zellinni', title: 'Spine Candle (soy, unscented)', price: '$8.99', sales: '46', revenue: '$409', reviews: '583', rating: '4.7', tipo: 'Directo', win: 'Incumbente del spine: pieza sola, soja, sin aroma. Interceptar con "set completo + Pine & Moss + parafina negra".' },
        { asin: 'B0DWJW1DV5', brand: 'Immeiscent', title: 'Glass Flameless Gothic Skull Floral Candle', price: '$22.69', sales: '31', revenue: '$806', reviews: '302', rating: '4.5', tipo: 'Sustituto de formato', win: 'Skull flameless en vidrio. VOC útil; MAVRA gana con cera real esculpida vs. LED.' },
        { asin: 'B0DZBHZS3J', brand: 'FLAVCHARM', title: 'Glass Flameless Skeleton Candle', price: '$25.99', sales: '15', revenue: '$445', reviews: '267', rating: '4.4', tipo: 'Sustituto de formato', win: 'Skeleton flameless. Mismo argumento: vela real + set + spine vs. novelty LED.' },
        { asin: 'B09CGSDVS8', brand: 'KORMMCO', title: 'Gothic Skull Candle, Large', price: '$17.99', sales: '23', revenue: '$401', reviews: '137', rating: '4.6', tipo: 'Directo', win: 'Vela skull grande individual. MAVRA gana con set de 4, aroma y "no blanquea".' },
        { asin: 'B0C8T92RLR', brand: 'SUPERSUN', title: 'Skeleton Candle, Gothic Vintage', price: '$18.04', sales: '13', revenue: '$240', reviews: '141', rating: '4.5', tipo: 'Directo', win: 'Vela skeleton decorativa. Pieza suelta; ganamos con set + spine + parafina negra real.' },
        { asin: 'B0B5LVZ1S1', brand: 'GUTE', title: 'Skull Blood Candles 2-Pack (bleeding red wax)', price: '$19.95', sales: '51', revenue: '$1,015', reviews: '100', rating: '4.5', tipo: 'Directo', win: 'Set skull de 2 con gimmick de sangre. MAVRA gana con estética premium permanente (no gore de temporada) + spine + aroma.' },
        { asin: 'B09ZHVC8DY', brand: 'Kobi & Knight', title: 'Black Skull Candle Set (snake+spine, coffin box)', price: '$39.99', sales: '10', revenue: '$388', reviews: '79', rating: '4.8', tipo: 'Directo', win: 'Análogo de SET más directo (skull+snake+spine en caja). Ganamos por parafina real esculpida + 4 piezas + aroma + no-blanqueo.' },
        { asin: 'B09ZG9925K', brand: 'GUTE', title: 'Skull & Spine Candles 4-Pack (snake+bones)', price: '$34.95', sales: '0*', revenue: '$0*', reviews: '36', rating: '4.8', tipo: 'Directo', win: 'Otro SET de 4 con skull+spine — el análogo de composición más cercano. Sin ventas actuales (agotado/estacional); yr-sales 33. Oportunidad: ejecutar mejor y con aroma.' },
        { asin: 'B07L7SQBCP', brand: 'The Psych Store', title: 'Spine Candle Holder (anatomical)', price: '$54.00', sales: '1', revenue: '$58', reviews: '88', rating: '4.7', tipo: 'Adyacente', win: 'Holder de columna anatómica premium. Confirma demanda por la pieza "spine"; MAVRA lo entrega como vela real dentro de un set.' },
        { asin: 'B0FGPBMZSR', brand: 'ElectricWise', title: 'Spine Candle (beeswax)', price: '$14.99', sales: '25', revenue: '$380', reviews: '18', rating: '4.0', tipo: 'Directo / Conquistable', win: 'Spine de cera de abeja, 4.0★ / 18 reseñas = débil. Conquistable; MAVRA da spine + skull + votivas + aroma.' },
      ],
    },
    campaigns: {
      methodology: `Base: AdsCrafted (Discovery → Harvest → Scale) + Chris Rawlings / Sophie Society (dominar top-of-search de la hero; ranking-first en lanzamiento, pivote a profit al llegar a top-3 orgánico). Precio: único set análogo directo Kobi & Knight $39.99 (skull+spine en coffin box); spine solo Zellinni $8.99 / ElectricWise $14.99. Set de 4 esculpido + parafina real + aroma → band premium ~$34.99–$54.99 (confirmar con Frank).`,
      sp: [
        {
          code: 'C1', name: 'SP Exact "Hero / Ranking"', tag: 'ranking-first, Rawlings',
          fields: [
            { label: 'Keywords (SKAG)', value: 'skull candle set · skull candle · gothic candles · goth candles · spine candle · skull decor · goth room decor' },
            { label: 'Objetivo', value: 'Dominar top-of-search de la cabeza ownable (td 0–3). Bid agresivo + Top-of-Search modifier +50% a +100%.' },
            { label: 'Bid / Budget', value: '$0.80–$1.50 · $25–$40/día (el grueso del lanzamiento)' },
            { label: 'ACOS', value: 'Tolerar 60–100% las primeras 2–3 semanas, luego bajar a profit.' },
            { label: 'Prioridad', value: 'spine candle + skull candle set — donde ganamos por producto (único set con spine real) → rankear ahí primero.' },
          ],
        },
        {
          code: 'C2', name: 'SP Phrase "Expansion"', tag: 'estética + ritual + forma',
          fields: [
            { label: 'Keywords', value: 'gothic decor · goth decor · goth home decor · gothic home decor · witch candles · ritual candles · witchy candles · black skull candle · candle gift set · skull decor for home' },
            { label: 'Bid / Budget', value: '$0.60–$1.10 · $12–$20/día' },
            { label: 'Nota', value: 'Vigilar black candles / decorative candles (demasiado genéricos) → a negativo si CVR bajo.' },
          ],
        },
        {
          code: 'C3', name: 'SP Broad "Discovery"', tag: '+ modificador',
          fields: [
            { label: 'Keywords broad', value: 'skull decor · gothic decor · goth room decor · witchy home decor · dark academia decor · witch candles · skull gifts' },
            { label: 'Bid / Budget', value: '$0.40–$0.75 · $10–$15/día · dynamic bids down-only al inicio' },
            { label: 'Nota', value: 'Motor de cosecha de search terms — su producto es el reporte de términos, no el ACOS.' },
          ],
        },
        {
          code: 'C4', name: 'SP Auto "Discovery"',
          fields: [
            { label: 'Targeting', value: 'Las 4 targeting groups (close, loose, complements, substitutes)' },
            { label: 'Bid / Budget', value: '$0.35–$0.70 · $10–$15/día' },
            { label: 'Nota', value: 'Complements/substitutes descubre ASINs de competidores para C6 (goth candle sets, spine candles, skull decor).' },
          ],
        },
        {
          code: 'C5', name: 'SP Auto/Broad "Halloween Seasonal"', tag: 'solo Sep–Oct, apagada el resto del año',
          fields: [
            { label: 'Recoge', value: 'Pico estacional (halloween candles, halloween skulls, gothic halloween decor, spooky home decor) — mismo listing permanente.' },
            { label: 'Bid / Budget', value: '$0.55–$1.10 · $15–$30/día solo en ventana · Pausar 1-nov' },
          ],
        },
        {
          code: 'C6', name: 'SP Product/ASIN "Competitor Conquest"',
          fields: [
            { label: 'Bid / Budget', value: '$0.70–$1.40 · $10–$18/día' },
            { label: 'Nota', value: 'Placement en la página del competidor = interceptar al que ya quiere lo gótico-skull.' },
          ],
          asins: [
            { asin: 'B09ZHVC8DY', desc: 'Kobi & Knight Black Skull Candle Set — $39.99 · 10/mo · 4.8★ · 79 rev (análogo de set MÁS directo)' },
            { asin: 'B0B7GQ6K7X', desc: 'Zellinni Spine Candle — $8.99 · 46/mo · 4.7★ · 583 rev (incumbente del spine, sin aroma)' },
            { asin: 'B0FGPBMZSR', desc: 'ElectricWise Spine Candle — $14.99 · 25/mo · 4★ · 18 rev (rating débil → conquistable)' },
            { asin: 'B0GFPBVVLQ', desc: 'Nomnu Skull Candle Warmer Lamp — $74.97 · 1,304/mo · 4.8★ (candles NOT included → interceptar)' },
            { asin: 'B0GC94MMZN / B0DGB5PXT1', desc: 'Sneferu Skull Planter Spine Gothic Vase — $25.99/$27.99 (tráfico "spine gothic")' },
            { asin: 'B0FB88BNLC / B0FB8DFJY6', desc: 'DRACIT Gothic Skull Canvas Wall Art — $75.99/$104.99 · 1,857/mo (líder revenue gótico-skull)' },
          ],
        },
      ],
      harvesting: [
        'Cadencia: cada 3–4 días, search term report de las campañas de descubrimiento (C3 broad, C4 auto, C5 seasonal).',
        'Graduación (G1): search term con Orders ≥ 2 (o 1 si el ACoS ya se disparó) → duplicar a C1 Exact. Bid de arranque = RPC = (Revenue / Clicks) × Target ACoS. La graduación es SIEMPRE a exact.',
        'Negar-vs-ladder (raíz-vs-cerrado): si el término es una RAÍZ con hijos por descubrir → NO se niega en la fuente; se re-siembra el ladder de match (exact 100% · phrase 0.75× · broad 0.5×, convención de industria) para seguir cosechando sus hijos. Si es un término CERRADO (long-tail de compra, sin hijos) → se aísla el exact + negative-exact en la fuente.',
        'Negativizador (N1): término con clics ≥ piso por tipo (SP 30 · SD 12 · SBV 15) Y (spend ≥ 1.5–2× CPA objetivo ó ACoS ≫ target) con 0 órdenes → negative exact. El piso por tipo es intención/CPC del canal, no significancia estadística.',
        'Word-level (N2): una palabra con ≥ 50 clics acumulados y 0 órdenes → negative phrase a nivel de cuenta.',
        'Negativos permanentes desde día 1 (mal-calificados): warmer, candle warmer, wax melt, wax warmer, mold, resin/silicone mold, wall art, canvas, candelabra, candle/candlestick holder, sconce, taper candles, unity candle.',
        'Semanal: subir bid/modifier de los exact que rankean top-5 orgánico; al llegar a top-3 en la hero (spine candle / skull candle set) → bajar bid (Rawlings: ya no pagás por el ranking ganado).',
        'Todos los umbrales (30/12/15 clics, ≥2 órdenes, ≥50 word-level, 1.5–2× CPA) son defaults editables por el usuario.',
      ],
      sbv: [
        {
          code: 'SBV-1', name: '"The Ritual / Dark Aesthetic"', tag: 'categoría, ofensiva — el spine como hook',
          keywords: 'skull candle · gothic candles · spine candle · goth room decor · skull decor · witch candles · dark academia decor',
          angle: `Abrir 2 s en oscuro total → una cerilla enciende el skull → reveal del set completo (skull + spine parándose vertical + 2 votivas) sobre superficie oscura. Quick-cuts: macro de las suturas → wax pool negro (que NO blanquea) → texto "Skull 12h · Spine 6h" → plano de altar real, permanente. Cierre en wordmark MAVRA + "Inhabit Your Shadow". El spine levantándose es el scroll-stop.`,
          bid: '$0.70–$1.40', budget: '$12–$20/día',
        },
        {
          code: 'SBV-2', name: '"Defensive / Conquest"', tag: 'defensiva + intercepción',
          keywords: 'skull candle set · spine candle · gothic candles · + targeting a ASINs de C6 (Kobi, Zellinni, ElectricWise, Nomnu)',
          angle: `Mismo hook del ritual, cierra en comparación implícita — "4 pieces · real black paraffin, no white bleed · sculpted, not stamped · Pine & Moss · gift-boxed" (lo que los competidores no tienen: Zellinni es 1 pieza sin aroma; Kobi no es parafina esculpida premium).`,
          bid: '$0.65–$1.25', budget: '$8–$15/día',
        },
      ],
      budget: `~$85–$140/día en la ventana de ranking (primeras 3–4 semanas), 45–55% en C1 (Exact Hero: spine candle + skull candle set) + SBV-1. Fuera de ventana: ~$45–70/día en modo profit.`,
    },
    notes: [
      { head: 'Conflicto sin resolver — altura del spine', body: 'Aparece como 5.67" en el overlay de imagen (Slot 2) pero se marcó conflicto vs ~10". El copy NO afirma la altura del spine — solo el ancho del skull (4.53"), que sí está confirmado. Resolver con medición física antes de agregarla.' },
      { head: 'COSMO gap — imágenes vs. copy', body: 'Imágenes YA cubren set de 4, escala del skull, caja de regalo, altar permanente, textura esculpida + "Pine & Moss", spine solo, burn 12h/6h. El copy refuerza lo que la imagen NO verbaliza: la objeción "quema en blanco" rebatida en palabras (Bullet 2), el framing "set/ritual de 4 piezas" como valor, keywords de estética/uso, el aroma DESCRITO (forest resin/damp earth), el ángulo regalo como keyword, y la permanencia afirmada explícita.' },
      { head: 'Supuestos & pendiente H10', body: 'Precio no confirmado → band $34.99–$54.99 (confirmar con Frank). ASIN propio no disponible → no se corrió Cerebro. 9 seeds de Magnet + 3 Product Research corrieron OK, cero errores de auth, volúmenes reales. Recomendado: search_amazon_brand_analytics (ABA click/conversion share) sobre skull candle / gothic candles / spine candle.' },
    ],
    sustento: {
      titleKeywords: [
        {
          label: 'skull candle set (product-exact)',
          metrics: 'Relevancia REAL vs reportada · ~0 vol medido · cp 914 · td 1',
          a910: `Frase exacta con ~0 volumen medido PERO product-exact y baja competencia. H10 no mide demanda, pero es el producto literal → va en título por relevancia de texto. Único análogo de set real: Kobi & Knight (10/mo).`,
          cosmo: `El intent "quiero un SET de velas skull, no una suelta" conecta con el atributo 4 piezas (skull + spine + 2 votivas); COSMO premia el fit de composición completa que casi nadie ofrece.`,
          voc: `"the whole thing (coffin and all) comes packed… seated comfortably in a foam fitting. This is a fantastic gift package." (Kobi & Knight, 5★)`,
        },
        {
          label: 'skull candle',
          metrics: 'Vol 907/mo · td 11 · cp 804',
          a910: `td alto (competido en título), pero es el producto genuino. El volumen alto aparente ("skull candle warmer" 3,212) es de WARMERS, no velas → negativo. La vela real es nicho chico y limpio.`,
          cosmo: `"skull candle" con intención de vela-objeto real; COSMO separa la vela esculpida del warmer que domina el término literal pero no es una vela.`,
          voc: `"They are too nice to light. They are for decor only." (Kobi & Knight, 5★)`,
        },
        {
          label: 'gothic candles',
          metrics: 'gothic candles 654/mo · td 3 · gothic candle 485 · td 3 · goth candles 462 · td 1',
          a910: `td bajo (1-3) = ownable. Título + bullets.`,
          cosmo: `Intención estética "velas góticas"; COSMO liga el contexto goth-permanente con el set esculpido de parafina negra, por encima de velas negras genéricas de cumpleaños/boda.`,
          voc: `"they're just the right combinations of goth, creepy, and spooky that I love to use in my home… it's definitely not just for Halloween." (Kobi & Knight, 5★)`,
        },
        {
          label: 'spine candle (diferenciador / moat)',
          metrics: 'Vol 531/mo · td 3 · cp solo 203 (muy baja competencia)',
          a910: `td 3 = ownable. Único incumbente real: Zellinni ($8.99, pieza sola, sin aroma). Término donde ganamos por producto → prioridad de ranking.`,
          cosmo: `"spine candle" es intención de pieza anatómica única; COSMO conecta con el spine esculpido dentro de un SET completo con aroma, superando al spine suelto sin aroma del incumbente.`,
          voc: `"The spinal column candle is so realistic that it led a guest of ours to remark that they must have made the cast from a real human spine." (Kobi & Knight, 5★)`,
        },
        {
          label: 'black (Real Black Paraffin)',
          metrics: 'black skull candle 132/mo · td 1 · black candles 11,220 · td 2 (ambigua)',
          a910: `black candles es cabeza gigante pero ambigua (taper/pillar/boda = forma equivocada) → se captura parcial vía el token "black" del título; en PPC va phrase con negativos.`,
          cosmo: `El intent "vela negra de verdad" conecta con el atributo parafina negra al núcleo que no blanquea; COSMO premia el atributo que resuelve el miedo "sale gris".`,
          voc: `"A problem with many black candles is that it's usually just a shade of grey… yet these candles are definitely a rich black color." (Kobi & Knight, 5★) + color al núcleo, lo que el comprador exige: "colored all the way through rather than being white in the center." (Tobeape, 5★)`,
        },
        {
          label: 'goth room decor / skull decor (ancla)',
          metrics: 'goth room decor 2,979/mo · td 0 · skull decor 4,136 · td 6 · cp solo 993',
          a910: `Anclas estéticas de baja competencia; el comprador entra por estética, no por "vela".`,
          cosmo: `Intención de decoración permanente de habitación gótica; COSMO matchea el contexto year-round con el set-como-decor (que el cliente trata como escultura, "too pretty to burn").`,
          voc: `"I love this candle so much I cannot bring myself to light it… probably one of the better decorations in my room." (Zellinni, 5★)`,
        },
        {
          label: 'witchy / ritual candle',
          metrics: 'witch candles 1,259/mo · td 1 · ritual candles 991 · td 1 · witchy candles 573 · td 0',
          a910: `Intención adyacente caliente, td 0-1 = ownable en bullets/backend.`,
          cosmo: `"ritual/witch candle" conecta con el set como altar; COSMO liga la intención ritual con la composición de 4 piezas sin mentir sobre el producto (es decor/altar).`,
          voc: `Uso ritual real del comprador: "Good quality I use them for candle magic as I am a Wiccan." (Tobeape, 5★) + "a gorgeous altar-ready look right out of the box… Perfect for Samhain, autumn rituals, and spellwork." (CULACEE, 5★)`,
        },
        {
          label: 'Pine & Moss / scented (aroma — driver)',
          metrics: 'No es keyword · pine candle 1,175/mo · td 3 · woodsy candle 411 (adyacentes)',
          a910: `Aroma = driver de calidad: se vende en imagen/bullet/A+, no se rankea.`,
          cosmo: `El intent implícito "que huela bien, no químico" conecta con el atributo Pine & Moss (forest resin / damp earth); COSMO premia el fit sensorial, que es el gap #1 del nicho.`,
          voc: `El gap #1 del nicho (aroma químico o ausente): "it smells like poison, just a horrendous smell. Like car oil maybe?" (Kobi & Knight, 3★) + "I couldn't smell the scent at all… The fragrance throw is basically nonexistent." (CULACEE, 3★)`,
        },
        {
          label: 'sculpted',
          metrics: 'Diferenciador de producto · sin keyword de volumen',
          a910: `Atributo de diferenciación (esculpido, no estampado) que va en título por relevancia de producto.`,
          cosmo: `Intención "detalle real, no molde genérico"; COSMO liga el contexto de calidad artesanal con las suturas/anatomía esculpidas a mano.`,
          voc: `"The details in the skull, snake and spine are pretty amazing, as even the scales on the snake are super detailed." (Kobi & Knight, 5★)`,
        },
        {
          label: 'gift (candle gift set / witchy-goth-skull gifts)',
          metrics: 'candle gift set 1,259/mo · td 11 · witchy gifts 3,369 · goth gifts 1,261 · skull gifts 598',
          a910: `Segmento regalo con volumen propio; la caja de regalo ya lo justifica en imagen.`,
          cosmo: `"gift" conecta con el atributo caja de regalo lista; COSMO lo enlaza con el nicho de regalo probado (incl. quiroprácticos por el spine).`,
          voc: `"perfect for gifting to chiropractors, orthopedics, or other bone-doctors!" (Zellinni, 5★)`,
        },
      ],
      claims: [
        {
          label: '1. A COMPLETE RITUAL, NOT A LONE CANDLE — Skull + Spine + 2 Votives',
          metrics: 'spine candle 531 · td 3 + skull candle set (product-exact)',
          a910: `Convierte el set en argumento; señal de diferenciación vs. rivales que venden 1 pieza.`,
          cosmo: `El intent "el set completo / el altar" conecta con las 4 piezas como composición; el spine es el atributo que "tu repisa no tenía".`,
          voc: `"must have made the cast from a real human spine" (Kobi & Knight, 5★) + framing altar: "they're just the right combinations of goth, creepy, and spooky that I love to use in my home." (Kobi & Knight, 5★)`,
        },
        {
          label: `2. TRUE BLACK, ALL THE WAY DOWN — Real Black Paraffin That Won't Bleach`,
          metrics: 'Rebate objeción "quema en blanco" (señal A10)',
          a910: `No keyword de ranking; rebate la objeción que la imagen no verbaliza → impacto CVR/rating.`,
          cosmo: `El intent "negro real que no se pone gris" conecta con la parafina pigmentada al núcleo; COSMO premia el atributo que responde el miedo específico.`,
          voc: `Color al núcleo, lo que el comprador exige: "colored all the way through rather than being white in the center." (Tobeape, 5★) + gap: "It looks like a grey hunk of plastic… it is NOT that color." (Zellinni, 1★) + "black residue on my hands that's hard to get off." (Tobeape, 2★)`,
        },
        {
          label: '3. HOURS OF SLOW BURN, BUILT AT REAL SCALE — Skull 12 hrs · Spine 6 hrs',
          metrics: 'Responde "dura poco" + "tamaño chico" con dato (12h/6h · 4.53")',
          a910: `No keyword; anti-devolución = A10.`,
          cosmo: `El intent "que dure / que sea del tamaño de la foto" conecta con el burn time declarado + escala real; COSMO liga la honestidad de atributo con la confianza de compra.`,
          voc: `El rival mintió con el MISMO número que MAVRA declara honesto: "IT SAYS THAT IT BURNS FOR 12 HRS BUT THAT IS COMPLETELY WRONG!… within 2 and half hours it was completely burned out." (GUTE, 3★) + tamaño: "made to look much bigger than it actually is." (ElectricWise, 1★)`,
        },
        {
          label: '4. SCULPTED, NOT STAMPED — Anatomical Detail & a Pine & Moss Scent',
          metrics: 'Esculpido + aroma (el gap #1 del nicho)',
          a910: `No keyword; el aroma convierte una queja de mercado en promesa.`,
          cosmo: `Doble fit: "detalle real" ↔ suturas esculpidas, y "que huela intencional (no dulce/estacional)" ↔ Pine & Moss (forest resin / damp earth).`,
          voc: `Sculpt: "The details in the skull, snake and spine are pretty amazing." (Kobi & Knight, 5★). Aroma-gap (químico o ausente): "it reeks of 'mint'… immediately caused an allergy attack." (Zellinni, 1★) + "I couldn't smell the scent at all… The fragrance throw is basically nonexistent." (CULACEE, 3★)`,
        },
        {
          label: '5. ARRIVES GIFT-READY, STAYS ALL YEAR — Boxed Gothic Home Decor',
          metrics: 'Caja de regalo + permanencia · refuerza candle gift set 1,259',
          a910: `No keyword; refuerza el segmento gift sin perseguir ranking.`,
          cosmo: `El intent "regalo listo / decor todo el año" conecta con gift box + posicionamiento no-Halloween; COSMO lo enlaza con el comprador que decora permanente.`,
          voc: `"I love the box they come in… I also use the coffin box the candle comes in as decor as well. It's packaging is killer!" (Kobi & Knight, 5★) + permanencia: "I display them all year round because every day is Halloween." (Zellinni, 5★)`,
        },
      ],
    },
  },

  // ── 3 SKULLS WALL DECOR (SWD) ───────────────────────────────────────────────
  {
    id: 'wall-skulls',
    sku: 'MAVRA-SWD',
    name: '3 Skulls Wall Decor',
    oneLiner: `Set de 3 cráneos humanos en polirresina negro mate, 3 tamaños 8.15"×5.9" / 7.3"×5.5" / 6.7"×5.1" · montaje con tornillo + chazos O cinta doble-faz permanente (keyhole hanger integrado) · "Sculpted, not stamped" · ventaja única: set de 3 como sistema (los competidores venden 1 solo, o prints planos).`,
    title: {
      primary: {
        count: 190,
        text: `MAVRA Gothic Skull Wall Decor Set of 3 - Sculpted Matte Black Skulls, Real 3D Wall Art Not a Print, Screw or Tape Mount, Goth Room Decor for Bedroom, Skull Decor & Gothic Gift, Not Halloween`,
      },
      alt: {
        label: 'Alternativa keyword-first (190 chars)',
        count: 190,
        text: `Gothic Skull Wall Decor Set of 3 - MAVRA Sculpted Matte Black Skulls, Real 3D Wall Art Not a Print, Screw or Tape Mount, Goth Room Decor, Skull Decor for Bedroom & Gothic Gift, Not Halloween`,
      },
    },
    bullets: [
      {
        headline: 'THREE SKULLS, ONE SYSTEM — A Curated Wall, Not a Single Piece',
        body: `Most gothic skull decor sells you one lonely skull. MAVRA gives you the full trio — three sculpted skulls in graduated sizes (8.15", 7.3", 6.7") engineered to hang together as one composed wall arrangement. Cluster them tight, stagger them across the wall, or frame a mirror — the set does the styling for you. This is a statement, not an afterthought.`,
        note: `diferenciador único: set de 3 como sistema · objeción: "¿un solo cráneo se ve pobre?" → viene el trío completo, ya curado`,
      },
      {
        headline: 'SCULPTED, NOT STAMPED — Real Dimensional Skulls, Never a Flat Print',
        body: `Look closer than the crowd of canvas prints: these are solid, dense polyresin skulls with true anatomical relief — zygomatic arches, temporal detail, real depth that catches a shadow on your wall. Deep matte black, hand-finished so no two are identical. You feel the weight the moment you unbox it. A poster fades into the wall; a MAVRA skull owns it.`,
        note: `objeción: "¿detalle real o molde genérico? ¿es solo un print?" → escultórico, polirresina densa, detalle anatómico, no impresión`,
      },
      {
        headline: 'MOUNT ONCE, HAUNT FOREVER — Your Wall, Your Rules, No Damage',
        body: `Two ways up, both built in: drive the included screw and wall anchors for a permanent hold, or press on the heavy-duty double-sided tape for a renter-friendly, hole-free install. An integrated keyhole hanger sits each skull flush and level in seconds. Bedroom, hallway, studio or dorm — command any wall without fear of wrecking it.`,
        note: `objeción: "¿daña la pared? ¿cómo se monta?" → tornillo+chazos O cinta, keyhole hanger, apto para alquiler`,
      },
      {
        headline: 'MADE TO FIT, BUILT TO HAUNT — Sized for Real Walls, Arrives Ready',
        body: `No guessing what lands at your door: the trio measures 8.15"×5.9", 7.3"×5.5" and 6.7"×5.1" — substantial enough to hold a wall, scaled to sit above a nightstand, console, shelf or headboard without overwhelming the room. Hardware is in the box; it arrives exactly as shown, ready to hang out of the packaging.`,
        note: `objeción: "¿qué tamaño llega? ¿en foto se ve distinto?" → 3 dimensiones exactas + hardware incluido + llega como se muestra`,
      },
      {
        headline: 'PERMANENT GOTHIC DECOR — Not a Costume You Box Up in November',
        body: `MAVRA builds the dark aesthetic as a year-round identity, not a seasonal prop — no orange, no plastic, no expiration date. It's goth room decor and skull decor for people who live in the dark all twelve months, and a striking gothic gift for the one who arranges their darkness with intention. Hang it once; let it haunt the wall forever.`,
        note: `objeción: "¿esto es solo para Halloween?" → NO, permanente año-completo · gift angle · reafirma la voz de marca`,
      },
    ],
    backend: {
      bytes: 242,
      text: `calavera calaveras craneo craneos decoracion gotica macabre memento mori occult witchy whimsigoth dark academia moody spooky skeleton cranium polyresin trio hanging plaque adhesive raven coffin apartment dorm shelf aesthetic calaca gothik skul`,
    },
    keywordClusters: [
      {
        label: 'Cluster A — Cabeza gótico-wall (front-load, máxima prioridad)',
        rows: [
          { kw: 'gothic wall decor', vol: '4,804', cptd: '10,000 / 6', intent: 'Producto exacto (estética+forma)', dest: 'T + B' },
          { kw: 'gothic wall art', vol: '2,549', cptd: '989 / 4', intent: 'Producto exacto (baja comp)', dest: 'T + B' },
          { kw: 'goth wall decor', vol: '1,892', cptd: '760 / 1', intent: 'Producto exacto (muy baja comp)', dest: 'T + B' },
          { kw: 'goth wall art', vol: '637', cptd: '867 / 3', intent: 'Producto exacto', dest: 'B + BK' },
          { kw: 'skull wall decor', vol: '590', cptd: '506 / 6', intent: 'Producto exacto (skull)', dest: 'T + B' },
          { kw: 'skull wall art', vol: '573', cptd: '5,000 / 4', intent: 'Producto exacto (skull)', dest: 'T + B' },
          { kw: 'skull wall mount', vol: '368', cptd: '516 / 5', intent: 'Producto + montaje', dest: 'B + PPC' },
          { kw: 'wall decor gothic', vol: '232', cptd: '719 / 3', intent: 'Producto (inverso)', dest: 'PPC' },
        ],
      },
      {
        label: 'Cluster B — Skull decor (cabeza skull, señales de compra altas)',
        rows: [
          { kw: 'skull decor', vol: '4,136', cptd: '993 / 6 · cnv 9%', intent: 'Estética skull (baja comp)', dest: 'T + B' },
          { kw: 'skulls', vol: '3,372', cptd: '100,000 / 13', intent: 'Muy amplio', dest: 'PPC auto/broad' },
          { kw: 'skull decor for home', vol: '988', cptd: '624 / 0 · cnv 33%', intent: 'Estética skull', dest: 'T/B' },
          { kw: 'skull home decor', vol: '482', cptd: '624 / 0 · cnv 33%', intent: 'Estética skull', dest: 'B' },
          { kw: 'skull decor for men', vol: '323', cptd: '337 / 0', intent: 'Regalo/uso', dest: 'BK' },
          { kw: 'skull decor for bedroom', vol: '306', cptd: '540 / 0', intent: 'Uso: dormitorio', dest: 'B' },
          { kw: 'macabre decor', vol: '617', cptd: '420 / 0 · cnv 33%', intent: 'Estética adyacente', dest: 'BK / PPC' },
        ],
      },
      {
        label: 'Cluster C — Estética / decor (ancla de categoría, alto volumen)',
        rows: [
          { kw: 'gothic decor', vol: '22,073', cptd: '30,000 / 5 · cnv 12%', intent: 'Estética', dest: 'B + A + PPC broad' },
          { kw: 'dark academia decor', vol: '14,267', cptd: '6,000 / 4 · cnv 8%', intent: 'Estética adyacente', dest: 'B + BK + A' },
          { kw: 'witchy home decor', vol: '10,203', cptd: '4,000 / 5 · cnv 9%', intent: 'Estética adyacente', dest: 'BK / PPC' },
          { kw: 'gothic home decor', vol: '8,940', cptd: '30,000 / 4', intent: 'Estética', dest: 'B + BK' },
          { kw: 'spooky home decor', vol: '4,561', cptd: '973 / 0 · cnv 20%', intent: 'Estética', dest: 'BK / PPC' },
          { kw: 'witchy decor', vol: '4,281', cptd: '848 / 2 · cnv 15%', intent: 'Estética', dest: 'BK / PPC' },
          { kw: 'whimsigoth decor', vol: '3,726', cptd: '385 / 1 · cnv 19%', intent: 'Estética (baja comp)', dest: 'BK / PPC' },
          { kw: 'moody decor', vol: '3,374', cptd: '394 / 0 · cnv 11%', intent: 'Estética', dest: 'BK' },
          { kw: 'gothic room decor', vol: '3,214', cptd: '20,000 / 2', intent: 'Estética + habitación', dest: 'A + PPC' },
          { kw: 'goth room decor', vol: '2,979', cptd: '537 / 0 · cnv 18%', intent: 'Estética + habitación', dest: 'T + B' },
          { kw: 'gothic bedroom decor', vol: '2,893', cptd: '527 / 0', intent: 'Uso: dormitorio', dest: 'B + PPC' },
          { kw: 'goth home decor', vol: '2,536', cptd: '571 / 0', intent: 'Estética', dest: 'B' },
          { kw: 'goth bedroom decor', vol: '1,170', cptd: '481 / 0', intent: 'Uso: dormitorio', dest: 'PPC' },
          { kw: 'gothic office decor', vol: '1,615', cptd: '423 / 2 · cnv 30%', intent: 'Uso: oficina', dest: 'PPC' },
        ],
      },
      {
        label: 'Cluster D — Regalo (gift buyers, conversión alta)',
        rows: [
          { kw: 'goth gifts', vol: '1,261', cptd: '775 / 1', intent: 'Regalo estética', dest: 'BK / PPC' },
          { kw: 'gothic gifts for women', vol: '1,072', cptd: '644 / 1 · cnv 29%', intent: 'Regalo', dest: 'BK / PPC' },
          { kw: 'goth gifts for women', vol: '988', cptd: '684 / 1 · cnv 10%', intent: 'Regalo', dest: 'BK' },
          { kw: 'skull gifts for women', vol: '630', cptd: '535 / 2 · cnv 14%', intent: 'Regalo skull', dest: 'BK' },
          { kw: 'skull gifts', vol: '598', cptd: '654 / 3 · cnv 17%', intent: 'Regalo skull', dest: 'B (una vez)' },
          { kw: 'goth girl gifts', vol: '575', cptd: '548 / 0 · cnv 33%', intent: 'Regalo', dest: 'BK' },
          { kw: 'skull gifts for men', vol: '563', cptd: '412 / 2 · cnv 22%', intent: 'Regalo skull', dest: 'BK' },
          { kw: 'goth gift', vol: '462', cptd: '461 / 0 · cnv 40%', intent: 'Regalo', dest: 'BK / PPC' },
          { kw: 'goth gift set', vol: '382', cptd: '350 / 0', intent: 'Regalo (set!)', dest: 'BK' },
        ],
      },
      {
        label: 'Cluster E — Adyacentes / backend-only (para BK)',
        rows: [
          { kw: 'witchcraft decor', vol: '637', cptd: '403 / 2 · cnv 25%', intent: 'Estética adyacente', dest: 'BK' },
          { kw: 'occult decor', vol: '524', cptd: '529 / 3', intent: 'Estética adyacente', dest: 'BK' },
          { kw: 'gothic aesthetic', vol: '315', cptd: '420 / 3', intent: 'Estética', dest: 'BK' },
          { kw: 'anatomical skull decor', vol: '0', cptd: '1,000 / 0', intent: 'Producto exacto (0 vol, semántico)', dest: 'BK' },
        ],
      },
    ],
    headerRec: `gothic wall decor / gothic skull wall decor · skull wall decor · skull wall art · goth wall decor · skull decor · goth room decor · bedroom · + diferenciadores (set of 3, sculpted, matte black, not a print, screw or tape mount, not Halloween).`,
    negatives: `Negativos de nicho (aesthetic equivocado): cow skull wall decor · bull skull wall decor · longhorn/steer/deer/elk skull · western/cowboy/cowgirl/southwestern · sugar skull / dia de los muertos / day of the dead · sugar skull decor. Además, desde día 1: canvas · poster · print · painting · framed · tapestry · wallpaper · decal · sticker · mold · diamond art · neon sign · tin sign · planter · shower curtain · tumbler · mug.`,
    competitors: {
      source: 'Helium 10 Product Research (Black Box) + Competitor Benchmark LIVE · US · 2026-07-25 · deduplicado por ASIN · rankeado por revenue/mo',
      topVoc: ['B09GB1CDXM', 'B0CKR5Y7WL', 'B0FB3S891Q', 'B0GSZPRFCN', 'B0FBG2RX3R', 'B0DJQJJ2M4', 'B0FCS58SWD', 'B0FF3WRFGN', 'B0DM8QBTHN', 'B0FB8DFJY6'],
      rows: [
        { asin: 'B0FF3WRFGN', brand: 'FWIEXA', title: 'Halloween Skeleton Canvas Set of 3, Gothic Skull', price: '$129.99', sales: '2,655', revenue: '$268,330', reviews: '310', rating: '4.6', tipo: 'Líder revenue / Sustituto', win: 'Rey del nicho pero print plano set of 3. Interceptar con "real 3D sculpted skulls, not a print" — mismo "set of 3", ejecución superior.' },
        { asin: 'B0FB3S891Q', brand: 'HPNIUB', title: 'Halloween Witch/Skeleton Framed Canvas Set', price: '$94.99', sales: '2,106', revenue: '$208,664', reviews: '525', rating: '4.5', tipo: 'Sustituto', win: '2º en revenue, 525 reseñas (VOC alto). Canvas; MAVRA gana en dimensión/sombra real y permanencia (no "Halloween").' },
        { asin: 'B0FBG2RX3R', brand: 'CHDITB', title: 'Spooky Ghost Gothic Framed Canvas Set', price: '$94.99', sales: '2,126', revenue: '$202,119', reviews: '516', rating: '4.4', tipo: 'Sustituto', win: 'Canvas ghost/gótico, 4.4 conquistable. Su comprador quiere pared gótica → darle escultura 3D.' },
        { asin: 'B0FB8DFJY6', brand: 'DRACIT', title: 'Gothic Skull Framed Canvas Set', price: '$104.99', sales: '1,857', revenue: '$172,310', reviews: '253', rating: '4.5', tipo: 'Sustituto', win: 'Canvas gótico-skull directo de tema. El match temático más cercano en print → contraste 3D es máximo.' },
        { asin: 'B0FB8VRY1C', brand: 'BICERE', title: 'Large Vintage Skull Floral Framed Canvas Set', price: '$106.99', sales: '1,879', revenue: '$164,909', reviews: '152', rating: '4.3', tipo: 'Sustituto / Conquistable', win: 'Skull canvas grande, 4.3★ = el canvas más débil del top. Objetivo de conquest por rating + forma real.' },
        { asin: 'B0FCS58SWD', brand: 'Ausril', title: 'Halloween Moon Castle Framed Canvas Set', price: '$94.99', sales: '1,519', revenue: '$135,495', reviews: '401', rating: '4.5', tipo: 'Sustituto', win: 'Canvas dark-fantasy, 401 reseñas (VOC). Mismo band $95; MAVRA ofrece objeto real montable.' },
        { asin: 'B0FD3112RF', brand: 'KAIRNE', title: 'Framed Skeleton/Witch Crow Canvas Set of 3', price: '$94.99', sales: '1,551', revenue: '$152,544', reviews: '55', rating: '4.4', tipo: 'Sustituto', win: 'Canvas set of 3, pocas reseñas (55) = entrada temprana ganable con pieza 3D.' },
        { asin: 'B0CKR5Y7WL', brand: 'ANERZA', title: '16-Pcs Dark Academia / Gothic Moody Wall Kit', price: '$16.99', sales: '1,751', revenue: '$63,031', reviews: '995', rating: '4.4', tipo: 'Sustituto', win: 'Kit barato de láminas dark-academia, 995 reseñas = VOC gold. Segmento low-price; MAVRA es statement premium.' },
        { asin: 'B0FFM5SLJQ', brand: 'KNBKID', title: 'Dark Academia Gothic Ghost/Skull Wall Art Set of 3', price: '$32.99', sales: '1,058', revenue: '$53,683', reviews: '81', rating: '4.5', tipo: 'Sustituto', win: 'Set of 3 dark-academia gótico — comprador ideal de MAVRA en formato print. Conquist directo.' },
        { asin: 'B0GSZPRFCN', brand: 'Dolkgy', title: 'Skull Wall Planters Set of 3 (hanging 3D)', price: '$42.99', sales: '341', revenue: '$8,852', reviews: '518', rating: '4.7', tipo: 'Directo de forma', win: 'El análogo de forma más cercano: 3 cráneos 3D reales montables en pared. Son macetas, pero validan el "set of 3 escultórico". MAVRA gana como decor puro (sin planta) + detalle anatómico.' },
        { asin: 'B0DJQJJ2M4', brand: 'VINADECOR', title: 'Real Death-Head Moth Skull Shadow Box Gothic', price: '$69.75', sales: '535', revenue: '$30,525', reviews: '462', rating: '4.8', tipo: 'Directo de forma', win: 'Pieza gótica 3D montable premium (4.8★, 462 reseñas). El benchmark de ejecución 3D a batir; MAVRA compite con set de 3 vs. su pieza única.' },
        { asin: 'B0DM8QBTHN', brand: '365CUSGIFTS', title: 'Skull & Crow Stained Glass Suncatcher', price: '$34.99', sales: '1,444', revenue: '$35,056', reviews: '257', rating: '4.6', tipo: 'Sustituto (objeto real)', win: 'Vitral colgante skull — objeto real, no print. Comparte el argumento "dimensional"; MAVRA ofrece set de pared sólido.' },
        { asin: 'B0GFTP5HJJ', brand: 'Nacynacy', title: 'Skull Neon Sign Wall Decor (LED)', price: '$29.99', sales: '1,095', revenue: '$35,554', reviews: '106', rating: '4.6', tipo: 'Sustituto (objeto real)', win: 'Neón skull de pared. Otro objeto-real gótico; MAVRA gana en permanencia editorial vs. estética gamer/neón.' },
        { asin: 'B0FC25KRSM', brand: 'Trulave', title: 'Gothic Skull Bathroom Wall Art', price: '$32.99', sales: '981', revenue: '$19,471', reviews: '131', rating: '4.6', tipo: 'Sustituto', win: 'Print skull low-price para baño. Segmento barato; MAVRA es la versión premium 3D del mismo comprador.' },
        { asin: 'B09GB1CDXM', brand: 'BEASTZHENG', title: 'Funny Skull Metal Tin Sign Wall Decor', price: '$9.99', sales: '1,464', revenue: '$14,102', reviews: '3,897', rating: '4.7', tipo: 'Adyacente / Conquistable', win: 'Tin sign skull barato con 3,897 reseñas = VOC gold del comprador skull-wall. Forma/precio distintos; puro valor de VOC + intercepción de la búsqueda "skull wall decor".' },
      ],
    },
    campaigns: {
      methodology: `Base: AdsCrafted (Discovery → Harvest → Scale) + Chris Rawlings / Sophie Society (dominar top-of-search de la hero; ranking-first, luego profit). Referencia de precio: canvas gótico-skull $75–$107 (FWIEXA $95, DRACIT $76, BICERE $107), sculptural gótico premium $70–$75 (Nomnu $75, VINADECOR $70). Un set escultórico 3D de 3 piezas puede sostener $50–$90. Precio real del SWD a confirmar con Frank.`,
      sp: [
        {
          code: 'C1', name: 'SP Exact "Hero / Ranking"', tag: 'ranking-first, Rawlings',
          fields: [
            { label: 'Keywords (SKAG)', value: 'gothic wall decor · gothic wall art · goth wall decor · skull wall decor · skull wall art · skull decor · goth room decor · skull decor for home' },
            { label: 'Objetivo', value: 'Dominar top-of-search de la cabeza ganable (td 0–6). Bid agresivo + Top-of-Search modifier +50% a +100%.' },
            { label: 'Bid / Budget', value: '$0.55–$1.20 (CPCs del nicho bajos: H10 sugiere $0.42–$0.60) · $25–$40/día' },
            { label: 'ACOS / Prioridad', value: 'Tolerar 60–100% las primeras 2–3 semanas. Prioridad ranking: gothic wall decor + skull wall decor.' },
          ],
        },
        {
          code: 'C2', name: 'SP Phrase "Expansion"',
          fields: [
            { label: 'Keywords', value: 'gothic decor · gothic home decor · goth home decor · gothic bedroom decor · goth bedroom decor · skull home decor · skull decor for bedroom · gothic room decor · macabre decor · skull wall mount · dark academia decor' },
            { label: 'Bid / Budget', value: '$0.45–$0.90 · $12–$20/día' },
            { label: 'Nota', value: 'Vigilar dark academia decor / gothic decor (muy amplios) → si CVR bajo, bajar bid o pasar a broad.' },
          ],
        },
        {
          code: 'C3', name: 'SP Broad "Discovery"', tag: '+ modificador',
          fields: [
            { label: 'Keywords broad', value: 'gothic decor · skull decor · dark academia decor · witchy home decor · spooky home decor · whimsigoth decor · witchy decor · moody decor' },
            { label: 'Bid / Budget', value: '$0.35–$0.65 · $10–$15/día · dynamic bids down-only al inicio' },
            { label: 'Nota', value: 'Motor de cosecha. Candidatos a promover rápido: spooky home decor (cnv 20%), whimsigoth (19%), witchy (15%).' },
          ],
        },
        {
          code: 'C4', name: 'SP Auto "Discovery"',
          fields: [
            { label: 'Targeting', value: 'Las 4 targeting groups (close, loose, complements, substitutes)' },
            { label: 'Bid / Budget', value: '$0.35–$0.65 · $10–$15/día' },
            { label: 'Nota', value: 'Segundo motor de cosecha. Útil porque el SERP es canvas → detecta a quién interceptar.' },
          ],
        },
        {
          code: 'C5', name: 'SP Auto/Broad "Halloween Seasonal"', tag: 'solo Sep–Oct, apagada el resto del año',
          fields: [
            { label: 'Recoge', value: 'Pico estacional (gothic halloween decor 1,615, halloween skeleton wall decor, spooky wall decor) — mismo listing permanente.' },
            { label: 'Bid / Budget', value: '$0.50–$0.95 · $15–$30/día solo en ventana · Pausar 1-nov' },
          ],
        },
        {
          code: 'C6', name: 'SP Product/ASIN "Competitor Conquest"',
          fields: [
            { label: 'Bid / Budget', value: '$0.55–$1.10 (más alto en rating <4.4 y canvas) · $10–$18/día' },
            { label: 'Nota', value: 'Placement en la página del competidor → mostrarle la versión escultórica real en vez del print.' },
          ],
          asins: [
            { asin: 'B0FDG85RV4', desc: 'FWIEXA Halloween Skeleton Canvas Set of 3, Gothic Skull Framed — $94.97 · 2,655/mo · 4.6★ (líder revenue; print plano)' },
            { asin: 'B0FB88BNLC', desc: 'DRACIT Spooky Halloween Dark Gothic Skull Framed Canvas Set — $75.99 · 1,857/mo · 4.4★' },
            { asin: 'B0FCX7RJ7V', desc: 'KAIRNE Framed Skeleton Canvas Wall Art Set of 3 — $94.99 · 1,551/mo · 4.4★' },
            { asin: 'B0FFMB3SMD', desc: 'KNBKID Framed Dark Academia Gothic Skull Witch Wall Decor Set of 3 — $69.99 · 1,058/mo · 4.5★' },
            { asin: 'B0FB8VRY1C', desc: 'BICERE Large Vintage Skull Framed Canvas Set — $106.99 · 1,879/mo · 4.3★ (rating <4.4 → conquistable)' },
            { asin: 'B0GFPBVVLQ', desc: 'Nomnu Skull Candle Warmer Lamp — $74.97 · 1,304/mo · 4.8★ (top del ecosistema skull-decor)' },
            { asin: 'B0DJQJJ2M4', desc: 'VINADECOR Real Death Head Moth Skull Shadow Box Gothic — $69.75 · 535/mo · 4.8★ (análogo 3D montable)' },
            { asin: 'B0FC25KRSM', desc: 'Trulave Gothic Skull Bathroom Wall Art — $32.99 (low-price)' },
          ],
        },
      ],
      harvesting: [
        'Cadencia: cada 3–4 días, search term report de las campañas de descubrimiento (C3 broad, C4 auto, C5 seasonal).',
        'Graduación (G1): search term con Orders ≥ 2 (o 1 si el ACoS ya se disparó) → duplicar a C1 Exact. Bid de arranque = RPC = (Revenue / Clicks) × Target ACoS. Candidatos calientes por CVR: skull decor for home, skull home decor, macabre decor, spooky home decor, goth room decor, whimsigoth decor. La graduación es SIEMPRE a exact.',
        'Negar-vs-ladder (raíz-vs-cerrado): si el término es una RAÍZ con hijos por descubrir → NO se niega en la fuente; se re-siembra el ladder de match (exact 100% · phrase 0.75× · broad 0.5×, convención de industria) para seguir cosechando sus hijos. Si es un término CERRADO (long-tail de compra, sin hijos) → se aísla el exact + negative-exact en la fuente.',
        'Negativizador (N1): término con clics ≥ piso por tipo (SP 30 · SD 12 · SBV 15) Y (spend ≥ 1.5–2× CPA objetivo ó ACoS ≫ target) con 0 órdenes → negative exact. El piso por tipo es intención/CPC del canal, no significancia estadística.',
        'Word-level (N2): una palabra con ≥ 50 clics acumulados y 0 órdenes → negative phrase a nivel de cuenta.',
        'Negativos permanentes desde día 1: cow, bull, longhorn, steer, deer, elk, antler, western, cowboy, cowgirl, southwestern, sugar skull, dia de los muertos, day of the dead, canvas, poster, print, painting, framed, tapestry, wallpaper, decal, sticker, mold, diamond art, neon sign, tin sign, planter, shower curtain, tumbler, mug.',
        'Semanal: subir bid/modifier de los exact top-5 orgánico; al llegar a top-3 en la hero (gothic wall decor / skull wall decor) → bajar bid (Rawlings: ya no pagás por el ranking ganado).',
        'Todos los umbrales (30/12/15 clics, ≥2 órdenes, ≥50 word-level, 1.5–2× CPA) son defaults editables por el usuario.',
      ],
      sbv: [
        {
          code: 'SBV-1', name: '"Real, Not a Print"', tag: 'categoría/estética, ofensiva',
          keywords: 'gothic wall decor · gothic wall art · goth wall decor · skull wall decor · skull decor · gothic decor · dark academia decor · goth room decor',
          angle: `Primeros 2 s un plano lateral rasante de UN cráneo sobre pared charcoal → la luz revela el relieve anatómico y la sombra que proyecta (lo que un print jamás hace). Corte: una mano monta los 3 cráneos (screw + tape), luego pull-back que revela el trío completo. Quick-cuts: macro de textura ("sculpted, not stamped"), los 3 tamaños lado a lado, cuarto real. Cierre en wordmark MAVRA + "MOUNT ONCE · HAUNT FOREVER" / "Inhabit Your Shadow".`,
          bid: '$0.70–$1.30', budget: '$12–$20/día',
        },
        {
          code: 'SBV-2', name: '"Defensive / Conquest"', tag: 'defensiva + intercepción',
          keywords: 'gothic wall decor · skull wall decor · gothic skull canvas · + targeting a ASINs de C6 (FWIEXA, DRACIT, KAIRNE, KNBKID, VINADECOR)',
          angle: `Mismo hook 3D, cierra en comparación implícita — "Set of 3 · Real sculpted skulls · Screw or tape mount · Not a flat print" (lo que los canvas competidores no pueden ofrecer). Defiende búsquedas de marca/categoría y aparece sobre el listing del competidor de print.`,
          bid: '$0.60–$1.20', budget: '$8–$15/día',
        },
      ],
      budget: `~$85–$140/día en la ventana de ranking (primeras 3–4 semanas), 45–55% en C1 (Exact Hero) + SBV-1. Fuera de ventana: ~$40–65/día en modo profit.`,
    },
    notes: [
      { head: 'COSMO gap — imágenes vs. copy', body: 'Imágenes/A+ YA cubren los 3 cráneos negro mate, install screw+tape "MOUNT ONCE / HAUNT FOREVER", matte macro "SCULPTED. NOT STAMPED", real scale + dimensiones, identidad "YOUR WALL", cross-sell dark room. El copy refuerza: el "set de 3 como SISTEMA" vs. competidores que venden 1, "Real, no un print" (el SERP es 90% canvas plano), keywords no verbalizadas (gothic/goth wall decor, dark academia, whimsigoth, macabre), el ángulo permanente-no-Halloween, el material (polirresina) + keyhole hanger renter-friendly, y el ángulo regalo (cnv 22–40%).' },
      { head: 'Supuestos', body: 'Precio no confirmado → rango $50–90 (canvas sets $75–107; sculptural Nomnu $75 / VINADECOR $70). Confirmar con Frank. ASIN propio no estaba en briefs → correr Cerebro si Frank lo pasa (auditar cobertura, sembrar negativos, ver qué de la cabeza ya rankea).' },
      { head: 'Pendiente H10 / hallazgo', body: 'Todas las llamadas H10 OK (Magnet ×10 seeds, Product Research ×2), cero errores de auth, volúmenes reales (52,857 frases únicas; 18,150 relevantes al nicho). Hallazgo: skull wall hanging y 3d wall art skull NO son cabezas reales (0 vol / dominados por moldes de resina y lámparas de ilusión) → no se persiguen como ranking; se usan como concepto de copy ("dimensional/sculpted").' },
    ],
    sustento: {
      titleKeywords: [
        {
          label: 'gothic wall decor (front-load)',
          metrics: 'Vol 4,804/mo · td 6 · cp 10,000',
          a910: `Cabeza gótica grande; combinada con la exacta de skull da "gothic skull wall decor". Prioridad de ranking (mayor vol ganable).`,
          cosmo: `Intención estética + forma "decoración gótica de pared"; COSMO liga el contexto dark permanente con la pieza escultórica, más allá del mar de canvas.`,
          voc: `"perfect gothic feel which was exactly what I was going for." (KNBKID, 5★)`,
        },
        {
          label: 'gothic wall art',
          metrics: 'Vol 2,549/mo · td 4 · cp solo 989 (baja competencia)',
          a910: `Producto-exacto de baja comp → ownable en título.`,
          cosmo: `"wall art" gótico conecta con el atributo 3D real; COSMO diferencia el arte-de-pared escultórico del print plano que comparte la palabra.`,
          voc: `"It looks like something you'd find in a boutique home décor shop, but at a fraction of the price." (KNBKID, 5★)`,
        },
        {
          label: 'goth wall decor',
          metrics: 'Vol 1,892/mo · td 1 · cp 760',
          a910: `td 1 = casi nadie titula → muy ownable.`,
          cosmo: `Intención goth-permanente de pared; fit con el trío year-round.`,
          voc: `"instantly made my space feel like a haunted little gallery." (KNBKID, 5★)`,
        },
        {
          label: 'skull wall decor',
          metrics: 'Vol 590/mo · td 6 · cp 506',
          a910: `Cabeza exacta de producto, chica pero directa. Cuidado: "skull wall" está copada por cráneos de ANIMAL (cow/bull/longhorn = negativos); el SWD es cráneo humano.`,
          cosmo: `El intent "decoración de pared con cráneo humano/gótico"; COSMO separa el cráneo humano gótico del western/farmhouse animal que comparte "skull wall".`,
          voc: `"witches, skulls, haunted houses… I hung them up for Halloween… I'm definitely leaving them up year-round because they're too fun to pack away!" (KNBKID, 5★)`,
        },
        {
          label: 'skull wall art',
          metrics: 'Vol 573/mo · td 4 · cp 5,000',
          a910: `Exacta de producto; el SERP lo dominan PRINTS planos → diferenciador "not a print".`,
          cosmo: `"skull wall art" conecta con pieza dimensional; COSMO premia el atributo relieve/sombra vs. impresión.`,
          voc: `"She loves the macabre and this was right in her wheelhouse." (FWIEXA, 5★)`,
        },
        {
          label: 'skull decor',
          metrics: 'Vol 4,136/mo · td 6 · cnv 9% · cp 993 · long-tail skull decor for home 988 · cnv 33%',
          a910: `Alta demanda estética-skull, baja competencia. Señales de compra fuertes en el long-tail.`,
          cosmo: `Intención decor-skull genérica; COSMO liga con la pieza premium 3D (no prop barato).`,
          voc: `"It's one of those conversation pieces that people immediately notice when they walk in." (VINADECOR, 5★)`,
        },
        {
          label: 'goth room decor / bedroom',
          metrics: 'goth room decor 2,979/mo · td 0 · cnv 18% · gothic bedroom decor 2,893 · td 0',
          a910: `td 0 ownable + alta conversión. skull decor for bedroom 306 · td 0.`,
          cosmo: `El intent "decorar mi cuarto/dormitorio goth" conecta con el trío para colgar sobre la cama; COSMO enlaza el uso real (above the bed / headboard) con el atributo set-de-3.`,
          voc: `"I love how spooky and magical they make my room feel." (ANERZA, 5★) + set de cráneos en pared: "My bathroom decor is skulls so I put plants in it and hung on wall. I love it." (Dolkgy, 5★)`,
        },
        {
          label: 'gothic gift',
          metrics: 'goth gifts 1,261/mo · td 1 · gothic gifts for women 1,072 · cnv 29% · goth gift 462 · cnv 40%',
          a910: `Segmento regalo de conversión ALTA (22-40%). goth gift set 382.`,
          cosmo: `"gothic gift" conecta con el statement piece regalable (set curado); COSMO lo enlaza con el comprador-regalo (daughter / best friend macabre-lover).`,
          voc: `"She loves the macabre and this was right in her wheelhouse." (FWIEXA, 5★) — comprado como regalo.`,
        },
        {
          label: 'set of 3 (diferenciador)',
          metrics: 'Diferenciador único · sin keyword de volumen (goth gift set 382 es lo más cercano)',
          a910: `Es el diferenciador único vs. competidores que venden 1 pieza. Va en título por relevancia de producto.`,
          cosmo: `El intent "llenar una pared / arreglo compuesto" conecta con el trío graduado ya curado; COSMO premia el fit de sistema-de-pared sobre pieza suelta.`,
          voc: `Análogo set-de-3 3D (Dolkgy, el más cercano): "Bought all three styles and love them displayed together." (Dolkgy, 5★) + "I couldn't just have one I needed all 3." (Dolkgy, 5★)`,
        },
        {
          label: 'sculpted / matte black / not a print / real 3D (wedge)',
          metrics: 'Relevancia REAL vs reportada · skull wall hanging 0 vol · td 16 · 3d wall art skull ≈0 vol',
          a910: `NO son keywords. "3d / wall hanging" parecen términos pero no tienen demanda → se explotan como concepto de copy ("sculpted / real / not a print"), no para rankear.`,
          cosmo: `El SERP es 90% canvas plano; COSMO puede leer la intención "quiero algo real/dimensional, no barato" y premiar el atributo 3D polirresina = categoría de uno.`,
          voc: `"very flat and cheap looking once you get close up." (FWIEXA, 2★) + matiz nuevo — el comprador ya castiga el print de IA: "Very obviously AI generated, low quality images… came out blurry." (ANERZA, 1★)`,
        },
      ],
      claims: [
        {
          label: '1. THREE SKULLS, ONE SYSTEM — A Curated Wall, Not a Single Piece',
          metrics: 'set of 3 (diferenciador) + gothic/skull wall decor',
          a910: `Los competidores venden 1 solo → señal de diferenciación.`,
          cosmo: `El intent "arreglo de pared compuesto, no una pieza sola" conecta con el trío graduado curado; COSMO premia el sistema-de-pared.`,
          voc: `Análogo set-de-3 (Dolkgy): "Bought all three styles and love them displayed together." (Dolkgy, 5★) + "It makes my house look like a gallery." (FWIEXA, 5★) + "conversation pieces that people immediately notice when they walk in." (VINADECOR, 5★)`,
        },
        {
          label: '2. SCULPTED, NOT STAMPED — Real Dimensional Skulls, Never a Flat Print (wedge #1)',
          metrics: 'Wedge #1 · el SERP son prints planos · alto impacto CTR/CVR (A10)',
          a910: `No keyword; la foto 3D rompe el patrón canvas del SERP.`,
          cosmo: `El intent "quiero algo real, no un print plano/barato" conecta con la polirresina densa con relieve anatómico; COSMO premia causalmente el atributo dimensional.`,
          voc: `"It's supposed to be painted. It looks like a freaking print transfer, smh." (BICERE, 1★) + "very flat and cheap looking once you get close up." (FWIEXA, 2★) + print de IA: "Very obviously AI generated, low quality images… came out blurry." (ANERZA, 1★)`,
        },
        {
          label: '3. MOUNT ONCE, HAUNT FOREVER — Your Wall, Your Rules, No Damage',
          metrics: 'skull wall mount 368 · td 5 (adyacente) · rebate queja de hardware (A10)',
          a910: `Rebate la queja de hardware más citada del nicho → CVR/rating.`,
          cosmo: `El intent "colgarlo sin dañar la pared / apto alquiler" conecta con tornillo O cinta doble-faz + keyhole hanger; COSMO liga el uso con el atributo de montaje dual.`,
          voc: `Análogo 3D (Dolkgy): "Do NOT use the hook it comes with!… it had fallen off and smashed everywhere because the hook fell off the wall." (Dolkgy, 1★) + "the hanger pins fell sending the print to the floor… Perfectly nice print ruined by an inferior hanger." (FWIEXA, 3★)`,
        },
        {
          label: '4. MADE TO FIT, BUILT TO HAUNT — Sized for Real Walls, Arrives Ready',
          metrics: '3 dimensiones exactas + hardware incluido · anti-devolución (A10)',
          a910: `No keyword; rebate "más chico que la foto" + "llega roto".`,
          cosmo: `El intent "que sea del tamaño de la foto / que llegue entero" conecta con dims declaradas + pieza 3D sólida (más resistente que canvas); COSMO premia la honestidad de atributo.`,
          voc: `"the very first room image shows the item way bigger than it actually is!" (BICERE, 3★) + material: "The frames are not wood, but are plastic or foam wrapped in a wood patterned vinyl." (Ausril, 3★) + peso real del análogo 3D: "heavy enough to not feel cheap." (Dolkgy, 5★)`,
        },
        {
          label: '5. PERMANENT GOTHIC DECOR — Not a Costume You Box Up in November',
          metrics: 'Ángulo permanente + gift · refuerza goth room decor / skull decor',
          a910: `No keyword; refuerza la estética-skull sin perseguir ranking.`,
          cosmo: `El intent "decoración dark todo el año, no disfraz" conecta con el posicionamiento no-Halloween; COSMO lo enlaza con el comportamiento real del comprador (colgar y no descolgar).`,
          voc: `"I wanted to swap out my normal artwork for something spooky for the Halloween season… It's November 1 and quite frankly I don't even want to take them down… They are not just cutesy for the season." (FWIEXA, 5★)`,
        },
      ],
    },
  },
]

// ── Styles ────────────────────────────────────────────────────────────────────
const sidebarLabelStyle = { fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.5)', display: 'block', marginBottom: '1rem', width: '100%' }
const sidebarProductStyle = { display: 'block', fontFamily: "var(--font-condensed)", fontSize: '0.7rem', color: 'var(--copper)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.25rem', textDecoration: 'none' }

const introStyle = { marginBottom: '3.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(var(--copper-rgb),0.2)' }
const eyebrowStyle = { fontFamily: "var(--font-sans)", fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.7)', marginBottom: '1rem' }
const introBodyStyle = { fontFamily: "var(--font-sans)", fontSize: '0.95rem', color: 'rgba(var(--fg-rgb),0.62)', lineHeight: 1.85, maxWidth: '680px' }

const productSectionStyle = { marginBottom: '6rem', paddingBottom: '4rem', borderBottom: '1px solid rgba(var(--copper-rgb),0.2)', scrollMarginTop: '80px' }
const skuStyle = { fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.65)', marginBottom: '0.6rem' }
const productTitleStyle = { fontFamily: "var(--font-condensed)", fontSize: 'clamp(1.5rem,3.4vw,2.15rem)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }
const oneLinerStyle = { fontFamily: "var(--font-sans)", fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(var(--fg-rgb),0.52)', lineHeight: 1.7, maxWidth: '720px' }

const subLabelStyle = { display: 'flex', alignItems: 'center', gap: '0.85rem', fontFamily: "var(--font-sans)", fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--copper)', margin: '2.75rem 0 1.25rem' }
const subLabelLineStyle = { width: '22px', height: '1px', background: 'rgba(var(--copper-bright-rgb),0.6)', flexShrink: 0 }

const titleCardStyle = { padding: '1.4rem 1.6rem', background: 'rgba(var(--burgundy-rgb),0.14)', border: '1px solid rgba(var(--copper-rgb),0.35)', borderLeft: '3px solid var(--copper)' }
const titleCardTopStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.9rem', flexWrap: 'wrap' }
const titleCardTagStyle = { fontFamily: "var(--font-sans)", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.75)' }
const titleTextStyle = { fontFamily: "var(--font-sans)", fontSize: '1rem', color: 'var(--fg)', lineHeight: 1.65 }

const countPillStyle = { display: 'inline-flex', alignItems: 'baseline', gap: '0.15rem', padding: '0.3rem 0.65rem', border: '1px solid rgba(var(--copper-rgb),0.35)', borderRadius: '2px', fontSize: '0.7rem', whiteSpace: 'nowrap' }
const countMaxStyle = { fontFamily: "var(--font-sans)", fontSize: '0.58rem', letterSpacing: '0.08em', color: 'rgba(var(--copper-rgb),0.7)', textTransform: 'uppercase' }

const bulletCardStyle = { display: 'flex', gap: '1.1rem', padding: '1.25rem 1.5rem', border: '1px solid rgba(var(--copper-rgb),0.22)', background: 'rgba(var(--copper-rgb),0.03)' }
const bulletMarkStyle = { fontFamily: "var(--font-condensed)", fontSize: '1.1rem', color: 'rgba(var(--copper-bright-rgb),0.55)', lineHeight: 1.3, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }
const bulletHeadStyle = { fontFamily: "var(--font-sans)", fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg)', marginBottom: '0.55rem', lineHeight: 1.5 }
const bulletBodyStyle = { fontFamily: "var(--font-sans)", fontSize: '0.9rem', color: 'rgba(var(--fg-rgb),0.72)', lineHeight: 1.7 }
const bulletNoteStyle = { marginTop: '0.65rem', fontFamily: "var(--font-sans)", fontSize: '0.62rem', letterSpacing: '0.03em', color: 'rgba(var(--copper-rgb),0.7)', lineHeight: 1.6 }

const backendWrapStyle = { padding: '1.25rem 1.5rem', border: '1px solid rgba(var(--copper-rgb),0.25)', background: 'rgba(var(--bg-rgb),0.5)' }
const backendCodeStyle = { display: 'block', fontFamily: "'Courier New',monospace", fontSize: '0.82rem', color: 'rgba(var(--fg-rgb),0.8)', lineHeight: 1.85, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }

const headerRecStyle = { marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(var(--copper-rgb),0.07)', borderLeft: '2px solid rgba(var(--copper-bright-rgb),0.7)' }
const headerRecLabelStyle = { display: 'block', fontFamily: "var(--font-sans)", fontSize: '0.56rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(var(--copper-bright-rgb),0.85)', marginBottom: '0.55rem' }
const headerRecBodyStyle = { fontFamily: "var(--font-sans)", fontSize: '0.85rem', color: 'rgba(var(--fg-rgb),0.72)', lineHeight: 1.7 }

const negativesStyle = { marginTop: '1rem', padding: '1rem 1.25rem', background: 'rgba(var(--burgundy-rgb),0.12)', borderLeft: '2px solid rgba(var(--burgundy-rgb),0.6)' }
const negLabelStyle = { display: 'block', fontFamily: "var(--font-sans)", fontSize: '0.56rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(191,147,85,0.85)', marginBottom: '0.55rem' }
const negBodyStyle = { fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.6)', lineHeight: 1.8, letterSpacing: '0.02em' }

const methodologyStyle = { fontFamily: "var(--font-sans)", fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.62)', lineHeight: 1.75, marginBottom: '1.75rem' }
const campGroupLabelStyle = { fontFamily: "var(--font-condensed)", fontSize: '0.85rem', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }
const campGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }

const campHeadRowStyle = { display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }
const campCodeStyle = { fontFamily: "var(--font-condensed)", fontSize: '0.85rem', color: 'var(--copper)', letterSpacing: '0.05em' }
const campNameStyle = { fontFamily: "var(--font-sans)", fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg)' }
const campTagStyle = { marginTop: '0.35rem', fontFamily: "var(--font-sans)", fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(var(--copper-bright-rgb),0.75)' }
const campFieldLabelStyle = { display: 'block', fontFamily: "var(--font-sans)", fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.7)', marginBottom: '0.3rem' }
const campFieldValueStyle = { fontFamily: "var(--font-sans)", fontSize: '0.83rem', color: 'rgba(var(--fg-rgb),0.72)', lineHeight: 1.6 }

const asinRowStyle = { display: 'flex', gap: '0.6rem', fontFamily: "var(--font-sans)", fontSize: '0.78rem', color: 'rgba(var(--fg-rgb),0.68)', lineHeight: 1.55 }
const asinCodeStyle = { fontFamily: "'Courier New',monospace", fontSize: '0.72rem', color: 'var(--copper)', flexShrink: 0, letterSpacing: '0.02em' }
const asinDescStyle = { minWidth: 0 }

const harvestListStyle = { margin: 0, padding: '0.5rem 1.5rem 1.5rem 2.75rem', display: 'grid', gap: '0.7rem' }
const harvestItemStyle = { fontFamily: "var(--font-sans)", fontSize: '0.85rem', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.65 }

const budgetBannerStyle = { marginTop: '1.75rem', padding: '1.1rem 1.5rem', background: 'rgba(var(--copper-rgb),0.08)', border: '1px solid rgba(var(--copper-rgb),0.3)', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.5rem 1.25rem' }
const budgetLabelStyle = { fontFamily: "var(--font-sans)", fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(var(--copper-bright-rgb),0.85)', whiteSpace: 'nowrap' }
const budgetValueStyle = { fontFamily: "var(--font-sans)", fontSize: '0.86rem', color: 'rgba(var(--fg-rgb),0.8)', lineHeight: 1.6 }

const noteHeadStyle = { fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.4rem' }
const noteBodyStyle = { fontFamily: "var(--font-sans)", fontSize: '0.84rem', color: 'rgba(var(--fg-rgb),0.68)', lineHeight: 1.7 }
