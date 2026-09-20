import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, ArrowLeft, Search, X, ChartNoAxesColumnIncreasing, BookOpen, Paintbrush, Image as ImageIcon, Megaphone, Clapperboard, Users, Type } from 'lucide-react'
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
const FEATURED = [
  { id:'brand-book', title:['Brand Book','Brand Book'], type:'guide', image:'/shots/brand-board-en-20260920.jpg', alt:['Tagline y lenguaje sensorial del Brand Book de MAVRA, captura en inglés','MAVRA Brand Book tagline and sensory language, English capture'], to:'/brand-guidelines/source', action:['Consultar el Brand Book completo','Read the complete Brand Book'], description:['Consumidor, posicionamiento y reglas de identidad.','Customer, positioning and identity rules.'], connection:['Estas decisiones orientan las imágenes de producto.','These decisions guide the product imagery.'], related:[['Entender la estrategia','Understand the strategy','/brand-guidelines']] },
  { id:'creative', title:['Dirección creativa','Creative direction'], type:'pieces', image:'/pinterest/b3.jpg', alt:['Lámpara MAVRA en una pieza existente del archivo Pinterest','MAVRA lamp in an existing Pinterest creative'], to:'/briefing#briefing-top', action:['Ver las piezas y sus reglas','See the pieces and their rules'], description:['Ejemplos reales de luz, detalle y ambientes de marca.','Real examples of lighting, detail and branded settings.'], connection:['Las reglas visuales se aplican en los briefs de producción.','The visual rules carry into the production briefs.'], related:[['Briefs de imagen','Image briefs','/listings-briefs'],['A+','A+','/aplus-briefs']] },
  { id:'amazon-content', title:['Contenido Amazon','Amazon content'], type:'brief', image:'/shots/product-brief-en-20260920.jpg', alt:['Brief de imágenes Wall Skulls, captura en inglés','Wall Skulls image brief, English capture'], to:'/listings-briefs', action:['Explorar los 20 briefs','Explore the 20 image briefs'], description:['La pregunta de compra, la imagen y el mensaje de cada posición.','The buyer question, image direction and message for each slot.'], connection:['La ficha presenta el producto; A+ lo conecta con la colección.','The product page introduces the item; A+ connects the collection.'], related:[['Secuencia A+','A+ sequence','/aplus-briefs'],['Copy de producto','Product copy','/copy']] },
  { id:'research', title:['Investigación','Research'], type:'tool', image:'/shots/research-en-20260917.jpg', alt:['Workspace de investigación, captura en inglés','Research workspace, English capture'], to:'/research', action:['Abrir el workspace','Open the workspace'], description:['Demanda, competencia y relevancia para los tres productos.','Demand, competition and relevance across the three products.'], connection:['El análisis orienta las prioridades de publicidad y lanzamiento.','The analysis informs advertising and launch priorities.'], related:[['Plan de campañas','Campaign plan','/campaigns'],['Lanzamiento','Launch','/launch']] },
]
const TYPES = { guide:['Guía','Guide'], brief:['Brief','Brief'], tool:['Herramienta','Tool'], pieces:['Piezas visuales','Visual pieces'] }

