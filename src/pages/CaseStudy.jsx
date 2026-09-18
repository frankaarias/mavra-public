import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight, Mail, ChevronDown } from 'lucide-react'
import useMavraLanguage from '../components/useMavraLanguage.js'
import '../case-editorial.css'

const COPY = {
 en: {
  eyebrow:'Amazon Growth Transformation Architects · Case Study',
  title:'Building MAVRA for Amazon.',
  intro:'MAVRA makes gothic home decor: wall skulls, a candle set and a skull lamp. This case presents AGTA’s work on the brand, directed by Frank Arias and Santi Rojas, from positioning and product content to launch planning.',
  primary:'See three decisions in practice', secondary:'Explore the work archive',
  caption:'MAVRA collection · Existing Pinterest creative',
  challenge:'01 / The challenge', challengeTitle:'Make dark decor relevant beyond Halloween.',
  challengeText:'The brand strategy defines a place for gothic objects in everyday homes. The challenge was to carry that position into the product images, buying information and way the collection is presented.',
  evidence:'02 / Three decisions, with evidence', evidenceTitle:'What we chose. What we built.',
  labels:['Starting point','Decision','Deliverable'],
  decisions:[
   {title:'Show a home, not a seasonal display.',image:'/pinterest/col.jpg',alt:'MAVRA candles, lamp and wall skulls in three styled interiors',type:'Existing Pinterest creative',facts:['The brand platform positions MAVRA as permanent gothic decor.','Use lived-in rooms, dark materials and warm light to connect the three product lines.','The collection creative shows the same visual direction across candles, lighting and wall decor.'],links:[['See the visual direction','/briefing'],['Read the brand decisions','/brand-guidelines']]},
   {title:'Answer the buying question before adding atmosphere.',image:'/pinterest/s1.jpg',alt:'Close-up of a MAVRA wall skull showing sculpted depth',type:'Pinterest detail image · Paired with the listing brief',facts:['The Wall Skulls brief identifies installation, detail and size as questions to answer.','Give each image one job: show attachment, surface depth or scale in a room.','Six image briefs for Wall Skulls, within a 20-slot plan covering the three products. The close-up shown here is an existing Pinterest piece, not the final listing export.'],links:[['Read the product-specific briefs','/listings-briefs'],['Follow the A+ sequence','/aplus-briefs']]},
   {title:'Use market research to inform the launch plan.',image:'/shots/research-en-20260917.jpg',alt:'English research workspace with keyword demand, competition and product-fit columns',type:'Research workspace · English capture',screen:true,facts:['A keyword list alone does not show whether a search suits the product.','Review demand, competitor coverage and product fit together before planning paid search.','A working research workspace, campaign plan and launch checklist. Together, they make it possible to inspect how priorities are chosen and execution is organised.'],links:[['Open research','/research'],['Inspect the campaign plan','/campaigns'],['See the launch checklist','/launch']]}
  ],
  proof:'03 / Scope and status',proofTitle:'What you can inspect today.',
  scope:[['3','Product lines','Wall Skulls, Skull Candle Set and Skull Lamp.','/skulls'],['20','Image brief slots','A specific question, image direction and copy for each slot.','/listings-briefs'],['6','Candle A+ modules','Opening, video, details, rooms, collection and closing.','/aplus-briefs']],
  scopeLink:'Inspect the work',status:'The case brings together brand documentation, existing Pinterest creative and production and launch plans. Final Amazon image exports and measured commercial outcomes are not included here. Each example identifies the kind of evidence it shows.',
  role:'04 / Our role',roleTitle:'We connect brand decisions to the work needed to sell.',roleText:'We led MAVRA’s brand strategy, Amazon content planning, creative direction and launch planning. AGTA presents this case with direction by Frank Arias and Santi Rojas.',
  responsibilities:['Brand positioning and customer understanding','Product-page copy and image briefs','Creative direction and production rules','Research, campaign structure and launch planning'],
  contactKicker:'05 / Build your Amazon growth system',contactTitle:'What does your brand need next?',contactText:'Tell us what you sell and where you need help: positioning, product content or launch planning.',next:'Your message reaches AGTA. We will reply by email to understand your priorities and discuss the next step.',
  form:['Your name','Work email','Company / brand','What would you like to improve?','Send your project'], sending:'Sending…',sent:'Thanks, your message is in. We will reply to the email you gave us.',failed:'That did not go through. Try again, or write to info@agta.io.',footer:'AGTA · MAVRA case study'
 },
 es: {
  eyebrow:'Amazon Growth Transformation Architects · Caso de estudio',
  title:'Construir MAVRA para vender en Amazon.',
  intro:'MAVRA es una marca de decoración gótica para el hogar: cráneos de pared, un set de velas y una lámpara. Este caso presenta el trabajo de AGTA, con dirección de Frank Arias y Santi Rojas, desde el posicionamiento y el contenido de producto hasta el plan de lanzamiento.',
  primary:'Ver tres decisiones en práctica',secondary:'Explorar el archivo de trabajo',caption:'Colección MAVRA · Pieza existente de Pinterest',
  challenge:'01 / El reto',challengeTitle:'Dar a la decoración oscura un lugar más allá de Halloween.',
  challengeText:'La estrategia de marca sitúa los objetos góticos en hogares cotidianos. El reto era trasladar ese posicionamiento a las imágenes, la información de compra y la forma de presentar la colección.',
  evidence:'02 / Tres decisiones con evidencia',evidenceTitle:'Qué elegimos. Qué construimos.',labels:['Punto de partida','Decisión','Entregable'],
  decisions:[
   {title:'Mostrar un hogar, no un decorado de temporada.',image:'/pinterest/col.jpg',alt:'Velas, lámpara y cráneos de pared MAVRA en tres interiores decorados',type:'Pieza existente de Pinterest',facts:['La plataforma de marca define MAVRA como decoración gótica permanente.','Usar habitaciones habitadas, materiales oscuros y luz cálida para conectar las tres líneas de producto.','La pieza de colección muestra la misma dirección visual aplicada a velas, iluminación y decoración de pared.'],links:[['Ver la dirección visual','/briefing'],['Leer las decisiones de marca','/brand-guidelines']]},
   {title:'Resolver la duda de compra antes de añadir atmósfera.',image:'/pinterest/s1.jpg',alt:'Primer plano de un cráneo MAVRA que muestra su relieve esculpido',type:'Imagen de detalle de Pinterest · Junto al brief de listing',facts:['El brief de Wall Skulls identifica instalación, detalle y tamaño como preguntas que hay que resolver.','Asignar una tarea a cada imagen: mostrar la fijación, el relieve o la escala dentro de un espacio.','Seis briefs de imagen para Wall Skulls, dentro de un plan de 20 posiciones para los tres productos. El primer plano mostrado es una pieza existente de Pinterest, no el archivo final del listing.'],links:[['Leer los briefs por producto','/listings-briefs'],['Seguir la secuencia A+','/aplus-briefs']]},
   {title:'Usar la investigación para orientar el lanzamiento.',image:'/shots/research-en-20260917.jpg',alt:'Espacio de investigación en inglés con columnas de demanda, competencia y ajuste al producto',type:'Espacio de investigación · Captura en inglés',screen:true,facts:['Una lista de palabras clave no basta para saber si una búsqueda encaja con el producto.','Revisar juntas la demanda, la presencia de competidores y la relevancia para el producto antes de planificar publicidad.','Un espacio de investigación funcional, un plan de campañas y una lista de comprobación del lanzamiento. Juntos permiten examinar cómo se eligen las prioridades y se organiza la ejecución.'],links:[['Abrir la investigación','/research'],['Examinar el plan de campañas','/campaigns'],['Ver el control de lanzamiento','/launch']]}
  ],
  proof:'03 / Alcance y estado',proofTitle:'Lo que puedes examinar hoy.',
  scope:[['3','Líneas de producto','Wall Skulls, Skull Candle Set y Skull Lamp.','/skulls'],['20','Posiciones de imagen','Pregunta, dirección de imagen y texto específicos para cada posición.','/listings-briefs'],['6','Módulos A+ de velas','Apertura, vídeo, detalles, habitaciones, colección y cierre.','/aplus-briefs']],
  scopeLink:'Examinar el trabajo',status:'El caso reúne documentación de marca, piezas existentes de Pinterest y planes de producción y lanzamiento. No incluye los archivos finales de imágenes de Amazon ni resultados comerciales medidos. Cada ejemplo indica qué tipo de evidencia muestra.',
  role:'04 / Nuestro rol',roleTitle:'Conectamos las decisiones de marca con el trabajo necesario para vender.',roleText:'Lideramos la estrategia de marca de MAVRA, la planificación de contenido para Amazon, la dirección creativa y el plan de lanzamiento. AGTA presenta este caso con dirección de Frank Arias y Santi Rojas.',
  responsibilities:['Posicionamiento y comprensión del comprador','Textos de la ficha de producto y briefs de imagen','Dirección creativa y reglas de producción','Investigación, estructura de campañas y plan de lanzamiento'],
  contactKicker:'05 / Construyamos tu sistema de crecimiento en Amazon',contactTitle:'¿Qué necesita tu marca ahora?',contactText:'Cuéntanos qué vendes y dónde necesitas ayuda: posicionamiento, contenido de producto o plan de lanzamiento.',next:'Tu mensaje llega a AGTA. Te responderemos por correo para entender tus prioridades y conversar sobre el siguiente paso.',
  form:['Tu nombre','Email de trabajo','Empresa / marca','¿Qué te gustaría mejorar?','Enviar tu proyecto'],sending:'Enviando…',sent:'Gracias, tu mensaje ya llegó. Te respondemos al correo que dejaste.',failed:'No se pudo enviar. Vuelve a intentarlo o escribe a info@agta.io.',footer:'AGTA · Caso MAVRA'
 }
}

