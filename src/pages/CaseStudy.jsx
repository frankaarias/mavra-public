import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, Check, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const COPY = {
  en: {
    language: 'ES',
    eyebrow: 'Frank Arias · Case Study 01',
    category: 'Amazon Brand Management',
    title: 'Building an Amazon-native brand as one connected system.',
    intro: 'MAVRA is a proof-of-work case study: a dark-home brand developed from market understanding through Amazon retail execution and launch operations.',
    primary: 'Explore the system',
    secondary: 'Browse the Brand OS',
    scope: [
      ['Role', 'Brand & Growth Lead'],
      ['Marketplace', 'Amazon US'],
      ['Scope', '3 product lines'],
      ['Built', '2026'],
    ],
    challengeKicker: 'The challenge',
    challengeTitle: 'Make every customer-facing decision compound.',
    challengeText: 'The work was not to make isolated assets. It was to build a usable system in which market signals, positioning, product storytelling, Amazon retail content and launch decisions reinforce one another.',
    systemKicker: 'The connected system',
    systemTitle: 'From market signal to operating rhythm.',
    evidence: 'Open evidence',
    decisionKicker: 'Selected decisions',
    decisionTitle: 'The work is visible. The reasoning is documented.',
    proofKicker: 'Scope & proof',
    proofTitle: 'Evidence over claims.',
    proofText: 'These are documented inputs and operating assets—not commercial results or projected outcomes.',
    roleKicker: 'My role',
    roleTitle: 'Strategy, retail execution and the systems between them.',
    roleText: 'I led the strategic and operational work across the brand. When specialist production is involved, the work should be credited as production—not mistaken for the direction behind it.',
    contactKicker: 'Start a conversation',
    contactTitle: 'Need this level of brand infrastructure for your Amazon business?',
    contactText: 'Tell me where your brand is today and what needs to become connected.',
    form: ['Your name', 'Work email', 'Company / brand', 'What are you building?', 'Send inquiry'],
    notice: 'Contact delivery is being configured.',
    footer: 'MAVRA · A documented Amazon Brand Management case study by Frank Arias.',
  },
  es: {
    language: 'EN',
    eyebrow: 'Frank Arias · Caso de estudio 01',
    category: 'Brand Management para Amazon',
    title: 'Construir una marca nativa de Amazon como un sistema conectado.',
    intro: 'MAVRA es un caso de estudio con prueba documental: una marca de dark home desarrollada desde el entendimiento del mercado hasta la ejecución retail en Amazon y la operación de lanzamiento.',
    primary: 'Explorar el sistema',
    secondary: 'Ver el Brand OS',
    scope: [
      ['Rol', 'Brand & Growth Lead'],
      ['Marketplace', 'Amazon US'],
      ['Alcance', '3 líneas de producto'],
      ['Construido', '2026'],
    ],
    challengeKicker: 'El reto',
    challengeTitle: 'Hacer que cada decisión frente al cliente se acumule.',
    challengeText: 'El trabajo no era crear activos aislados. Era construir un sistema utilizable donde señales de mercado, posicionamiento, narrativa de producto, contenido retail de Amazon y decisiones de lanzamiento se refuercen entre sí.',
    systemKicker: 'El sistema conectado',
    systemTitle: 'De la señal de mercado al ritmo operativo.',
    evidence: 'Abrir evidencia',
    decisionKicker: 'Decisiones seleccionadas',
    decisionTitle: 'El trabajo se ve. El razonamiento está documentado.',
    proofKicker: 'Alcance y prueba',
    proofTitle: 'Evidencia antes que promesas.',
    proofText: 'Estos son inputs documentados y activos operativos; no resultados comerciales ni proyecciones.',
    roleKicker: 'Mi rol',
    roleTitle: 'Estrategia, ejecución retail y los sistemas que las conectan.',
    roleText: 'Lideré el trabajo estratégico y operativo de la marca. Cuando interviene producción especializada, debe acreditarse como producción y no confundirse con la dirección que la guía.',
    contactKicker: 'Iniciar una conversación',
    contactTitle: '¿Necesitas este nivel de infraestructura de marca para tu negocio en Amazon?',
    contactText: 'Cuéntame dónde está tu marca hoy y qué piezas necesitan empezar a trabajar conectadas.',
    form: ['Tu nombre', 'Email de trabajo', 'Empresa / marca', '¿Qué estás construyendo?', 'Enviar consulta'],
    notice: 'La entrega de mensajes está en configuración.',
    footer: 'MAVRA · Caso de estudio documentado de Brand Management para Amazon por Frank Arias.',
  },
}

