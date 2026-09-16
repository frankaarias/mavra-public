import { useTranslation } from '../i18n/TranslationProvider.jsx'
import { useState, useEffect } from 'react'
import brand from '../brand/brand.json'

const { campaigns, identity } = brand
import ESTADO from '../data/launch_state.json'

// ── Checklist de lanzamiento ──────────────────────────────────────────────────
// La mitad de los ítems se verifica sola contra la cuenta (SP-API + Ads API) y se
// pinta en verde o rojo con el dato al lado. El resto se marca a mano: son los que
// ninguna API puede ver — las imágenes, el inventario en el centro logístico, y la
// prueba de indexación escribiendo "keyword ASIN" en la barra de Amazon.
//
// La regla que ordena todo: las fases avanzan POR SEÑAL, no por fecha.

const STORE = 'mavra_launch_v1'



// Lo que ninguna API puede responder: se mira a mano.
const MANUALES = {
  imagenes: 'Main sobre fondo blanco + las de objeción: escala, montaje, material, uso real.',
  aplus: 'Publicado y con alt text cargado — es lo único del A+ que indexa.',
  stock: 'Confirmado en el centro logístico, no "en camino".',
  indexacion: 'Escribí «keyword ASIN» en la barra de Amazon. Si aparece, indexó. Se mira los 7 primeros días, no una sola vez: lo que interesa es verla subir.',
  impresiones: 'Se lee en el reporte de Amazon, que tarda en cubrir el día en curso.',
}

function Dot({ estado }) {
  const color = estado === true ? '#6f9c63' : estado === false ? '#c0553f' : 'rgba(148,163,184,0.4)'
  return (
    <span
      style={{
        display: 'inline-block', width: 9, height: 9, borderRadius: '50%', flex: 'none',
        background: estado == null ? 'transparent' : color,
        border: `1px solid ${color}`, marginTop: 6,
      }}
    />
  )
}

