import { useTranslation } from '../i18n/TranslationProvider.jsx'
import { useState, useMemo, useEffect, useRef } from 'react'
import brand from '../brand/brand.json'

const { identity } = brand
import PLAN from '../data/campaign_plan.json'

// ── Módulo de campañas ────────────────────────────────────────────────────────
// El plan de PPC como estructura editable, no como texto. Cada campaña arma su
// nombre por segmentos separados por "|", el ad group hereda ese mismo nombre, y las
// keywords se sacan o se arrastran de una campaña a otra. El nombre se recalcula solo.
//
// Naming (respaldado por el AGTA Brain): la convención tiene que llevar root, match
// type y ASIN; el ad group se nombra igual que la campaña; los tres placements son
// top of search / rest of search / product pages → el bloque "75T/0R/0P".

const STORE = 'mavra_campanas_v1'

const MATCH_ABBR = { Exact: 'E', Phrase: 'P', Broad: 'B', Product: 'PT', Auto: 'A' }
const MATCH_CLS = { Exact: 'cmp-m-e', Phrase: 'cmp-m-p', Broad: 'cmp-m-b', Product: 'cmp-m-pt', Auto: 'cmp-m-a' }

const ESTADO_LBL = {
  viva: 'corriendo en Amazon',
  nueva: 'a crear',
  propuesta: 'bloqueada',
}

function placements(s) {
  return `${s.tos}T/${s.ros}R/${s.pp}P`
}

// El nombre completo, en el orden que definió Frank.
function campaignName(s) {
  return [s.prod, s.tipo, s.estructura, s.target, s.clase, s.match, placements(s), s.asin, s.sufijo]
    .filter((x) => x !== null && x !== undefined && x !== '')
    .join(' | ')
}

function Segment({ children, tone }) {
  return <span className={`cmp-seg${tone ? ' cmp-seg-' + tone : ''}`}>{children}</span>
}

function CampaignName({ s }) {
  return (
    <div className="cmp-name">
      <Segment tone="prod">{s.prod}</Segment><i>|</i>
      <Segment tone="tipo">{s.tipo}</Segment><i>|</i>
      <Segment tone="estr">{s.estructura}</Segment><i>|</i>
      <Segment tone="target">{s.target}</Segment><i>|</i>
      <Segment>{s.clase}</Segment><i>|</i>
      <Segment tone="match">{s.match}</Segment><i>|</i>
      <Segment tone="plc">{placements(s)}</Segment><i>|</i>
      <Segment tone="asin">{s.asin}</Segment><i>|</i>
      <Segment>{s.sufijo}</Segment>
    </div>
  )
}

function KwRow({ k, campId, onRemove, onDragStart }) {
  const { text: trText } = useTranslation()

  return (
    <li
      className="cmp-kw"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart(campId, k.kw)
      }}
      title={trText(k.motivo || '')}
    >
      <span className="cmp-kw-grip" aria-hidden>{"⠿"}</span>
      <span className="cmp-kw-txt">{k.kw}</span>
      <span className="cmp-kw-sv" title={trText("Búsquedas mensuales reales del término (dato de mercado)")}>
        {trText((k.sv || 0).toLocaleString('en-US'))}
      </span>
      {trText(k.bid != null && <span className="cmp-kw-bid" title={trText("Puja sugerida por el dato de mercado")}>{"$"}{trText(k.bid)}</span>)}
      {trText(k.td != null && <span className="cmp-kw-td" title={trText("Title density: cuántos competidores la tienen en el título. Cuanto más baja, más ownable.")}>{trText("td ")}{trText(k.td)}</span>)}
      <button className="cmp-kw-x" onClick={() => onRemove(campId, k.kw)} title={trText("Sacar del plan")}>{"×"}</button>
    </li>
  )
}