export default function CaseStudy(){
 const [lang]=useMavraLanguage(); const copy=COPY[lang]; const [envio,setEnvio]=useState('quieto')
  async function handleSubmit(event) {
    event.preventDefault()
    const datos = Object.fromEntries(new FormData(event.currentTarget))
    setEnvio('enviando')
    try {
      const r = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      if (!r.ok) throw new Error(String(r.status))
      event.target.reset()
      setEnvio('enviado')
    } catch {
      // Se dice que no salió. Dar por bueno un envío que falló es el bug que
      // este formulario tuvo desde el principio.
      setEnvio('error')
    }
  }

  return <main className="case-study editorial-case">
 <header className="editorial-header editorial-hero"><div><p className="case-eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p className="editorial-lead">{lang==='es'?'MAVRA es una marca de decoración gótica para el hogar. Un caso de AGTA que conecta posicionamiento, contenido de producto y planificación del lanzamiento en Amazon.':'MAVRA makes gothic home decor. An AGTA case connecting brand positioning, product content and Amazon launch planning.'}</p><div className="case-hero-actions"><a className="case-button primary" href="#evidence">{copy.primary} <ArrowDown size={16}/></a><Link className="case-button secondary" to="/brand">Brand OS <ArrowUpRight size={16}/></Link></div></div><figure className="hero-composition"><div className="hero-photo-grid">{[['/pinterest/b3.jpg',lang==='es'?'Lámpara MAVRA en un interior oscuro':'MAVRA lamp in a dark interior'],['/pinterest/b1.jpg',lang==='es'?'Set de velas MAVRA':'MAVRA candle set'],['/pinterest/s1.jpg',copy.decisions[1].alt]].map(([src,alt])=><a key={src} href={src} target="_blank" rel="noreferrer" aria-label={(lang==='es'?'Ampliar: ':'Enlarge: ')+alt}><img src={src} alt={alt}/></a>)}</div><figcaption>{copy.caption}</figcaption></figure></header>
 <section className="editorial-section case-challenge"><p className="case-section-label">{copy.challenge}</p><div><h2>{copy.challengeTitle}</h2><p>{copy.challengeText}</p></div></section>
 <section className="editorial-section" id="evidence"><span id="system"/><p className="case-section-label">{copy.evidence}</p><h2>{copy.evidenceTitle}</h2><div className="case-decision-grid">{copy.decisions.map((d,index)=><article className="case-decision-card" key={index}><Link className="decision-preview" to={d.links[0][1]} aria-label={d.links[0][0]}><img className={'decision-image'+(d.screen?' decision-screenshot':'')} src={d.image} alt={d.alt} loading="lazy"/><ArrowUpRight size={18} aria-hidden="true"/></Link><div className="decision-card-body"><h3 className="decision-category">{(lang==='es'?['Marca','Contenido Amazon','Lanzamiento']:['Brand','Amazon content','Launch'])[index]}</h3><p className="decision-description">{d.title}</p><details className="decision-details"><summary>{lang==='es'?'Ver la decisión completa':'Read the full decision'}<ChevronDown size={16} aria-hidden="true"/></summary><dl>{d.facts.map((f,i)=><div key={i}><dt>{copy.labels[i]}</dt><dd>{f}</dd></div>)}</dl><p className="editorial-note">{d.type}</p></details><div className="editorial-links">{d.links.map(([l,to])=><Link key={to} to={to}>{l} <ArrowUpRight size={14} aria-hidden="true"/></Link>)}</div></div></article>)}</div><aside className="case-next-step"><h3>{lang==='es'?'Construyamos el siguiente paso de tu marca.':'Let’s build your brand’s next step.'}</h3><a className="case-button primary" href="#contact">{lang==='es'?'Hablemos':'Let’s talk'}<ArrowUpRight size={16}/></a></aside></section>
 <section className="editorial-section" id="scope"><p className="case-section-label">{copy.proof}</p><h2>{copy.proofTitle}</h2><div className="editorial-facts">{copy.scope.map(([n,l,d,to])=><article key={l}><h3>{n} / {l}</h3><p>{d}</p><div className="editorial-links"><Link to={to}>{copy.scopeLink} →</Link></div></article>)}</div><p className="editorial-note">{copy.status}</p></section>
 <section className="editorial-section case-role"><p className="case-section-label">{copy.role}</p><h2>{copy.roleTitle}</h2><p>{copy.roleText}</p><ul>{copy.responsibilities.map(r=><li key={r}>{r}</li>)}</ul></section>
 <section className="case-contact" id="contact"><div className="case-contact-copy"><p className="case-section-label">{copy.contactKicker}</p><h2>{copy.contactTitle}</h2><p>{copy.contactText}</p><p className="editorial-note">{copy.next}</p></div>
        <form className="case-contact-form" onSubmit={handleSubmit}>
          <label><span>{copy.form[0]}</span><input name="name" required /></label>
          <label><span>{copy.form[1]}</span><input type="email" name="email" required /></label>
          <label><span>{copy.form[2]}</span><input name="company" /></label>
          <label><span>{copy.form[3]}</span><textarea name="message" rows="4" required /></label>
          <label className="case-form-trampa" aria-hidden="true">
            <span>No rellenar</span>
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <button type="submit" className="case-button primary" disabled={envio === 'enviando'}>
            <Mail size={15} /> {envio === 'enviando' ? copy.sending : copy.form[4]}
          </button>
          {envio === 'enviado' && <p className="case-form-notice" role="status">{copy.sent}</p>}
          {envio === 'error' && <p className="case-form-notice" role="alert">{copy.failed}</p>}
        </form>
 </section><footer className="case-footer"><span>{copy.footer}</span><Link to="/brand">{copy.secondary} →</Link></footer></main>
}
