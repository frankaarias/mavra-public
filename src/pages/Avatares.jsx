import { useTranslation } from '../i18n/TranslationProvider.jsx'
import { useEffect } from 'react'
import brand from '../brand/brand.json'

const { identity, nav } = brand

export default function Avatares() {
  const { text: trText } = useTranslation()

  useEffect(() => { document.title = `Avatares — ${identity.name}` }, [])

  return (
    <>
      <div className="page-header">
        <h1>{trText("Avatares")}</h1>
        <p className="page-subtitle">{trText("Los tres tipos de rostro de ")}{trText(identity.name)}{trText(" y para qué sirve cada uno.")}</p>
        <div style={metaStyle}>{trText("v1.2 · 2026-08-05")}</div>
      </div>

      <div style={layoutStyle}>
        <aside style={sidebarStyle}>
          <p style={sidebarLabelStyle}>{trText("Contenido")}</p>
          {nav.avatares.map(n => (
            <a key={n.id} href={`#${n.id}`} style={n.driver ? driverLinkStyle : linkStyle}>{trText(n.label)}</a>
          ))}
        </aside>

        <div style={contentStyle}>

          {/* ─── La distinción ─── */}
          <section id="distincion">
            <H2>{trText("La distinción")}</H2>
            <p>{trText(identity.name)}{trText(" tiene ")}<strong>{trText("tres tipos de avatar")}</strong>{trText(", y no son intercambiables. Cada uno nació para un canal distinto, se genera en una herramienta distinta y responde a una regla distinta. Mezclarlos rompe la lectura de marca.")}</p>

            <Tipo
              id="amazon"
              n="01"
              titulo="Avatar de marca — Amazon"
              quien="Mujer de pelo corto oscuro, ropa negra, gesto sereno."
              donde="Módulos A+ · cortes de listado · imágenes de galería"
              herramienta="Magnific (Nano Banana 2) con @women1 · animación en Kling 3.0"
              regla="Es la cara institucional del producto. Vive dentro del ecosistema Amazon y no sale de ahí. Nunca habla a cámara, nunca vende: habita el espacio con el producto."
            />

            <Tipo
              id="social"
              n="02"
              titulo="Personaje enmascarado — Social media"
              quien="Figura de negro con una pieza real del SWD usada como careta, sujeta con cinta, bajo capucha."
              donde="Instagram · TikTok orgánico · identidad visual de la marca"
              herramienta="Magnific con @ref de la pieza C3 (20,7 cm) conectada"
              regla="Es la marca personificada, no una persona. Sin boca visible: la voz va como audio y no necesita lipsync. La capucha es obligatoria — sin ella la pieza se lee como antifaz. Plano medio, nunca cuerpo entero."
            />

            <Tipo
              id="crs"
              n="03"
              titulo="CRS — UGC de pauta"
              quien="Personas reales y distintas, con nombre, edad y guardarropa propio. Victorian y Whimsigoth, M y F."
              donde="Anuncios pagos · UGC · creatividades de performance"
              herramienta="Higgsfield con fichas canónicas de producto · character reference sheets"
              regla="Son clientes, no la marca. Cada uno tiene sus cinco escenarios — Casa, Trabajo, Calle, Fiesta, Evento Social. Hablan, usan y muestran el producto como lo haría un comprador."
            />
          </section>

          <hr className="copper-line" />

          {/* ─── Por qué importa ─── */}
          <section id="porque">
            <H2>{trText("Por qué la separación importa")}</H2>

            <Rule title={trText("Cada canal pide otra cosa")}>{trText("Amazon premia la calma y la consistencia: el mismo rostro, el mismo mundo, siempre. Social media premia el símbolo: algo reconocible en un scroll de un segundo. La pauta premia la credibilidad: alguien que parece una persona real usando el producto. Un solo avatar no puede hacer las tres.")}</Rule>

            <Rule title={trText("El avatar de Amazon no hace UGC")}>{trText("Si la cara institucional aparece \"recomendando\" el producto en un anuncio, el contenido deja de leerse como testimonio y pasa a leerse como publicidad de marca. Para eso están los CRS.")}</Rule>

            <Rule title={trText("El enmascarado no vende, representa")}>{trText("No sostiene el producto para mostrarlo ni explica beneficios. Es la marca mirándote. En cuanto habla o argumenta, se vuelve un disfraz.")}</Rule>
          </section>

          <hr className="copper-line" />

          {/* ─── Reglas de producción ─── */}
          <section id="produccion">
            <H2>{trText("Reglas de producción")}</H2>

            <Rule title={trText("Producto: fichas canónicas")}>{trText("Los tres productos tienen ficha canónica en Higgsfield Marketing Studio, con vista frontal, medidas reales y la regla de cómo se sostienen: ")}<strong>{trText("SWD y CND, una pieza por mano y nunca todas a la vez")}</strong>{"; "}<strong>{trText("LMP, apoyada en una superficie")}</strong>{trText(", nunca en el aire.")}</Rule>

            <Rule title={trText("Una acción por clip")}>{trText("Un UGC de cinco segundos aguanta una sola acción: cuelga la pieza, la acomoda, enciende la lámpara. Apilar acciones produce deformación.")}</Rule>

            <Rule title={trText("Manipular un objeto rígido no se genera")}>{trText("Los motores de video tratan todo lo que hay en cuadro como masa deformable. Si una mano toca el producto, el producto cede. Cuando la toma es \"una mano manipula el producto\", se compone en Remotion sobre foto fija — no se genera.")}</Rule>

            <Rule title={trText("La ficha del producto manda sobre el prompt")}>{trText("Lo que el motor obedece es la ")}<strong>{trText("descripción de la ficha canónica")}</strong>{trText(", no lo que se pida en el prompt de la toma. El set CND salió con cuatro calaveras porque la ficha decía ")}<em>{trText("\"votive skull candles\"")}</em>{trText(" cuando las votivas son cilindros lisos: el prompt pedía dos votivas y el motor igual las dibujó con cara. Antes de culpar al prompt, leer la ficha.")}</Rule>

            <Rule title={trText("Showcase no muestra el set — UGC sí")}>{trText("El formato ")}<strong>{trText("Product Showcase")}</strong>{trText(" de Marketing Studio escribe su propio prompt y se queda con una sola pieza: pedirle un set de cuatro devuelve la calavera sola, sin avatar y con un look que no es de la marca. Para mostrar un set completo va ")}<strong>{trText("UGC con prompt libre")}</strong>{trText(", que sí acepta script y escena.")}</Rule>

            <Rule title={trText("La postura decide si la mano se cree")}>{trText("Un avatar recostado tomando una pieza se lee mal — el brazo llega en un ángulo que nadie usaría. Sentado en el borde de la cama, de pie frente a una superficie o acercándose a una repisa, funciona. La postura se define antes que la acción.")}</Rule>
          </section>

          <hr className="copper-line" />

          {/* ─── Método Marketing Studio ─── */}
          <section id="metodo">
            <H2>{trText("Método Marketing Studio")}</H2>
            <p>{trText("Los cinco pasos que hacen que un UGC con producto salga bien a la primera. Verificado contra el CND el 5 de agosto de 2026, después de cuatro corridas fallidas. Cada regla existe porque una corrida se perdió sin ella.")}</p>

            <Rule title={trText("01 · Producto y avatar van por parámetro, nunca en el prompt")}>{trText("Se pasan como ")}<code>{trText("product_ids")}</code>{trText(" y ")}<code>{trText("avatar_ids")}</code>{trText(" — plural, en array, aunque sea uno solo. Escribir ")}<code>{trText('<<<product:…>>>')}</code>{trText(" dentro del texto")}<strong>{trText(" no vincula nada")}</strong>{trText(": esa sintaxis es de Elements y Marketing Studio la lee como texto muerto. La confusión viene de que el servidor, cuando el producto")}<em>{trText(" sí")}</em>{trText(" está vinculado, agrega él solo ese marcador al final del prompt. Es la salida, no la entrada. Sin vincular, el motor genera a ciegas: inventa el avatar y reemplaza las piezas que no conoce.")}</Rule>

            <Rule title={trText("02 · Sin setting_id — la postura va en el prompt")}>{trText("Los settings traen su propio prompt fijo y pelean contra el tuyo. El setting")}<em>{trText(" Bedroom")}</em>{trText(" dice literalmente ")}<em>{trText("\"on bed or propped against pillows\"")}</em>{trText(": te acuesta a la modelo, que es justo lo que no funciona. Se omite el setting y el cuarto se describe en el prompt, con la postura primero.")}</Rule>

            <Rule title={trText("03 · El conteo se da como inventario cerrado")}>{trText("Decir ")}<em>{trText("\"las dos votivas\"")}</em>{trText(" no alcanza — ni siquiera con la ficha correcta vinculada. El motor las duplica igual. Lo que sí funciona es cerrar el inventario:")}<em>{trText(" \"la mesa tiene exactamente cuatro objetos y nada más… exactamente dos votivas, contalas: una a la izquierda y una a la derecha, nunca tres… siguen siendo dos en todos los cuadros\"")}</em>{trText(". Con eso el bug desaparece.")}</Rule>

            <Rule title={trText("04 · La escala se ancla al cuerpo, no en centímetros")}>{trText("Poner las medidas reales en el prompt no sirve: el motor no tiene noción de centímetros. Sí tiene noción de que algo entra en una mano. ")}<em>{trText("\"Small — it fits entirely in her palm\"")}</em>{trText(" corrigió el tamaño donde ")}<em>{"4,53\""}</em>{trText(" no hacía nada. La mano es la regla de medir.")}</Rule>

            <Rule title={trText("05 · No juzgar el primer plano contra las medidas reales")}>{trText("En un plano cerrado la mano va adelante y la cara atrás, así que la perspectiva agranda el producto — pasa igual en una foto real. Una toma correcta se puede leer como error si se la mide contra los centímetros de la pieza. La escala se evalúa en el ")}<strong>{trText("plano abierto")}</strong>{trText(", donde el producto convive con el mobiliario en el mismo plano focal.")}</Rule>
          </section>

        </div>
      </div>
    </>
  )
}

