import { useEffect } from 'react'
import brand from '../brand/brand.json'

const { identity, nav } = brand

export default function Filmografia() {
  useEffect(() => { document.title = `Filmografía — ${identity.name}` }, [])

  return (
    <>
      <div className="page-header">
        <h1>Filmografía</h1>
        <p className="page-subtitle">Guía de cinematografía y video AI para {identity.name}.</p>
        <div style={metaStyle}>v1.0 · 2026-05-27 · Basada en research de 27 transcripts Kling</div>
      </div>

      <div style={layoutStyle}>
        <aside style={sidebarStyle}>
          <p style={sidebarLabelStyle}>Contenido</p>
          {nav.filmografia.map(n => (
            <a key={n.id} href={`#${n.id}`} style={n.driver ? driverLinkStyle : linkStyle}>{n.label}</a>
          ))}
        </aside>

        <div style={contentStyle}>

          {/* ─── Identidad ─── */}
          <section id="identidad">
            <H2>Identidad Cinematográfica</H2>
            <p>{identity.name} no hace videos de producto. Hace <strong>rituales visuales</strong>. Cada clip debe sentirse como una escena de una película gótica de bajo presupuesto que alguien encontró en un VHS olvidado — íntima, oscura, deliberada.</p>

            <H3>Principios universales</H3>
            <ul style={listStyle}>
              <li>Siempre imagen de referencia → nunca text-only</li>
              <li>Siempre un solo movimiento de cámara por clip</li>
              <li>Siempre underexposed — la oscuridad es parte del producto</li>
              <li>Siempre estático el sujeto — lo que se mueve es la cámara o la llama</li>
              <li>Nunca luz natural, nunca exterior, nunca colores saturados</li>
              <li>Nunca más de 10 segundos por clip hero</li>
            </ul>
          </section>

          <hr className="copper-line" />

          {/* ─── Style Bible ─── */}
          <section id="style-bible">
            <H2>Style Bible Lines</H2>
            <p style={noteStyle}>Copiar exacto al final de cada prompt de esa corriente. Una línea, siempre igual.</p>

            <StyleBible
              corriente="LMP — Trad Goth"
              line="Extreme underexposure. Heavy vignette into pure black. Deep ceremonial shadows. Trad Goth. Cinematic."
            />
            <StyleBible
              corriente="SWD — Victorian Gothic"
              line="2400K warm tungsten. Deep ceremonial shadows. Heavy vignette. Victorian Gothic. Photorealistic."
            />
            <StyleBible
              corriente="CND — Whimsigoth"
              line="2400K candlelight as primary source. Intimate and mystical. Heavily underexposed ambient. Whimsigoth. Photorealistic."
            />
          </section>

          <hr className="copper-line" />

          {/* ─── Estructura de prompt ─── */}
          <section id="estructura">
            <H2>Estructura de Prompt {identity.name}</H2>
            <Code>{`[Subject anchor] + [Shot description] + [Camera movement] + [Preserve constraints] + [Style bible]`}</Code>

            <H3>Ejemplo — LMP hero dolly in</H3>
            <Code>{`The skull lamp on the dark wood nightstand, its warm electric glow steady and constant.
Camera performs a slow dolly in, closing distance over the full 10 seconds.
The lamp and its skull shadow remain perfectly still throughout.
Extreme underexposure. Heavy vignette into pure black. Deep ceremonial shadows. Trad Goth. Cinematic.`}</Code>

            <H3>Timestamp prompting — multi-acción en un clip</H3>
            <Code>{`In the first 5 seconds: camera holds still.
Final 5 seconds: slow dolly in toward the lamp.`}</Code>
          </section>

          <hr className="copper-line" />

          {/* ─── Movimientos ─── */}
          <section id="movimientos">
            <H2>Movimientos de Cámara Aprobados</H2>

            <H3>Hero slots (video animado)</H3>
            <MovTable rows={[
              ['Dolly in ceremonial', 'slow dolly in', 'LMP hero — acercamiento al producto'],
              ['Push in dramático', 'slow push in', 'CND hero — reveal de altar'],
              ['Crane down reveal', 'crane down', 'SWD hero — descender desde overhead'],
              ['Orbit lento', 'slow cinematic arc / rotating lens', 'Cualquier corriente — girar alrededor'],
              ['Pedestal up', 'pedestal up', 'Elevar perspectiva sin cambiar ángulo'],
              ['Tilt up reveal', 'tilt up', 'Mostrar sombra proyectada en la pared'],
            ]} />

            <H3>B-rolls / módulos secundarios</H3>
            <MovTable rows={[
              ['Rack focus', 'rack focus foreground to background', 'Detalle de textura → ambiente'],
              ['Camera pullback', 'camera pullback', 'Revelar el contexto completo'],
              ['Fixed lens', 'fixed lens', 'Sujeto quieto, llama o sombra en movimiento'],
              ['Tilt down', 'tilt down', 'Descender desde sombra a producto'],
              ['Lateral truck', 'slow lateral truck right', 'Mostrar ángulos del producto'],
            ]} />

            <H3>Prohibidos para {identity.name}</H3>
            <ul style={listStyle}>
              <li><Tag>handheld</Tag> / <Tag>documentary style</Tag> — destruye la solemnidad</li>
              <li><Tag>fpv</Tag> / <Tag>drone</Tag> — fuera de contexto de interiores</li>
              <li><Tag>fast 360 orbit</Tag> — demasiado dinámico, rompe el mood</li>
              <li><Tag>whip pan</Tag> — agresivo, anti-ritual</li>
              <li><Tag>zoom in</Tag> óptico — usar <Tag>dolly in</Tag> físico</li>
              <li><Tag>barrel roll</Tag> / <Tag>inception shot</Tag> — experimental, no de marca</li>
            </ul>
          </section>

          <hr className="copper-line" />

          {/* ─── Reglas ─── */}
          <section id="reglas">
            <H2>Reglas de Prompting {identity.name}</H2>

            <Rule title="NUNCA negativos en movimientos de cámara">
              El AI lee el sustantivo y lo genera aunque diga "no". <br />
              <Bad>"no wobble"</Bad> <Bad>"no shake"</Bad> <Bad>"no stabilization wobble"</Bad><br />
              <Good>"smooth"</Good> <Good>"steady"</Good> <Good>"continuous"</Good>
            </Rule>

            <Rule title="SIEMPRE context de escena">
              El AI necesita saber hacia dónde va la cámara, no solo cómo se mueve.<br />
              <Bad>"camera dolly in"</Bad><br />
              <Good>"camera performs a slow dolly in toward the skull lamp"</Good>
            </Rule>

            <Rule title="SIEMPRE anchor para la sombra (LMP)">
              El skull shadow es el elemento diferenciador — anclarlo explícitamente.<br />
              <Good>"The skull shadow it casts remains perfectly still throughout"</Good><br />
              Sin el anchor, el AI lo distorsiona o lo borra al animar.
            </Rule>

            <Rule title="SIEMPRE muted colors si hay riesgo de saturación">
              El AI satura colores al animar. Para los negros de {identity.name}:<br />
              <Good>"muted colors"</Good> o <Good>"desaturated palette"</Good>
            </Rule>

            <Rule title="FP Spaces para hero — Higgsfield para motion reference">
              Higgsfield recomprime la imagen al subir como start frame → pierde calidad.<br />
              Hero con start frame de alta fidelidad → FP Spaces siempre.<br />
              Higgsfield → solo para motion reference transfer.
            </Rule>

            <Rule title="Describe la fuente de luz cuando el objeto puede confundirse con vela">
              <Bad>"warm flicker"</Bad> → Kling interpreta lámpara como vela<br />
              <Good>"steady warm electric light — no flicker, no pulse, no candle behavior, purely electric"</Good>
            </Rule>
          </section>

          <hr className="copper-line" />

          {/* ─── Corrientes ─── */}
          <section id="corrientes">
            <H2>Guía por Corriente</H2>

            <CorrienteBlock
              id="lmp"
              title="LMP — Trad Goth"
              mood="Solemnidad. La sombra del cráneo como altar doméstico. Hora de medianoche."
              luz="Solo la lámpara. Sin fuente externa. Glow eléctrico cálido contra fondo negro."
              paleta="Negro profundo · Amber eléctrico · Gris de sombra"
              movimientos={[
                ['Hero', 'slow dolly in', 'Acercamiento ceremonial al producto'],
                ['B2', 'fixed lens', 'Producto quieto — solo la sombra como movimiento'],
                ['B5', 'tilt up', 'Empezar en la lámpara, revelar la sombra en la pared'],
                ['B6', 'slow cinematic arc', 'Mostrar la sombra desde otro ángulo'],
              ]}
              refs={[
                '@Naked Lateral #1 — foto lateral perpendicular (vista de lado)',
                '@Naked Medium Left Darker 2 — alternativa para bedroom (más oscura)',
                'NO usar @Naked Lateral #1 para contrapicado (shadow no proyecta bien)',
              ]}
            />

            <CorrienteBlock
              id="swd"
              title="SWD — Victorian Gothic"
              mood="Arquitectura de duelo. Antigüedad institucionalizada. El cráneo como objeto de colección aristocrática."
              luz="Tungsteno cálido desde arriba-izquierda. Sombras largas hacia la derecha."
              paleta="Burdeos · Dorado oxidado · Negro profundo"
              movimientos={[
                ['Hero', 'crane down', 'Descender desde overhead hacia el cluster en la pared'],
                ['B2', 'slow push in', 'Acercarse frontalmente al cluster'],
                ['B5', 'slow lateral truck right', 'Revelar props (mesa, libro, candelero)'],
                ['B6', 'rack focus foreground to background', 'De prop foreground a skulls en la pared'],
              ]}
              refs={[
                'Fondo: pared yeso granate-burdeos matte',
                'Props: marco oval dorado vacío, mesa de caoba, vela negra sin encender, libro encuadernado',
                'Pared flat, sin textura moderna',
              ]}
            />

            <CorrienteBlock
              id="cnd"
              title="CND — Whimsigoth"
              mood="Altar doméstico. Ritual privado. La llama como invitación."
              luz="Solo la llama de las velas. 2400K. Sin luz adicional."
              paleta="Ámbar profundo · Ciruela · Negro · Toques de violeta"
              movimientos={[
                ['Hero', 'slow push in', 'Acercarse al altar completo'],
                ['B2', 'fixed lens', 'Solo las llamas moviéndose, todo lo demás quieto'],
                ['B5', 'tilt down', 'Empezar arriba del altar, descender hacia las velas'],
                ['B6', 'rack focus foreground to background', 'De cristal amatista a velas encendidas'],
              ]}
              refs={[
                'Superficie: madera oscura envejecida',
                'Props: cristales amatista, tallos botánicos secos, charm de luna creciente',
                'Fondo: pared ciruela-carbón, cortina de encaje negro en borde del frame',
              ]}
            />
          </section>

          <hr className="copper-line" />

          {/* ─── Templates ─── */}
          <section id="templates">
            <H2>Prompt Templates</H2>

            <H3>Dolly in — cualquier corriente</H3>
            <Code>{`The [PRODUCTO] on the [SUPERFICIE]. [DESCRIPCIÓN LUZ Y GLOW].
Camera performs a slow dolly in, closing distance over the full 10 seconds in a measured, ceremonial pace.
The [PRODUCTO] remains perfectly still throughout. [ANCHOR ELEMENTO ESPECIAL].
[STYLE BIBLE DE LA CORRIENTE]`}</Code>

            <H3>Fixed lens — llama o sombra</H3>
            <Code>{`The [PRODUCTO] on the [SUPERFICIE]. [DESCRIPCIÓN LUZ].
Camera locked off — fixed lens. No camera movement.
Only [LLAMA/SOMBRA] moves within the frame.
[STYLE BIBLE DE LA CORRIENTE]`}</Code>

            <H3>Arc / orbit</H3>
            <Code>{`The [PRODUCTO] on the [SUPERFICIE]. [DESCRIPCIÓN LUZ].
Camera performs a slow cinematic arc from left, orbiting the [PRODUCTO] at a steady pace.
[PRODUCTO] remains at center of frame throughout the movement.
[STYLE BIBLE DE LA CORRIENTE]`}</Code>
          </section>

          <hr className="copper-line" />

          {/* ─── Learnings ─── */}
          <section id="learnings">
            <H2>Learnings de Producción</H2>

            <Learning
              date="2026-05-26"
              title='LMP hero — "warm flicker" generó llama de vela'
              bad='"pulses with a faint warm flicker"'
              fix='"steady warm electric light — no flicker, no pulse, no candle behavior, purely electric"'
              rule="Describir explícitamente la fuente como eléctrica cuando puede confundirse con vela."
            />
            <Learning
              date="2026-05-26"
              title="Higgsfield recomprime el start frame → pérdida de calidad"
              bad="Subir imagen de alta calidad como start frame a Higgsfield"
              fix="Correr el video directamente en FP Spaces con el start frame original"
              rule="Hero shots con start frame → FP Spaces siempre. Higgsfield solo para motion reference."
            />
            <Learning
              date="2026-07-31"
              title="Seedance 2.0 resuelve un SBV entero de 15 s en UNA generación multishot"
              bad="Generar cinco planos por separado y montarlos"
              fix="Un prompt con cinco brackets [Shot N, 3 seconds], la cámara declarada DENTRO de cada bracket, y estilo + restricciones FUERA al final"
              rule="Seedance corta solo y respeta el orden, el largo y el movimiento de cada plano. Lo que NO sostiene es la continuidad entre cortes: pierde la habitación y deriva el color de los objetos secundarios (el SWD arrancó negro y terminó dorado). Sirve para storyboard y ritmo; para pieza final el producto hay que fijarlo con referencias."
            />
            <Learning
              date="2026-07-31"
              title="Seedance no acepta bloque negativo — las restricciones van en positivo"
              bad="Negative: object deformation, camera shake, extra fingers"
              fix="Constraints: every object holds its exact shape; locked-off camera; natural anatomy with five properly formed fingers"
              rule="El bloque Negative es solo de Kling. En Seedance el texto se lee entero y nombrar el defecto lo invoca. Cerrar siempre con 'No music. No subtitles.'"
            />
            <Learning
              date="2026-05-27"
              title='"No stabilization wobble" generó vibración'
              bad='"No stabilization wobble" en el prompt'
              fix="Remover la línea. El AI lee el sustantivo, ignora la negación."
              rule="Para movimientos de cámara — NUNCA negativos. Solo descriptores positivos."
            />
          </section>

        </div>
      </div>
    </>
  )
}