const CHAPTERS = {
  en: [
    { number: '01', title: 'Discover', body: 'Market, customer, competitive and keyword evidence used to define the opportunity before execution.', links: [['Research engine', '/research'], ['Competitive landscape', '/competitors']] },
    { number: '02', title: 'Define', body: 'A positioning platform, verbal system and territory designed to turn category information into a coherent brand.', links: [['Brand guidelines', '/brand-guidelines'], ['Cultural territories', '/corrientes']] },
    { number: '03', title: 'Design', body: 'Creative direction translated into reusable rules for scenes, imagery, typography, film and AI-assisted production.', links: [['Scenography', '/scenography'], ['Film direction', '/filmografia'], ['Visual avatars', '/avatares']] },
    { number: '04', title: 'Merchandise', body: 'The brand becomes an Amazon retail experience through product positioning, SEO, listing architecture and A+ content.', links: [['Product portfolio', '/skulls'], ['Listing briefs', '/listings-briefs'], ['A+ content', '/aplus-briefs']] },
    { number: '05', title: 'Grow', body: 'Launch, paid traffic, social distribution and creator activity are planned as a connected growth loop—not isolated channels.', links: [['Campaign architecture', '/campaigns'], ['Launch system', '/launch'], ['Creator strategy', '/influencers']] },
    { number: '06', title: 'Operate', body: 'Research tools, manual checks and decision frameworks make the work inspectable, repeatable and easier to improve.', links: [['Research workspace', '/research'], ['Creator operations', '/influencers'], ['Creator studio', '/creators']] },
  ],
  es: [
    { number: '01', title: 'Descubrir', body: 'Evidencia de mercado, cliente, competencia y keywords usada para definir la oportunidad antes de ejecutar.', links: [['Motor de research', '/research'], ['Panorama competitivo', '/competitors']] },
    { number: '02', title: 'Definir', body: 'Una plataforma de posicionamiento, sistema verbal y territorio para convertir información de categoría en una marca coherente.', links: [['Brand guidelines', '/brand-guidelines'], ['Territorios culturales', '/corrientes']] },
    { number: '03', title: 'Diseñar', body: 'Dirección creativa traducida a reglas reutilizables para escenas, imagen, tipografía, film y producción asistida por IA.', links: [['Escenografía', '/scenography'], ['Dirección de film', '/filmografia'], ['Avatares visuales', '/avatares']] },
    { number: '04', title: 'Comercializar', body: 'La marca se convierte en una experiencia retail de Amazon mediante producto, SEO, arquitectura de listing y A+.', links: [['Portafolio de producto', '/skulls'], ['Briefs de listing', '/listings-briefs'], ['Contenido A+', '/aplus-briefs']] },
    { number: '05', title: 'Crecer', body: 'Lanzamiento, tráfico pagado, distribución social y creators se planean como un loop de crecimiento conectado, no canales aislados.', links: [['Arquitectura de campañas', '/campaigns'], ['Sistema de launch', '/launch'], ['Estrategia de creators', '/influencers']] },
    { number: '06', title: 'Operar', body: 'Herramientas de research, comprobaciones manuales y marcos de decisión hacen el trabajo inspeccionable, repetible y mejorable.', links: [['Workspace de research', '/research'], ['Operación de creators', '/influencers'], ['Creator studio', '/creators']] },
  ],
}

const DECISIONS = {
  en: [
    ['A market reading became a permanent territory.', 'Research, competitor analysis and brand strategy were connected before product and creative execution.', '/research'],
    ['The Amazon PDP was treated as a retail experience.', 'Product positioning, listing copy, visual briefs and A+ content were developed as one customer journey.', '/listings-briefs'],
    ['Growth was built as an operating system.', 'Campaign architecture, launch phases and creator workflows were documented as decisions a team can inspect and run.', '/launch'],
  ],
  es: [
    ['Una lectura de mercado se convirtió en un territorio permanente.', 'Research, análisis competitivo y estrategia de marca se conectaron antes de ejecutar producto y creatividad.', '/research'],
    ['El PDP de Amazon se trató como una experiencia retail.', 'Posicionamiento de producto, copy de listing, briefs visuales y A+ se desarrollaron como un solo journey de compra.', '/listings-briefs'],
    ['El crecimiento se construyó como sistema operativo.', 'Arquitectura de campañas, fases de launch y workflows de creators se documentaron como decisiones que un equipo puede inspeccionar y ejecutar.', '/launch'],
  ],
}

const PROOF = {
  en: [
    ['3', 'product lines', 'Wall Skulls · Skull Candle Set · Skull Lamp'],
    ['126', 'creators mapped', '86 manually verified · 41 tier-A'],
    ['18', 'public working modules', 'Strategy, retail, creative and operations'],
    ['6', 'connected workstreams', 'Discover through Operate'],
  ],
  es: [
    ['3', 'líneas de producto', 'Wall Skulls · Skull Candle Set · Skull Lamp'],
    ['126', 'creators mapeados', '86 verificados manualmente · 41 nivel A'],
    ['18', 'módulos de trabajo públicos', 'Estrategia, retail, creatividad y operación'],
    ['6', 'frentes conectados', 'De descubrir a operar'],
  ],
}

