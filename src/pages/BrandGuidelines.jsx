import { Link } from 'react-router-dom'
import brand from '../brand/brand.json'
import useMavraLanguage from '../components/useMavraLanguage.js'

const { identity } = brand
const COPY = {
  en: {
    eyebrow: 'MAVRA · Brand book',
    title: 'The decisions that made a dark-home brand coherent.',
    intro: 'This is the public reading layer of MAVRA’s Brand Book: the few decisions that connect customer understanding, positioning, creative direction and Amazon retail execution.',
    source: 'Explore source material',
    sourceNote: 'The full working Brand Book remains available as documented evidence.',
    decisions: [
      ['01', 'Customer tension', 'Dark décor is often framed as seasonal or decorative. The opportunity was to build for people who use their home as a permanent expression of identity—not a temporary costume.', 'Open consumer evidence', '/brand-guidelines/source#d1'],
      ['02', 'Territory', 'MAVRA claims permanent dark interiors: collected, considered and atmospheric. The territory separates the brand from Halloween shorthand and generic gothic décor.', 'Open positioning evidence', '/brand-guidelines/source#d2-territory'],
      ['03', 'Brand platform', 'The positioning system turns that territory into a usable decision filter: what the brand enables, what it refuses and how product, words and image remain recognizably MAVRA.', 'Open platform evidence', '/brand-guidelines/source#d3'],
      ['04', 'Visual identity', 'Chiaroscuro, controlled warmth and product-first composition translate the brand into a repeatable visual grammar across listing images, A+ and campaign assets.', 'Open identity evidence', '/brand-guidelines/source#d4'],
      ['05', 'Activation', 'The brand is not a static guideline. It is designed to become a retail experience—product story, creative system and moments of activation reinforcing one another.', 'Open activation evidence', '/brand-guidelines/source#d5'],
    ],
    closeTitle: 'Read the decisions first. Inspect the source when needed.',
    closeBody: 'The public layer makes the logic legible in minutes. The underlying matrices, principles and working notes remain one click away for anyone who wants to audit the depth.',
  },
  es: {
    eyebrow: 'MAVRA · Brand book',
    title: 'Las decisiones que hicieron coherente una marca de dark home.',
    intro: 'Esta es la capa pública de lectura del Brand Book de MAVRA: las decisiones que conectan entendimiento del cliente, posicionamiento, dirección creativa y ejecución retail en Amazon.',
    source: 'Explorar material fuente',
    sourceNote: 'El Brand Book completo de trabajo sigue disponible como evidencia documentada.',
    decisions: [
      ['01', 'Tensión del consumidor', 'El dark décor suele presentarse como algo estacional o decorativo. La oportunidad fue construir para quienes usan su hogar como expresión permanente de identidad, no como un disfraz temporal.', 'Abrir evidencia de consumidor', '/brand-guidelines/source#d1'],
      ['02', 'Territorio', 'MAVRA se apropia de los interiores oscuros permanentes: curados, intencionales y atmosféricos. El territorio separa la marca del atajo de Halloween y del gótico decorativo genérico.', 'Abrir evidencia de posicionamiento', '/brand-guidelines/source#d2-territory'],
      ['03', 'Plataforma de marca', 'El sistema de posicionamiento convierte ese territorio en un filtro de decisión utilizable: qué habilita la marca, qué rechaza y cómo producto, palabras e imagen siguen siendo reconociblemente MAVRA.', 'Abrir evidencia de plataforma', '/brand-guidelines/source#d3'],
      ['04', 'Identidad visual', 'Claroscuro, calidez controlada y composición centrada en producto traducen la marca a una gramática visual repetible para listing, A+ y campañas.', 'Abrir evidencia de identidad', '/brand-guidelines/source#d4'],
      ['05', 'Activación', 'La marca no es una guía estática. Está diseñada para convertirse en una experiencia retail: historia de producto, sistema creativo y momentos de activación reforzándose entre sí.', 'Abrir evidencia de activación', '/brand-guidelines/source#d5'],
    ],
    closeTitle: 'Lee primero las decisiones. Inspecciona la fuente cuando lo necesites.',
    closeBody: 'La capa pública vuelve la lógica legible en minutos. Matrices, principios y notas de trabajo quedan a un clic para quien quiera auditar la profundidad.',
  },
}
const styles = {
  page:{maxWidth:'1280px',margin:'0 auto',padding:'clamp(5rem,10vw,9rem) clamp(1.25rem,5vw,5rem) 6rem'},
  hero:{maxWidth:'760px',paddingBottom:'clamp(3rem,7vw,6rem)',borderBottom:'1px solid rgba(var(--copper-rgb),.22)'},
  eyebrow:{margin:0,color:'var(--copper)',fontFamily:"'Josefin Sans',sans-serif",fontSize:'.65rem',letterSpacing:'.24em',textTransform:'uppercase'},
  title:{margin:'1rem 0 1.5rem',color:'var(--fg)',fontFamily:"'Cinzel',serif",fontSize:'clamp(2.15rem,4.5vw,4.25rem)',fontWeight:400,lineHeight:1.06,letterSpacing:'-.025em'},
  intro:{maxWidth:'650px',color:'rgba(var(--fg-rgb),.68)',fontFamily:"'Basilia',serif",fontSize:'1.05rem',lineHeight:1.75},
  button:{display:'inline-flex',alignItems:'center',gap:'.5rem',marginTop:'1.6rem',padding:'.75rem 1rem',border:'1px solid rgba(var(--copper-rgb),.45)',color:'var(--fg)',fontFamily:"'Josefin Sans',sans-serif",fontSize:'.62rem',letterSpacing:'.16em',textTransform:'uppercase',textDecoration:'none'},
  list:{marginTop:'clamp(3rem,8vw,7rem)',borderTop:'1px solid rgba(var(--copper-rgb),.2)'},
  item:{display:'grid',gridTemplateColumns:'90px minmax(0,1fr) auto',gap:'clamp(1.25rem,4vw,4rem)',alignItems:'start',padding:'clamp(2rem,5vw,4rem) 0',borderBottom:'1px solid rgba(var(--copper-rgb),.18)'},
  number:{color:'var(--copper)',fontFamily:"'Josefin Sans',sans-serif",fontSize:'.65rem',letterSpacing:'.2em',paddingTop:'.45rem'},
  heading:{margin:0,color:'var(--fg)',fontFamily:"'Cinzel',serif",fontSize:'clamp(1.4rem,2.5vw,2.1rem)',fontWeight:400},
  body:{margin:'.75rem 0 0',maxWidth:'650px',color:'rgba(var(--fg-rgb),.67)',fontFamily:"'Basilia',serif",fontSize:'.95rem',lineHeight:1.75},
  source:{display:'inline-flex',alignItems:'center',marginTop:'.3rem',padding:'.55rem 0',color:'var(--copper)',fontFamily:"'Josefin Sans',sans-serif",fontSize:'.6rem',letterSpacing:'.13em',textTransform:'uppercase',textDecoration:'none',whiteSpace:'nowrap'},
  close:{marginTop:'clamp(4rem,10vw,9rem)',padding:'clamp(2rem,5vw,4rem)',background:'rgba(var(--copper-rgb),.06)',border:'1px solid rgba(var(--copper-rgb),.22)',maxWidth:'900px'},
}
export default function BrandGuidelines() {
  const [lang] = useMavraLanguage()
  const copy = COPY[lang]
  return <main style={styles.page}>
    <header style={styles.hero}>
      <p style={styles.eyebrow}>{copy.eyebrow}</p>
      <h1 style={styles.title}>{copy.title}</h1>
      <p style={styles.intro}>{copy.intro}</p>
      <Link to="/brand-guidelines/source" style={styles.button}>{copy.source} ↗</Link>
      <p style={{...styles.intro,fontSize:'.8rem',marginTop:'.85rem'}}>{copy.sourceNote}</p>
    </header>
    <section style={styles.list} aria-label={copy.eyebrow}>
      {copy.decisions.map(([number,title,body,label,to])=><article key={number} style={styles.item}>
        <span style={styles.number}>{number}</span>
        <div><h2 style={styles.heading}>{title}</h2><p style={styles.body}>{body}</p></div>
        <Link to={to} style={styles.source}>{label} ↗</Link>
      </article>)}
    </section>
    <section style={styles.close}>
      <h2 style={styles.heading}>{copy.closeTitle}</h2>
      <p style={styles.body}>{copy.closeBody}</p>
    </section>
  </main>
}
