import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDown, ArrowLeft } from 'lucide-react'
import useMavraLanguage from '../components/useMavraLanguage.js'
import '../case-editorial.css'
import '../brand-library.css'

// Destinations stay shared between languages; research and competitor data are external to this index.
const RESOURCES = [
  ['/brand-guidelines','guide','Entender la estrategia','Understand the strategy','Las cinco decisiones principales, explicadas antes de entrar al documento.','The five main brand decisions, explained before opening the full document.'],
  ['/brand-guidelines/source','guide','Consultar el Brand Book completo','Read the complete Brand Book','Consumidor, posicionamiento, voz, identidad y aplicaciones en un solo documento.','Customer, positioning, voice, identity and applications in one document.'],
  ['/corrientes','guide','Referentes culturales','Cultural references','Las corrientes estéticas que dan contexto al universo de MAVRA.','The aesthetic movements behind MAVRA’s visual world.'],
  ['/fonts','guide','Tipografía','Typography','Familias, jerarquías y ejemplos del sistema tipográfico.','Font families, hierarchy and examples of the type system.'],
  ['/briefing#briefing-top','pieces','Piezas y dirección creativa','Creative pieces and direction','Ejemplos visuales y las decisiones que los conectan con Amazon.','Visual examples and the decisions that connect them to Amazon.'],
  ['/scenography#scenography-top','guide','Guía de escenarios y luz','Setting and lighting guide','Reglas para ambientes, iluminación, cámara y composición.','Rules for settings, lighting, camera and composition.'],
  ['/filmografia','guide','Dirección de vídeo','Video direction','Lenguaje audiovisual, movimientos y pautas de producción.','Visual language, camera movement and production guidance.'],
  ['/avatares','guide','Personas y vestuario','People and wardrobe','Perfiles y estilismo para representar a la marca.','Character profiles and styling for representing the brand.'],
  ['/skulls','guide','Los tres productos','The three products','Wall Skulls, Skull Candle Set y Skull Lamp dentro de la colección.','Wall Skulls, Skull Candle Set and Skull Lamp within the collection.'],
  ['/listings-briefs','brief','20 briefs de imagen','20 image briefs','Qué mostrar, qué pregunta resolver y qué decir en cada imagen.','What to show, which buyer question to answer and what to say in each image.'],
  ['/aplus-briefs','brief','Secuencia y copy A+','A+ sequence and copy','Seis módulos del brief de velas y su conexión con la colección.','Six modules in the candle brief and their connection to the collection.'],
  ['/copy','brief','Textos y palabras clave de producto','Product copy and keywords','El contenido escrito de la ficha y su relación con las búsquedas.','Product-page copy and its relationship to customer searches.'],
  ['/research','tool','Demanda y palabras clave','Search demand and keywords','Workspace para examinar demanda, competencia y ajuste al producto.','A workspace for examining demand, competition and product fit.'],
  ['/competitors','tool','Comparación de competidores','Competitor comparison','Referencias competitivas para estudiar la categoría.','Competitive references for examining the category.'],
  ['/campaigns','tool','Plan de publicidad en Amazon','Amazon advertising plan','Estructura de campañas y organización de palabras clave.','Campaign structure and keyword organisation.'],
  ['/launch','tool','Comprobaciones de lanzamiento','Launch checks','Fases y comprobaciones para preparar y seguir el lanzamiento.','Stages and checks for preparing and tracking the launch.'],
  ['/pinterest','pieces','Piezas y plan de Pinterest','Pinterest creative and plan','Creatividades existentes y su organización por producto.','Existing creative pieces organised by product.'],
  ['/influencers','guide','Estrategia de creadores','Creator strategy','Criterios de selección y planificación de colaboraciones.','Selection criteria and collaboration planning.'],
  ['/creators','brief','Brief para colaboradores','Collaborator brief','El encargo creativo para quienes producen contenido de la marca.','The creative brief for people producing brand content.'],
]
const GROUPS = [
  { id:'brand-visual', title:['Marca y dirección visual','Brand and visual direction'], intro:['De la estrategia a las reglas para producir imágenes coherentes.','From brand strategy to the rules for consistent imagery.'], resources:RESOURCES.slice(0,8) },
  { id:'product-content', title:['Contenido de producto','Product content'], intro:['Lo que el comprador necesita ver y entender para elegir.','What shoppers need to see and understand before choosing.'], resources:RESOURCES.slice(8,12) },
  { id:'research-launch', title:['Investigación y lanzamiento','Research and launch'], intro:['Del análisis de oportunidades a la planificación de la ejecución.','From examining opportunities to planning execution.'], resources:RESOURCES.slice(12) },
]
const FEATURED = [
  { id:'brand-book', title:['Brand Book','Brand Book'], type:'guide', image:'/shots/brand-board-en-20260920.jpg', alt:['Tagline y lenguaje sensorial del Brand Book de MAVRA, captura en inglés','MAVRA Brand Book tagline and sensory language, English capture'], to:'/brand-guidelines/source', action:['Consultar el Brand Book completo','Read the complete Brand Book'], description:['Consumidor, posicionamiento y reglas de identidad.','Customer, positioning and identity rules.'], connection:['Estas decisiones orientan las imágenes de producto.','These decisions guide the product imagery.'], related:[['Entender la estrategia','Understand the strategy','/brand-guidelines']] },
  { id:'creative', title:['Dirección creativa','Creative direction'], type:'pieces', image:'/pinterest/b3.jpg', alt:['Lámpara MAVRA en una pieza existente del archivo Pinterest','MAVRA lamp in an existing Pinterest creative'], to:'/briefing#briefing-top', action:['Ver las piezas y sus reglas','See the pieces and their rules'], description:['Ejemplos reales de luz, detalle y ambientes de marca.','Real examples of lighting, detail and branded settings.'], connection:['Las reglas visuales se aplican en los briefs de producción.','The visual rules carry into the production briefs.'], related:[['Briefs de imagen','Image briefs','/listings-briefs'],['A+','A+','/aplus-briefs']] },
  { id:'amazon-content', title:['Contenido Amazon','Amazon content'], type:'brief', image:'/shots/product-brief-en-20260920.jpg', alt:['Brief de imágenes Wall Skulls, captura en inglés','Wall Skulls image brief, English capture'], to:'/listings-briefs', action:['Explorar los 20 briefs','Explore the 20 image briefs'], description:['La pregunta de compra, la imagen y el mensaje de cada posición.','The buyer question, image direction and message for each slot.'], connection:['La ficha presenta el producto; A+ lo conecta con la colección.','The product page introduces the item; A+ connects the collection.'], related:[['Secuencia A+','A+ sequence','/aplus-briefs'],['Copy de producto','Product copy','/copy']] },
  { id:'research', title:['Investigación','Research'], type:'tool', image:'/shots/research-en-20260917.jpg', alt:['Workspace de investigación, captura en inglés','Research workspace, English capture'], to:'/research', action:['Abrir el workspace','Open the workspace'], description:['Demanda, competencia y relevancia para los tres productos.','Demand, competition and relevance across the three products.'], connection:['El análisis orienta las prioridades de publicidad y lanzamiento.','The analysis informs advertising and launch priorities.'], related:[['Plan de campañas','Campaign plan','/campaigns'],['Lanzamiento','Launch','/launch']] },
]
const TYPES = { guide:['Guía','Guide'], brief:['Brief','Brief'], tool:['Herramienta','Tool'], pieces:['Piezas visuales','Visual pieces'] }

