import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const CONTENT = {
  en: {
    switch: 'ES',
    eyebrow: 'MAVRA · Evidence index',
    title: 'The evidence behind the case study.',
    lead: 'This is not an internal workspace. It is a curated reading path through the decisions, systems and customer-facing work built for MAVRA.',
    note: 'Public case study · Operational files, source data and production notes are intentionally excluded.',
    groups: [
      ['01 / Discover', 'Market evidence before execution.', [['Research & category', '/research'], ['Brand territory', '/corrientes']]],
      ['02 / Define', 'Positioning turned into a usable brand system.', [['Brand strategy', '/brand-guidelines'], ['Typography system', '/fonts']]],
      ['03 / Design', 'Creative direction built for repeatable retail production.', [['Creative direction', '/briefing'], ['Scenography', '/scenography'], ['Film direction', '/filmografia'], ['Visual avatars', '/avatares']]],
      ['04 / Merchandise', 'The Amazon PDP as a considered customer journey.', [['Product portfolio', '/skulls'], ['Listing architecture', '/listings-briefs'], ['A+ system', '/aplus-briefs']]],
      ['05 / Grow', 'Demand, distribution and launch planned as one loop.', [['Demand system', '/copy'], ['Launch framework', '/launch'], ['Distribution', '/pinterest'], ['Creator operations', '/influencers']]],
      ['06 / Operate', 'A system made inspectable without exposing working files.', [['Return to case study', '/']]],
    ],
  },
  es: {
    switch: 'EN',
    eyebrow: 'MAVRA · Índice de evidencias',
    title: 'La evidencia detrás del caso de estudio.',
    lead: 'Esto no es un espacio de trabajo interno. Es un recorrido curado por las decisiones, sistemas y trabajo de cara al cliente construidos para MAVRA.',
    note: 'Caso de estudio público · Los archivos operativos, datos fuente y notas de producción se excluyen intencionalmente.',
    groups: [
      ['01 / Descubrir', 'Evidencia de mercado antes de ejecutar.', [['Research y categoría', '/research'], ['Territorio de marca', '/corrientes']]],
      ['02 / Definir', 'Posicionamiento convertido en un sistema de marca utilizable.', [['Estrategia de marca', '/brand-guidelines'], ['Sistema tipográfico', '/fonts']]],
      ['03 / Diseñar', 'Dirección creativa construida para una producción retail repetible.', [['Dirección creativa', '/briefing'], ['Escenografía', '/scenography'], ['Dirección de film', '/filmografia'], ['Avatares visuales', '/avatares']]],
      ['04 / Comercializar', 'El PDP de Amazon como un journey de compra pensado.', [['Portafolio de producto', '/skulls'], ['Arquitectura de listing', '/listings-briefs'], ['Sistema A+', '/aplus-briefs']]],
      ['05 / Crecer', 'Demanda, distribución y lanzamiento planeados como un solo loop.', [['Sistema de demanda', '/copy'], ['Marco de launch', '/launch'], ['Distribución', '/pinterest'], ['Operación de creators', '/influencers']]],
      ['06 / Operar', 'Un sistema inspeccionable sin exponer archivos de trabajo.', [['Volver al caso de estudio', '/']]],
    ],
  },
}

function initialLanguage() {
  try { return localStorage.getItem('mavra-case-language') || 'en' } catch { return 'en' }
}

export default function BrandOS() {
  const [lang, setLang] = useState(initialLanguage)
  const copy = CONTENT[lang]
  const toggleLanguage = () => {
    const next = lang === 'en' ? 'es' : 'en'
    setLang(next)
    try { localStorage.setItem('mavra-case-language', next) } catch {}
  }

  return (
    <main className="evidence-index">
      <header className="evidence-index-hero">
        <button className="evidence-language" onClick={toggleLanguage}>{copy.switch}</button>
        <p className="case-eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </header>
      <section className="evidence-index-groups" aria-label="Evidence areas">
        {copy.groups.map(([number, description, links]) => (
          <article key={number} className="evidence-index-group">
            <div><span>{number}</span><p>{description}</p></div>
            <nav>{links.map(([label, to]) => <Link key={to} to={to}>{label}<ArrowUpRight size={15} /></Link>)}</nav>
          </article>
        ))}
      </section>
      <footer className="evidence-index-note">{copy.note}</footer>
    </main>
  )
}