// ─── Sub-components ────────────────────────────────────────────────

function H2({ children }) {
  return <h2 style={{ fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--copper)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>{children}</h2>
}
function H3({ children }) {
  return <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', color: 'rgba(var(--fg-rgb),0.6)', margin: '2rem 0 0.75rem', textTransform: 'uppercase' }}>{children}</h3>
}
function Code({ children }) {
  return (
    <pre style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(var(--copper-rgb),0.2)', borderRadius: '4px', padding: '1.25rem', fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--fg)', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: '1rem 0 1.5rem' }}>
      {children}
    </pre>
  )
}
function Tag({ children }) {
  return <code style={{ background: 'rgba(var(--copper-rgb),0.15)', color: 'var(--copper)', padding: '0.15rem 0.4rem', borderRadius: '3px', fontSize: '0.8rem', fontFamily: 'monospace' }}>{children}</code>
}
function Good({ children }) {
  return <code style={{ background: 'rgba(60,120,60,0.15)', color: '#7ecf7e', padding: '0.15rem 0.5rem', borderRadius: '3px', fontSize: '0.78rem', fontFamily: 'monospace', display: 'inline-block', margin: '0.2rem 0.3rem 0.2rem 0' }}>{children}</code>
}
function Bad({ children }) {
  return <code style={{ background: 'rgba(120,40,40,0.15)', color: '#cf7e7e', padding: '0.15rem 0.5rem', borderRadius: '3px', fontSize: '0.78rem', fontFamily: 'monospace', display: 'inline-block', margin: '0.2rem 0.3rem 0.2rem 0', textDecoration: 'line-through' }}>{children}</code>
}