function CampaignCard({ c, onRemove, onDragStart, onDrop, dragging }) {
  const { text: trText } = useTranslation()

  const [over, setOver] = useState(false)
  const esSKW = c.seg.estructura === 'SKW'
  const exceso = esSKW && c.keywords.length > 1
  return (
    <div
      className={`cmp-card cmp-est-${c.estado}${over && dragging ? ' cmp-over' : ''}${exceso ? ' cmp-warn' : ''}`}
      // preventDefault siempre: si se condiciona al estado de React, un drop que ocurre
      // antes del re-render queda sin destino válido y la keyword no se mueve.
      onDragOver={(e) => { e.preventDefault(); if (!over) setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(c.id) }}
    >
      <div className="cmp-card-head">
        <span className={`cmp-match ${MATCH_CLS[c.seg.match] || ''}`} title={`${trText('Match')} ${c.seg.match}`}>
          {trText(MATCH_ABBR[c.seg.match] || '?')}
        </span>
        <CampaignName s={c.seg} />
        <span className={`cmp-estado cmp-estado-${c.estado}`}>{trText(ESTADO_LBL[c.estado])}</span>
      </div>

      <div className="cmp-meta">
        {trText(c.seg.tos > 0 && <span className="cmp-chip cmp-chip-tos" title={trText("Top of search bid modifier")}>{trText("TOS +")}{trText(c.seg.tos)}{"%"}</span>)}
        {trText(c.seg.pp > 0 && <span className="cmp-chip" title={trText("Product pages bid modifier")}>{trText("PP +")}{trText(c.seg.pp)}{"%"}</span>)}
        {trText(c.bid != null && <span className="cmp-chip">{trText("bid $")}{trText(c.bid)}{trText(c.bidActual != null && c.bidActual !== c.bid && <em>{trText(" (hoy $")}{trText(c.bidActual)}{")"}</em>)}</span>)}
        {trText(c.budget != null && <span className="cmp-chip">{"$"}{trText(c.budget)}{trText("/día")}</span>)}
        <span className="cmp-chip cmp-chip-ag" title={trText("El ad group se nombra igual que la campaña — así lo marca el AGTA Brain")}>{trText("ad group = campaña")}</span>
      </div>

      {trText(c.nota && <div className="cmp-nota">{trText(c.nota)}</div>)}

      {trText(c.targets && (
        <ul className="cmp-targets">
          {c.targets.map((t) => (
            <li key={t.asin}>
              <code>{trText(t.asin)}</code>
              <span>{trText("rankea en ")}{trText(t.kws_p1)}{trText(" kws de página 1 · ")}{trText(t.share)}{trText("% del volumen del nicho")}</span>
            </li>
          ))}
        </ul>
      ))}

      {trText((c.keywords.length > 0 || c.seg.estructura !== 'AUTO') && (
        <ul className="cmp-kws">
          {c.keywords.map((k) => (
            <KwRow key={k.kw} k={k} campId={c.id} onRemove={onRemove} onDragStart={onDragStart} />
          ))}
          {trText(c.keywords.length === 0 && <li className="cmp-kw-vacio">{trText("Sin keywords — arrastrá una acá.")}</li>)}
        </ul>
      ))}

      {trText(exceso && (
        <div className="cmp-alerta">{trText("Es una campaña SKW y tiene ")}{trText(c.keywords.length)}{trText(" keywords. Una SKW lleva una sola: sacá las demás o cambiala a otra estructura.")}</div>
      ))}
    </div>
  )
}