export default function Launch() {
  const { text: trText, language: uiLanguage } = useTranslation()

  const [prod, setProd] = useState('SWD')
  const [marcado, setMarcado] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}') } catch { return {} }
  })
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(marcado)) } catch { /* sin espacio: se pierde el guardado, no la pantalla */ }
  }, [marcado])

  const p = ESTADO.productos[prod]
  const porId = Object.fromEntries(p.items.map((i) => [i.id, i]))
  const clave = (id) => `${prod}:${id}`

  // El ítem verificado por API manda; el manual usa lo que marcaste vos.
  const resuelto = (it) => (it.auto ? it.estado : marcado[clave(it.id)] === true ? true : null)
  const listos = p.items.filter((i) => resuelto(i) === true).length
  const rojos = p.items.filter((i) => resuelto(i) === false).length

  return (
    <div className="lnc-page">
      <header className="lnc-head">
        <h1>{trText("Checklist de lanzamiento")}</h1>
        <p>{trText("Los ítems con dato se verifican solos contra la cuenta y se pintan en verde o rojo. Los que ninguna API puede ver los marcás vos. ")}<strong>{trText("Las fases avanzan por señal, no por fecha.")}</strong>
        </p>
      </header>

      <div className="lnc-tabs" role="tablist">
        {Object.entries(ESTADO.productos).map(([k, v]) => {
          const items = v.items
          const ok = items.filter((i) => (i.auto ? i.estado : marcado[`${k}:${i.id}`] === true) === true).length
          return (
            <button
              key={k} role="tab" aria-selected={prod === k}
              className={`lnc-tab${prod === k ? ' active' : ''}`}
              onClick={() => setProd(k)}
            >
              <span className="lnc-tab-sku">{trText(identity.name)}{"-"}{trText(k)}</span>
              <span className="lnc-tab-name">{trText(v.nombre)}</span>
              <span className="lnc-tab-n">{trText(ok)}{"/"}{trText(items.length)}</span>
            </button>
          )
        })}
      </div>

      <div className="lnc-resumen">
        <span><strong>{trText(listos)}</strong>{trText(" en verde")}</span>
        <span><strong>{trText(rojos)}</strong>{trText(" en rojo")}</span>
        <span><strong>{trText(p.items.length - listos - rojos)}</strong>{trText(" sin resolver")}</span>
        <span>{trText("ASIN ")}<code>{trText(p.asin)}</code></span>
        <span>{trText(p.verificables)}{trText(" de ")}{trText(p.items.length)}{trText(" se verifican solos")}</span>
      </div>

      {campaigns.launch.map((f) => (
        <section key={f.n} className="lnc-fase">
          <div className="lnc-fase-head">
            <span className="lnc-fase-n">{trText(f.n)}</span>
            <h2>{trText(f.t)}</h2>
          </div>
          <p className="lnc-fase-d">{trText(f.d)}</p>
          <ul className="lnc-items">
            {f.items.map((id) => {
              const it = porId[id]
              if (!it) return null
              const est = resuelto(it)
              return (
                <li key={id} className={`lnc-item${est === true ? ' ok' : est === false ? ' mal' : ''}`}>
                  <Dot estado={est} />
                  <div className="lnc-item-body">
                    <div className="lnc-item-txt">
                      {trText(it.texto)}
                      {trText(!it.auto && <span className="lnc-manual">{trText("a mano")}</span>)}
                    </div>
                    <div className="lnc-item-det">{trText(it.auto ? it.detalle : MANUALES[id] || it.detalle)}</div>
                  </div>
                  {trText(!it.auto && (
                    <label className="lnc-chk">
                      <input
                        type="checkbox"
                        checked={marcado[clave(id)] === true}
                        onChange={(e) => setMarcado((m) => ({ ...m, [clave(id)]: e.target.checked }))}
                      />
                      <span>{trText("hecho")}</span>
                    </label>
                  ))}
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      {trText(p.exclusiones && (
        <section className="lnc-excl">
          <span className="lnc-kpi-lbl">{trText("Dónde ")}{trText(identity.name)}{trText(" no quiere aparecer")}</span>
          <p className="lnc-fase-d">{trText("No es optimización: es identidad. Se carga antes de tener un solo dato, porque el problema no es que la keyword rinda mal — es que atrae al comprador equivocado. Va como ")}<strong>{trText("phrase")}</strong>{trText(", que corta la frase entera y no solo la palabra suelta.")}</p>
          <div className="lnc-chips">
            {p.exclusiones.activas.map((t) => (
              <span key={t} className="lnc-chip on">{t}</span>
            ))}
          </div>
          <p className="lnc-excl-cob">
            {uiLanguage === 'en'
              ? `Loaded in the ${p.exclusiones.ad_groups_busqueda} ad groups competing in search.`
              : `Cargadas en los ${p.exclusiones.ad_groups_busqueda} ad groups que compiten por búsquedas.`}
            {p.exclusiones.ad_groups_producto > 0 && (uiLanguage === 'en'
              ? ` The ${p.exclusiones.ad_groups_producto} product-targeting ad group(s) exclude by ASIN, not phrase: ${p.exclusiones.exclusiones_producto} exclusions today.`
              : ` Los ${p.exclusiones.ad_groups_producto} grupos que apuntan a productos excluyen por ASIN, no por frase: ${p.exclusiones.exclusiones_producto} exclusiones hoy.`)}
          </p>
          {trText(p.exclusiones.propuestas.length > 0 && (
            <details className="lnc-excl-prop">
              <summary>{trText(p.exclusiones.propuestas.length)}{trText(" propuestas sin cargar — esperan tu OK")}</summary>
              <ul>
                {p.exclusiones.propuestas.map((x) => (
                  <li key={x.t}><b>{x.t}</b>{" — "}{trText(x.motivo.replace(/^Propuesto: /, ''))}</li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      ))}

      <section className="lnc-fase">
        <div className="lnc-fase-head">
          <span className="lnc-fase-n">{trText("Fase 4")}</span>
          <h2>{trText("Cuando ya hay señal")}</h2>
        </div>
        <p className="lnc-fase-d">{trText("Graduar keywords de backend a viñetas a título, por evidencia — la pregunta no es \"¿es buena?\" sino \"¿ya se ganó el lugar?\". Rotar el backend: las que indexaron liberan su espacio. Cambiar el rol de las campañas, de descubrimiento a defensa. Y recién ahí abrir la cabeza de categoría en exact.")}</p>
      </section>

      <div className="lnc-kpi">
        <span className="lnc-kpi-lbl">{trText("La vara cambia con la etapa")}</span>
        <div className="lnc-kpi-row"><b>{trText("Lanzamiento")}</b>{trText(" indexó · impresiones · clics")}</div>
        <div className="lnc-kpi-row"><b>{trText("Crecimiento")}</b>{trText(" CVR contra la mediana del nicho")}</div>
        <div className="lnc-kpi-row"><b>{trText("Maduro")}</b>{trText(" aporte incremental")}</div>
        <div className="lnc-kpi-row"><b>{trText("Defensa")}</b>{trText(" no perder posición")}</div>
        <p className="lnc-kpi-nota">{trText("Usar la vara de una etapa en otra es el error más caro del lanzamiento.")}</p>
      </div>

      <footer className="lnc-foot">{trText("Estado de la cuenta leído el ")}{trText(ESTADO.generado)}{trText(". Los ítems automáticos se recalculan cuando se regenera; lo que marcás a mano queda guardado en este navegador.")}</footer>
    </div>
  )
}
