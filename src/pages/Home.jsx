import { Link } from 'react-router-dom'
import useMavraLanguage from '../components/useMavraLanguage.js'

const copy = {
  en: {
    eyebrow: 'MAVRA · BRAND OS',
    title: 'The source library behind the case study.',
    intro: 'A concise map of the systems used to build MAVRA. Start with the case study for the narrative; enter a surface only when you want to inspect the work behind it.',
    note: 'This is an index, not a second Brand Book.',
    groups: [
      { number: '01', title: 'Brand foundation', body: 'Positioning, audience, verbal identity and the visual system that holds the brand together.', links: [['Brand Guidelines', '/brand-guidelines'], ['Typography', '/fonts']] },
      { number: '02', title: 'Creative direction', body: 'The production language that turns strategy into scenes, motion and repeatable visual rules.', links: [['Creative Direction', '/briefing#briefing-top'], ['Scenography', '/scenography#scenography-top'], ['Filmography', '/filmografia'], ['Avatars', '/avatares']] },
      { number: '03', title: 'Amazon retail', body: 'The product, listing and A+ surfaces where the brand is made legible at the moment of purchase.', links: [['Listings', '/listings'], ['A+ briefs', '/aplus-briefs'], ['Copy & Ads', '/copy']] },
      { number: '04', title: 'Growth operations', body: 'Research, campaign architecture, launch control and creator systems. These are working surfaces, not a sales deck.', links: [['Research workspace', '/research'], ['Campaigns', '/campaigns'], ['Launch', '/launch'], ['Creators', '/creators']] }
    ],
    returnToCase: 'Return to Case Study',
    footer: 'MAVRA · Brand OS'
  },
  es: {
    eyebrow: 'MAVRA · BRAND OS',
    title: 'La biblioteca fuente detrás del caso de estudio.',
    intro: 'Un mapa conciso de los sistemas usados para construir MAVRA. Empieza por el caso de estudio para entender la narrativa; entra a una superficie solo cuando quieras inspeccionar el trabajo que la sostiene.',
    note: 'Esto es un índice, no un segundo Brand Book.',
    groups: [
      { number: '01', title: 'Fundamentos de marca', body: 'Posicionamiento, audiencia, identidad verbal y el sistema visual que sostiene la marca.', links: [['Brand Guidelines', '/brand-guidelines'], ['Tipografía', '/fonts']] },
      { number: '02', title: 'Dirección creativa', body: 'El lenguaje de producción que convierte la estrategia en escenas, movimiento y reglas visuales repetibles.', links: [['Dirección creativa', '/briefing#briefing-top'], ['Escenografía', '/scenography#scenography-top'], ['Filmografía', '/filmografia'], ['Avatares', '/avatares']] },
      { number: '03', title: 'Retail en Amazon', body: 'Las superficies de producto, listing y A+ donde la marca se vuelve legible en el momento de compra.', links: [['Listings', '/listings'], ['Briefs A+', '/aplus-briefs'], ['Copy & Ads', '/copy']] },
      { number: '04', title: 'Operaciones de crecimiento', body: 'Research, arquitectura de campañas, control de lanzamiento y sistemas de creators. Son superficies de trabajo, no una presentación comercial.', links: [['Workspace de research', '/research'], ['Campañas', '/campaigns'], ['Launch', '/launch'], ['Creators', '/creators']] }
    ],
    returnToCase: 'Volver al Caso de estudio',
    footer: 'MAVRA · Brand OS'
  }
}

export default function Home() {
  const [language] = useMavraLanguage()
  const t = copy[language] || copy.en

  return (
    <main className="brand-os-index">
      <header className="brand-os-hero">
        <p className="section-label">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="brand-os-intro">{t.intro}</p>
        <p className="brand-os-note">{t.note}</p>
      </header>

      <section className="brand-os-grid" aria-label={t.eyebrow}>
        {t.groups.map(group => (
          <article className="brand-os-card" key={group.number}>
            <p className="brand-os-number">{group.number}</p>
            <h2>{group.title}</h2>
            <p>{group.body}</p>
            <nav aria-label={group.title}>
              {group.links.map(([label, to]) => <Link key={to} to={to}>{label}<span aria-hidden="true">↗</span></Link>)}
            </nav>
          </article>
        ))}
      </section>

      <footer className="brand-os-footer">
        <Link to="/">{t.returnToCase} <span aria-hidden="true">↗</span></Link>
        <span>{t.footer}</span>
      </footer>
    </main>
  )
}
