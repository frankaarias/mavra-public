import { useEffect } from 'react'
import brand from '../brand/brand.json'

const { identity } = brand

// ─── shared style tokens ──────────────────────────────────────────────────────
const C = {
  copper:        'rgba(var(--copper-rgb),1)',
  copperFaint:   'rgba(var(--copper-rgb),0.15)',
  copperMid:     'rgba(var(--copper-rgb),0.25)',
  copperBorder:  'rgba(var(--copper-rgb),0.35)',
  copper50:      'rgba(var(--copper-rgb),0.5)',
  copper60:      'rgba(var(--copper-rgb),0.6)',
  cream:         'var(--fg)',
  cream40:       'rgba(var(--fg-rgb),0.4)',
  cream45:       'rgba(var(--fg-rgb),0.45)',
  cream55:       'rgba(var(--fg-rgb),0.55)',
  cream60:       'rgba(var(--fg-rgb),0.6)',
  cream70:       'rgba(var(--fg-rgb),0.7)',
  cream80:       'rgba(var(--fg-rgb),0.8)',
  cream35:       'rgba(var(--fg-rgb),0.35)',
  burgundy10:    'rgba(var(--burgundy-rgb),0.1)',
  burgundy06:    'rgba(var(--burgundy-rgb),0.06)',
  bg:            'var(--bg)',
}

const font = {
  cinzel:   "'Cinzel', serif",
  josefin:  "'Josefin Sans', sans-serif",
  imfell:   "'IMFell', serif",
  basilia:  "'Basilia', serif",
}

// ─── sub-components ───────────────────────────────────────────────────────────

function PaletteSwatch({ hex, label }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem',
      fontFamily: font.josefin, fontSize:'0.6rem', letterSpacing:'0.1em',
      color: C.cream45 }}>
      <span style={{ width:14, height:14, background: hex,
        border:'1px solid rgba(255,255,255,0.15)', display:'inline-block' }} />
      {label || hex}
    </span>
  )
}

function PaletteRow({ swatches }) {
  return (
    <div style={{ marginTop:'0.75rem', display:'flex', flexWrap:'wrap', gap:'0.5rem', alignItems:'center' }}>
      {swatches.map((s, i) => <PaletteSwatch key={i} hex={s.hex} label={s.label} />)}
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <span style={{ fontFamily: font.josefin, fontSize:'0.6rem', letterSpacing:'0.2em',
      textTransform:'uppercase', color: C.copper60, marginBottom:'0.35rem', display:'block' }}>
      {children}
    </span>
  )
}

function FieldValue({ children }) {
  return (
    <div style={{ fontFamily: font.basilia, fontSize:'0.85rem',
      color: C.cream70, lineHeight:1.65 }}>
      {children}
    </div>
  )
}

function SpecsLine({ children, style }) {
  return (
    <div style={{ marginTop:'0.75rem', fontFamily: font.josefin, fontSize:'0.6rem',
      letterSpacing:'0.15em', textTransform:'uppercase', color: C.copper50, ...style }}>
      {children}
    </div>
  )
}