const ROLE = {
  en: ['Brand strategy', 'Amazon growth', 'Creative direction', 'Product marketing', 'Launch operations', 'AI workflows'],
  es: ['Estrategia de marca', 'Amazon growth', 'Dirección creativa', 'Product marketing', 'Operación de launch', 'Workflows de IA'],
}

export default function CaseStudy() {
  const [lang, setLang] = useState('en')
  const [submitted, setSubmitted] = useState(false)
  const copy = COPY[lang]
  const chapters = useMemo(() => CHAPTERS[lang], [lang])

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="case-study">
      <section className="case-hero">
        <div className="case-grid-noise" aria-hidden="true" />
        <div className="case-language" aria-label="Language selector">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <span>/</span>
          <button className={lang === 'es' ? 'active' : ''} onClick={() => setLang('es')}>ES</button>
        </div>
        <div className="case-hero-copy">
          <p className="case-eyebrow">{copy.eyebrow}</p>
          <p className="case-category">{copy.category}</p>
          <h1>{copy.title}</h1>
          <p className="case-intro">{copy.intro}</p>
          <div className="case-hero-actions">
            <a href="#system" className="case-button primary">{copy.primary} <ArrowDown size={15} /></a>
            <a href="#evidence" className="case-button secondary">{copy.secondary} <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <dl className="case-scope-grid">
          {copy.scope.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
        </dl>
      </section>

      <section className="case-section case-challenge">
        <div className="case-section-label">01 / {copy.challengeKicker}</div>
        <div className="case-split-copy">
          <h2>{copy.challengeTitle}</h2>
          <p>{copy.challengeText}</p>
        </div>
      </section>

      <section id="system" className="case-section">
        <div className="case-section-label">02 / {copy.systemKicker}</div>
        <h2 className="case-wide-title">{copy.systemTitle}</h2>
        <div className="case-chapter-grid">
          {chapters.map((chapter) => (
            <article className="case-chapter" key={chapter.number}>
              <span className="case-chapter-number">{chapter.number}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.body}</p>
              <div className="case-evidence-links">
                {chapter.links.map(([label, to]) => <Link key={to} to={to}>{label} <ArrowUpRight size={12} /></Link>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="case-section">
        <div className="case-section-label">03 / {copy.decisionKicker}</div>
        <h2 className="case-wide-title">{copy.decisionTitle}</h2>
        <div className="case-decision-list">
          {DECISIONS[lang].map(([title, body, to], index) => (
            <Link className="case-decision" to={to} key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
              <ArrowUpRight size={19} />
            </Link>
          ))}
        </div>
      </section>

      <section className="case-section case-proof" id="evidence">
        <div className="case-section-label">04 / {copy.proofKicker}</div>
        <div className="case-split-copy">
          <div><h2>{copy.proofTitle}</h2><p>{copy.proofText}</p></div>
          <Link className="case-button secondary case-all-evidence" to="/brand">{copy.secondary} <ArrowUpRight size={15} /></Link>
        </div>
        <div className="case-proof-grid">
          {PROOF[lang].map(([value, label, note]) => <article key={label}><strong>{value}</strong><h3>{label}</h3><p>{note}</p></article>)}
        </div>
      </section>

      <section className="case-section case-role">
        <div className="case-section-label">05 / {copy.roleKicker}</div>
        <div className="case-split-copy">
          <div><h2>{copy.roleTitle}</h2><p>{copy.roleText}</p></div>
          <ul>{ROLE[lang].map(item => <li key={item}><Check size={15} /> {item}</li>)}</ul>
        </div>
      </section>

      <section className="case-contact" id="contact">
        <div className="case-contact-copy">
          <p className="case-section-label">06 / {copy.contactKicker}</p>
          <h2>{copy.contactTitle}</h2>
          <p>{copy.contactText}</p>
        </div>
        <form className="case-contact-form" onSubmit={handleSubmit}>
          <label><span>{copy.form[0]}</span><input name="name" required /></label>
          <label><span>{copy.form[1]}</span><input type="email" name="email" required /></label>
          <label><span>{copy.form[2]}</span><input name="company" /></label>
          <label><span>{copy.form[3]}</span><textarea name="message" rows="4" required /></label>
          <button type="submit" className="case-button primary"><Mail size={15} /> {copy.form[4]}</button>
          {submitted && <p className="case-form-notice" role="status">{copy.notice}</p>}
        </form>
      </section>

      <footer className="case-footer">
        <span>{copy.footer}</span>
        <Link to="/brand">MAVRA Brand OS <ArrowUpRight size={13} /></Link>
      </footer>
    </main>
  )
}