// ─── Componentes ───────────────────────────────────────────────────
function H2({ children }) {
  const { text: trText } = useTranslation()

  return <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--fg)' }}>{trText(children)}</h2>
}

function Tipo({ id, n, titulo, quien, donde, herramienta, regla }) {
  const { text: trText } = useTranslation()

  return (
    <div id={id} style={{ margin: '2rem 0', padding: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.2)', borderRadius: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'rgba(var(--copper-rgb),0.7)', fontFamily: 'monospace' }}>{trText(n)}</span>
        <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--copper)' }}>{trText(titulo)}</span>
      </div>
      <Campo label="Quién es">{trText(quien)}</Campo>
      <Campo label="Dónde vive">{trText(donde)}</Campo>
      <Campo label="Con qué se hace">{trText(herramienta)}</Campo>
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(var(--copper-rgb),0.15)', fontSize: '0.85rem', color: 'rgba(var(--fg-rgb),0.8)', lineHeight: 1.7, maxWidth: '70ch' }}>
        {trText(regla)}
      </div>
    </div>
  )
}

function Campo({ label, children }) {
  const { text: trText } = useTranslation()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', padding: '0.4rem 0', fontSize: '0.83rem', alignItems: 'start' }}>
      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(var(--copper-rgb),0.7)', paddingTop: '0.15rem' }}>{trText(label)}</span>
      <span style={{ color: 'rgba(var(--fg-rgb),0.75)' }}>{trText(children)}</span>
    </div>
  )
}