function StyleBible({ corriente, line }) {
  return (
    <div style={{ marginBottom: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.25)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ background: 'rgba(var(--copper-rgb),0.1)', padding: '0.6rem 1rem', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--copper)' }}>{corriente}</div>
      <div style={{ padding: '0.9rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--fg)', letterSpacing: '0.02em' }}>{line}</div>
    </div>
  )
}

function Rule({ title, children }) {
  return (
    <div style={{ margin: '1.5rem 0', paddingLeft: '1rem', borderLeft: '2px solid rgba(var(--copper-rgb),0.4)' }}>
      <div style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.85)', lineHeight: 1.7, maxWidth: '70ch' }}>{children}</div>
    </div>
  )
}

function MovTable({ rows }) {
  return (
    <div style={{ margin: '1rem 0 1.5rem' }}>
      {rows.map(([mov, kw, uso], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 2fr', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)', fontSize: '0.82rem', alignItems: 'start' }}>
          <span style={{ color: 'var(--fg)' }}>{mov}</span>
          <code style={{ color: 'var(--copper)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{kw}</code>
          <span style={{ color: 'rgba(var(--fg-rgb),0.6)' }}>{uso}</span>
        </div>
      ))}
    </div>
  )
}

function CorrienteBlock({ id, title, mood, luz, paleta, movimientos, refs }) {
  return (
    <div id={id} style={{ margin: '2.5rem 0', padding: '1.5rem', border: '1px solid rgba(var(--copper-rgb),0.2)', borderRadius: '4px' }}>
      <div style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '0.75rem' }}>{title}</div>
      <p style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'rgba(var(--fg-rgb),0.75)', marginBottom: '1rem' }}>{mood}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
        <div><span style={{ color: 'var(--copper)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Iluminación</span><br />{luz}</div>
        <div><span style={{ color: 'var(--copper)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Paleta</span><br />{paleta}</div>
      </div>
      <MovTable rows={movimientos} />
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--copper)', marginBottom: '0.5rem' }}>Referencias</div>
        <ul style={{ ...listStyle, color: 'rgba(var(--fg-rgb),0.65)' }}>
          {refs.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    </div>
  )
}

function Learning({ date, title, bad, fix, rule }) {
  return (
    <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', borderLeft: '3px solid rgba(var(--copper-rgb),0.5)' }}>
      <div style={{ fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.4)', marginBottom: '0.4rem' }}>{date}</div>
      <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--fg)' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', marginBottom: '0.4rem' }}><Bad>{bad}</Bad></div>
      <div style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}><Good>{fix}</Good></div>
      <div style={{ fontSize: '0.78rem', color: 'rgba(var(--fg-rgb),0.55)', fontStyle: 'italic' }}>Regla: {rule}</div>
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
const listStyle = { paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'rgba(var(--fg-rgb),0.75)', lineHeight: 2 }
const noteStyle = { fontSize: '0.82rem', color: 'rgba(var(--fg-rgb),0.55)', fontStyle: 'italic', marginBottom: '1.5rem' }