const AREAS = [
  { id:'research', title:['Investigación','Research'], purpose:['Entender la oportunidad','Understand the opportunity'], intro:['Demanda, competencia y relevancia para los tres productos.','Demand, competition and relevance across the three products.'], icon:ChartNoAxesColumnIncreasing, indices:[12,13] },
  { id:'brand-book', title:['Brand Book','Brand Book'], purpose:['Definir la marca','Define the brand'], intro:['El consumidor, el posicionamiento y las reglas que definen MAVRA.','The customer, positioning and rules that define MAVRA.'], icon:BookOpen, indices:[0,1,2,3] },
  { id:'creative', title:['Dirección creativa','Creative direction'], purpose:['Dar forma a la identidad','Shape the identity'], intro:['Las reglas y referencias para producir imágenes coherentes.','The rules and references for producing consistent imagery.'], icon:Paintbrush, indices:[4,5,6,7] },
  { id:'amazon-content', title:['Contenido Amazon','Amazon content'], purpose:['Resolver la compra','Help shoppers decide'], intro:['Lo que el comprador necesita ver y entender para elegir.','What shoppers need to see and understand before choosing.'], icon:ImageIcon, indices:[8,9,10,11] },
  { id:'activation', title:['Activación','Activation'], purpose:['Preparar lanzamiento y difusión','Plan launch and reach'], intro:['De la planificación de campañas a las colaboraciones con creadores.','From campaign planning to creator collaborations.'], icon:Megaphone, indices:[14,15,16,17,18] },
]
const JOURNEY = AREAS.slice(0,4).map(area => ({ ...area, ...FEATURED.find(item=>item.id===area.id) }))
const PREVIEWS = {
  0:'/shots/brand-guidelines-en-20260917.jpg', 1:'/shots/brand-board-en-20260920.jpg',
  2:'/shots/corrientes-en-20260917.jpg', 4:'/pinterest/b3.jpg',
  5:'/shots/scenography-en-20260917.jpg', 9:'/shots/product-brief-en-20260920.jpg',
  10:'/shots/aplus-briefs-en-20260917.jpg', 12:'/shots/research-en-20260917.jpg',
  14:'/shots/campanas-en-20260917.jpg', 15:'/shots/launch-en-20260917.jpg',
  16:'/pinterest/b3.jpg', 17:'/shots/influencers-en-20260917.jpg', 18:'/shots/creators-en-20260917.jpg',
}
const RESOURCE_ICONS = {3:Type, 6:Clapperboard, 7:Users, 8:ImageIcon, 11:BookOpen, 13:ChartNoAxesColumnIncreasing}
const OPEN = { guide:['Abrir guía','Open guide'], brief:['Abrir brief','Open brief'], tool:['Abrir herramienta','Open tool'], pieces:['Ver piezas','View creative'] }
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()

function AreaTabs({ items, active, onChange, i, journey=false }) {
  const refs = useRef([])
  const prefix = journey ? 'journey' : 'catalog'
  const label = journey ? ['Etapas del recorrido','Journey stages'][i] : ['Explora por área','Explore by area'][i]
  const select = (index, focus=false) => {
    onChange(items[index].id)
    if (focus) refs.current[index]?.focus()
  }
  const onKeyDown = (event,index) => {
    const keys = {ArrowDown:(index+1)%items.length, ArrowUp:(index-1+items.length)%items.length, Home:0, End:items.length-1}
    if (keys[event.key] !== undefined) { event.preventDefault(); select(keys[event.key],true) }
  }
  return <>
    <label className="library-mobile-select">{label}<select value={active} onChange={event=>onChange(event.target.value)}>{items.map(item=><option key={item.id} value={item.id}>{item.title[i]}{journey?'':` · ${item.indices.length}`}</option>)}</select></label>
    <div className={'library-rail'+(journey?' journey-rail':'')}>
      {!journey && <p className="library-rail-label">{label}</p>}
      <div role="tablist" aria-label={label} aria-orientation="vertical">
        {items.map((item,index)=>{const Icon=item.icon; return <button key={item.id} type="button" role="tab" id={`${prefix}-tab-${item.id}`} aria-selected={active===item.id} aria-controls={`${prefix}-panel`} tabIndex={active===item.id?0:-1} ref={node=>{refs.current[index]=node}} onKeyDown={event=>onKeyDown(event,index)} onClick={()=>select(index)} className="library-area">
          {journey ? <img src={item.image} alt="" width="84" height="84" className={item.type==='pieces'?'is-photo':''}/> : <Icon size={26} strokeWidth={1.5} aria-hidden="true"/>}
          <span className="library-area-copy"><span className="library-area-title">{item.title[i]}</span><span>{item.purpose[i]}</span>{!journey && <span className="library-area-count">{item.indices.length} {i===0?'recursos':'resources'}</span>}</span>
        </button>})}
      </div>
    </div>
  </>
}