function Rule({ title, children }) {
  const { text: trText } = useTranslation()

  return (
    <div style={{ margin: '1.5rem 0', paddingLeft: '1rem', borderLeft: '2px solid rgba(var(--copper-rgb),0.4)' }}>
      <div style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.5rem' }}>{trText(title)}</div>
      <div style={{ fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.85)', lineHeight: 1.7, maxWidth: '70ch' }}>{trText(children)}</div>
    </div>
  )
}

// ─── Nav ───────────────────────────────────────────────────────────

// ─── Styles ────────────────────────────────────────────────────────
const metaStyle = { fontSize: '0.75rem', color: 'rgba(var(--fg-rgb),0.4)', marginTop: '0.5rem', letterSpacing: '0.05em' }
const layoutStyle = { display: 'flex', gap: '3rem', maxWidth: '1600px', margin: '0 auto', padding: '3rem clamp(1.25rem, 4vw, 3rem)' }
const sidebarStyle = { width: '200px', flexShrink: 0, position: 'sticky', top: '80px', alignSelf: 'flex-start' }
const sidebarLabelStyle = { fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(var(--fg-rgb),0.3)', marginBottom: '0.75rem' }
const linkStyle = { display: 'block', fontSize: '0.78rem', color: 'rgba(var(--fg-rgb),0.5)', padding: '0.3rem 0', textDecoration: 'none', transition: 'color 0.2s' }
const driverLinkStyle = { ...linkStyle, color: 'var(--copper)', fontWeight: 600, marginTop: '0.5rem' }
const contentStyle = { flex: 1, minWidth: 0 }
