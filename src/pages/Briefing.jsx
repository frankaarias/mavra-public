import { useEffect, useState } from 'react'
import brand from '../brand/brand.json'
import useMavraLanguage from '../components/useMavraLanguage.js'

const { identity } = brand
const COPY = {
  en: {
    nav: ['Brand', 'Portfolio', 'Visual system', 'Framework', 'Principles'],
    eyebrow: 'Case study evidence · Creative direction',
    title: <>A visual system<br />built for Amazon.</>,
    lead: "MAVRA's creative direction translates brand position, product truth and retail questions into one coherent visual experience.",
    sections: [
      ['01 — Brand point of view', 'Darkness as a form of authorship.', 'MAVRA is designed for people who treat their home as a personal world, not a temporary costume. The visual language is intentional, warm and precise: dark surfaces, controlled light and objects that feel collected rather than mass-produced.'],
      ['02 — Product architecture', 'Three expressions, one brand world.', ''],
      ['03 — Visual system', 'A repeatable aesthetic, not isolated images.', ''],
      ['04 — Production framework', 'Creative direction that connects to retail.', 'The work is planned from the customer’s decision journey outward: what they need to understand first, what objection follows, and which product proof earns the next moment of attention.'],
      ['05 — Creative principles', 'How the system stays coherent.', ''],
    ],
    products: [['Wall Skulls', 'A dimensional wall-decor system designed to make the permanent dark interior feel authored rather than seasonal.'], ['Skull Candle Set', 'A four-piece ritual object that combines sculptural detail, atmosphere and giftable presentation.'], ['Skull Lamp', 'A light object designed around shadow, modulation and an immediately recognizable room-level effect.']],
    visual: [['Light', 'Chiaroscuro, directional warmth and controlled shadow make form, finish and depth legible without losing atmosphere.'], ['Space', 'Permanent interiors, editorial surfaces and human-scale context position the products beyond seasonal decoration.'], ['Composition', 'Each frame has a job: establish the product, prove its details, communicate scale or place it inside a wider collection.']],
    framework: ['Brand territory', 'Product story', 'Image architecture', 'Retail execution'],
    principles: [['Product fidelity', 'The product remains the visual source of truth. Every scene, crop and format preserves its silhouette, scale and material character.'], ['Atmosphere serves proof', 'Mood is selected to make a product attribute easier to understand and want.'], ['One visual system', 'Listing images, A+ content, campaign creative and social assets share the same visual grammar.'], ['Evidence before claims', 'The visual stack answers scale, materials, use, presentation and product relationships before asking for conversion.']],
    footer: 'This public case-study view documents the creative reasoning and selected outputs. Source files and production notes remain outside the public experience.',
  },
  es: {
    nav: ['Marca', 'Portafolio', 'Sistema visual', 'Marco', 'Principios'],
    eyebrow: 'Evidencia del caso · Dirección creativa',
    title: <>Un sistema visual<br />hecho para Amazon.</>,
    lead: 'La dirección creativa de MAVRA traduce posición de marca, verdad de producto y preguntas retail en una experiencia visual coherente.',
    sections: [
      ['01 — Punto de vista de marca', 'La oscuridad como forma de autoría.', 'MAVRA está diseñada para personas que tratan su hogar como un mundo personal, no como un disfraz temporal. El lenguaje visual es intencional, cálido y preciso: superficies oscuras, luz controlada y objetos que se sienten coleccionados, no decorados en masa.'],
      ['02 — Arquitectura de producto', 'Tres expresiones, un solo mundo de marca.', ''],
      ['03 — Sistema visual', 'Una estética repetible, no imágenes aisladas.', ''],
      ['04 — Marco de producción', 'Dirección creativa conectada al retail.', 'El trabajo se planifica desde el journey de decisión del cliente: qué necesita entender primero, qué objeción aparece después y qué prueba de producto gana el siguiente momento de atención.'],
      ['05 — Principios creativos', 'Cómo el sistema se mantiene coherente.', ''],
    ],
    products: [['Wall Skulls', 'Un sistema de decoración mural dimensional que hace que el interior oscuro permanente se sienta diseñado, no estacional.'], ['Skull Candle Set', 'Un objeto ritual de cuatro piezas que combina detalle escultural, atmósfera y presentación apta para regalo.'], ['Skull Lamp', 'Un objeto de luz diseñado alrededor de sombra, modulación y un efecto inmediato a escala de habitación.']],
    visual: [['Luz', 'El claroscuro, la calidez direccional y la sombra controlada hacen legible forma, acabado y profundidad sin perder atmósfera.'], ['Espacio', 'Interiores permanentes, superficies editoriales y contexto a escala humana sitúan los productos más allá de la decoración estacional.'], ['Composición', 'Cada frame tiene una tarea: establecer el producto, probar su detalle, comunicar escala o situarlo dentro de un mundo coleccionable.']],
    framework: ['Territorio de marca', 'Historia de producto', 'Arquitectura de imagen', 'Ejecución retail'],
    principles: [['Fidelidad de producto', 'El producto es la fuente de verdad visual. Cada escena, crop y formato preserva su silueta, escala y carácter material.'], ['La atmósfera demuestra', 'El mood se elige para que un atributo de producto sea más fácil de entender y desear.'], ['Un solo sistema visual', 'Imágenes de listing, contenido A+, creatividades de campaña y activos sociales comparten la misma gramática visual.'], ['Evidencia antes que promesas', 'El stack visual responde escala, materiales, uso, presentación y relaciones de producto antes de pedir conversión.']],
    footer: 'Esta vista pública documenta el razonamiento creativo y outputs seleccionados. Archivos fuente y notas de producción quedan fuera de la experiencia pública.',
  },
}
const ids = ['marca', 'portfolio', 'visual-system', 'framework', 'principles']
const C = { background:'var(--bg)', foreground:'var(--fg)', copper:'var(--copper)', muted:'rgba(var(--fg-rgb),0.58)', border:'rgba(var(--copper-rgb),0.22)' }
const styles = {
  page:{maxWidth:'1360px',margin:'0 auto',padding:'60px clamp(20px, 4vw, 48px)'}, hero:{maxWidth:'800px',padding:'64px 0 48px',borderBottom:`1px solid ${C.border}`}, eyebrow:{margin:'0 0 14px',color:C.copper,fontSize:'0.68rem',letterSpacing:'0.2em',textTransform:'uppercase'}, title:{margin:0,color:C.foreground,fontFamily:'var(--font-condensed)',fontSize:'clamp(2.3rem, 6vw, 4.8rem)',fontWeight:400,lineHeight:.98,letterSpacing:'.035em'}, lead:{margin:'22px 0 0',color:C.muted,fontFamily:"'IM Fell English', Georgia, serif",fontSize:'1.25rem',fontStyle:'italic',lineHeight:1.55}, section:{marginTop:'72px'}, label:{display:'block',marginBottom:'9px',color:C.copper,fontSize:'0.65rem',letterSpacing:'0.18em',textTransform:'uppercase'}, h2:{margin:0,color:C.foreground,fontFamily:'var(--font-condensed)',fontSize:'2rem',fontWeight:400,letterSpacing:'.04em'}, body:{margin:'14px 0 0',color:C.muted,fontSize:'.95rem',lineHeight:1.75,maxWidth:'760px'}, grid:{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:'14px',marginTop:'28px'}, card:{minHeight:'155px',padding:'24px',background:'rgba(255,255,255,0.025)',border:`1px solid ${C.border}`}, cardTitle:{margin:0,color:C.foreground,fontFamily:'var(--font-condensed)',fontSize:'1.15rem',fontWeight:400,letterSpacing:'.06em'}, cardText:{margin:'12px 0 0',color:C.muted,fontSize:'.84rem',lineHeight:1.65}
}
function Cards({items}) { return <div style={styles.grid}>{items.map(([title,text],i)=><article key={title} style={styles.card}><h3 style={styles.cardTitle}>{title}</h3>{text && <p style={styles.cardText}>{text}</p>}{!text && <span style={styles.label}>0{i+1}</span>}</article>)}</div> }
export default function Briefing() {
 const [active,setActive]=useState('marca'); const [lang]=useMavraLanguage(); const copy=COPY[lang]
 useEffect(()=>{document.title=`${identity.name} — ${lang === 'en' ? 'Creative Direction' : 'Dirección Creativa'}`},[lang])
 const goTo=id=>{setActive(id);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
 return <main id="briefing-top" style={styles.page}>
  <nav aria-label={lang === 'es' ? 'Secciones de dirección creativa' : 'Creative direction sections'} style={{position:'sticky',top:'60px',zIndex:30,display:'flex',gap:'20px',overflowX:'auto',padding:'12px 0',background:C.background,borderBottom:`1px solid ${C.border}`}}>{ids.map((id,i)=><button key={id} type="button" onClick={()=>goTo(id)} style={{flex:'0 0 auto',padding:'4px 0',color:active===id?C.copper:C.muted,background:'none',border:0,borderBottom:active===id?`1px solid ${C.copper}`:'1px solid transparent',cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:'.64rem',letterSpacing:'.14em',textTransform:'uppercase'}}>{copy.nav[i]}</button>)}</nav>
  <header style={styles.hero}><p style={styles.eyebrow}>{copy.eyebrow}</p><h1 style={styles.title}>{copy.title}</h1><p style={styles.lead}>{copy.lead}</p></header>
  <section id={ids[0]} style={styles.section}><span style={styles.label}>{copy.sections[0][0]}</span><h2 style={styles.h2}>{copy.sections[0][1]}</h2><p style={styles.body}>{copy.sections[0][2]}</p></section>
  <section id={ids[1]} style={styles.section}><span style={styles.label}>{copy.sections[1][0]}</span><h2 style={styles.h2}>{copy.sections[1][1]}</h2><Cards items={copy.products}/></section>
  <section id={ids[2]} style={styles.section}><span style={styles.label}>{copy.sections[2][0]}</span><h2 style={styles.h2}>{copy.sections[2][1]}</h2><Cards items={copy.visual}/></section>
  <section id={ids[3]} style={styles.section}><span style={styles.label}>{copy.sections[3][0]}</span><h2 style={styles.h2}>{copy.sections[3][1]}</h2><p style={styles.body}>{copy.sections[3][2]}</p><Cards items={copy.framework.map(x=>[x,''])}/></section>
  <section id={ids[4]} style={styles.section}><span style={styles.label}>{copy.sections[4][0]}</span><h2 style={styles.h2}>{copy.sections[4][1]}</h2><Cards items={copy.principles}/></section>
  <footer style={{marginTop:'76px',padding:'28px 0',borderTop:`1px solid ${C.border}`}}><p style={{...styles.body,margin:0,maxWidth:'680px',fontSize:'.8rem'}}>{copy.footer}</p></footer>
 </main>
}