function Resource({index,i}) {
  const [to,type,es,en,descEs,descEn] = RESOURCES[index]
  const Icon = RESOURCE_ICONS[index] || BookOpen
  return <li><Link className="library-resource" to={to}>
    <span className="library-resource-image">{PREVIEWS[index] ? <img src={PREVIEWS[index]} alt="" loading="lazy" width="96" height="96"/> : <Icon size={34} strokeWidth={1.3} aria-hidden="true"/>}</span>
    <span className="library-resource-copy"><strong>{i===0?es:en}</strong><span>{i===0?descEs:descEn}</span></span>
    <span className="library-resource-action">{OPEN[type][i]}<ArrowUpRight size={17} aria-hidden="true"/></span>
  </Link></li>
}

export default function Home() {
  const [lang] = useMavraLanguage()
  const i = lang === 'es' ? 0 : 1
  const { hash } = useLocation()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [query,setQuery] = useState('')
  const searchRef = useRef(null)
  const clearSearch = () => { setQuery(''); searchRef.current?.focus() }
  // Keep existing library anchors useful and preserve selection with Back/Forward.
  const legacyArea = {'#brand-visual':'brand-book','#product-content':'amazon-content','#research-launch':'research'}[hash]
  const catalog = hash.startsWith('#library') || !!legacyArea
  const stage = JOURNEY.find(item=>item.id===params.get('stage')) || JOURNEY[0]
  const area = AREAS.find(item=>item.id===(params.get('area') || legacyArea)) || AREAS[2]
  const nextStage = JOURNEY[JOURNEY.indexOf(stage)+1]
  const nextArea = AREAS[AREAS.indexOf(area)+1]
  const search = normalize(query.trim())
  const results = RESOURCES.map((resource,index)=>({resource,index})).filter(({resource,index})=>{
    const group=AREAS.find(item=>item.indices.includes(index))
    return normalize([...resource,...group.title,...TYPES[resource[1]]].join(' ')).includes(search)
  }).map(item=>item.index)
  const choose = (key,value) => {
    const next = new URLSearchParams(params)
    next.set(key,value)
    navigate({pathname:'/brand',search:`?${next}`,hash},{preventScrollReset:true})
    if (key==='area') setQuery('')
  }
  const journeyUrl = `/brand${params.get('stage')?`?stage=${encodeURIComponent(stage.id)}`:''}`
  const libraryUrl = `/brand?stage=${stage.id}&area=${stage.id}#library`
  return <main className="case-study editorial-case brand-library">
    <header className="editorial-header library-header" id={catalog?'library':'journey'}>
      <Link className="library-back" to={catalog?journeyUrl:'/'}><ArrowLeft size={16} aria-hidden="true"/>{catalog ? (i===0?'Volver al recorrido':'Back to the journey') : (i===0?'Volver al caso':'Back to the case')}</Link>
      <div className="library-heading-row"><div><h1>{catalog ? (i===0?'Toda la biblioteca':'The full library') : (i===0?'Del mercado a Amazon.':'From market to Amazon.')}</h1>
        <p className="editorial-lead">{catalog ? (i===0?'19 recursos para entender las decisiones y explorar el trabajo.':'19 resources to understand the decisions and explore the work.') : (i===0?'Explora cómo una decisión lleva a la siguiente.':'Explore how one decision leads to the next.')}</p>
      </div>{catalog && <div className="library-search"><Search size={19} aria-hidden="true"/><input ref={searchRef} type="search" aria-label={i===0?'Buscar en toda la biblioteca':'Search the full library'} placeholder={i===0?'Buscar un recurso…':'Find a resource…'} value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>{if(event.key==='Escape')setQuery('')}}/>{query && <button type="button" onClick={clearSearch} aria-label={i===0?'Borrar búsqueda':'Clear search'}><X size={17} aria-hidden="true"/></button>}</div>}</div>
    </header>
    <section className="editorial-section library-workspace" aria-label={catalog?(i===0?'Recursos de la biblioteca':'Library resources'):(i===0?'Recorrido por el sistema MAVRA':'Journey through the MAVRA system')}>
      <AreaTabs items={catalog?AREAS:JOURNEY} active={catalog?area.id:stage.id} onChange={id=>choose(catalog?'area':'stage',id)} i={i} journey={!catalog}/>
      {catalog ? <div className="library-detail catalog-detail" role={search?'region':'tabpanel'} id="catalog-panel" aria-labelledby={search?'library-results-heading':`catalog-tab-${area.id}`} tabIndex={0}>
        <div className="library-detail-heading"><h2 id="library-results-heading">{search?(i===0?'Resultados de búsqueda':'Search results'):area.title[i]}</h2><p>{search?(i===0?'Coincidencias en todas las áreas de la biblioteca.':'Matches across every area of the library.'):area.intro[i]}</p></div>
        <p className="library-sr-only" role="status" aria-live="polite">{search?`${results.length} ${i===0?'resultados':'results'}`:`${area.indices.length} ${i===0?'recursos':'resources'}`}</p>
        {search && <p className="library-result-count">{results.length} {i===0?'resultados':'results'}</p>}
        {search && !results.length ? <div className="library-empty"><h3>{i===0?'No encontramos ese recurso.':'No matching resources.'}</h3><p>{i===0?'Prueba con «marca», «vídeo» o «Amazon», o vuelve a explorar por área.':'Try “brand”, “video” or “Amazon”, or browse by area.'}</p><button type="button" className="library-text-button" onClick={clearSearch}>{i===0?'Borrar búsqueda':'Clear search'}<ArrowRight size={16} aria-hidden="true"/></button></div> : <ul className="library-resource-list">{(search?results:area.indices).map(index=><Resource key={RESOURCES[index][0]} index={index} i={i}/>)}</ul>}
        {!search && nextArea && <button className="library-next-area library-text-button" type="button" onClick={()=>choose('area',nextArea.id)}>{i===0?'Continuar con':'Continue with'} {nextArea.title[i]}<ArrowRight size={17} aria-hidden="true"/></button>}
      </div> : <div className="library-detail journey-detail" role="tabpanel" id="journey-panel" aria-labelledby={`journey-tab-${stage.id}`} tabIndex={0}>
        <div className="library-detail-heading"><h2>{stage.title[i]}</h2><p>{stage.description[i]}</p></div>
        <Link to={stage.to} className={`journey-preview${stage.type==='pieces'?' is-photo':''}`} aria-label={stage.action[i]}><img src={stage.image} alt={stage.alt[i]} width="800" height="400"/><span><ArrowUpRight size={18} aria-hidden="true"/></span></Link>
        <p className="journey-explanation">{stage.connection[i]}</p>
        <div className="journey-actions"><Link className="case-button primary" to={stage.to}>{stage.action[i]}<ArrowUpRight size={16} aria-hidden="true"/></Link>{nextStage ? <button type="button" className="library-text-button" onClick={()=>choose('stage',nextStage.id)}>{i===0?'Continuar con':'Continue with'} {nextStage.title[i]}<ArrowRight size={17} aria-hidden="true"/></button> : <Link className="library-text-button" to="/brand?area=activation#library">{i===0?'Continuar con Activación':'Continue with Activation'}<ArrowRight size={17} aria-hidden="true"/></Link>}</div>
        <nav className="journey-connections" aria-label={i===0?'Recursos relacionados':'Related resources'}><span>{i===0?'Conecta con':'Connects to'}</span>{stage.related.map(([es,en,to])=><Link key={to} to={to}>{i===0?es:en}<ArrowUpRight size={14} aria-hidden="true"/></Link>)}</nav>
      </div>}
    </section>
    {!catalog && <div className="editorial-section library-open-all"><Link to={libraryUrl}>{i===0?'Ver la biblioteca completa':'Browse the full library'}<ArrowRight size={18} aria-hidden="true"/></Link></div>}
    <footer className="editorial-footer library-footer"><span>AGTA · {i===0?'Caso MAVRA':'MAVRA Case Study'}</span><Link to="/">{i===0?'Volver al caso':'Back to the case'}<ArrowRight size={16} aria-hidden="true"/></Link></footer>
  </main>
}