function TextBlock({ label, children }) {
  return (
    <div style={{ marginTop:'1.25rem', padding:'1rem 1.25rem',
      background: C.burgundy10, borderLeft:`2px solid ${C.copperBorder}` }}>
      {label && (
        <span style={{ fontFamily: font.josefin, fontSize:'0.58rem', letterSpacing:'0.22em',
          textTransform:'uppercase', color: C.copper60, marginBottom:'0.6rem', display:'block' }}>
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

function TextLine({ sub, children }) {
  return (
    <div style={{
      fontFamily: sub ? font.basilia : font.cinzel,
      fontStyle:  sub ? 'italic' : 'normal',
      fontSize:   sub ? '0.82rem' : '0.88rem',
      color:      sub ? C.cream55 : C.cream80,
      lineHeight: 1.8,
    }}>
      {children}
    </div>
  )
}

function CalloutList({ items }) {
  return (
    <div style={{ marginTop:'0.5rem' }}>
      {items.map((item, i) => (
        <div key={i} style={{ fontFamily: font.josefin, fontSize:'0.68rem', letterSpacing:'0.1em',
          color: C.cream60, padding:'0.3rem 0', borderBottom:`1px solid rgba(var(--copper-rgb),0.1)`,
          display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span style={{ color: C.copper50, fontSize:'0.7rem' }}>—</span>
          {item}
        </div>
      ))}
    </div>
  )
}

function MoodTag({ children }) {
  return (
    <div style={{ marginTop:'1rem', fontFamily: font.imfell, fontStyle:'italic',
      fontSize:'0.88rem', color: C.cream35,
      borderTop:`1px solid rgba(var(--copper-rgb),0.1)`, paddingTop:'0.75rem' }}>
      {children}
    </div>
  )
}

function TwoPanelNote({ children }) {
  return (
    <div style={{ marginTop:'1rem', padding:'0.75rem 1rem',
      border:`1px dashed rgba(var(--copper-rgb),0.3)`, fontFamily: font.josefin,
      fontSize:'0.62rem', letterSpacing:'0.1em', color: C.cream45,
      lineHeight: 1.7 }}>
      {children}
    </div>
  )
}

function AlvaroBlock({ title, children }) {
  return (
    <div style={{ marginTop:'1.25rem', padding:'1.25rem 1.5rem',
      background: C.burgundy06, border:`1px solid ${C.copperBorder}`,
      borderLeft:`3px solid ${C.copper}` }}>
      <span style={{ fontFamily: font.josefin, fontSize:'0.6rem', letterSpacing:'0.25em',
        textTransform:'uppercase', color: C.copper, display:'block', marginBottom:'0.75rem' }}>
        {title}
      </span>
      {children}
    </div>
  )
}

function AlvaroRow({ children }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem 2rem',
      fontFamily: font.josefin, fontSize:'0.62rem', letterSpacing:'0.1em',
      color: C.cream45, marginBottom:'0.4rem' }}>
      {children}
    </div>
  )
}

function ModuleCard({ id, moduleId, title, size, badge, status, children }) {
  const statusStyles = {
    ready: {
      card:  { borderColor:'rgba(var(--copper-rgb),0.4)', background:'rgba(var(--copper-rgb),0.04)' },
      badge: { color: C.copper },
    },
    pending: {
      card:  { borderColor:'rgba(var(--copper-rgb),0.15)', opacity:0.75 },
      badge: { color:'rgba(var(--fg-rgb),0.25)' },
    },
    iterando: {
      card:  { borderColor:'rgba(var(--copper-rgb),0.3)', background:'rgba(var(--burgundy-rgb),0.06)' },
      badge: { color:'rgba(var(--fg-rgb),0.6)' },
    },
  }
  const s = statusStyles[status] || statusStyles.pending

  return (
    <div id={id} style={{
      border:`1px solid ${C.copperMid}`, padding:'1.5rem 1.75rem',
      scrollMarginTop:'80px', ...s.card }}>
      {/* header */}
      <div style={{ display:'flex', alignItems:'baseline', gap:'1rem',
        marginBottom:'1rem', flexWrap:'wrap' }}>
        <span style={{ fontFamily: font.josefin, fontSize:'0.58rem', letterSpacing:'0.25em',
          textTransform:'uppercase', color: C.copper, whiteSpace:'nowrap' }}>
          {moduleId}
        </span>
        <span style={{ fontFamily: font.cinzel, fontSize:'0.9rem', color: C.cream,
          textTransform:'uppercase', letterSpacing:'0.06em' }}>
          {title}
        </span>
        {size && (
          <span style={{ fontFamily: font.josefin, fontSize:'0.58rem', letterSpacing:'0.15em',
            color:'rgba(var(--copper-rgb),0.6)', whiteSpace:'nowrap',
            padding:'0.2rem 0.5rem', border:`1px solid rgba(var(--copper-rgb),0.2)` }}>
            {size}
          </span>
        )}
        <span style={{ marginLeft:'auto', fontFamily: font.josefin, fontSize:'0.55rem',
          letterSpacing:'0.2em', textTransform:'uppercase', whiteSpace:'nowrap', ...s.badge }}>
          {badge}
        </span>
      </div>
      {children}
    </div>
  )
}

function ModuleBody({ children }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
      {children}
    </div>
  )
}

function ProductSection({ id, label, title, meta, children }) {
  return (
    <div id={id} style={{ marginBottom:'6rem', paddingBottom:'4rem',
      borderBottom:`1px solid rgba(var(--copper-rgb),0.2)` }}>
      <div style={{ fontFamily: font.josefin, fontSize:'0.65rem', letterSpacing:'0.35em',
        textTransform:'uppercase', color: C.copper, marginBottom:'0.75rem' }}>
        {label}
      </div>
      <div style={{ fontFamily: font.cinzel, fontSize:'clamp(1.3rem,3vw,2rem)', color: C.cream,
        marginBottom:'0.5rem', textTransform:'uppercase' }}>
        {title}
      </div>
      <div style={{ fontFamily: font.josefin, fontSize:'0.62rem', letterSpacing:'0.15em',
        textTransform:'uppercase', color:'rgba(var(--copper-rgb),0.55)', marginBottom:'2rem' }}>
        {meta}
      </div>
      <div style={{ display:'grid', gap:'1.25rem', marginTop:'2rem' }}>
        {children}
      </div>
    </div>
  )
}

// ─── inline text snippet used inside Álvaro B2 ───────────────────────────────
function AlvaroTextSample() {
  return (
    <div style={{ margin:'0.5rem 0 0.5rem 1rem', padding:'0.75rem 1rem',
      background:'rgba(0,0,0,0.2)', borderLeft:'2px solid rgba(var(--copper-rgb),0.4)' }}>
      {['For the one who arranges', 'the darkness', 'with intention.'].map((line, i) => (
        <div key={i} style={{ fontFamily: font.cinzel, fontSize:'0.9rem',
          color: C.cream, lineHeight:1.8 }}>{line}</div>
      ))}
      <div style={{ fontFamily: font.josefin, fontSize:'0.58rem', letterSpacing:'0.15em',
        color:'rgba(var(--copper-rgb),0.7)', marginTop:'0.5rem' }}>
        Fuente: Cinzel 400 · Color: var(--fg) · Centrado vertical y horizontal
      </div>
    </div>
  )
}

// ─── palettes shared across modules ──────────────────────────────────────────
const palBW  = [{ hex:'var(--bg)' }, { hex:'var(--fg)' }, { hex:'var(--copper-bright)' }]
const palBWL = [{ hex:'var(--bg)', label:'var(--bg) fondo' }, { hex:'var(--fg)', label:'var(--fg) texto' }, { hex:'var(--copper-bright)', label:'var(--copper-bright) separador' }]
const palOverlay = [{ hex:'var(--bg)', label:'Overlay var(--bg)' }, { hex:'var(--fg)' }, { hex:'var(--copper-bright)', label:'subrayado copper' }]
const palB7  = [{ hex:'var(--bg)' }, { hex:'var(--copper-bright)', label:'accent lamp' }, { hex:'var(--fg)' }]

// ─── main component ───────────────────────────────────────────────────────────
export default function AplusBriefs() {
  useEffect(() => { document.title = `${identity.name} — A+ Content Briefs` }, [])

  return (
    <>
      {/* page header */}
      <div style={{ maxWidth:1600, margin:'0 auto', padding:'4rem clamp(1.25rem, 4vw, 3rem) 2rem',
        borderBottom:`1px solid rgba(var(--copper-rgb),0.2)` }}>
        <h1 style={{ fontFamily: font.cinzel, fontSize:'clamp(1.8rem,4vw,3rem)',
          color: C.cream, marginBottom:'0.5rem' }}>
          A+ Content Briefs
        </h1>
        <p style={{ fontFamily: font.imfell, fontStyle:'italic',
          color:'rgba(var(--fg-rgb),0.45)', fontSize:'1rem' }}>
          7 módulos · Standard A+ · 960×300 y 960×600
        </p>
      </div>

      {/* layout: sidebar + content */}
      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr',
        maxWidth:1600, margin:'0 auto' }}>

        {/* ── sidebar ── */}
        <aside style={{ padding:'3rem 1.5rem 3rem 2rem',
          borderRight:`1px solid rgba(var(--copper-rgb),0.15)`,
          position:'sticky', top:60, height:'fit-content' }}>
          <div style={{ fontFamily: font.josefin, fontSize:'0.6rem', letterSpacing:'0.25em',
            textTransform:'uppercase', color:'rgba(var(--copper-rgb),0.5)', marginBottom:'1rem' }}>
            Productos
          </div>

          {/* sidebar link helper */}
          {[
            { href:'#wall-skulls', label:'Wall Skulls', product: true },
            { href:'#ws-b1',  label:'B1 — Hero',                indent: true },
            { href:'#ws-b2',  label:'B2 — Buyer Persona',       indent: true },
            { href:'#ws-b3',  label:'B3 — Materiales',          indent: true },
            { href:'#ws-b4',  label:'B4 — Intro Corrientes',    indent: true },
            { href:'#ws-b5',  label:'B5 — Victoriano + Pastel', indent: true },
            { href:'#ws-b6',  label:'B6 — Trad + Southern',     indent: true },
            { href:'#ws-b7',  label:'B7 — Cross-sell',          indent: true },
            { href:'#skull-candle', label:'Skull Candle Set', product: true },
            { href:'#cnd-b1', label:'B1 — Hero',                indent: true },
            { href:'#cnd-b2', label:'B2 — Buyer Persona',       indent: true },
            { href:'#cnd-b3', label:'B3 — Materiales',          indent: true },
            { href:'#cnd-b4', label:'B4 — Whimsigoth',          indent: true },
            { href:'#cnd-b5', label:'B5 — Victoriano + Pastel', indent: true },
            { href:'#cnd-b6', label:'B6 — Trad + Southern',     indent: true },
            { href:'#cnd-b7', label:'B7 — Cross-sell',          indent: true },
            { href:'#skull-lamp',   label:'Skull Lamp',         product: true },
            { href:'#lmp-b1', label:'B1 — Hero',                indent: true },
            { href:'#lmp-b2', label:'B2 — Buyer Persona',       indent: true },
            { href:'#lmp-b3', label:'B3 — Materiales',          indent: true },
            { href:'#lmp-b4', label:'B4 — Whimsigoth',          indent: true },
            { href:'#lmp-b5', label:'B5 — Victoriano + Pastel', indent: true },
            { href:'#lmp-b6', label:'B6 — Trad + Southern',     indent: true },
            { href:'#lmp-b7', label:'B7 — Cross-sell',          indent: true },
            { href:'#premium-cnd', label:'CND — Premium A+', product: true },
            { href:'#pcnd-m1', label:'M1 — Hero',               indent: true },
            { href:'#pcnd-m2', label:'M2 — Video',              indent: true },
            { href:'#pcnd-m3', label:'M3 — Hotspots',           indent: true },
            { href:'#pcnd-m4', label:'M4 — Room Carousel',      indent: true },
            { href:'#pcnd-m5', label:'M5 — Regimen Carousel',   indent: true },
            { href:'#pcnd-m6', label:'M6 — Q&A',                indent: true },
            { href:'#pcnd-m7', label:'M7 — Close',              indent: true },
          ].map(({ href, label, product, indent }) => (
            <a key={href} href={href} style={{
              display:'block',
              fontFamily: product ? font.cinzel : font.josefin,
              fontSize: product ? '0.7rem' : '0.68rem',
              letterSpacing: product ? '0.1em' : '0.1em',
              textTransform: product ? 'uppercase' : undefined,
              color: product ? C.copper : C.cream40,
              textDecoration:'none',
              padding: product ? '0.3rem 0' : '0.3rem 0',
              paddingLeft: indent ? '0.5rem' : undefined,
              marginTop: product ? '1.5rem' : undefined,
              marginBottom: product ? '0.5rem' : undefined,
              borderBottom: product ? 'none' : `1px solid rgba(var(--copper-rgb),0.08)`,
            }}>
              {label}
            </a>
          ))}
        </aside>

        {/* ── content ── */}
        <div style={{ padding:'3rem 2.5rem 6rem' }}>

          {/* ══════════════ WALL SKULLS ══════════════ */}
          <ProductSection
            id="wall-skulls"
            label="SWD"
            title="Wall Skulls"
            meta="Set de 3 cráneos de pared · Polyresin matte black · Standard A+ · 7 módulos (plan original — superado)"
          >

            <TwoPanelNote>
              <strong style={{ color: C.copper }}>Nota — divergencia estructural con la serie final.</strong> El A+ de SWD que se produjo es una serie Premium tipo M (no documentada aún como sección propia): M1 Hero &quot;MOUNT ONCE / HAUNT FOREVER&quot; (3 cráneos en pared charcoal, aplique de hierro con Edison + brújula de bronce) · M2 Macro (2 cráneos 3/4, luz rasante, sin texto) · M3 Buyer-Persona (mujer leyendo en cama, 3 cráneos sobre el cabecero) · M4 Room Carousel (habitaciones, split &quot;AN EMPTY WALL&quot; → styled) · M5 Regimen 3 estados: IT STARTS WITH [skulls] ON THE WALL → ADD THE FLAME → AND IGNITE THE SHADOW · SANCTUARY COMPLETE · M6 Close &quot;INHABIT YOUR SHADOW&quot; (colección completa + LMP encendida). Los módulos B1–B7 de abajo (corrientes two-panel) fueron el plan direccional y NO se produjeron así; se actualizaron B1/B7 al contenido real y el resto queda como referencia.
            </TwoPanelNote>

            {/* B1 */}
            <ModuleCard id="ws-b1" moduleId="B1" title="Hero — Mount Once"
              size="960×300" badge="Imagen final" status="ready">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena (imagen final M1)</FieldLabel>
                  <FieldValue>
                    3 cráneos montados en pared charcoal mate. Aplique de hierro forjado con bombillo Edison encendido en la zona superior-izquierda (única luz cálida) + brújula de bronce sobre la consola oscura debajo. Sombras de contacto profundas. Fondo near-black.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — texto embebido en imagen. No usar campos de texto de Amazon.</FieldValue>
                  <PaletteRow swatches={palBW} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido (imagen final)">
                <TextLine>MOUNT ONCE — copper, serif</TextLine>
                <TextLine>HAUNT FOREVER — cream, serif</TextLine>
              </TextBlock>
              <MoodTag>Cinematográfico · gótico premium · editorial oscuro</MoodTag>
            </ModuleCard>

            {/* B2 */}
            <ModuleCard id="ws-b2" moduleId="B2" title="Buyer Persona"
              size="960×300" badge="En producción" status="ready">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo (FP · 16:9)</FieldLabel>
                  <FieldValue>
                    Habitación real con paredes charcoal o gris profundo. Cama oscura o sofá parcialmente visible. Una lámpara o vela encendida como luz principal (2400K). Uno o dos libros en superficie cercana. Los 3 skull pieces montados en la pared del fondo — pequeños, integrados como arte permanente. Mujer de espaldas o tres-cuartos en el fondo, mirando los skulls. Sin cara visible. Piel ivory, cabello castaño oscuro, top negro manga larga. Figura ligeramente defocused.
                  </FieldValue>
                  <SpecsLine style={{ marginTop:'0.5rem' }}>Generar en FP: 16:9 landscape</SpecsLine>
                </div>
                <div>
                  <FieldLabel>Paleta</FieldLabel>
                  <PaletteRow swatches={palBWL} />
                </div>
              </ModuleBody>
              <AlvaroBlock title="Para Álvaro — Cómo armar esta imagen">
                <div style={{ marginBottom:'0.75rem', color:'rgba(var(--fg-rgb),0.7)',
                  fontFamily: font.josefin, fontSize:'0.72rem', letterSpacing:'0.1em' }}>
                  Amazon recibe <strong style={{ color: C.cream }}>una sola imagen de 960×300px</strong>. Álvaro la arma completa en Canva o PS y la sube. El texto va dentro de la imagen — no en los campos de texto de Amazon.
                </div>
                <AlvaroRow>
                  <span>1. Con la imagen de la carpeta, crear una composición <strong style={{ color: C.cream }}>960×300px</strong> (escalado al doble)</span>
                  <span>Export: <strong style={{ color: C.cream }}>JPG</strong></span>
                </AlvaroRow>
                <AlvaroRow>
                  <span>2. Zona izquierda (0 a 576px): pegar imagen, escalar para llenar exactamente ese espacio</span>
                </AlvaroRow>
                <AlvaroRow>
                  <span>3. Zona derecha (576 a 960px): rectángulo sólido color <strong style={{ color: C.cream }}>var(--bg)</strong></span>
                </AlvaroRow>
                <AlvaroRow>
                  <span>4. En el borde entre ambas zonas (en 576px): línea vertical <strong style={{ color: C.cream }}>1–2px, color var(--copper-bright)</strong></span>
                </AlvaroRow>
                <AlvaroRow>
                  <span>5. Dentro de la zona derecha, texto centrado:</span>
                </AlvaroRow>
                <AlvaroTextSample />
              </AlvaroBlock>
              <MoodTag>Íntimo · sofisticado · "este es el hogar de alguien real"</MoodTag>
            </ModuleCard>

            {/* B3 */}
            <ModuleCard id="ws-b3" moduleId="B3" title="Materiales"
              size="960×600" badge="Prompt aprobado" status="ready">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena</FieldLabel>
                  <FieldValue>
                    Objeto montado sobre pared vertical negra, cámara a 60–70° izquierda del eje frontal (ángulo tres cuartos posterior). Eje vertical alineado a la gravedad. La apertura frontal apunta hacia la derecha y se aleja de la cámara. El objeto sangra por bordes superior, izquierdo e inferior. Borde derecho con espacio visible. Luz rasante 2200K desde la derecha, 45° altura. Polyresin negro mate, sin reflejos. Negros RGB 15–25. DSLR fotorrealista.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Standard Single Image Highlights</FieldValue>
                  <PaletteRow swatches={palBW} />
                </div>
              </ModuleBody>
              <AlvaroBlock title="Prompt aprobado — usar @creation #134 como ref">
                <div style={{ fontFamily: font.basilia, fontSize:'0.78rem',
                  color:'rgba(var(--fg-rgb),0.6)', lineHeight:1.7, marginBottom:'0.75rem' }}>
                  @creation #134 como referencia 100% del objeto — cero desviación en forma, textura y acabado negro mate, proporciones absolutamente idénticas. El objeto está montado sobre una pared vertical negra, la cara trasera totalmente plana en contacto uniforme con la superficie. El objeto se presenta erecto, eje vertical perfectamente alineado con la gravedad. La cámara está posicionada a la izquierda del eje frontal del objeto, aproximadamente a 60–70°, en un ángulo tres cuartos posterior. La apertura frontal del objeto apunta hacia la derecha del encuadre y se aleja de la cámara. Solo la superficie lateral izquierda y la cúpula superior quedan visibles. Zoom cercano — el objeto sangra por el borde superior, el izquierdo y el inferior. El borde derecho queda con espacio — la apertura frontal y la pared visibles. Iluminación rasante desde la derecha, 45° de altura, 2200K cálido. Polyresin negro mate, sin reflejos especulares. Negros RGB 15–25. Calidad macro fotorrealista DSLR, nitidez extrema.
                </div>
                <AlvaroRow>
                  <span>Generar en FP: <strong style={{ color: C.cream }}>4:3 o 1:1</strong></span>
                  <span>Álvaro extiende a <strong style={{ color: C.cream }}>960×600</strong></span>
                </AlvaroRow>
              </AlvaroBlock>
              <TextBlock label="Callouts embebidos — líneas copper (3 máximo)">
                <CalloutList items={[
                  'Matte polyresin — solid, dense weight',
                  'Hand-finished. No two identical.',
                  'Hardware included',
                ]} />
              </TextBlock>
              <MoodTag>Justificación de precio · "esto vale lo que cuesta"</MoodTag>
            </ModuleCard>

            {/* B4 */}
            <ModuleCard id="ws-b4" moduleId="B4" title="Intro Corrientes"
              size="960×600" badge="En iteración" status="iterando">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena — Whimsigoth</FieldLabel>
                  <FieldValue>
                    Habitación Whimsigoth real: paredes verde bosque oscuro. Tres skull pieces montados en la pared, cada uno al 4% de altura del frame. Repisa debajo con vela encendida, dos cristales de cuarzo y flores secas. Espejo ornamentado antiguo a la derecha. Luces de hada doradas a la izquierda. Cortina de encaje oscuro borde derecho. Terciopelo dusty purple borde inferior. Ventana al fondo con árbol oscuro y misterioso visible en la noche. Iluminación: ámbar de vela, dorado de hada, azul-fría de luna difusa. Ambiente oscuro con sombras profundas. Composición 16:9.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — posición del texto a criterio del diseñador. Sugerencia: viñeta oscura difuminada en la parte inferior de la imagen, texto posicionado en el tercio inferior.</FieldValue>
                  <PaletteRow swatches={palOverlay} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido — criterio del diseñador · sugerencia: viñeta inferior difuminada">
                <TextLine>Darkness is not one thing.</TextLine>
                <TextLine sub>It has textures, rituals, families.</TextLine>
                <SpecsLine style={{ marginTop:'0.5rem' }}>Cinzel 700 primera línea · IMFell italic segunda</SpecsLine>
              </TextBlock>
              <MoodTag>Editorial · transición — como dar vuelta la página de un lookbook</MoodTag>
            </ModuleCard>

            {/* B5 */}
            <ModuleCard id="ws-b5" moduleId="B5" title="Gótico Victoriano + Pastel Goth"
              size="960×600" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo — Victoriano</FieldLabel>
                  <FieldValue>
                    Salón oscuro, marcos ornamentados, terciopelo, candelabros. Skull pieces integrados en la pared como arte arquitectónico. Tonos: burdeos + negro + dorado envejecido. Muy formal, opulento.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Panel derecho — Pastel Goth</FieldLabel>
                  <FieldValue>
                    Dormitorio moderno — lavanda-gris oscuro, elementos cute-macabros, calaveras en tonos pastel. Skull pieces en la pared. Más joven, internet-era.
                  </FieldValue>
                </div>
              </ModuleBody>
              <TwoPanelNote>
                <strong style={{ color: C.copper }}>Two-panel:</strong> Dos paneles verticales ~480×600 c/u · divisor copper fino en el centro
                <br />
                Texto debajo: "VICTORIAN GOTHIC" / "PASTEL GOTH" — Cinzel 400, cream, letter-spacing amplio
              </TwoPanelNote>
              <MoodTag>Contraste deliberado — el espectro de la oscuridad tiene extremos</MoodTag>
            </ModuleCard>

            {/* B6 */}
            <ModuleCard id="ws-b6" moduleId="B6" title="Trad Goth + Southern Gothic"
              size="960×600" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo — Trad Goth</FieldLabel>
                  <FieldValue>
                    Pared de concreto o ladrillo, arte dark minimal. Skull pieces montados como statement arquitectónico. Estética DIY/post-punk. Muy oscuro, crudo, sin adornos.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Panel derecho — Southern Gothic</FieldLabel>
                  <FieldValue>
                    Madera envejecida, pintura descascarada, flores secas, luz cálida oscura (sepia-burdeos). Skull pieces sobre la pared deteriorada. Riqueza en descomposición elegante.
                  </FieldValue>
                </div>
              </ModuleBody>
              <TwoPanelNote>
                <strong style={{ color: C.copper }}>Two-panel:</strong> Igual estructura que B5 · divisor copper · izquierda near-black frío / derecha near-black cálido
                <br />
                Texto debajo: "TRAD GOTH" / "SOUTHERN GOTHIC" — Cinzel 400, cream
              </TwoPanelNote>
              <MoodTag>Las dos estéticas más crudas — comparten energía decadente</MoodTag>
            </ModuleCard>

            {/* B7 */}
            <ModuleCard id="ws-b7" moduleId="B7" title="Cross-sell — The Collection"
              size="960×300" badge="Imagen final" status="ready">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena</FieldLabel>
                  <FieldValue>
                    Los 3 productos {identity.name} en repisa gótica curada (imagen final M6): los 3 wall skulls montados, skull + spine candles y votivas encendidos al frente, y la Skull Lamp encendida proyectando el cráneo. Props: póster anatómico &quot;Human Skeleton&quot;, guantes de cuero, sextante de bronce, cristales de amatista/pirita. Cada producto legible.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — imagen full, sin campos de texto de Amazon.</FieldValue>
                  <PaletteRow swatches={palB7} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido (imagen final)">
                <TextLine>INHABIT YOUR SHADOW — cream, serif, centrado</TextLine>
              </TextBlock>
              <MoodTag>Editorial de marca · "el universo completo"</MoodTag>
            </ModuleCard>

          </ProductSection>

          {/* ══════════════ SKULL CANDLE SET ══════════════ */}
          <ProductSection
            id="skull-candle"
            label="CND"
            title="Skull Candle Set"
            meta="Set de 4 piezas · Genuine black paraffin · Standard A+ (plan original — superado)"
          >

            <TwoPanelNote>
              <strong style={{ color: C.copper }}>Nota — plan superado por el A+ Premium.</strong> El A+ de CND que se produjo/shippeó es la serie Premium M1–M6 (ver sección &quot;CND — Premium A+&quot; más abajo): Hero &quot;THE RITUAL BEGINS&quot;, Video, Hotspots, Room Carousel (8 slides), Regimen Carousel (3 estados) y Close &quot;INHABIT YOUR SHADOW&quot;. Estos módulos B1–B7 (Standard, con corrientes Whimsigoth / Victorian+Pastel / Trad+Southern) quedaron como plan direccional y NO son la serie final. Se conservan como referencia.
            </TwoPanelNote>

            {/* CND B1 */}
            <ModuleCard id="cnd-b1" moduleId="B1" title="Hero oscuro + logo"
              size="960×300" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena</FieldLabel>
                  <FieldValue>
                    Skull Candle Set sobre superficie oscura (mármol negro o madera envejecida). Única fuente de luz dramática desde arriba — la llama ilumina los contornos del cráneo y crea sombras profundas. Fondo near-black (var(--bg)). Las cuencas del ojo tienen un brillo tenue.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — texto embebido en imagen. No usar campos de texto de Amazon.</FieldValue>
                  <PaletteRow swatches={[{ hex:'var(--bg)', label:'fondo' }, { hex:'var(--fg)', label:'logo' }, { hex:'var(--copper-bright)', label:'acento llama' }]} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido">
                <TextLine>Logo {identity.name} — centrado, cream</TextLine>
                <TextLine sub>INHABIT YOUR SHADOW. — Josefin Sans tiny, debajo del logo</TextLine>
              </TextBlock>
              <MoodTag>Cinematográfico · ritualístico · horror de lujo</MoodTag>
            </ModuleCard>

            {/* CND B2 */}
            <ModuleCard id="cnd-b2" moduleId="B2" title="Buyer Persona"
              size="960×300" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo (~60%) — Standard Single Right Image</FieldLabel>
                  <FieldValue>
                    Interior oscuro y curado — estantería con cráneos, velas encendidas ({identity.name}), plantas oscuras, libros. Se ve que es el hogar real de alguien, no decoración de Halloween. Composición íntima, luz cálida de vela dominante.
                  </FieldValue>
                  <SpecsLine style={{ marginTop:'0.5rem' }}>Split horizontal · izquierda ~60% imagen · derecha ~40% fondo negro</SpecsLine>
                </div>
                <div>
                  <FieldLabel>Paleta</FieldLabel>
                  <PaletteRow swatches={palBWL} />
                </div>
              </ModuleBody>
              <AlvaroBlock title="Para Álvaro — Texto lado derecho (fondo negro)">
                <AlvaroRow>
                  <span>Línea separadora copper entre panel imagen y panel negro</span>
                </AlvaroRow>
                <AlvaroTextSample />
                <AlvaroRow>
                  <span>Cinzel 400 · color cream · centrado vertical en zona derecha</span>
                </AlvaroRow>
              </AlvaroBlock>
              <MoodTag>Íntimo · sofisticado · "este es el hogar de alguien real"</MoodTag>
            </ModuleCard>

            {/* CND B3 */}
            <ModuleCard id="cnd-b3" moduleId="B3" title="Detalles / Materiales"
              size="960×600" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena</FieldLabel>
                  <FieldValue>
                    Close-ups del Skull Candle Set mostrando calidad material. Una vela skull encendida (wax pool visible) + una sin encender mostrando textura escultórica y detalle anatómico (suturas craneales, pómulos, mandíbula). Superficie de piedra o madera oscura. Luz suave pero direccional.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Standard Single Image Highlights</FieldValue>
                  <PaletteRow swatches={palBW} />
                </div>
              </ModuleBody>
              <TextBlock label="Callouts embebidos — líneas copper (máx 5)">
                <CalloutList items={[
                  '100% paraffin wax',
                  'True black — no degrade',
                  'Hand-finished detail',
                  'Skull burns 12 hrs · Spine burns 6 hrs',
                  'Pine & Moss Scent — aromatic',
                ]} />
              </TextBlock>
              <MoodTag>Calidad de producto · artesanía · lujo material</MoodTag>
            </ModuleCard>

            {/* CND B4 */}
            <ModuleCard id="cnd-b4" moduleId="B4" title="Intro Corrientes — Whimsigoth"
              size="960×600" badge="Imagen lista" status="ready">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena — Whimsigoth</FieldLabel>
                  <FieldValue>
                    Skull Candle Set (pillar, spine taper, 2 tealights) sobre superficie de madera oscura en primer plano, los cuatro encendidos. Reloj victoriano con ornamentos oscuros junto al set. Dos cristales de cuarzo y flores secas en vaso. Paredes verde bosque oscuro. Cortina de encaje borde izquierdo. Luces de hada irregulares al fondo. Humo fino visible. Planta colgante borde superior. Terciopelo dusty purple borde inferior. Azul-fría de luna difusa desde ventana. Ambiente oscuro, sombras profundas — ámbar dominante. 16:9.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — posición del texto a criterio del diseñador. Sugerencia: viñeta oscura difuminada en la parte inferior de la imagen, texto posicionado en el tercio inferior.</FieldValue>
                  <PaletteRow swatches={palOverlay} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido — igual que SWD">
                <TextLine>Darkness is not one thing.</TextLine>
                <TextLine sub>It has textures, rituals, families.</TextLine>
                <SpecsLine style={{ marginTop:'0.5rem' }}>Cinzel 700 primera línea · IMFell italic segunda</SpecsLine>
              </TextBlock>
              <MoodTag>Editorial · transición — mismo módulo que SWD, misma voz de marca</MoodTag>
            </ModuleCard>

            {/* CND B5 */}
            <ModuleCard id="cnd-b5" moduleId="B5" title="Gótico Victoriano + Pastel Goth"
              size="960×600" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo — Gótico Victoriano</FieldLabel>
                  <FieldValue>
                    Salón oscuro, marcos ornamentados, terciopelo, candelabros con Skull Candles. Tonos profundos: burdeos + negro + dorado envejecido. Muy formal, opulento. Skull Candle Set como pieza central de la composición.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Panel derecho — Pastel Goth</FieldLabel>
                  <FieldValue>
                    Dormitorio moderno — fondo lavanda-gris oscuro, elementos cute-macabros, calaveras en tonos pastel, ropa negra drapeada. Skull Candles encendidas. Más joven, internet-era, lúdico pero oscuro.
                  </FieldValue>
                </div>
              </ModuleBody>
              <TwoPanelNote>
                <strong style={{ color: C.copper }}>Two-panel:</strong> Dos paneles verticales ~480×600 c/u · divisor copper fino en el centro
                <br />
                Texto debajo: "VICTORIAN GOTHIC" / "PASTEL GOTH" — Cinzel 400, cream, letter-spacing amplio
              </TwoPanelNote>
              <MoodTag>Contraste deliberado — el espectro de la oscuridad tiene extremos</MoodTag>
            </ModuleCard>

            {/* CND B6 */}
            <ModuleCard id="cnd-b6" moduleId="B6" title="Trad Goth + Southern Gothic"
              size="960×600" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo — Batcave / Trad Goth</FieldLabel>
                  <FieldValue>
                    Pared de concreto o ladrillo, arte dark minimal, iluminación stark. Skull Candles sobre madera cruda o metal. Estética DIY/post-punk con intención. Muy oscuro, crudo, sin adornos.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Panel derecho — Southern Gothic</FieldLabel>
                  <FieldValue>
                    Madera envejecida, pintura descascarada, flores secas, luz cálida oscura (tonos sepia-burdeos). La decadencia del Sur estadounidense filtrada por lo oscuro. Skull Candles sobre superficie gastada. Riqueza en descomposición elegante.
                  </FieldValue>
                </div>
              </ModuleBody>
              <TwoPanelNote>
                <strong style={{ color: C.copper }}>Two-panel:</strong> Igual estructura que B5 · divisor copper · izquierda near-black frío / derecha near-black cálido
                <br />
                Texto debajo: "TRAD GOTH" / "SOUTHERN GOTHIC" — Cinzel 400, cream
              </TwoPanelNote>
              <MoodTag>Las dos estéticas más crudas — comparten energía decadente</MoodTag>
            </ModuleCard>

            {/* CND B7 */}
            <ModuleCard id="cnd-b7" moduleId="B7" title="Cross-sell — The Collection"
              size="960×300" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena</FieldLabel>
                  <FieldValue>
                    Los 3 productos {identity.name} en una sola escena curada y oscura: Wall Skulls montados en pared (fondo), Skull Candle Set en superficie en primer plano, Skull Lamp a un lado como única fuente de luz. Composición equilibrada, cada producto legible y completo. Escena atmosférica, no catalogue shot.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — imagen full, sin campos de texto de Amazon.</FieldValue>
                  <PaletteRow swatches={palB7} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido (opcional)">
                <TextLine sub>THE COLLECTION — Cinzel pequeño, cream, esquina inferior</TextLine>
              </TextBlock>
              <MoodTag>Editorial de marca · "el universo completo"</MoodTag>
            </ModuleCard>

          </ProductSection>

          {/* ══════════════ SKULL LAMP ══════════════ */}
          <ProductSection
            id="skull-lamp"
            label="LMP"
            title="Skull Lamp"
            meta="Lámpara de mesa · Matte / Glitter / Naked (ambas veils incluidas) · Touch dimmer 3 niveles · Bombillo E26 incluido · Standard A+"
          >

            {/* LMP B1 */}
            <ModuleCard id="lmp-b1" moduleId="B1" title="Hero oscuro + logo"
              size="960×300" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena</FieldLabel>
                  <FieldValue>
                    Skull Lamp (shade matte) como única fuente de luz en la escena. Fondo near-black (var(--bg)). La lámpara encendida ilumina sutilmente la superficie y crea la shadow projection del cráneo en la pared. Sin otros props. Logo {identity.name} en zona oscura de la imagen.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — texto embebido en imagen. No usar campos de texto de Amazon.</FieldValue>
                  <PaletteRow swatches={[{ hex:'var(--bg)', label:'fondo' }, { hex:'var(--fg)', label:'logo' }, { hex:'var(--copper-bright)', label:'acento cálido' }]} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido">
                <TextLine>Logo {identity.name} — zona oscura izquierda, cream</TextLine>
                <TextLine sub>INHABIT YOUR SHADOW. — Josefin Sans tiny, debajo del logo</TextLine>
              </TextBlock>
              <MoodTag>Cinematográfico · gótico premium · la lámpara como único punto de luz</MoodTag>
            </ModuleCard>

            {/* LMP B2 */}
            <ModuleCard id="lmp-b2" moduleId="B2" title="Buyer Persona"
              size="960×300" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo (~60%) — Standard Single Right Image</FieldLabel>
                  <FieldValue>
                    Habitación real oscura y curada — Skull Lamp encendida como fuente de luz principal. Libros, cristales, flores secas. Shadow projection del cráneo visible en la pared. La persona de espaldas o tres-cuartos, mirando la lámpara. Sin cara visible. Figura ligeramente defocused.
                  </FieldValue>
                  <SpecsLine style={{ marginTop:'0.5rem' }}>Split horizontal · izquierda ~60% imagen · derecha ~40% fondo negro</SpecsLine>
                </div>
                <div>
                  <FieldLabel>Paleta</FieldLabel>
                  <PaletteRow swatches={palBWL} />
                </div>
              </ModuleBody>
              <AlvaroBlock title="Para Álvaro — Texto lado derecho (fondo negro)">
                <AlvaroRow>
                  <span>Línea separadora copper entre panel imagen y panel negro</span>
                </AlvaroRow>
                <AlvaroTextSample />
                <AlvaroRow>
                  <span>Cinzel 400 · color cream · centrado vertical en zona derecha</span>
                </AlvaroRow>
              </AlvaroBlock>
              <MoodTag>Íntimo · sofisticado · "este es el hogar de alguien real"</MoodTag>
            </ModuleCard>

            {/* LMP B3 */}
            <ModuleCard id="lmp-b3" moduleId="B3" title="Detalles / Materiales"
              size="960×600" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena</FieldLabel>
                  <FieldValue>
                    Close-up del Skull Lamp mostrando calidad de construcción: cage metálico, detalle de cráneo escultórico, filamento Edison visible, base sólida. Ángulo tres cuartos posterior — cámara a 60–70° del eje frontal mostrando estructura interna. Superficie y pared charcoal oscuras. Luz rasante.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Standard Single Image Highlights</FieldValue>
                  <PaletteRow swatches={palBW} />
                </div>
              </ModuleBody>
              <TextBlock label="Callouts embebidos — líneas copper (máx 3)">
                <CalloutList items={[
                  'Solid base + geometric metal shade frame',
                  'Touch dimmer — 3 levels: Soft / Medium / High',
                  'E26 bulb included · Both Veils Included (Matte + Glitter) + Naked cage',
                ]} />
              </TextBlock>
              <MoodTag>Justificación de precio · "esto vale lo que cuesta"</MoodTag>
            </ModuleCard>

            {/* LMP B4 */}
            <ModuleCard id="lmp-b4" moduleId="B4" title="Intro Corrientes — Whimsigoth"
              size="960×600" badge="Imagen lista" status="ready">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena — Whimsigoth (shade matte · @mate)</FieldLabel>
                  <FieldValue>
                    Skull Lamp (shade matte encendido, glow difuso cálido) sobre mesa de noche de madera ebonizada oscura en primer plano. Junto a la lámpara: libro antiguo de cuero oscuro abierto, cristal de cuarzo, flores secas en vaso, frasco oscuro, dos velas apagadas. Paredes verde bosque oscuro. Luces de hada irregulares en pared detrás. Cortina de encaje borde izquierdo. Planta colgante borde superior. Terciopelo dusty purple borde inferior. Azul-fría de luna difusa desde la derecha. Ambiente oscuro, sombras profundas. 16:9.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — posición del texto a criterio del diseñador. Sugerencia: viñeta oscura difuminada en la parte inferior de la imagen, texto posicionado en el tercio inferior.</FieldValue>
                  <PaletteRow swatches={palOverlay} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido — igual que SWD">
                <TextLine>Darkness is not one thing.</TextLine>
                <TextLine sub>It has textures, rituals, families.</TextLine>
                <SpecsLine style={{ marginTop:'0.5rem' }}>
                  Cinzel 700 primera línea · IMFell italic segunda · Shade: sin skull projections en pared (modo matte)
                </SpecsLine>
              </TextBlock>
              <MoodTag>Editorial · transición — mismo módulo que SWD, misma voz de marca</MoodTag>
            </ModuleCard>

            {/* LMP B5 */}
            <ModuleCard id="lmp-b5" moduleId="B5" title="Gótico Victoriano + Pastel Goth"
              size="960×600" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo — Gótico Victoriano</FieldLabel>
                  <FieldValue>
                    Salón oscuro, marcos ornamentados, terciopelo, candelabros. Skull Lamp encendida como pieza central sobre consola o repisa ornamentada. Shadow projection del cráneo sobre pared con damasco. Tonos: burdeos + negro + dorado envejecido. Muy formal, opulento.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Panel derecho — Pastel Goth</FieldLabel>
                  <FieldValue>
                    Mesa de noche moderna — fondo lavanda-gris oscuro, elementos cute-macabros. Skull Lamp encendida, shadow projection en pared lisa. Estética más joven, internet-era, lúdica pero oscura.
                  </FieldValue>
                </div>
              </ModuleBody>
              <TwoPanelNote>
                <strong style={{ color: C.copper }}>Two-panel:</strong> Dos paneles verticales ~480×600 c/u · divisor copper fino en el centro
                <br />
                Texto debajo: "VICTORIAN GOTHIC" / "PASTEL GOTH" — Cinzel 400, cream, letter-spacing amplio
              </TwoPanelNote>
              <MoodTag>Contraste deliberado — el espectro de la oscuridad tiene extremos</MoodTag>
            </ModuleCard>

            {/* LMP B6 */}
            <ModuleCard id="lmp-b6" moduleId="B6" title="Trad Goth + Southern Gothic"
              size="960×600" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Panel izquierdo — Batcave / Trad Goth</FieldLabel>
                  <FieldValue>
                    Pared de concreto o ladrillo, arte dark minimal. Skull Lamp sobre superficie cruda (metal o madera sin tratar). Shadow projection del cráneo clara sobre pared clara-oscura. Estética DIY/post-punk. Muy oscuro, sin adornos.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Panel derecho — Southern Gothic</FieldLabel>
                  <FieldValue>
                    Madera envejecida, pintura descascarada, flores secas. Skull Lamp sobre superficie gastada. Shadow projection en pared deteriorada. Luz cálida oscura (sepia-burdeos). Riqueza en descomposición elegante.
                  </FieldValue>
                </div>
              </ModuleBody>
              <TwoPanelNote>
                <strong style={{ color: C.copper }}>Two-panel:</strong> Igual estructura que B5 · divisor copper · izquierda near-black frío / derecha near-black cálido
                <br />
                Texto debajo: "TRAD GOTH" / "SOUTHERN GOTHIC" — Cinzel 400, cream
              </TwoPanelNote>
              <MoodTag>Las dos estéticas más crudas — comparten energía decadente</MoodTag>
            </ModuleCard>

            {/* LMP B7 */}
            <ModuleCard id="lmp-b7" moduleId="B7" title="Cross-sell — The Collection"
              size="960×300" badge="Pendiente" status="pending">
              <ModuleBody>
                <div>
                  <FieldLabel>Escena</FieldLabel>
                  <FieldValue>
                    Los 3 productos {identity.name} en una sola escena curada y oscura: Wall Skulls montados en pared (fondo), Skull Candle Set sobre superficie en primer plano, Skull Lamp como única fuente de luz activa de la escena. Composición equilibrada, cada producto legible. Escena atmosférica, no catalogue shot.
                  </FieldValue>
                </div>
                <div>
                  <FieldLabel>Módulo Amazon</FieldLabel>
                  <FieldValue>Header Image with Text — imagen full, sin campos de texto de Amazon.</FieldValue>
                  <PaletteRow swatches={palB7} />
                </div>
              </ModuleBody>
              <TextBlock label="Texto embebido (opcional)">
                <TextLine sub>THE COLLECTION — Cinzel pequeño, cream, esquina inferior</TextLine>
              </TextBlock>
              <MoodTag>Editorial de marca · "el universo completo"</MoodTag>
            </ModuleCard>

          </ProductSection>

        {/* ═══════════════════════ BRAND STORY V2 ═══════════════════════ */}
        <ProductSection id="brand-story" label="Brand Story" title="From the Brand — V2"
          meta="8 cards · Divididos module · 332×364 px · Amazon Brand Story">

          <ModuleCard id="bs-card1" moduleId="C1" title={`Brand Card — ${identity.name}`}
            size="332×364" badge="Manual Python" status="pending">
            <ModuleBody>
              <div>
                <FieldLabel>Escena</FieldLabel>
                <FieldValue>Fondo negro var(--bg) + patrón geométrico de triángulos en cobre (muy sutil) + `${identity.name}` en MADE Mirage centrado + "Inhabit your shadow." en copper debajo.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy Amazon</FieldLabel>
                <FieldValue>Headline: {identity.name} · Body: Gothic home decor for the ones who arrange the darkness with intention. · CTA: Inhabit your shadow.</FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>Única card sin producto — establece el tono antes de mostrar cualquier pieza</MoodTag>
          </ModuleCard>

          <ModuleCard id="bs-card2" moduleId="C2" title="Skull Lamp — Shadow Moment"
            size="332×364" badge="FP @Naked Front" status="pending">
            <ModuleBody>
              <div>
                <FieldLabel>Prompt FP</FieldLabel>
                <FieldValue>@Naked Front exactly as provided — do not alter, reinterpret, rotate, zoom, or reframe anything. Change only: replace background with dark charcoal painted wall, replace surface with dark ebonized wood console. Deeply underexposed ambient, heavy vignette, gothic sanctuary.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy Amazon</FieldLabel>
                <FieldValue>Headline: Skull Lamp · Body: One touch. Skull shadow on your wall. · CTA: Shop →</FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>La sombra del cráneo es el producto — @Naked Front la genera automáticamente</MoodTag>
          </ModuleCard>

          <ModuleCard id="bs-card3" moduleId="C3" title="Skull Candle Set — Fire"
            size="332×364" badge="FP @CND - Skull" status="pending">
            <ModuleBody>
              <div>
                <FieldLabel>Prompt FP</FieldLabel>
                <FieldValue>@CND - Skull como referencia — cero desviación, ultra detallado, textura hiperrealista, nitidez extrema, reproducción exacta de color. @CND - Skull sobre superficie de piedra oscura envejecida, vela encendida, llama activa dominando el frame, humo fino sobre la llama, cráneo visible con detalle extremo. Encuadre cercano vertical. Pared charcoal near-black al fondo fuera de foco. Luz ámbar cálida de la llama como única fuente. Ambiente oscuro ritual. Fotorrealista.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy Amazon</FieldLabel>
                <FieldValue>Headline: Skull Candle Set · Body: The ritual begins. · CTA: Shop →</FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>Close-up de una sola vela — llama dominante</MoodTag>
          </ModuleCard>

          <ModuleCard id="bs-card4" moduleId="C4" title="Wall Skull Decor — In Situ"
            size="332×364" badge="FP @SWD" status="pending">
            <ModuleBody>
              <div>
                <FieldLabel>Prompt FP</FieldLabel>
                <FieldValue>@SWD mounted flat against a smooth charcoal matte-painted wall, asymmetric arrangement at varying heights. Camera frontal, straight-on. The flat rear surface of each object is completely in contact with the wall — adhered flush, zero gap, no floating. Each object casts a tight contact shadow directly onto the wall surface. Lateral raking light from the left. Deeply underexposed ambient, heavy vignette, gothic permanent installation. Photorealistic.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy Amazon</FieldLabel>
                <FieldValue>Headline: Wall Skull Decor · Body: Mount once. Haunt forever. · CTA: Shop →</FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>Ancla de contacto obligatoria — sin ella los skulls flotan</MoodTag>
          </ModuleCard>

          <ModuleCard id="bs-card5" moduleId="C5" title="Skull Lamp — Detail"
            size="332×364" badge="FP @Naked Front" status="pending">
            <ModuleBody>
              <div>
                <FieldLabel>Prompt FP</FieldLabel>
                <FieldValue>@Naked Front on dark ebonized stone slab — close-up detail composition, geometric skull cage metalwork dominant in frame, lateral raking light from upper left revealing the precision cut of the metal, near-black matte background, no shadow projection, gothic product detail shot.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy Amazon</FieldLabel>
                <FieldValue>Headline: Skull Lamp · Body: Geometric metalwork. Three brightness levels. E26 smart bulb ready. · CTA: Shop →</FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>Sin "exactly as provided" — FP recompone para close-up del shade</MoodTag>
          </ModuleCard>

          <ModuleCard id="bs-card6" moduleId="C6" title="Skull Candle Set — Altar"
            size="332×364" badge="FP @CND" status="pending">
            <ModuleBody>
              <div>
                <FieldLabel>Prompt FP</FieldLabel>
                <FieldValue>@CND como referencia — cero desviación, ultra detallado, textura hiperrealista, nitidez extrema, reproducción exacta de color. @CND sobre cómoda de madera oscura, los cuatro encendidos. Cámara a 0.3m de distancia del set, altura baja casi al nivel del set, ángulo casi horizontal — el set ocupa la mayor parte del frame. Junto al set: llave de hierro antigua; pétalos de rosa secos esparcidos; libro de tapa oscura parcialmente abierto. Paño de terciopelo burdeos debajo del set. Luz cálida ámbar de las cuatro velas — única fuente de llama. Humo fino. Ambiente oscuro y acogedor. Fotorrealista.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy Amazon</FieldLabel>
                <FieldValue>Headline: Skull Candle Set · Body: 100% paraffin. True black. Hand-finished detail. · CTA: Shop →</FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>Set completo en composición de altar — cámara a 0.3m, más cerca que en A+</MoodTag>
          </ModuleCard>

          <ModuleCard id="bs-card7" moduleId="C7" title="Wall Skull Decor — Detail"
            size="332×364" badge="FP @SWD C1 (image)" status="pending">
            <ModuleBody>
              <div>
                <FieldLabel>Prompt FP</FieldLabel>
                <FieldValue>@SWD C1 (image) extreme close-up, lateral raking light from the left revealing skull volume and anatomical surface detail — orbital sockets, suture lines, surface texture. Dark bokeh background, near-black. Single warm point of lateral light. Deeply underexposed ambient, gothic artisan quality. Photorealistic.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy Amazon</FieldLabel>
                <FieldValue>Headline: Wall Skull Decor · Body: Anatomical detail. Permanent installation. Drill once. · CTA: Shop →</FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>Alternar entre @SWD C1, C2, C3 según calidad del resultado</MoodTag>
          </ModuleCard>

          <ModuleCard id="bs-card8" moduleId="C8" title="Complete the Sanctuary"
            size="332×364" badge="FP 3 productos" status="pending">
            <ModuleBody>
              <div>
                <FieldLabel>Prompt FP</FieldLabel>
                <FieldValue>@swd on the back wall centered, viewed at 4-5 meters, each object ~8% of frame height. Clean charcoal wall with only @swd. @cnd exactly as shown on a raw dark-stained wood console in the foreground, centered. Candles gently lit — soft warm amber glow. @Mate on the same console to the right of @cnd, lamp softly glowing. Camera frontal at console height, shallow DOF. Setting: charcoal wall, dark console, fairy lights out of focus, dark floor. Lighting: 2400K tungsten + candlelight, vignette. Trad Goth + Whimsigoth, photorealistic.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy Amazon</FieldLabel>
                <FieldValue>Headline: Complete the Sanctuary · Body: Three objects. One philosophy. Built to last. · CTA: Shop the Collection →</FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>Adaptado del B7-A aprobado — ratio 1:1 en vez de 4:1</MoodTag>
          </ModuleCard>

        </ProductSection>

        {/* ══════════════ PREMIUM A+ — CND (Skull Candle Set) ══════════════ */}
        <ProductSection
          id="premium-cnd"
          label="CND — Premium A+"
          title="Skull Candle Set — Premium A+"
          meta={`7 módulos · reemplaza Dual/Four Images por Hotspots, Regimen Carousel y Q&A · Space Magnific &quot;${identity.name}&quot;, página &quot;CND A+&quot;`}
        >

          <ModuleCard id="pcnd-m1" moduleId="M1" title="Hero" size="1464×600 (~21:9)" badge="Aprobado" status="ready">
            <ModuleBody>
              <div>
                <FieldLabel>Escena</FieldLabel>
                <FieldValue>
                  Candle set completo (calavera + columna + 2 tealights) sobre mesa de roble ebonizado, pared de yeso charcoal mate detrás. Horizonte en el tercio inferior. Llama 1800K como única fuente de luz, subsurface scattering en la cera, vasto espacio negativo arriba para el headline. Chiaroscuro con viñeta negra en las 4 esquinas.
                </FieldValue>
              </div>
              <div>
                <FieldLabel>Copy (se agrega en Photoshop, no horneado)</FieldLabel>
                <FieldValue>Headline: THE RITUAL BEGINS. — sin subtexto. (INHABIT YOUR SHADOW se movió al módulo de cierre M6.)</FieldValue>
                <PaletteRow swatches={palBW} />
              </div>
            </ModuleBody>
            <TwoPanelNote>Mobile 600×450 generado y pendiente de aprobación final — misma escena, recompuesta vertical.</TwoPanelNote>
            <MoodTag>Editorial oscuro · Rembrandt desde arriba-izquierda · macro 100mm f/2.8</MoodTag>
          </ModuleCard>

          <ModuleCard id="pcnd-m2" moduleId="M2" title="Video — El Ritual" badge="Aprobado" status="ready">
            <ModuleBody>
              <div>
                <FieldLabel>Formato</FieldLabel>
                <FieldValue>1 MP4 + 1 thumbnail. Pipeline propio en la página &quot;CND Vid 3 — El Ritual&quot; del Space.</FieldValue>
              </div>
              <div>
                <FieldLabel>Thumbnail (imagen final M2)</FieldLabel>
                <FieldValue>Macro dramático de un skull candle con mecha encendida, glow cálido sobre la superficie agrietada, fondo negro sólido. Sin texto overlay.</FieldValue>
              </div>
            </ModuleBody>
          </ModuleCard>

          <ModuleCard id="pcnd-m3" moduleId="M3" title="Hotspots — Anatomía del set" size="Desktop 1464×600 + 6 mobile 600×450" badge="6/6 completo" status="ready">
            <ModuleBody>
              <div>
                <FieldLabel>Concept</FieldLabel>
                <FieldValue>Set completo plano/3-cuartos sobre superficie oscura, 6 puntos interactivos (hover desktop / swipe mobile).</FieldValue>
              </div>
              <div>
                <FieldLabel>Desktop</FieldLabel>
                <FieldValue>Edición manual de Frank (&quot;Premium Hotspot CND 1&quot;) — texto de la tapa de la caja ya resuelto.</FieldValue>
              </div>
            </ModuleBody>
            <TextBlock label="Copy de los 6 hotspots">
              <TextLine sub>1. Skull candle — True black. Not grey. 4.53&quot; × 3.39&quot;.</TextLine>
              <TextLine sub>2. Spine candle — The spine burns too. ~10&quot; of sculptural wax.</TextLine>
              <TextLine sub>3. Tealights ×2 — Two tealights to set the altar.</TextLine>
              <TextLine sub>4. {identity.name} box — Premium box. A gift that speaks first.</TextLine>
              <TextLine sub>5. Aroma — Pine, wet moss, dark earth.</TextLine>
              <TextLine sub>6. Material — Premium vegetal wax. ASTM F2417 + F2058.</TextLine>
            </TextBlock>
            <MoodTag>Macro 100mm f/5.6 · Caso B (piezas apagadas) para consistencia con el hero del módulo</MoodTag>
          </ModuleCard>

          <ModuleCard id="pcnd-m4" moduleId="M4" title="Room Carousel — Corrientes y espacios" size="Desktop 1464×600 + mobile 600×450 · 8 slides" badge="Aprobado" status="ready">
            <ModuleBody>
              <div>
                <FieldLabel>Concept</FieldLabel>
                <FieldValue>4 habitaciones &quot;Lived-In Gothic&quot; × 2 slides c/u (intro del espacio + reveal con el set encendido) = 8 slides — Dormitorio, Baño, Cocina, Oficina/Biblioteca. El set como única fuente de luz en el reveal.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy por slide (imágenes finales)</FieldLabel>
                <FieldValue>
                  Dormitorio: EVERY SANCTUARY STARTS HERE → THE NIGHT WATCHER — For those who turn off the screen, not the mind.<br/>
                  Baño: JUST A BATHROOM? → For those whose bathroom is already a sanctuary.<br/>
                  Cocina: THE HEART, UNLIT → For those who cook like they conjure.<br/>
                  Oficina/Biblioteca: FOCUS ASKS FOR MORE → MEMENTO MORI for the long hours.
                </FieldValue>
              </div>
            </ModuleBody>
            <TwoPanelNote>Copy real difiere del brief direccional (antes: &quot;FOR THE END OF THE DAY&quot; etc.). Estructura real = intro + reveal por habitación, con props editoriales (thrillers John Connolly / Gotham Chronology / Oxford notes).</TwoPanelNote>
            <MoodTag>Charcoal matte plaster · ebonized oak · nunca más de 1 elemento decorativo extra por escena</MoodTag>
          </ModuleCard>

          <ModuleCard id="pcnd-m5" moduleId="M5" title="Premium Regimen Carousel" size="1464×600 (~21:9) · 3 estados" badge="Aprobado" status="ready">
            <ModuleBody>
              <div>
                <FieldLabel>Concept</FieldLabel>
                <FieldValue>Reemplaza Comparison Table 1 (forzaba fondo blanco/UI de Amazon) — 3 estados clickeables 100% marca, mismo dormitorio en los 3 para continuidad visual.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy por estado</FieldLabel>
                <FieldValue>
                  State 1 — solo CND: IT STARTS WITH A FLAME.<br/>
                  State 2 — CND + SWD (skulls en la pared): IT CLIMBS THE WALL.<br/>
                  State 3 — Full {identity.name} (+LMP encendida): SANCTUARY COMPLETE.
                </FieldValue>
              </div>
            </ModuleBody>
            <MoodTag>Solo headline en mayúscula, sin subtexto — consistente con la voz de marca (frases cortas con peso)</MoodTag>
          </ModuleCard>

          <ModuleCard id="pcnd-m6" moduleId="M6" title="Q&A — Objeciones" badge="Aprobado (texto, sin asset)" status="ready">
            <ModuleBody>
              <div>
                <FieldLabel>Objetivo</FieldLabel>
                <FieldValue>Pre-empta las 3 objeciones core antes de la compra — sube el rating en el tiempo.</FieldValue>
              </div>
            </ModuleBody>
            <TextBlock label="5 preguntas">
              <TextLine sub>&quot;Is the wax real or cheap filler?&quot; → Premium vegetal wax, ASTM F2417 + F2058 certified. True black pigment, matte — not painted plastic.</TextLine>
              <TextLine sub>&quot;How big is it actually?&quot; → Skull candle 4.53&quot; × 3.39&quot;. Spine candle ~10&quot; H. Plus two tealights and the {identity.name} box.</TextLine>
              <TextLine sub>&quot;Is this just a Halloween thing?&quot; → No. {identity.name} is permanent gothic decor — designed to live in your room in March as much as October.</TextLine>
              <TextLine sub>&quot;What does Pine &amp; Moss smell like?&quot; → Pine, wet moss and dark earth — a forest after rain, not a sweet candle.</TextLine>
              <TextLine sub>&quot;Can I gift it?&quot; → It ships in a premium {identity.name} box made to be unwrapped slowly.</TextLine>
            </TextBlock>
          </ModuleCard>

          <ModuleCard id="pcnd-m7" moduleId="M7" title="Close — Full Image" size="Desktop 1464×600 + mobile 600×450" badge="Base + Victorian aprobados · Whimsigoth pendiente" status="iterando">
            <ModuleBody>
              <div>
                <FieldLabel>Concept (imagen final)</FieldLabel>
                <FieldValue>Los 3 productos {identity.name} en repisa gótica curada — skull + spine candles encendidos y votivas al frente, los 3 wall skulls montados, y la LMP encendida proyectando el cráneo. Props: póster anatómico &quot;Human Skeleton&quot; enmarcado, libro &quot;Alchemical Text&quot;, guantes de cuero, sextante de bronce, cristales de amatista/pirita.</FieldValue>
              </div>
              <div>
                <FieldLabel>Copy</FieldLabel>
                <FieldValue>Headline: INHABIT YOUR SHADOW. (solo mayúscula, sin body — mismo criterio de M5)</FieldValue>
              </div>
            </ModuleBody>
            <TwoPanelNote>Divergencia — en el archivo final este cierre es el M6 (la secuencia de imágenes shippeada es M1–M6; el Q&amp;A queda text-only, sin asset). Copy real = INHABIT YOUR SHADOW (antes: THIS IS WHERE THE ALTAR BEGINS).</TwoPanelNote>
            <MoodTag>Ámbar cálido CND+LMP como únicas fuentes · resto near-black</MoodTag>
          </ModuleCard>

        </ProductSection>

        </div>{/* /content */}
      </div>{/* /layout */}

      <div className="global-footer">
        {identity.name} — A+ Content Briefs · <a href="/">Home</a>
      </div>
    </>
  )
}
