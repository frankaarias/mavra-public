import useReveal from '../components/useReveal.js'
import brand from '../brand/brand.json'

const { identity } = brand

export default function Listings() {
  useReveal()

  return (
    <>
      <div className="page-header">
        <h1>Listing Image Briefs</h1>
        <p className="page-subtitle">Briefs de imágenes por slot y producto.</p>
      </div>

      <div style={layoutStyle}>
        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <div style={sidebarLabelStyle}>Productos</div>
          <a href="#wall-skulls" style={sidebarProductStyle}>Wall Skulls</a>
          <a href="#skull-candle" style={sidebarProductStyle}>Skull Candle Set</a>
          <a href="#skull-lamp" style={sidebarProductStyle}>Skull Lamp</a>
        </aside>

        {/* Content */}
        <div style={contentStyle}>

          {/* Álvaro Banner */}
          <div style={alvaroBannerStyle}>
            <span style={alvaroBannerTitleStyle}>Para Álvaro — Verificar antes de producir</span>
            <div style={alvaroBannerBodyStyle}>
              Los textos de overlay deben coincidir exactamente con los que aparecen en cada slot. No modificar copy salvo indicación explícita. Los tamaños aprobados son:
            </div>
            <div style={alveroSpecsRowStyle}>
              <span>Título: <strong>MADE MIRAGE Bold · 150px</strong></span>
              <span>Subtítulo: <strong>MADE MIRAGE Regular · 100px</strong></span>
              <span>Color texto: <strong>var(--fg-muted)</strong></span>
              <span>Color dimensiones: <strong>#BF9355</strong></span>
            </div>
            <div style={changesBlockStyle}>
              <span style={changesTitleStyle}>Cambios aprobados — reunión 2026-05-06 (aplica a todos los productos)</span>
              <ChangeItem>Fuente título: <code style={codeStyle}>MADE MIRAGE Bold 150px</code> — sin punto final</ChangeItem>
              <ChangeItem>Fuente subtítulo: <code style={codeStyle}>MADE MIRAGE Regular 100px</code> (reemplaza Thin)</ChangeItem>
              <ChangeItem>Color texto: <code style={codeStyle}>var(--fg-muted)</code> RGB(217,211,193) — estándar aprobado para overlays oscuros (reemplaza var(--fg))</ChangeItem>
              <ChangeItem>Header overlay: línea dorada full-width + diamante central + rombos esquinas inferiores</ChangeItem>
              <ChangeItem>Color líneas de dimensión: <code style={codeStyle}>#BF9355</code></ChangeItem>
            </div>
          </div>

          {/* ── Wall Skulls ─────────────────────────────────────────────── */}
          <ProductSection id="wall-skulls" title="Wall Skulls">
            <SlotCard
              id="ws-1b"
              approved
              slotNum="Slot 1"
              title="Main Image — White Studio"
              badge="✓ Aprobado"
              escena={`Los 3 cráneos en composición de producto (vistas frontal + laterales) sobre fondo, con placa/logo ${identity.name} enmarcado detrás. Acabado negro mate real. Variantes finales en blanco puro (1(1),1(3)) y fondo oscuro de marca (1(2),1(4)); la de fondo blanco es la main de Amazon.`}
              iluminacion="Difusa suave desde arriba. Sombra suave bajo cada cráneo. Contraste máximo negro mate sobre blanco."
              specs="3000×3000px | 1:1 | PNG — Sin overlay (Amazon main image)"
              driver="El acabado negro mate es REAL, no render 3D. Fondo blanco = prueba de material."
            />
            <SlotCard
              id="ws-2b"
              approved
              slotNum="Slot 2"
              title="Installation Process"
              badge="✓ Aprobado"
              escena="Imagen compuesta: imagen principal grande (pared charcoal, manos instalando cráneo con tornillo y chazos) + inset secundario mostrando la parte trasera del cráneo con una mano aplicando el double-sided tape."
              iluminacion="Suave desde arriba, 2500K. Sin sombras duras. Hardware (tornillo + chazos) visible."
              specs="2000×2000px | 1:1 | PNG"
              driver='Blocker eliminado: "¿Me va a quedar mal instalado / va a dañar la pared?"'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['MOUNT ONCE', 'HAUNT FOREVER', 'Screw & Wall Anchors or Permanent Double-Sided Tape'] }}
            />
            <SlotCard
              id="ws-3b"
              approved
              slotNum="Slot 3"
              title="Matte Macro"
              badge="✓ Aprobado"
              escena="Fondo negro mate seamless. Macro de 1 cráneo en ángulo 3/4. Enfoque en arco zigomático, zona temporal y textura de superficie; leve brillo bronce por la luz rasante."
              iluminacion="Luz rasante desde la DERECHA, 2200K, bajo ángulo. Resalta textura de polirresina. Sin brillo."
              specs="2000×2000px | 1:1 | PNG"
              driver='Blocker eliminado: "¿Tiene detalle real o es molde genérico?"'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['SCULPTED. NOT STAMPED', 'Anatomical detail. Dense Weight.'] }}
            />
            <SlotCard
              id="ws-4b"
              approved
              slotNum="Slot 4"
              title="Real Scale"
              badge="✓ Aprobado"
              escena='Plano medio. Pared charcoal llena el fondo. 3 cráneos montados a la altura de los ojos. Mujer de costado/espalda — sin cara visible — mano tocando el cráneo central C2.'
              iluminacion="Luz lateral cálida 2400K desde la izquierda. Pool sobre cráneos. Mujer en sombra parcial."
              specs="2000×2000px | 1:1 | PNG"
              driver='Blocker eliminado: "No sé qué tan grande es — en foto parece diferente"'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted) · Líneas dimensión #BF9355', lines: ['MADE TO FIT', 'BUILT TO HAUNT', '8.15" × 5.9" | 7.3" × 5.5" | 6.7" × 5.1"'] }}
              sourceTag="Dimensiones verificadas vs imagen final (8.15×5.9 / 7.3×5.5 / 6.7×5.1)."
            />
            <SlotCard
              id="ws-5b"
              approved
              slotNum="Slot 5"
              title="Identity Statement"
              badge="✓ Aprobado"
              escena="Los 3 cráneos montados en pared gris oscuro texturizada, junto a dos rosas secas y parte de un espejo redondo ornamentado. Composición minimalista. Sin avatar en la versión final."
              iluminacion="Luz lateral cálida 2400K. Atmósfera contenida, contraste alto."
              specs="2000×2000px | 1:1 | PNG"
              driver='Purchase driver: Identidad — "esto me representa". Sin cuerpo adicional.'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · var(--fg-muted)', lines: ['YOUR WALL', 'Your language'] }}
              sourceTag="Divergencia — sin avatar; still-life con rosas secas + espejo redondo."
            />
            <SlotCard
              id="ws-6b"
              approved
              slotNum="Slot 6"
              title="Cross-Sell — Dark Room Styled"
              badge="✓ Aprobado"
              escena={`Habitación curada oscura. Pared charcoal con 3 cráneos montados. Superficie debajo: velas ${identity.name} skull candles encendidas + libros lomo oscuro. Ecosistema ${identity.name} completo.`}
              iluminacion="Luz lateral cálida 2400K fuera del frame izquierdo. Sombras en esquinas."
              specs="2000×2000px | 1:1 | PNG"
              driver={`Purchase driver: "¿Cómo se ve esto en un cuarto real?" + Cross-sell activo con velas ${identity.name}.`}
              overlay={{ specs: 'MADE MIRAGE Bold 150px · var(--fg-muted)', lines: ['A SANCTUARY IS BORN', '◆ Add the flames to your realm ◆'] }}
              sourceTag={`Verificado — overlay final agrega 'Add the flames to your realm' + wordmark ${identity.name}.`}
            />
          </ProductSection>

          {/* ── Skull Candle Set ─────────────────────────────────────────── */}
          <ProductSection id="skull-candle" title="Skull Candle Set">
            <SlotCard
              id="sc-1b"
              approved
              slotNum="Slot 1"
              title="Main Image — Dark Studio"
              badge="✓ Aprobado"
              escena={`Set completo encendido sobre superficie oscura mate: skull candle centrado, con spine candle y velas votivas/pilar flanqueando. Backdrop de marca con placa/logo ${identity.name} enmarcado detrás. Variantes finales: fondo blanco (1(1),1(3)) y fondo oscuro de marca (1(2),1(4)) — la dark studio es la aprobada.`}
              iluminacion="Llamas como fuente primaria, pool ambar cálido alrededor del set, oscuridad profunda en bordes."
              specs="3000×3000px | 1:1 | PNG — Sin overlay (Amazon main image)"
              driver="Rompe patrón del 75% de competidores con fondo blanco. Set completo identificable en 2 segundos desde SERP."
            />
            <SlotCard
              id="sc-2b"
              approved
              updated
              slotNum="Slot 2"
              title="Hands on Skull + Spine"
              badge="✓ Aprobado"
              escena="Close-up de antebrazos y manos del avatar — sin cara, sin hombros, cortado a la altura de los codos. Mano izquierda sostiene skull candle; mano derecha sostiene spine candle. Ambas velas a la misma altura frente a cámara."
              iluminacion="Luz tungsteno 2400K desde arriba-izquierda, cálida y controlada. Tonos dorados en manos y velas."
              specs="2048×2048px | 1:1 | PNG"
              driver='Blocker eliminado: "¿Qué tamaño tienen realmente?" — escala real de ambas piezas visible simultáneamente.'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['HOLD THE DARK', 'Real paraffin. True black.', 'Skull 4.53" × 3.39" · Spine 5.67" × 1.38"'] }}
              sourceTag="Verificado — imagen final agrega callouts de dimensión; se quitó 'The ritual begins.'"
            />
            <SlotCard
              id="sc-3b"
              approved
              slotNum="Slot 3"
              title="Unboxing Gift Moment"
              badge="✓ Aprobado"
              escena={`Manos con tatuajes abriendo caja de regalo negra ${identity.name}; el set emerge del inserto de espuma protectora — skull, spine y 2 velitas votivas. Gift set curado.`}
              iluminacion="Luz cálida direccional desde arriba y ligeramente izquierda, panel teal legible."
              specs="2000×2000px | 1:1 | PNG"
              driver='Purchase driver: Gift buyers (P3) — el packaging justifica el precio.'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['GIVE THE DARK', 'Complete the ritual inside.'] }}
              sourceTag="Divergencia — en la imagen final no se ve el panel teal ni la tagline 'Witness Our Dark Renaissance'; caja negra con espuma + 2 tealights."
            />
            <SlotCard
              id="sc-4b"
              approved
              slotNum="Slot 4"
              title="Altar — Permanent Decor"
              badge="✓ Aprobado"
              escena="Escena de altar iluminada por velas: skull candle entre decoración gótica — spine candle y velas pilar negras. Ambiente moody, permanencia año-completo (no Halloween). Sin avatar/silueta en la versión final."
              iluminacion="Llamas como única fuente, pool ambar alrededor del set."
              specs="2000×2000px | 1:1 | PNG"
              driver='Purchase driver: "Quiero ser esa persona en ese espacio" — identidad + permanencia año completo, no Halloween.'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['YOUR ALTAR. YOUR RULES', 'Permanent dark aesthetic decor.'] }}
              sourceTag="Divergencia — versión final es still-life de altar (sin avatar/silueta)."
            />
            <SlotCard
              id="sc-5b"
              approved
              slotNum="Slot 5"
              title="Texture Macro"
              badge="✓ Aprobado"
              escena="Skull candle encendido, iluminado de forma dramática desde arriba, con inset ampliado que muestra las grietas/suturas esculpidas a mano (detalle anatómico). Superficie oscura."
              iluminacion="Luz rasante 2400K desde la derecha a bajo ángulo. Resalta relieve escultórico y profundidad anatómica."
              specs="2000×2000px | 1:1 | PNG"
              driver='Blocker eliminado: "¿Tiene detalle real o es molde genérico?"'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['SCULPTED. NOT STAMPED', 'Pine & Moss Scent', 'Anatomical detail.'] }}
              sourceTag="Verificado — imagen final agrega callout 'PINE & MOSS scent'; escena = skull encendido + inset, no macro desde abajo."
            />
            <SlotCard
              id="sc-6b"
              approved
              slotNum="Slot 6"
              title="Spine Lit Solo"
              badge="✓ Aprobado"
              escena="Spine candle solo, orientación vertical, longitud completa centrada en frame, pequeña llama activa en vértebra superior. Fondo negro puro absoluto."
              iluminacion="Llama del spine como única fuente — vértebras superiores iluminadas en ambar, inferiores se desvanecen en oscuridad."
              specs="2000×2000px | 1:1 | PNG"
              driver="Componente diferenciador sin equivalente en competidores S4."
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['RITUAL DEMANDS A SPINE', 'Both real. Both black.'] }}
            />
            <SlotCard
              id="sc-7"
              approved
              slotNum="Slot 7"
              title="Burn Performance"
              badge="✓ Aprobado"
              escena="Skull + spine ardiendo juntos sobre ebonized oak. Llamas activas en ambas velas. Cera negra visible derritiéndose. Fondo negro. Sin persona."
              iluminacion="Llamas como fuente principal. Pool ambar cálido. 2400K tungsten support. Vignette pronunciado."
              specs="2000×2000px | 1:1 | PNG"
              driver='Blocker eliminado: "¿Cuánto dura? ¿La llama se ve bien? ¿Quema en blanco?"'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['BURNS AS DARK AS IT LOOKS', 'Skull: 12 hrs · Spine: 6 hrs.'] }}
            />
          </ProductSection>

          {/* ── Skull Lamp ───────────────────────────────────────────────── */}
          <ProductSection id="skull-lamp" title="Skull Lamp">
            <SlotCard
              id="sl-1a"
              approved
              slotNum="Slot 1"
              title="Main Image — Shadow First"
              badge="✓ Aprobado"
              escena={`Habitación oscura. Lámpara ${identity.name} encendida a ángulo 3/4 sobre superficie oscura. La jaula metálica geométrica (skull facetado) proyecta la sombra del cráneo claramente sobre la pared de fondo. Bombillo tipo Edison cálido encendido dentro del shade.`}
              iluminacion="Lámpara como única fuente. Pool de luz en shade + sombra calavera geométrica en pared. Oscuridad profunda fuera del radio."
              specs="3000×3000px | 1:1 | PNG — Sin overlay (Amazon main image)"
              driver="Shadow projection = #1 emotional driver S2. Ningún competidor lo demuestra en main image."
            />
            <SlotCard
              id="sl-2a"
              approved
              slotNum="Slot 2"
              title="Shade Modes"
              badge="✓ Aprobado"
              escena="Las 3 configuraciones del shade lado a lado, cada una encendida: Matte (veil blanco mate), Glitter (veil texturizado que brilla cálido) y Naked Cage (jaula metálica desnuda, sin veil). Las 2 veils —matte + glitter— vienen incluidas. Fondo oscuro."
              iluminacion="Luz interna como única fuente. Glitter activo en modo Glitter."
              specs="2000×2000px | 1:1 | PNG"
              driver="El shade ES el producto — 3 experiencias visuales distintas, con las 2 veils incluidas."
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['PICK YOUR DARKNESS.', 'Matte. Glitter. Naked.', 'Both Veils Included.'] }}
            />
            <SlotCard
              id="sl-3"
              approved
              slotNum="Slot 3"
              title="Scale Proof"
              badge="✓ Aprobado"
              escena="Lámpara completa en superficie oscura, referencia de escala al lado (libro estándar a la derecha). Espacio negativo arriba y derecha para callouts de dimensiones."
              iluminacion="Luz difusa desde arriba. Lámpara apagada para máxima legibilidad de dimensiones físicas."
              specs="2000×2000px | 1:1 | PNG"
              driver="Top pain point S2 — comprador no sabe qué tamaño llega realmente."
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['MADE TO FIT', 'BUILT TO HAUNT', 'Shade: 5.4" Wide. Height: 12.2". Arrives Exactly as Shown.'] }}
            />
            <SlotCard
              id="sl-4a"
              approved
              slotNum="Slot 4"
              title="Construction Detail"
              badge="✓ Aprobado"
              escena="Close-up de la construcción: base metálica negra sólida (circular) + marco geométrico del shade en metal (wireframe facetado). Superficie con grano de madera oscura, fondo charcoal."
              iluminacion="Luz direccional controlada. Marco metálico captando luz. Sin sombras duras sobre el producto."
              specs="2000×2000px | 1:1 | PNG"
              driver='Blocker eliminado: "Es frágil / se va a romper"'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['BUILT TO LAST THE DARK', 'Solid Base. Metal Shade Frame.'] }}
            />
            <SlotCard
              id="sl-5a"
              approved
              slotNum="Slot 5"
              title="Brightness Levels"
              badge="✓ Aprobado"
              escena="Lámpara mostrada en 3 paneles demostrando el touch-dimmer de 3 niveles: Soft (glow tenue) → Medium → High (luz cálida intensa). Mismo encuadre en los 3 paneles. Fondo oscuro."
              iluminacion="Luz interna del bombillo tipo Edison como única fuente, en 3 intensidades. Sin luz de relleno."
              specs="2000×2000px | 1:1 | PNG"
              driver="Touch-dimmer de 3 niveles — el comprador regula la intensidad con un toque a la base."
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['CONTROL THE NIGHT', 'Soft. Medium. High.'] }}
            />
            <SlotCard
              id="sl-6a"
              approved
              slotNum="Slot 6"
              title="Bedside Touch"
              badge="✓ Aprobado"
              escena="Lámpara encendida sobre mesa de noche. Mano tatuada acercándose a tocar la base circular (activación del touch-dimmer). Sin cara. Ambiente oscuro."
              iluminacion="Lámpara como fuente primaria. Pool cálido sobre superficie."
              specs="2000×2000px | 1:1 | PNG"
              driver="Bedside Convenience Buyer (Cluster 3 S2) — touch-dimmer es motivación primaria de compra."
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['THE DARK OBEYS.', 'Awaken from darkness with a touch.'] }}
            />
            <SlotCard
              id="sl-7"
              approved
              slotNum="Slot 7"
              title="Assembly Guide"
              badge="✓ Aprobado"
              escena="Grid 2×2 con los 4 pasos de armado de la lámpara. Fondo charcoal matte oscuro. Manos con uñas dark grey."
              iluminacion="Fotos reales del proceso con fondo reemplazado. Grid compuesto en Freepik Design."
              specs="2000×2000px | 1:1 | PNG"
              driver='Blocker eliminado: "¿Qué necesito comprar aparte? ¿Cómo se arma?"'
              overlay={{ specs: 'MADE MIRAGE Bold 150px · Regular 100px · var(--fg-muted)', lines: ['BUILD THE DARK', '1. Unscrew the Ring.   2. Seat the Shade.   3. Lock It In.   4. Bring the Dark.'] }}
            />
          </ProductSection>

        </div>
      </div>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProductSection({ id, title, children }) {
  return (
    <div style={{ marginBottom: '6rem', paddingBottom: '4rem', borderBottom: '1px solid rgba(var(--copper-rgb),0.2)' }} id={id}>
      <div style={{ fontFamily: "var(--font-condensed)", fontSize: 'clamp(1.3rem,3vw,2rem)', color: 'var(--fg)', marginBottom: '2rem', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {children}
      </div>
    </div>
  )
}

function SlotCard({ id, approved, updated, slotNum, title, badge, escena, iluminacion, specs, driver, overlay, sourceTag }) {
  return (
    <div id={id} style={{
      border: `1px solid ${approved ? 'rgba(var(--copper-rgb),0.4)' : 'rgba(var(--copper-rgb),0.25)'}`,
      padding: '1.5rem 1.75rem',
      background: approved ? 'rgba(var(--copper-rgb),0.04)' : 'transparent',
      scrollMarginTop: '80px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={slotNumberStyle}>{slotNum}</span>
        <span style={slotTitleStyle}>{title}</span>
        {badge && <span style={{ ...slotBadgeStyle, ...(approved ? slotBadgeApprovedStyle : {}) }}>{badge}</span>}
        {updated && <span style={{ ...slotBadgeStyle, color: 'var(--copper)', background: 'rgba(var(--burgundy-rgb),0.25)', padding: '0.15rem 0.5rem', border: '1px solid rgba(var(--burgundy-rgb),0.4)' }}>↑ Actualizado 2026-05-06</span>}
      </div>

      <div style={slotBodyStyle}>
        <div>
          <span style={fieldLabelStyle}>Escena</span>
          <div style={fieldValueStyle}>{escena}</div>
        </div>
        <div>
          <span style={fieldLabelStyle}>Iluminación</span>
          <div style={fieldValueStyle}>{iluminacion}</div>
          <div style={specsLineStyle}>{specs}</div>
        </div>
      </div>

      {overlay && (
        <div style={overlayBlockStyle}>
          <div style={overlaySpecsStyle}>{overlay.specs}</div>
          {overlay.lines.map((line, i) => (
            <div key={i} style={overlayLineStyle}>
              {i < overlay.lines.length - 1 ? <strong>{line}</strong> : line}
            </div>
          ))}
        </div>
      )}

      {sourceTag && <div style={sourceTagStyle}>{sourceTag}</div>}

      <div style={purchaseDriverStyle}>{driver}</div>
    </div>
  )
}

function ChangeItem({ children }) {
  return (
    <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.82rem', color: 'rgba(var(--fg-rgb),0.75)', lineHeight: 1.7, paddingLeft: '0.75rem', borderLeft: '1px solid rgba(var(--copper-rgb),0.2)', marginBottom: '0.4rem' }}>
      {children}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const layoutStyle = { display: 'grid', gridTemplateColumns: '200px 1fr', maxWidth: '1600px', margin: '0 auto' }
const sidebarStyle = { padding: '3rem 1.5rem 3rem 2rem', borderRight: '1px solid rgba(var(--copper-rgb),0.15)', position: 'sticky', top: '60px', height: 'fit-content' }
const sidebarLabelStyle = { fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.5)', marginBottom: '1rem', display: 'block' }
const sidebarProductStyle = { display: 'block', fontFamily: "var(--font-condensed)", fontSize: '0.7rem', color: 'var(--copper)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.5rem', marginBottom: '0.5rem', textDecoration: 'none' }
const contentStyle = { padding: '3rem 2.5rem 6rem' }
const alvaroBannerStyle = { marginBottom: '3rem', padding: '1.5rem 1.75rem', background: 'rgba(var(--copper-rgb),0.06)', border: '1px solid rgba(var(--copper-rgb),0.35)', borderLeft: '3px solid var(--copper)' }
const alvaroBannerTitleStyle = { fontFamily: "var(--font-sans)", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--copper)', display: 'block', marginBottom: '0.75rem' }
const alvaroBannerBodyStyle = { fontFamily: "var(--font-sans)", fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.7, marginBottom: '0.75rem' }
const alveroSpecsRowStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.4rem 2rem', fontFamily: "var(--font-sans)", fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(var(--fg-rgb),0.45)' }
const changesBlockStyle = { marginTop: '1rem', padding: '1rem 1.25rem', background: 'rgba(var(--burgundy-rgb),0.12)', borderLeft: '2px solid rgba(var(--burgundy-rgb),0.6)' }
const changesTitleStyle = { fontFamily: "var(--font-sans)", fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(var(--burgundy-rgb),0.9)', marginBottom: '0.6rem', display: 'block' }
const codeStyle = { fontFamily: "var(--font-sans)", fontSize: '0.78rem', color: 'var(--copper)', background: 'rgba(var(--copper-rgb),0.1)', padding: '0.05rem 0.3rem' }
const slotNumberStyle = { fontFamily: "var(--font-sans)", fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--copper)', whiteSpace: 'nowrap' }
const slotTitleStyle = { fontFamily: "var(--font-condensed)", fontSize: '0.9rem', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.06em' }
const slotBadgeStyle = { marginLeft: 'auto', fontFamily: "var(--font-sans)", fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.7)', whiteSpace: 'nowrap' }
const slotBadgeApprovedStyle = { color: 'rgba(var(--copper-rgb),1)' }
const slotBodyStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }
const fieldLabelStyle = { fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)', marginBottom: '0.35rem', display: 'block' }
const fieldValueStyle = { fontFamily: "var(--font-sans)", fontSize: '0.85rem', color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.65 }
const specsLineStyle = { marginTop: '0.75rem', fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.5)' }
const overlayBlockStyle = { marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(var(--burgundy-rgb),0.1)', borderLeft: '2px solid rgba(var(--copper-rgb),0.35)' }
const overlaySpecsStyle = { fontFamily: "var(--font-sans)", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)', marginBottom: '0.65rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(var(--copper-rgb),0.15)' }
const overlayLineStyle = { fontFamily: "var(--font-sans)", fontSize: '0.82rem', color: 'rgba(var(--fg-rgb),0.65)', lineHeight: 1.7 }
const sourceTagStyle = { display: 'inline-block', marginTop: '1rem', fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.55)', padding: '0.25rem 0.6rem', border: '1px solid rgba(var(--copper-rgb),0.2)' }
const purchaseDriverStyle = { marginTop: '1rem', fontFamily: "var(--font-sans)", fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.5)', borderTop: '1px solid rgba(var(--copper-rgb),0.1)', paddingTop: '0.75rem' }