export default function Campanas() {
  const { text: trText, language: uiLanguage } = useTranslation()

  const [prod, setProd] = useState('SWD')
  const [plan, setPlan] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORE)
      if (guardado) return JSON.parse(guardado)
    } catch { /* si el guardado está corrupto, se arranca del plan original */ }
    return PLAN
  })
  // El origen del arrastre vive en una ref porque se lee dentro del mismo tick del drop;
  // el estado solo existe para pintar la campaña resaltada.
  const dragRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const empezarDrag = (campId, kw) => { dragRef.current = { campId, kw }; setDragging(true) }

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(plan)) } catch { /* sin espacio: se pierde el guardado, no el plan en pantalla */ }
  }, [plan])

  const p = plan[prod]

  const mover = (destino) => {
    const drag = dragRef.current
    if (!drag) return
    setPlan((prev) => {
      const next = structuredClone(prev)
      const camps = next[prod].campaigns
      const dest = camps.find((c) => c.id === destino)
      if (!dest) return prev
      // El origen puede ser otra campaña o el banco: el banco no está en `camps`,
      // así que no se puede exigir que exista una campaña de origen.
      const origen = drag.campId === '__banco__' ? null : camps.find((c) => c.id === drag.campId)
      if (origen && origen.id === dest.id) return prev
      let kw
      if (origen) {
        const i = origen.keywords.findIndex((k) => k.kw === drag.kw)
        if (i < 0) return prev
        kw = origen.keywords[i]
        origen.keywords.splice(i, 1)
      } else {
        const j = next[prod].banco.findIndex((k) => k.kw === drag.kw)
        if (j < 0) return prev
        kw = next[prod].banco[j]
        next[prod].banco.splice(j, 1)
      }
      if (!dest.keywords.some((k) => k.kw === kw.kw)) dest.keywords.push(kw)
      return next
    })
    dragRef.current = null
    setDragging(false)
  }

  const sacar = (campId, kw) => {
    setPlan((prev) => {
      const next = structuredClone(prev)
      const c = next[prod].campaigns.find((x) => x.id === campId)
      if (!c) return prev
      const i = c.keywords.findIndex((k) => k.kw === kw)
      if (i < 0) return prev
      const [fuera] = c.keywords.splice(i, 1)
      if (!next[prod].banco.some((k) => k.kw === fuera.kw)) next[prod].banco.unshift(fuera)
      return next
    })
  }

  const resetear = () => {
    if (!confirm(trText('Vuelve al plan original y se pierden los cambios de esta pantalla. ¿Seguimos?'))) return
    localStorage.removeItem(STORE)
    setPlan(PLAN)
  }

  const texto = useMemo(
    () =>
      p.campaigns
        .map((c) => {
          const kws = c.keywords.map((k) => `    ${k.kw}  (SV ${k.sv})`).join('\n')
          const head = `${campaignName(c.seg)}${c.bid != null ? `  · bid $${c.bid}` : ''}${c.budget != null ? ` · $${c.budget}/${uiLanguage === 'en' ? 'day' : 'día'}` : ''}`
          return kws ? `${head}\n${kws}` : head
        })
        .join('\n\n'),
    [p, uiLanguage],
  )

  const copiar = () => navigator.clipboard?.writeText(texto)

  const totalBudget = p.campaigns.reduce((s, c) => s + (c.budget || 0), 0)
  const totalKw = p.campaigns.reduce((s, c) => s + c.keywords.length, 0)

  return (
    <div className="cmp-page">
      <header className="cmp-head">
        <h1>{trText("Campañas")}</h1>
        <p>{trText("El plan de PPC como estructura editable. El nombre de cada campaña se arma por segmentos y se recalcula solo; el ad group hereda ese nombre. Las keywords se sacan con la × o se arrastran de una campaña a otra. Nada de esto está subido a Amazon: es el plan para revisar antes de ejecutar.")}</p>
      </header>

      <div className="cmp-tabs" role="tablist">
        {Object.entries(plan).map(([k, v]) => (
          <button
            key={k}
            role="tab"
            aria-selected={prod === k}
            className={`cmp-tab${prod === k ? ' active' : ''}`}
            onClick={() => setProd(k)}
          >
            <span className="cmp-tab-sku">{trText(identity.name)}{"-"}{trText(k)}</span>
            <span className="cmp-tab-name">{trText(v.producto)}</span>
          </button>
        ))}
      </div>

      <div className="cmp-resumen">
        <span><strong>{trText(p.campaigns.length)}</strong>{trText(" campañas")}</span>
        <span><strong>{trText(totalKw)}</strong>{trText(" keywords")}</span>
        <span><strong>{"$"}{trText(totalBudget)}</strong>{trText("/día")}</span>
        <span>{trText("veredicto del MKL: ")}<strong>{trText(p.veredicto)}</strong></span>
        <span>{trText("el líder se lleva ")}<strong>{trText(p.lider_share)}{"%"}</strong>{trText(" del volumen en página 1")}</span>
        <button className="cmp-btn" onClick={copiar}>{trText("Copiar el plan")}</button>
        <button className="cmp-btn cmp-btn-ghost" onClick={resetear}>{trText("Volver al original")}</button>
      </div>

      <div className="cmp-grid">
        <div className="cmp-col">
          {p.campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              c={c}
              dragging={dragging}
              onRemove={sacar}
              onDragStart={empezarDrag}
              onDrop={mover}
            />
          ))}
        </div>

        <aside className="cmp-banco">
          <div className="cmp-banco-head">
            <h2>{trText("Banco")}</h2>
            <p>{trText("Las que sacaste, más la cabeza del nicho — que va a fase 2, cuando el producto tenga reseñas. Arrastrá cualquiera a una campaña para meterla al plan.")}</p>
          </div>
          <ul className="cmp-kws">
            {p.banco.map((k) => (
              <li
                key={k.kw}
                className="cmp-kw cmp-kw-banco"
                draggable
                onDragStart={() => empezarDrag('__banco__', k.kw)}
                onDragEnd={() => { dragRef.current = null; setDragging(false) }}
                title={trText(k.motivo || '')}
              >
                <span className="cmp-kw-grip" aria-hidden>{"⠿"}</span>
                <span className="cmp-kw-txt">{k.kw}</span>
                <span className="cmp-kw-sv">{trText((k.sv || 0).toLocaleString('en-US'))}</span>
                {trText(k.td != null && <span className="cmp-kw-td">{trText("td ")}{trText(k.td)}</span>)}
              </li>
            ))}
            {trText(p.banco.length === 0 && <li className="cmp-kw-vacio">{trText("Vacío.")}</li>)}
          </ul>
        </aside>
      </div>
    </div>
  )
}
