import { useEffect, useState } from 'react';
import brand from '../brand/brand.json'

const { identity, nav } = brand

const VAR = {
  dark: 'var(--bg)', cream: 'var(--fg)', copper: 'var(--copper)', burgundy: 'var(--burgundy)',
  muted: '#A8A096', faint: 'rgba(var(--fg-rgb),0.35)',
};

const S = {
  page: { maxWidth: '1600px', margin: '0 auto', padding: '60px clamp(20px, 4vw, 48px)' },
  hero: { textAlign: 'center', padding: '60px 0 40px', borderBottom: `1px solid ${VAR.copper}` },
  eyebrow: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: VAR.muted, marginBottom: '16px' },
  h1: { fontFamily: "var(--font-condensed)", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: '400', color: VAR.cream, letterSpacing: '0.1em', marginBottom: '16px' },
  tagline: { fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1.2rem', color: VAR.faint },
  meta: { fontSize: '12px', color: VAR.muted, marginTop: '12px', letterSpacing: '1px' },
  sectionHeader: { marginBottom: '40px' },
  label: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: VAR.copper, display: 'block', marginBottom: '8px' },
  h2: { fontFamily: "var(--font-condensed)", fontSize: '1.6rem', fontWeight: '400', color: VAR.cream, marginBottom: '16px' },
  h3: { fontFamily: "var(--font-condensed)", fontSize: '1rem', color: VAR.copper, marginBottom: '12px', fontWeight: '400' },
  body: { fontSize: '0.95rem', color: VAR.muted, lineHeight: '1.8', marginBottom: '16px' },
  card: { background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(var(--copper-rgb),0.2)`, padding: '24px', borderRadius: '2px', marginBottom: '16px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  hr: { border: 'none', borderTop: `1px solid ${VAR.copper}`, margin: '60px 0' },
  doList: { listStyle: 'none', padding: 0 },
  doItem: { padding: '8px 0 8px 20px', position: 'relative', fontSize: '0.9rem', color: VAR.muted, borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' },
};


export default function Briefing() {
  const [active, setActive] = useState('marca');
  useEffect(() => { document.title = `${identity.name} — Briefing para Diseñador`; }, []);

  const scrollTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={S.page}>
      {/* Sticky subnav */}
      <div style={{ position: 'sticky', top: '60px', background: VAR.dark, zIndex: 50, borderBottom: `1px solid rgba(var(--copper-rgb),0.3)`, padding: '12px 0', marginBottom: '40px', display: 'flex', gap: '24px', overflowX: 'auto' }}>
        {nav.briefing.map(id => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', color: active === id ? VAR.copper : VAR.muted, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', padding: '4px 0', borderBottom: active === id ? `1px solid ${VAR.copper}` : '1px solid transparent' }}>
            {id}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div style={S.hero}>
        <p style={S.eyebrow}>Documento de producción visual · Confidencial</p>
        <h1 style={S.h1}>{identity.name}<br />Briefing para Diseñador</h1>
        <p style={S.tagline}>"Inhabit your shadow."</p>
        <p style={S.meta}>Versión 2.0 · Mayo 2026 · Wall Skulls + Skull Candle + Skull Lamp</p>
      </div>

      <hr style={S.hr} />

      {/* 01 — MARCA */}
      <section id="marca" style={{ marginBottom: '80px' }}>
        <div style={S.sectionHeader}>
          <span style={S.label}>01 — Identidad de Marca</span>
          <h2 style={S.h2}>{identity.name}</h2>
          <p style={S.body}>Decoración gótica premium para Amazon FBA. Marca propia. Todo lo que diseñes debe comunicar una sola cosa: que la oscuridad es una forma de maestría, no de miedo.</p>
        </div>

        <div style={S.card}>
          <span style={S.label}>Arquetipo</span>
          <h3 style={S.h3}>The Liberator</h3>
          <p style={S.body}>"Aquí puedes ser quien realmente eres." No depende de escasez — depende de lo que el producto habilita: construir el espacio donde el cliente puede ser completamente él mismo.</p>
        </div>

        <div style={S.grid2}>
          <div style={S.card}>
            <span style={S.label}>Tagline (permanente)</span>
            <p style={{ fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1.2rem', color: VAR.cream, margin: 0 }}>"Inhabit your shadow."</p>
          </div>
          <div style={S.card}>
            <span style={S.label}>Slogan (campaña)</span>
            <p style={{ fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1.2rem', color: VAR.cream, margin: 0 }}>"The darkness you deserved."</p>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <span style={S.label}>Paleta de Color</span>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
            {[['var(--bg)', 'Negro cálido'], ['var(--fg)', 'Hueso/Crema'], ['var(--copper)', 'Cobre/Bronce'], ['var(--burgundy)', 'Burdeos']].map(([hex, name]) => (
              <div key={hex} style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: hex, border: '1px solid rgba(var(--copper-rgb),0.4)', margin: '0 auto 8px', borderRadius: '2px' }} />
                <div style={{ fontSize: '10px', color: VAR.muted, letterSpacing: '1px' }}>{name}</div>
                <div style={{ fontSize: '10px', color: VAR.copper, fontFamily: 'monospace' }}>{hex}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <span style={S.label}>Sistema Tipográfico</span>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead><tr>{['Rol', 'Fuente', 'Uso'].map(h => <th key={h} style={{ textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: VAR.copper, padding: '10px 12px', borderBottom: `1px solid rgba(var(--copper-rgb),0.2)` }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['Headline', 'Cinzel', 'Títulos, marca, momentos clave'],
                ['Body', 'Basilia Regular', 'Cuerpo de texto, descripciones'],
                ['Editorial / Citas', 'IM Fell English Italic', 'Frases de marca, citas — fijo'],
                ['Props / Callouts', 'Josefin Sans', 'Etiquetas, datos técnicos, UI'],
              ].map(row => (
                <tr key={row[0]}>{row.map((v, i) => <td key={i} style={{ padding: '10px 12px', fontSize: '13px', color: i === 1 ? VAR.cream : VAR.muted, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={S.card}>
          <span style={S.label}>Tono de Voz</span>
          <div style={S.grid2}>
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: VAR.copper, marginBottom: '12px' }}>Hacer</p>
              <ul style={S.doList}>
                {['Vocabulario ritual: invocar, habitar, convocar', 'Frases cortas con peso — 3 palabras que pesan más que un párrafo', 'Sereno y seguro — habla desde la certeza', 'Describe lo que proyecta, no lo que es', 'Referencias: Caravaggio, memento mori, arquitectura gótica'].map(item => (
                  <li key={item} style={S.doItem}><span style={{ position: 'absolute', left: 0, color: VAR.copper }}>+</span>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: VAR.burgundy, marginBottom: '12px' }}>No hacer</p>
              <ul style={S.doList}>
                {['Exclamaciones de ningún tipo', 'Jerga de e-commerce: "oferta", "¡No te lo pierdas!"', 'Mencionar Halloween como referente', 'Pedir disculpas por la estética', 'Explicar por qué es gótica — mostrarlo'].map(item => (
                  <li key={item} style={S.doItem}><span style={{ position: 'absolute', left: 0, color: VAR.burgundy }}>×</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div style={S.card}>
          <span style={S.label}>Referencias Visuales de Marca</span>
          <p style={S.body}><strong style={{ color: VAR.copper }}>theblackenedteeth.com</strong> — referente principal. Museum-grade documentation aesthetic. Estudiarla en profundidad antes de diseñar.</p>
          <p style={{ ...S.body, marginBottom: 0 }}><strong style={{ color: VAR.copper }}>killstar.com</strong> — referente secundario. Gothic fashion premium. Nivel de producción visual de referencia.</p>
        </div>
      </section>

      <hr style={S.hr} />

      {/* 02 — PRODUCTOS */}
      <section id="productos" style={{ marginBottom: '80px' }}>
        <div style={S.sectionHeader}>
          <span style={S.label}>02 — Productos</span>
          <h2 style={S.h2}>Los 3 Productos {identity.name}</h2>
        </div>

        {[
          { name: 'Wall Skulls (SWD)', sub: 'Set de 3 wall skulls de polirresina negra mate (3 tamaños)', specs: [['Material', 'High-density polyresin negra mate'], ['Acabado', 'Satin-matte — sin brillo. Microestructura de casting visible a detalle'], ['Dimensiones', '3 tamaños · 8.15"×5.9" · 7.3"×5.5" · 6.7"×5.1"'], ['Construcción', 'Relieve escultórico al frente · espalda plana con keyhole hanger · Screw & Wall Anchors o Permanent Double-Sided Tape']], overlay: 'S1: sin overlay | S2: MOUNT ONCE. HAUNT FOREVER. | S3: SCULPTED. NOT STAMPED. | S4: MADE TO FIT. BUILT TO HAUNT. | S5: YOUR WALL. YOUR LANGUAGE. | S6: A SANCTUARY IS BORN. (Add the flames to your realm.)' },
          { name: 'Skull Candle Set (CND)', sub: 'Vela calavera + vela espina + 2 votives. Parafina negra real. Aromáticas (Pine & Moss Scent).', specs: [['Material', 'Cera negra de parafina — 100% black, sin degradar'], ['Detalles', 'Suturas craneales · fisuras naturales de enfriamiento · anatomía real'], ['Dimensiones', 'Skull 4.53"×3.39" · Spine 5.67"×1.38" (callouts listing; el A+ Premium cita spine ~10"H — verificar)'], ['Piezas', 'Skull candle (12 hrs) · Spine candle (6 hrs) · 2 votives (NO tealights; la vision del unboxing los etiqueta "tealights" — verificar)']], overlay: 'S1: sin overlay | S2: HOLD THE DARK. | S3: GIVE THE DARK. | S4: YOUR ALTAR. YOUR RULES. | S5: SCULPTED. NOT STAMPED. | S6: RITUAL DEMANDS A SPINE. | S7: BURNS AS DARK AS IT LOOKS.' },
          { name: 'Skull Lamp (LMP)', sub: 'Lámpara de mesa geométrica. Proyecta sombra de calavera cuando encendida.', specs: [['Dimensiones', 'Shade: 5.4" (13.7cm) ancho · Height: 12.2" (31cm)'], ['Bulbo', 'E26 incluido. Compatible con cualquier bombillo E26, incl. smart bulbs'], ['Modos shade', 'Matte Diffuser · Glitter Translucent · Naked Cage (sin veil) — ambas veils incluidas'], ['Control', 'Touch dimmer — 3 niveles: Soft · Medium · High']], overlay: 'S1: sin overlay | S2: PICK YOUR DARKNESS. (Both Veils Included) | S3: MADE TO FIT. BUILT TO HAUNT. | S4: BUILT TO LAST THE DARK | S5: CONTROL THE NIGHT (Soft/Medium/High) | S6: THE DARK OBEYS. | S7: BUILD THE DARK (Assembly)' },
        ].map(({ name, sub, specs, overlay }) => (
          <div key={name} style={{ ...S.card, marginBottom: '24px' }}>
            <h3 style={S.h3}>{name}</h3>
            <p style={S.body}>{sub}</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ padding: '6px 12px 6px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: VAR.copper, whiteSpace: 'nowrap', width: '140px' }}>{k}</td>
                    <td style={{ padding: '6px 0', fontSize: '13px', color: VAR.muted }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ background: 'rgba(var(--copper-rgb),0.08)', padding: '12px 16px', fontSize: '11px', color: VAR.muted, letterSpacing: '0.5px', fontFamily: 'monospace' }}>
              <span style={{ color: VAR.copper, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>Overlays aprobados</span>
              {overlay}
            </div>
          </div>
        ))}
      </section>

      <hr style={S.hr} />

      {/* 03 — ESCENOGRAFÍA */}
      <section id="escenografia" style={{ marginBottom: '80px' }}>
        <div style={S.sectionHeader}>
          <span style={S.label}>03 — Escenografía</span>
          <h2 style={S.h2}>Setup de Fotografía</h2>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>Iluminación estándar {identity.name} (TODOS los prompts)</h3>
          <p style={{ ...S.body, fontFamily: 'monospace', background: 'rgba(var(--copper-rgb),0.06)', padding: '12px 16px', fontSize: '12px' }}>
            Warm 2400K tungsten key light from upper-left, soft and controlled — warm golden tones, natural shadows falling toward the right, vignette into deep darkness at frame edges. No flat fill light.
          </p>
          <p style={S.body}>Excepción — Skull candle solo (@skull lora): luz raking desde la DERECHA (no izquierda).</p>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>Superficies Aprobadas</h3>
          <div style={S.grid2}>
            {[['Superficie', 'Dark ebonized oak — madera oscura con grano natural visible'], ['Pared', 'Charcoal matte — gris oscuro sin pattern'], ['Alternativa pared', 'Garnet-burgundy casi negro (#1A0008) para Victorian Gothic'], ['Pared gothic exterior', 'Tongue-and-groove wood siding, near-black — para Southern Gothic']].map(([k, v]) => (
              <div key={k} style={{ borderLeft: `2px solid ${VAR.copper}`, paddingLeft: '12px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: VAR.copper, letterSpacing: '1px', marginBottom: '4px' }}>{k}</div>
                <div style={{ fontSize: '13px', color: VAR.muted }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>Corrientes Góticas — Estado</h3>
          {[
            { name: 'Victorian Gothic', status: '✅ Aprobado', desc: 'Pared sólida #1A0008, mahogany table, libros, vela taper, cortina forest-green, marco oval dorado' },
            { name: 'Trad Goth / Batcave', status: '✅ Aprobado', desc: 'Pared charcoal bare, superficie concreto, lamp como sole light source. Minimalismo total.' },
            { name: 'Whimsigoth', status: '✅ Aprobado', desc: 'Pared dusty plum-charcoal, cristales, altar, dos velas taper, mystical. Dos fuentes de luz.' },
            { name: 'Southern Gothic', status: '✅ Aprobado', desc: 'Ladrillo envejecido o madera tongue-and-groove, decay elegante, sepia 2200K, botanical dried.' },
            { name: 'Pastel Goth', status: '✅ Aprobado', desc: 'Pared lavanda matte, sole light source, Edison estándar. Pared da el efecto, no smart bulb.' },
          ].map(({ name, status, desc }) => (
            <div key={name} style={{ padding: '12px 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: VAR.cream }}>{name}</span>
                <span style={{ fontSize: '11px', color: VAR.copper }}>{status}</span>
              </div>
              <p style={{ fontSize: '12px', color: VAR.muted, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={S.hr} />

      {/* 04 — HERRAMIENTAS */}
      <section id="herramientas" style={{ marginBottom: '80px' }}>
        <div style={S.sectionHeader}>
          <span style={S.label}>04 — Herramientas</span>
          <h2 style={S.h2}>Stack de Generación</h2>
        </div>

        <div style={S.grid2}>
          {[
            { tool: 'Freepik Spaces / Nano Banana 2', desc: 'Google Imagen 3.1. Prompting con @refs. Para corrientes, composiciones multi-producto, background swaps.' },
            { tool: 'gpt-image-2', desc: 'OpenAI. Para generación rápida, edición de imagen, logo flattening, UGC brandkit.' },
            { tool: 'Kling v1.6 PRO (fal.ai)', desc: 'Video UGC. Imagen a video 9:16. La imagen fuente DEBE tener el ratio 9:16 antes de enviar.' },
            { tool: 'Gemini 2.5 Flash', desc: 'Análisis de imágenes generadas. Herramienta oficial de visión — NUNCA GPT-4o ni Read tool.' },
          ].map(({ tool, desc }) => (
            <div key={tool} style={S.card}>
              <h3 style={{ ...S.h3, marginBottom: '8px' }}>{tool}</h3>
              <p style={{ ...S.body, marginBottom: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={S.hr} />

      {/* 05 — APRENDIZAJES */}
      <section id="aprendizajes" style={{ marginBottom: '80px' }}>
        <div style={S.sectionHeader}>
          <span style={S.label}>05 — Aprendizajes Críticos de Producción</span>
          <h2 style={S.h2}>Reglas que No Se Rompen</h2>
        </div>

        {[
          {
            cat: 'Freepik / Prompting',
            rules: [
              '@Naked Front = vista frontal LMP. @Naked Medium Left Darker = vista lateral izquierda. Usar el correcto según el ángulo que necesitas.',
              'NUNCA usar UUIDs en prompts — siempre nombre corto: @List #146, @Naked Front, @DSC5186 #2.',
              'El approach correcto para corrientes LMP es "exactly as provided, change ONLY these elements" — no scene-rebuild completo.',
              'SIEMPRE incluir el nombre del estilo en el descriptor de luz/atmósfera al final: "Southern Gothic warmth", "Victorian Gothic ceremonial".',
              'Skull shadow projection: NUNCA poner paredes con pattern (damask, wallpaper) — suprime la proyección. Paredes sólidas oscuras.',
              'Cuando hay @ref → NO describir el contenido del objeto. Descripción causa alucinaciones.',
              'NUNCA poner el aspect ratio en el prompt — se da en el selector del generador.',
              'Prompts cortos preservan mejor el @ref. Enhanced puede mejorar atmósfera pero diluye adherencia al producto.',
            ],
          },
          {
            cat: 'Skull Lamp (LMP)',
            rules: [
              'Shadow projection: la proyección del skull es non-negotiable. Pared sólida oscura para máxima legibilidad.',
              'Edison filament: "preserved exactly as lit in source with visible glowing filaments" — NO tocar esta línea.',
              'Corrientes de LMP van en ESPAÑOL (actualizado 2026-05-14 — antes había inconsistencia).',
              'Para corrientes LMP: prompt quirúrgico "exactly as provided, change only these elements" — no rebuild.',
              '@Naked Front = frontal. @Naked Medium Left Darker / @Naked Medium Left Darker 2 = lateral izquierdo.',
            ],
          },
          {
            cat: 'Skull Candle (CND)',
            rules: [
              'Set = skull + spine + 2 VOTIVES (no tealights). Con espacio: @candle set.',
              'Aromáticas — Pine & Moss Scent. Las votives son velitas cilíndricas, no tealights.',
              'Para shots individuales del skull: luz raking desde la DERECHA (no izquierda). Diferente al estándar.',
              'Prompts CND: @DSC5186 #2 como referencia. Descripción mínima cuando hay @ref.',
              'Corrientes CND van en ESPAÑOL. Formato: "@DSC5186 #2 como referencia — cero desviación..." + descripción de escena.',
            ],
          },
          {
            cat: 'Wall Skulls (SWD)',
            rules: [
              'SWD: @DSC01792 copia — nunca UUID, nunca @img1.',
              'Skull morphology prior irreversible — el modelo reinterpreta. Única solución: compositing externo (Frank monta foto real en PIL/Photoshop).',
              'NUNCA usar "plaque" en prompts — confunde al modelo.',
              'Camera angle VA AL INICIO del prompt — si llega tarde, el modelo se ancla a perpendicular.',
              'Para M4/B7 cross-sell: @List #117 (SWD frontales), @candle set, @Naked Front. Profundidad física explícita en metros.',
            ],
          },
          {
            cat: 'General',
            rules: [
              'Imágenes → Gemini 2.5 Flash (SDK google.genai). NUNCA GPT-4o ni Read tool.',
              'gpt-image-2 es el modelo de imágenes de OpenAI. NUNCA DALL-E-3 ni gpt-image-1.',
              'Todos los prompts de corrientes: en ESPAÑOL. Aprobado 2026-05-14.',
            ],
          },
        ].map(({ cat, rules }) => (
          <div key={cat} style={{ ...S.card, marginBottom: '24px' }}>
            <h3 style={S.h3}>{cat}</h3>
            <ul style={S.doList}>
              {rules.map(rule => (
                <li key={rule} style={{ ...S.doItem, paddingLeft: '20px' }}>
                  <span style={{ position: 'absolute', left: 0, color: VAR.copper }}>→</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <div style={{ borderTop: `1px solid rgba(var(--copper-rgb),0.3)`, padding: '32px 0', color: VAR.muted, fontSize: '12px', letterSpacing: '1px', textAlign: 'center' }}>
        {identity.name} · Briefing para Diseñador · Versión 2.0 · Mayo 2026 · AGT
      </div>
    </div>
  );
}
