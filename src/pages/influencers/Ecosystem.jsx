const s = {
  h1: { fontFamily: "var(--font-condensed)", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 400, color: 'var(--fg)', marginBottom: '8px' },
  sub: { fontFamily: "'IM Fell English', serif", fontStyle: 'italic', color: 'rgba(var(--fg-rgb),0.45)', fontSize: '1rem', marginBottom: '40px' },
  sectionLabel: { fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--copper-bright)', marginBottom: '16px', marginTop: '48px' },
  h2: { fontFamily: "var(--font-condensed)", fontSize: '1.1rem', color: 'var(--fg)', marginBottom: '12px', fontWeight: 400 },
  p: { fontFamily: "var(--font-sans)", fontSize: '0.85rem', color: 'rgba(var(--fg-rgb),0.6)', lineHeight: 1.8, marginBottom: '12px' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(var(--copper-rgb),0.15)', padding: '20px', marginBottom: '12px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '32px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' },
  label: { fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper-bright)', marginBottom: '8px' },
  num: { fontFamily: "var(--font-condensed)", fontSize: '2rem', color: 'var(--fg)', lineHeight: 1, marginBottom: '6px' },
  small: { fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.45)', lineHeight: 1.6 },
  note: { fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: 'rgba(var(--copper-bright-rgb),0.8)', marginTop: '8px' },
  divider: { borderColor: 'rgba(var(--copper-rgb),0.15)', margin: '40px 0' },
  tag: { display: 'inline-block', fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(var(--copper-rgb),0.12)', color: 'var(--copper-bright)', padding: '3px 8px', marginRight: '6px', marginBottom: '4px' },
  flow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  flowBox: { background: 'rgba(var(--copper-rgb),0.08)', border: '1px solid rgba(var(--copper-rgb),0.2)', padding: '10px 14px', fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'var(--fg)', textAlign: 'center', minWidth: '100px' },
  arrow: { color: 'rgba(var(--copper-rgb),0.5)', fontSize: '1rem' },
  li: { fontFamily: "var(--font-sans)", fontSize: '0.8rem', color: 'rgba(var(--fg-rgb),0.55)', padding: '5px 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.07)', listStyle: 'none' },
}

function Card({ label, num, text, note }) {
  return (
    <div style={s.card}>
      <p style={s.label}>{label}</p>
      <div style={s.num}>{num}</div>
      <p style={s.small}>{text}</p>
      {note && <p style={s.note}>{note}</p>}
    </div>
  )
}

export default function Ecosystem() {
  return (
    <div style={{ maxWidth: '100%' }}>
      <h1 style={s.h1}>El Ecosistema de Influencers</h1>
      <p style={s.sub}>Todo lo que investigamos — explicado de forma rápida y clara</p>

      {/* RESEARCH SUMMARY */}
      <p style={s.sectionLabel}>Lo que investigamos</p>
      <div style={s.grid3}>
        <Card label="Transcripts analizados" num="9" text="YouTube: Creator Connections, Influencer Program, TikTok + Amazon strategies." note="Fuente: Chris Rawlings, Think Media, Thomas Talks y más" />
        <Card label="Creadores identificados" num="91" text="TikTok/IG creators en nicho dark/gothic. 10 A1 (storefront confirmado), 20 A2, 20 hubs A3." note="Ver Directorio tab para stats completos" />
        <Card label="Guía producida" num="1" text="Amazon Influencer Marketing Guide 2025-2026 — estrategia completa para marcas nuevas con Brand Registry." />
      </div>

      <hr style={s.divider} />

      {/* CHANNEL 1: AMAZON CREATOR CONNECTIONS */}
      <p style={s.sectionLabel}>Canal 1 — Amazon Creator Connections</p>
      <h2 style={s.h2}>¿Qué es?</h2>
      <p style={s.p}>Es el marketplace nativo dentro de Amazon Seller Central donde las marcas publican campañas y los creadores del Amazon Associates Program se unen. <strong style={{ color: 'var(--fg)' }}>La marca paga solo cuando hay ventas reales.</strong> Amazon gestiona tracking y pagos automáticamente.</p>

      <h2 style={{ ...s.h2, marginTop: '20px' }}>¿Cómo fluye el dinero?</h2>
      <div style={s.flow}>
        <div style={s.flowBox}>Marca publica<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>Seller Central</span></div>
        <span style={s.arrow}>→</span>
        <div style={s.flowBox}>Creador se une<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>Associates Dashboard</span></div>
        <span style={s.arrow}>→</span>
        <div style={s.flowBox}>Genera ventas<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>Via links/storefront</span></div>
        <span style={s.arrow}>→</span>
        <div style={s.flowBox}>Marca paga comisión<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>Amazon debita automático</span></div>
        <span style={s.arrow}>→</span>
        <div style={{ ...s.flowBox, borderColor: 'rgba(var(--copper-bright-rgb),0.4)', background: 'rgba(var(--copper-bright-rgb),0.06)' }}>Brand Referral Bonus<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>~10% crédito de vuelta</span></div>
      </div>

      <div style={s.grid2}>
        <div style={s.card}>
          <p style={s.label}>Requisito</p>
          <p style={s.small}>Brand Registry activo en Amazon US. Sin BR = no puedes crear campañas.</p>
        </div>
        <div style={s.card}>
          <p style={s.label}>Presupuesto mínimo</p>
          <div style={{ fontFamily: "var(--font-condensed)", fontSize: '1.4rem', color: 'var(--fg)', lineHeight: 1, marginBottom: '6px' }}>$5,000</div>
          <p style={s.small}>Es un techo máximo, <strong style={{ color: 'var(--fg)' }}>no un pago anticipado.</strong> Muchas campañas no llegan a $1,000 gastado. Solo pagas por ventas reales.</p>
        </div>
        <div style={s.card}>
          <p style={s.label}>Comisión recomendada para MAVRA</p>
          <div style={{ fontFamily: "var(--font-condensed)", fontSize: '1.4rem', color: 'var(--fg)', lineHeight: 1, marginBottom: '6px' }}>15–20%</div>
          <p style={s.small}>Nicho gothic/dark = menos competencia pero también menos creadores. Hay que ofrecer más para atraer atención. 10% rara vez consigue creadores activos.</p>
        </div>
        <div style={{ ...s.card, borderColor: 'rgba(196,65,65,0.3)' }}>
          <p style={{ ...s.label, color: '#c44040' }}>⚠ Problema conocido</p>
          <p style={s.small}>"Auto-accept loophole": creadores aceptan campañas automáticamente sin obligación de crear contenido. Mitígalo describiendo muy específicamente el tipo de contenido esperado en el mensaje al creador.</p>
        </div>
      </div>

      <hr style={s.divider} />

      {/* CHANNEL 2: AMAZON INFLUENCER PROGRAM */}
      <p style={s.sectionLabel}>Canal 2 — Amazon Influencer Program</p>
      <h2 style={s.h2}>¿Qué es?</h2>
      <p style={s.p}>Los creadores que tienen un Amazon Storefront pueden recomendar cualquier producto de Amazon. Cuando sus seguidores compran, el creador gana una comisión de Amazon (estándar de Associates).</p>
      <p style={s.p}><strong style={{ color: 'var(--fg)' }}>Para la marca no hay costo directo.</strong> Pero hacer outreach a estos creadores para que promuevan tus productos específicamente = estrategia de gifting.</p>

      <h2 style={{ ...s.h2, marginTop: '20px' }}>Estrategia de gifting</h2>
      <div style={s.flow}>
        <div style={s.flowBox}>Identifica creador<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>Con storefront activo</span></div>
        <span style={s.arrow}>→</span>
        <div style={s.flowBox}>Envías producto<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>Costo = producto físico</span></div>
        <span style={s.arrow}>→</span>
        <div style={s.flowBox}>Creador crea contenido<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>TikTok/Reels con tu producto</span></div>
        <span style={s.arrow}>→</span>
        <div style={s.flowBox}>Link a tu listing<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>Directo a Amazon</span></div>
        <span style={s.arrow}>→</span>
        <div style={{ ...s.flowBox, borderColor: 'rgba(var(--copper-bright-rgb),0.4)', background: 'rgba(var(--copper-bright-rgb),0.06)' }}>Ventas orgánicas<br /><span style={{ fontSize: '0.62rem', color: 'var(--copper-bright)' }}>Sin comisión adicional</span></div>
      </div>

      <hr style={s.divider} />

      {/* CHANNEL 3: TIKTOK ORGANIC */}
      <p style={s.sectionLabel}>Canal 3 — TikTok Organic + Brand Collab</p>
      <h2 style={s.h2}>¿Qué es?</h2>
      <p style={s.p}>Outreach directo a creadores de TikTok en el nicho gothic/dark/witchy. Muchos ya tienen Amazon Storefronts — pueden mostrar tu producto y linkearlo directamente.</p>

      <div style={s.grid2}>
        <div style={s.card}>
          <p style={s.label}>10 creadores A1 — prioridad máxima</p>
          <p style={s.small}>Dark home decor, gothic, witchy — nichos exactos de MAVRA. Todos con Amazon Storefront confirmado. + 20 hubs A3 para paid ads.</p>
          <p style={s.note}>Ver Directorio tab para stats y breakdown completo</p>
        </div>
        <div style={s.card}>
          <p style={s.label}>Plataformas adicionales</p>
          <ul style={{ margin: 0, padding: 0 }}>
            <li style={s.li}>Social Cat — matching platform gratuita</li>
            <li style={s.li}>JoinBrands — para escalar cuando haya tracción</li>
            <li style={s.li}>Instagram DM directo para cuentas grandes</li>
          </ul>
        </div>
      </div>

      <hr style={s.divider} />

      {/* BEFORE OUTREACH */}
      <p style={s.sectionLabel}>Antes del primer outreach — decisiones pendientes</p>
      <div style={s.grid2}>
        <div style={{ ...s.card, borderColor: 'rgba(var(--copper-bright-rgb),0.3)' }}>
          <p style={s.label}>Decisiones de Frank</p>
          <ul style={{ margin: 0, padding: 0 }}>
            {[
              'Oferta: producto gratis / comisión / pago fijo?',
              'Qué producto(s) enviar primero?',
              'Follower mínimo para gifting',
              'Listings de Amazon live (necesario para links)',
              'Logística de envíos de producto',
            ].map((item, i) => (
              <li key={i} style={{ ...s.li, display: 'flex', gap: '8px' }}>
                <span style={{ color: 'rgba(var(--copper-bright-rgb),0.6)', flexShrink: 0 }}>☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={s.card}>
          <p style={s.label}>Listo para armar</p>
          <ul style={{ margin: 0, padding: 0 }}>
            {[
              ['✓', 'done', '58 creadores identificados'],
              ['✓', 'done', '9 transcripts analizados'],
              ['✓', 'done', 'Estrategia definida'],
              ['☐', '', 'DM templates (IG + TikTok)'],
              ['☐', '', 'Brief de contenido'],
              ['☐', '', 'Campaña Amazon Creator Connections'],
              ['✓', 'done', 'Directorio 91 creadores con stats (ver tab)'],
            ].map(([icon, cls, text], i) => (
              <li key={i} style={{ ...s.li, display: 'flex', gap: '8px', color: cls === 'done' ? 'rgba(96,176,96,0.6)' : undefined, textDecoration: cls === 'done' ? 'line-through' : undefined }}>
                <span style={{ color: cls === 'done' ? '#60b060' : 'rgba(var(--copper-rgb),0.5)', flexShrink: 0 }}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
