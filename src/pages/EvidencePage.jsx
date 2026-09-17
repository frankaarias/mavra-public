import { useState } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const AREAS = {
  research: {
    en: ['Discover / Market evidence', 'Research turns category noise into a decision.', 'The public record shows how market language, customer needs and competitive context were used to define an opportunity before product, creative or acquisition work began.', [['Read the demand', 'Map the language customers use before deciding what the brand should claim.'], ['Find the gap', 'Separate permanent interior demand from seasonal or novelty-led category signals.'], ['Create a brief', 'Translate the reading into decisions the brand, product and retail work can share.']]],
    es: ['Descubrir / Evidencia de mercado', 'El research convierte el ruido de categoría en una decisión.', 'El registro público muestra cómo el lenguaje de mercado, las necesidades del cliente y el contexto competitivo se usaron para definir una oportunidad antes de trabajar producto, creatividad o adquisición.', [['Leer la demanda', 'Mapear el lenguaje que usan los clientes antes de decidir qué debe prometer la marca.'], ['Encontrar el vacío', 'Separar demanda permanente de interiores de señales estacionales o guiadas por novedad.'], ['Crear un brief', 'Traducir la lectura en decisiones que comparten marca, producto y retail.']]],
  },
  territory: {
    en: ['Define / Brand territory', 'A niche becomes a coherent world when it has boundaries.', 'MAVRA was positioned around permanent dark interiors rather than a seasonal gothic costume. The territory provides a consistent answer to what belongs, what does not and why.', [['Cultural reading', 'Reference distinct interior expressions without treating one aesthetic as a costume.'], ['Brand boundary', 'Keep the world warm, deliberate and domestic—not generic horror or Halloween.'], ['Customer meaning', 'Give the product a role in self-expression, atmosphere and everyday ritual.']]],
    es: ['Definir / Territorio de marca', 'Un nicho se vuelve un mundo coherente cuando tiene límites.', 'MAVRA se posicionó alrededor de interiores oscuros permanentes y no como un disfraz gótico estacional. El territorio responde consistentemente qué pertenece, qué no y por qué.', [['Lectura cultural', 'Referenciar expresiones interiores distintas sin tratar una estética como disfraz.'], ['Límite de marca', 'Mantener un mundo cálido, deliberado y doméstico; no horror genérico ni Halloween.'], ['Significado para el cliente', 'Dar al producto un rol en autoexpresión, atmósfera y ritual cotidiano.']]],
  },
  strategy: {
    en: ['Define / Brand strategy', 'Positioning is useful only when it directs execution.', 'The strategy work establishes the point of view, customer tension and verbal rules that let product, imagery and Amazon content feel authored by the same brand.', [['Point of view', 'Build from the customer’s desire to inhabit a personal interior world.'], ['Verbal system', 'Use language that is precise, atmospheric and grounded in a product truth.'], ['Decision filter', 'Test every visible choice against the same territory instead of adding style by instinct.']]],
    es: ['Definir / Estrategia de marca', 'El posicionamiento solo sirve cuando dirige la ejecución.', 'El trabajo estratégico establece el punto de vista, la tensión del cliente y reglas verbales para que producto, imagen y contenido de Amazon parezcan creados por la misma marca.', [['Punto de vista', 'Partir del deseo del cliente de habitar un mundo interior personal.'], ['Sistema verbal', 'Usar lenguaje preciso, atmosférico y anclado en una verdad de producto.'], ['Filtro de decisión', 'Probar cada elección visible contra el mismo territorio, no añadir estilo por instinto.']]],
  },
  typography: {
    en: ['Design / Typography', 'Typography carries tone before a customer reads the copy.', 'The type system defines hierarchy, restraint and contrast across retail content. It makes the brand legible while preserving its dark, editorial character.', [['Hierarchy', 'Let product information remain easy to scan at Amazon speed.'], ['Character', 'Use an editorial voice without sacrificing utility or accessibility.'], ['Consistency', 'Reuse a small set of rules so every surface feels related.']]],
    es: ['Diseñar / Tipografía', 'La tipografía transmite tono antes de que el cliente lea el copy.', 'El sistema tipográfico define jerarquía, contención y contraste en contenido retail. Hace legible la marca preservando su carácter oscuro y editorial.', [['Jerarquía', 'Mantener la información de producto fácil de escanear a velocidad Amazon.'], ['Carácter', 'Usar una voz editorial sin sacrificar utilidad o accesibilidad.'], ['Consistencia', 'Reutilizar pocas reglas para que cada superficie se sienta relacionada.']]],
  },
  creative: {
    en: ['Design / Creative direction', 'Creative direction gives the brand a repeatable visual point of view.', 'The work connects brand position, product truth and retail questions into one visual system instead of treating every image as a separate request.', [['Brand world', 'Dark surfaces, controlled light and objects that feel collected rather than mass-produced.'], ['Product proof', 'Use composition to make material, scale, context and function easier to understand.'], ['Retail sequence', 'Plan visual content around the order in which a customer needs answers.']]],
    es: ['Diseñar / Dirección creativa', 'La dirección creativa da a la marca un punto de vista visual repetible.', 'El trabajo conecta posición de marca, verdad de producto y preguntas retail en un sistema visual, en vez de tratar cada imagen como una solicitud aislada.', [['Mundo de marca', 'Superficies oscuras, luz controlada y objetos que se sienten coleccionados, no decorados masivamente.'], ['Prueba de producto', 'Usar composición para entender mejor material, escala, contexto y función.'], ['Secuencia retail', 'Planear contenido visual según el orden en que el cliente necesita respuestas.']]],
  },
  scenography: {
    en: ['Design / Scenography', 'Scenes are a product argument, not decoration.', 'Scenography turns the brand world into domestic environments that make a product’s scale, use and emotional outcome understandable in one view.', [['Context', 'Place the object in believable interiors rather than empty visual theatre.'], ['Light', 'Use controlled contrast to preserve both atmosphere and product legibility.'], ['Continuity', 'Repeat environmental rules so images work as a system across the PDP and A+.']]],
    es: ['Diseñar / Escenografía', 'Las escenas son un argumento de producto, no decoración.', 'La escenografía convierte el mundo de marca en interiores domésticos que hacen entendible la escala, uso y resultado emocional de un producto en una vista.', [['Contexto', 'Ubicar el objeto en interiores creíbles y no en teatro visual vacío.'], ['Luz', 'Usar contraste controlado para preservar atmósfera y legibilidad de producto.'], ['Continuidad', 'Repetir reglas ambientales para que las imágenes funcionen como sistema en PDP y A+.']]],
  },
  film: {
    en: ['Design / Film direction', 'Motion should extend the world, not decorate the feed.', 'Film direction defines a cinematic grammar for product motion: intimate framing, controlled pacing and material-led details that retain the same visual authorship as the static work.', [['Camera logic', 'Choose movement that reveals a product or an atmosphere with purpose.'], ['Light and texture', 'Use motion to make surface, shadow and ritual tangible.'], ['Production rule', 'Keep the film language consistent whether production is practical or AI-assisted.']]],
    es: ['Diseñar / Dirección de film', 'El movimiento debe extender el mundo, no decorar el feed.', 'La dirección de film define una gramática cinematográfica: encuadre íntimo, ritmo controlado y detalles guiados por material que conservan la autoría visual del trabajo estático.', [['Lógica de cámara', 'Elegir movimiento que revele producto o atmósfera con propósito.'], ['Luz y textura', 'Usar movimiento para hacer tangibles superficie, sombra y ritual.'], ['Regla de producción', 'Mantener el lenguaje de film consistente, sea la producción práctica o asistida por IA.']]],
  },
  avatars: {
    en: ['Design / Visual avatars', 'People are selected for narrative fit, not decoration.', 'The avatar system establishes the kinds of human presence that can make the product world credible, while protecting the product as the central subject.', [['Role', 'Use people to give scale, use context and emotional identification.'], ['Casting logic', 'Match the visual presence to a specific interior and cultural expression.'], ['Restraint', 'Keep human presence purposeful rather than letting it replace the product story.']]],
    es: ['Diseñar / Avatares visuales', 'Las personas se seleccionan por ajuste narrativo, no decoración.', 'El sistema de avatares define presencias humanas que hacen creíble el mundo del producto sin perder al producto como sujeto central.', [['Rol', 'Usar personas para dar escala, contexto de uso e identificación emocional.'], ['Lógica de casting', 'Ajustar presencia visual a una expresión interior y cultural concreta.'], ['Contención', 'Mantener la presencia humana con propósito y no reemplazar la historia del producto.']]],
  },
  products: {
    en: ['Merchandise / Product portfolio', 'The product portfolio starts with a role in the customer’s space.', 'Each line is framed through product truth, use context and its contribution to the wider MAVRA world—not as isolated inventory.', [['Wall objects', 'Sculptural pieces designed to change a surface and establish a room’s point of view.'], ['Candle set', 'A four-piece ritual set framed around material, atmosphere and gifting.'], ['Skull lamp', 'Functional lighting positioned as both utility and an atmospheric object.']]],
    es: ['Comercializar / Portafolio de producto', 'El portafolio empieza con un rol en el espacio del cliente.', 'Cada línea se presenta desde verdad de producto, contexto de uso y contribución al mundo MAVRA; no como inventario aislado.', [['Objetos de pared', 'Piezas esculturales diseñadas para transformar una superficie y definir el punto de vista de un espacio.'], ['Set de velas', 'Un set ritual de cuatro piezas construido desde material, atmósfera y regalo.'], ['Lámpara skull', 'Iluminación funcional posicionada como utilidad y objeto atmosférico.']]],
  },
  retail: {
    en: ['Merchandise / Amazon retail experience', 'A listing is a sequence of answered questions.', 'The listing architecture treats the PDP as a customer journey. Each image, line of copy and proof point earns its place by reducing a specific decision friction.', [['Establish the product', 'Make the product, material and core value proposition immediately clear.'], ['Make it believable', 'Show scale, context, details and use conditions before asking for a decision.'], ['Build the world', 'Use the final retail layers to connect the item with the wider brand and portfolio.']]],
    es: ['Comercializar / Experiencia retail Amazon', 'Un listing es una secuencia de preguntas respondidas.', 'La arquitectura de listing trata el PDP como un journey de compra. Cada imagen, línea de copy y prueba reduce una fricción de decisión específica.', [['Establecer el producto', 'Hacer inmediatamente claros producto, material y propuesta central de valor.'], ['Hacerlo creíble', 'Mostrar escala, contexto, detalles y condiciones de uso antes de pedir la decisión.'], ['Construir el mundo', 'Usar las capas finales para conectar el artículo con la marca y el portafolio.']]],
  },
  aplus: {
    en: ['Merchandise / A+ content', 'A+ is the visual layer of product decision-making.', 'For MAVRA, A+ content is not a gallery added after the listing. It extends the customer journey with the context, proof and portfolio connections a buyer needs next.', [['Orient', 'Reintroduce the product through the customer outcome it creates.'], ['Explain', 'Answer material, scale, care and use questions through visual proof.'], ['Connect', 'Create a clear route to the rest of the collection without interrupting the product story.']]],
    es: ['Comercializar / Contenido A+', 'El A+ es la capa visual de la toma de decisión de producto.', 'Para MAVRA, el A+ no es una galería añadida después del listing. Extiende el journey con el contexto, prueba y conexiones de portafolio que el comprador necesita.', [['Orientar', 'Reintroducir el producto mediante el resultado que crea para el cliente.'], ['Explicar', 'Responder material, escala, cuidado y uso con prueba visual.'], ['Conectar', 'Crear una ruta clara al resto de la colección sin interrumpir la historia del producto.']]],
  },
  demand: {
    en: ['Grow / Demand system', 'Search, retail and acquisition should learn from the same customer language.', 'The demand system connects market terms, retail copy and launch learning into a single loop. It documents the decision logic without exposing proprietary account settings.', [['Discover', 'Use category language to identify the demand worth addressing.'], ['Encode', 'Carry that language into SEO, copy and the image architecture.'], ['Learn', 'Use launch and acquisition signals to improve the customer-facing system.']]],
    es: ['Crecer / Sistema de demanda', 'Búsqueda, retail y adquisición deben aprender del mismo lenguaje de cliente.', 'El sistema de demanda conecta términos de mercado, copy retail y aprendizaje de lanzamiento en un solo loop. Documenta la lógica sin exponer ajustes propietarios de cuenta.', [['Descubrir', 'Usar lenguaje de categoría para identificar la demanda que vale abordar.'], ['Codificar', 'Llevar ese lenguaje a SEO, copy y arquitectura de imagen.'], ['Aprender', 'Usar señales de lanzamiento y adquisición para mejorar el sistema de cara al cliente.']]],
  },
  launch: {
    en: ['Grow / Launch framework', 'A launch is a learning sequence, not a calendar event.', 'The framework connects readiness, customer-facing execution and measured learning. Publicly, it shows the operating principles—not account data, thresholds or unfinished tasks.', [['Prepare', 'Confirm that product, retail content and measurement can support a real launch.'], ['Observe', 'Read early signals before expanding activity or drawing conclusions.'], ['Graduate', 'Move only the validated decisions into the next operating rhythm.']]],
    es: ['Crecer / Marco de launch', 'Un lanzamiento es una secuencia de aprendizaje, no un evento de calendario.', 'El marco conecta preparación, ejecución de cara al cliente y aprendizaje medido. Públicamente muestra principios operativos, no datos de cuenta, umbrales ni tareas pendientes.', [['Preparar', 'Confirmar que producto, contenido retail y medición sostienen un lanzamiento real.'], ['Observar', 'Leer señales tempranas antes de escalar actividad o sacar conclusiones.'], ['Graduar', 'Mover solo decisiones validadas al siguiente ritmo operativo.']]],
  },
  distribution: {
    en: ['Grow / Distribution', 'Distribution extends the brand world to the places customers discover ideas.', 'Pinterest and other discovery surfaces are considered as an extension of product storytelling. The public case focuses on the role of distribution, not channel tactics or unreleased campaign plans.', [['Inspire', 'Lead with the room, ritual or outcome that makes the product desirable.'], ['Bridge', 'Connect discovery content back to a specific retail decision.'], ['Learn', 'Use response patterns to improve future creative and assortment decisions.']]],
    es: ['Crecer / Distribución', 'La distribución extiende el mundo de marca a donde el cliente descubre ideas.', 'Pinterest y otras superficies de descubrimiento se consideran extensión del storytelling de producto. El caso público muestra el rol de distribución, no tácticas ni planes inéditos.', [['Inspirar', 'Partir del espacio, ritual o resultado que hace deseable el producto.'], ['Conectar', 'Unir contenido de descubrimiento con una decisión retail específica.'], ['Aprender', 'Usar patrones de respuesta para mejorar creatividad y surtido futuro.']]],
  },
  creators: {
    en: ['Grow / Creator operations', 'Creator strategy is a system of fit.', 'The program was designed around relevance and repeatability: finding people whose spaces and audiences can make the product world credible, then learning from each activation.', [['Discover', 'Map potential partners around aesthetic and audience relevance.'], ['Qualify', 'Verify fit before activation rather than treating reach as the main filter.'], ['Learn', 'Use each collaboration to improve future selection and creative direction.']]],
    es: ['Crecer / Operación de creators', 'La estrategia de creators es un sistema de ajuste.', 'El programa se diseñó alrededor de relevancia y repetibilidad: encontrar personas cuyos espacios y audiencias hagan creíble el mundo del producto y aprender de cada activación.', [['Descubrir', 'Mapear posibles partners por relevancia estética y de audiencia.'], ['Calificar', 'Verificar ajuste antes de activar, en vez de tratar el alcance como filtro principal.'], ['Aprender', 'Usar cada colaboración para mejorar selección y dirección creativa futura.']]],
  },
}