export default function Home() {
  const [lang] = useMavraLanguage()
  const i = lang === 'es' ? 0 : 1
  return <main className="case-study editorial-case brand-library">
    <header className="editorial-header library-header">
      <p className="case-eyebrow">AGTA / MAVRA · Brand OS</p>
      <h1>{i===0?'Explora el sistema MAVRA.':'Explore the MAVRA system.'}</h1>
      <p className="editorial-lead">{i===0?'Estrategia, dirección creativa y ejecución para Amazon, conectadas en un mismo caso.':'Strategy, creative direction and Amazon execution, connected in one case.'}</p>
      <nav className="library-entry-links" aria-label={i===0?'Recorridos':'Explore'}>
        <a href="#library"><ArrowDown size={15} aria-hidden="true"/>{i===0?'Ver toda la biblioteca':'Browse the full library'}</a>
        <Link to="/"><ArrowLeft size={15} aria-hidden="true"/>{i===0?'Leer el caso primero':'Read the case first'}</Link>
      </nav>
    </header>
    <section className="editorial-section library-featured" aria-labelledby="featured-heading">
      <h2 id="featured-heading">{i===0?'Empieza por aquí':'Start here'}</h2>
      <div className="library-feature-grid">{FEATURED.map(item=><article className="library-feature" key={item.id}>
        <Link to={item.to} className="library-feature-main" aria-label={item.action[i]}>
          <div className={'library-preview'+(item.type==='pieces'?' library-photo':'')}><img src={item.image} alt={item.alt[i]} loading="lazy" width="800" height="500"/><ArrowUpRight size={18} aria-hidden="true"/></div>
          <div className="library-feature-copy"><span className="library-type">{TYPES[item.type][i]}</span><h3>{item.title[i]}</h3><p>{item.description[i]}</p><span className="library-action">{item.action[i]}<ArrowUpRight size={14} aria-hidden="true"/></span></div>
        </Link>
        <div className="library-connection"><p>{item.connection[i]}</p><nav aria-label={`${i===0?'Continuar desde':'Continue from'} ${item.title[i]}`}>{item.related.map(([es,en,to])=><Link to={to} key={to}>{i===0?es:en}<ArrowUpRight size={13} aria-hidden="true"/></Link>)}</nav></div>
      </article>)}</div>
    </section>
    <section className="editorial-section library-catalog" id="library" aria-labelledby="library-heading">
      <div className="library-catalog-heading"><h2 id="library-heading">{i===0?'Toda la biblioteca':'The full library'}</h2><p>{i===0?'Elige un recurso según lo que quieras examinar.':'Choose a resource based on what you want to examine.'}</p></div>
      <nav className="library-jump" aria-label={i===0?'Áreas de la biblioteca':'Library areas'}>{GROUPS.map(group=><a href={'#'+group.id} key={group.id}>{group.title[i]}<ArrowDown size={14} aria-hidden="true"/></a>)}</nav>
      {GROUPS.map(group=><section className="library-group" id={group.id} key={group.id} aria-labelledby={group.id+'-title'}>
        <div className="library-group-heading"><h3 id={group.id+'-title'}>{group.title[i]}</h3><p>{group.intro[i]}</p></div>
        <ul className="library-resource-list">{group.resources.map(([to,type,es,en,descEs,descEn])=><li key={to}><Link className="library-resource" to={to}>
          <span className="library-resource-copy"><strong>{i===0?es:en}</strong><span>{i===0?descEs:descEn}</span></span><span className="library-type">{TYPES[type][i]}</span><ArrowUpRight size={17} aria-hidden="true"/>
        </Link></li>)}</ul>
      </section>)}
    </section>
    <footer className="editorial-footer"><Link to="/">← {i===0?'Volver al caso':'Back to the case'}</Link><Link to="/#contact">{i===0?'Hablemos de tu marca':'Let’s talk about your brand'} →</Link></footer>
  </main>
}
