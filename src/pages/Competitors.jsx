import { useTranslation } from '../i18n/TranslationProvider.jsx'
import { useEffect } from 'react';
import brand from '../brand/brand.json'

const { identity } = brand

const S = {
  page: { maxWidth: '1600px', margin: '0 auto', padding: '60px clamp(20px, 4vw, 48px)' },
  header: { marginBottom: '60px', borderBottom: '1px solid #1e1e1e', paddingBottom: '40px' },
  h1: { fontSize: '28px', fontWeight: 'normal', color: 'var(--fg)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' },
  sub: { color: '#8a7a6a', fontSize: '14px', letterSpacing: '1px', marginBottom: '16px' },
  tag: { background: '#1a1a1a', border: '1px solid #333', color: '#9a8a7a', fontSize: '11px', padding: '4px 10px', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-block', marginRight: '8px', marginBottom: '4px' },
  sectionTitle: { fontSize: '13px', textTransform: 'uppercase', letterSpacing: '3px', color: '#8a7060', marginBottom: '24px', borderBottom: '1px solid #1e1e1e', paddingBottom: '12px' },
  body: { fontSize: '15px', color: '#b8a898', lineHeight: '1.8', marginBottom: '16px' },
  quote: { background: '#111', borderLeft: '2px solid #6a5040', padding: '20px 24px', margin: '16px 0' },
  quoteText: { margin: 0, fontStyle: 'italic', color: '#a89880', fontSize: '15px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  specItem: { background: '#111', border: '1px solid #1e1e1e', padding: '18px 20px' },
  specLabel: { fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#6a5a4a', marginBottom: '8px' },
  specVal: { fontSize: '14px', color: '#c8b09a' },
  modeCard: { background: '#0e0c0c', border: '1px solid #1e1e1e', padding: '24px' },
  mavraBox: { background: '#0e1010', border: '1px solid #2a3a3a', padding: '32px', marginTop: '0' },
  kw: { background: '#111', border: '1px solid #2a2a2a', padding: '8px 16px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#8a7060' },
  footer: { borderTop: '1px solid #1a1a1a', padding: '40px 0', marginTop: '80px', color: '#4a3a2a', fontSize: '12px', letterSpacing: '1px' },
};

export default function Competitors() {
  const { text: trText } = useTranslation()

  useEffect(() => { document.title = `${identity.name} — Competitors`; }, []);

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>{trText("The Blackened Teeth — Análisis Visual")}</h1>
        <p style={S.sub}>{trText("theblackenedteeth.com · Cardiff, Gales · Fundada 2018")}</p>
        <div>
          {[`Referente Visual ${identity.name}`, 'Wall Skulls · A+ · Store · Listings', 'Marzo 2026'].map(t => (
            <span key={t} style={S.tag}>{trText(t)}</span>
          ))}
        </div>
      </div>

      {/* Brand Identity */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={S.sectionTitle}>{trText("Identidad de Marca")}</h2>
        <p style={S.body}>{trText("The Blackened Teeth no vende decoración gótica. Vende objetos filosóficos. Posicionamiento: ")}<strong style={{ color: '#d4c0a0' }}>{trText("gothic homeware como arte fino")}</strong>{trText(" — no novedad de Halloween, no commodity de Amazon.")}</p>
        <div style={S.quote}><p style={S.quoteText}>{trText("\"Lighting is the single most transformative thing you can do to a room... Every lamp here is designed to do two things: function as exceptional gothic lighting and stand alone as a sculptural object worthy of the room it inhabits.\"")}</p></div>
        <div style={S.quote}><p style={S.quoteText}>{trText("\"Remember you must die. It is one of the oldest, most unsettling, and most beautiful ideas in human history.\" — Colección Memento Mori")}</p></div>
        <p style={S.body}>{trText("Patrón copy: ")}<strong style={{ color: '#d4c0a0' }}>{trText("filosofía primero, función después")}</strong>{trText(". Sub-vocabulario: Victorian Gothic, Gothic Baroque, Memento Mori, Sacred Heart, Dark Anatomy.")}</p>
      </div>

      {/* Two Modes */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={S.sectionTitle}>{trText("Dos Modos de Composición")}</h2>
        <div style={S.grid2}>
          {[
            { title: 'Modo A — Dark Studio Puro', desc: 'Producto centrado contra negro absoluto. Sin props, sin contexto. El producto emerge de la oscuridad. Un solo foco desde arriba-frontal. Background absorbe toda la luz.', effect: 'Fotografía de museo aplicada a e-commerce.' },
            { title: 'Modo B — Vanitas Tableau', desc: 'Still life curado con props atmosféricos. Referencia: pintura flamenca del siglo XVII. Props con significado: velas encendidas con cera chorreada, libros sobre muerte/ocultismo, objetos metálicos.', effect: 'La llama viva aparece en casi todas las imágenes de lifestyle — firma visual de la marca.' },
          ].map(({ title, desc, effect }) => (
            <div key={title} style={S.modeCard}>
              <h3 style={{ fontSize: '14px', color: '#c8b89a', marginBottom: '12px', fontWeight: 'normal' }}>{trText(title)}</h3>
              <p style={{ fontSize: '14px', color: '#b8a898', lineHeight: '1.7', marginBottom: '12px' }}>{trText(desc)}</p>
              <p style={{ fontSize: '13px', color: 'var(--copper)', fontStyle: 'italic' }}>{trText(effect)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lighting */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={S.sectionTitle}>{trText("Iluminación — El Elemento Más Técnico")}</h2>
        <div style={S.grid2}>
          {[
            ['Temperatura de color', '~2200–2700K — naranja-ámbar cálido. Nunca luz blanca de día.'],
            ['Dirección', 'Lateral-baja con ligero frente. Esculpe cavidades (cuencas orbitales, relieves).'],
            ['Intensidad', 'Baja a muy baja. Zonas de sombra van a negro puro — no se levanta el negro en post.'],
            ['Para piezas de pared', 'Spotlight único, vignette natural. Sin luz de relleno.'],
            ['Highlights en dorado', 'Suaves, sin burn. Gold tones parejos — sin reflejo especular duro.'],
            ['Referencia artística', 'Tenebrismo — estilo Caravaggio aplicado a fotografía de producto.'],
          ].map(([label, value]) => (
            <div key={label} style={S.specItem}>
              <div style={S.specLabel}>{trText(label)}</div>
              <div style={S.specVal}>{trText(value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={S.sectionTitle}>{trText("Paleta Cromática")}</h2>
        <p style={S.body}>{trText("Paleta completamente disciplinada. Sin plata, sin tonos fríos, sin pasteles.")}</p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '24px 0' }}>
          {[
            ['#000000', 'Negro absoluto', 'Fondos'],
            ['#1a1a18', 'Charcoal oscuro', 'Paredes'],
            ['#c8922a', 'Oro cálido', 'Acento principal'],
            ['#8a6830', 'Latón antiguo', 'Props'],
            ['#e8d8b8', 'Hueso / Marfil', 'Acabado natural'],
            ['#8a1a18', 'Carmesí profundo', 'Solo en velas'],
          ].map(([hex, name, role]) => (
            <div key={hex} style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: hex, border: '1px solid #2a2a2a', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '10px', color: '#6a5a4a', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: '1.4' }}>{trText(name)}<br />{trText(role)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Products / Prices */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={S.sectionTitle}>{trText("Productos y Precios — Referencia para ")}{trText(identity.name)}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
          <thead>
            <tr>{['Categoría', 'Producto ejemplo', 'Precio'].map(h => <th key={h} style={{ textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#6a5a4a', padding: '10px 16px', borderBottom: '1px solid #1e1e1e' }}>{trText(h)}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ['Velas', 'Gothic skull candles, Victorian Gothic', '$13 – $29'],
              ['Piezas de pared / placas', 'Memento Mori Filigree Plaque, Grave Marker', '$22 – $170'],
              ['Cráneos ornamentales', "Death's Head Skull, Gold Skull", '$29 – $116'],
              ['Skull corbels / wall skulls', 'Ossuary Skull Corbel (+ Gold Edition)', '$116'],
              ['Lámparas', 'Skeleton lamp, spine lamp, anatomical heart', '$92 – $893'],
            ].map(row => (
              <tr key={row[0]}>{row.map((v, i) => <td key={i} style={{ padding: '10px 16px', fontSize: '14px', color: '#b8a898', borderBottom: '1px solid #151515' }}>{trText(v)}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '13px', color: '#6a5a4a' }}>{trText("Producto más directo a ")}{trText(identity.name)}{trText(" Wall Skulls: ")}<strong style={{ color: '#b8a898' }}>{trText("Ossuary Skull Corbel $116")}</strong>{trText(" — vocabulario arquitectónico, referencia histórica.")}</p>
      </div>

      {/* {identity.name} Recommendations */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={S.sectionTitle}>{trText("Aplicación Directa para ")}{trText(identity.name)}</h2>
        <div style={S.mavraBox}>
          <h3 style={{ color: '#6ab8b8', fontWeight: 'normal', marginBottom: '8px', fontSize: '16px' }}>{trText("Takeaways del análisis visual TBT")}</h3>
          <p style={{ color: '#7a9898', fontSize: '13px', marginBottom: '24px' }}>{trText("Basado en análisis de imagen, copy, pricing y posicionamiento")}</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              ['Fondo', 'Negro puro o charcoal oscuro en todos los assets. Cero fondos blancos en imágenes de marca.'],
              ['Iluminación', 'Luz cálida lateral (~2500K), intensidad baja, raking light sobre polyresin para mostrar textura matte.'],
              ['Props', 'Una vela de taper encendida + candelabro de latón + objeto metálico. Simple. Nada de Halloween.'],
              ['Composición', `${identity.name} tiene ventaja única — set de 3 cráneos como sistema. TBT siempre fotografía uno solo.`],
              ['Piezas de pared', 'Montar en pared real oscura. Shot frontal. Spotlight único con vignette.'],
              ['Copy', 'Vocabulario filosófico: "Memento Mori," "Dark Architecture," "Anatomical." Nombre de colección para el set.'],
              ['Precio target', `TBT wall skulls: $61–116. ${identity.name} set de 3: $49–89 compite directamente.`],
              [`Ventaja ${identity.name}`, `TBT no tiene distribución en Amazon. ${identity.name} captura el mercado que nunca va a encontrar theblackenedteeth.com.`],
            ].map(([k, v]) => (
              <li key={k} style={{ marginBottom: '12px', fontSize: '14px', color: '#9ab8b8', paddingLeft: '20px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: '#4a8888' }}>{"→"}</span>
                <strong style={{ color: '#c8d8d8' }}>{trText(k)}{":"}</strong> {trText(v)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mood Keywords */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={S.sectionTitle}>{trText("Vocabulario Visual — Mood Keywords")}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '24px 0' }}>
          {['Vanitas', 'Tenebrismo', 'Sepulchral Elegance', 'Victorian Occult Parlor', 'Candlelit Ceremony', 'Alchemical Gold', 'Deliberadamente Lento', 'Memento Mori'].map(kw => (
            <span key={kw} style={S.kw}>{trText(kw)}</span>
          ))}
        </div>
        <p style={S.body}>{trText("No es \"Halloween scary.\" No es agresivo. Es ")}<strong style={{ color: '#d4c0a0' }}>{trText("tranquilo, deliberado y bello de forma mórbida")}</strong>{trText(" — más cerca de un retrato de duelo victoriano que de una película de horror.")}</p>
      </div>

      <div style={S.footer}>{trText("The Blackened Teeth Visual Analysis · ")}{trText(identity.name)}{trText(" · AGT · Marzo 2026")}</div>
    </div>
  );
}