function initialLanguage() {
  try { return localStorage.getItem('mavra-case-language') || 'en' } catch { return 'en' }
}

export default function EvidencePage({ area }) {
  const [lang, setLang] = useState(initialLanguage)
  const entry = AREAS[area] || AREAS.strategy
  const [eyebrow, title, lead, cards] = entry[lang]
  const toggleLanguage = () => {
    const next = lang === 'en' ? 'es' : 'en'
    setLang(next)
    try { localStorage.setItem('mavra-case-language', next) } catch {}
  }

  return (
    <main className="evidence-page">
      <header className="evidence-page-hero">
        <div className="evidence-page-topline"><Link to="/brand"><ArrowLeft size={15} /> {lang === 'en' ? 'Evidence index' : 'Índice de evidencias'}</Link><button onClick={toggleLanguage}>{lang === 'en' ? 'ES' : 'EN'}</button></div>
        <p className="case-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </header>
      <section className="evidence-page-cards">
        {cards.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{body}</p></article>)}
      </section>
      <footer className="evidence-page-footer"><span>{lang === 'en' ? 'Public case-study evidence · Operational files remain private.' : 'Evidencia pública del caso · Los archivos operativos permanecen privados.'}</span><Link to="/">{lang === 'en' ? 'Back to case study' : 'Volver al caso de estudio'} <ArrowUpRight size={14} /></Link></footer>
    </main>
  )
}
