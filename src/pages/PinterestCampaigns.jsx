import { useTranslation } from '../i18n/TranslationProvider.jsx'
import brand from '../brand/brand.json'
import useReveal from '../components/useReveal.js'

const { identity } = brand

// ── Datos medidos con la API de Pinterest el 2026-09-04 (ventana 06-jun → 03-sep) ──
const AUDIENCE = [
  ['Audiencia total', '49.000'],
  ['Audiencia comprometida', '10.000'],
  ['En Estados Unidos', '28,3%'],
  ['Mujeres', '73,7%'],
  ['25–34 años', '44%'],
  ['Móvil', '~90%'],
]

const DIAGNOSIS = [
  ['Impresiones', '80.332'],
  ['Guardados', '773'],
  ['Clics al pin', '2.290'],
  ['Clics salientes', '24'],
]

const CAMPAIGNS = [
  {
    id: 1,
    name: 'Producto → Amazon',
    budget: '$18 / día',
    dest: 'Listado de Amazon, con tag de Attribution propio de Pinterest',
    why: 'Es la que vende. Enlace directo: el clic va al listado sin abrir el primer plano del pin.',
    group: 'B',
  },
  {
    id: 2,
    name: 'Oferta → correo → Amazon',
    budget: '$12 / día',
    dest: 'get.mavra.space/offer/',
    why: 'El descuento se canjea en Amazon, así que también vende — y encima deja el correo, que es lo único que queda nuestro.',
    group: 'A',
  },
  {
    id: 3,
    name: 'Colección → Store',
    budget: '$5 / día',
    dest: 'Store de Amazon',
    why: 'Un solo pin con los tres productos. Es el único caso donde el Store gana: el mensaje es la marca, no una pieza.',
    group: 'C',
  },
]

const GROUP_B = [
  { img: 'b1.jpg', text: 'BLACK ALL THE WAY THROUGH', file: 'mavra-cnd-victorian-detail', prod: 'Skull Candle Set', why: 'Al que ya compró velas negras que se destiñeron.' },
  { img: 'b2.jpg', text: 'IT STAYS UP IN JULY', file: 'mavra-cnd-southern-still', prod: 'Skull Candle Set', why: 'El argumento que más repiten las reseñas.' },
  { img: 'b3.jpg', text: 'LIGHT THE ROOM, NOT THE TABLE', file: 'mavra-lmp-dark-academia-detail', prod: 'Skull Lamp', why: 'Dark Academia · el 84% de la audiencia sigue Education.' },
  { img: 'b4.jpg', text: 'SCULPTED, NOT STAMPED', file: 'mavra-lmp-moody-still', prod: 'Skull Lamp', why: 'Art 87% · la diferencia se ve de cerca.' },
  { img: 'b5.jpg', text: 'ONE PIECE CHANGES THE CORNER', file: 'mavra-cnd-whimsigoth-gesture', prod: 'Skull Candle Set', why: 'DIY 80% · el que decora de a poco.' },
  { img: 'b6.jpg', text: 'THE HOME IS NOT A BACKGROUND', file: 'mavra-lmp-candle-rooms-gesture', prod: 'Skull Lamp', why: 'El tagline, para quien ya está en la estética.' },
  { img: 's1.jpg', text: 'REAL DEPTH, NOT A FLAT PLAQUE', file: 'mavra-swd-moody-detail-01', prod: 'Wall Decor Set of 3', why: 'Lo que más repiten las reseñas de SWD: tienen relieve, no son placas.' },
  { img: 's2.jpg', text: 'SCREWS OR TAPE — YOUR CALL', file: 'mavra-swd-whimsigoth-gesture-01', prod: 'Wall Decor Set of 3', why: 'Para el que alquila y no puede hacer agujeros.' },
  { img: 's3.jpg', text: 'THREE FORMS, NO REPEATS', file: 'mavra-swd-southern-still-01', prod: 'Wall Decor Set of 3', why: 'Prueba que son tres diseños distintos, no el mismo tres veces.' },
]

const GROUP_C = [
  { img: 'col.jpg', text: 'Un producto por banda, tres escenas reales', file: 'triptico · CND victorian · LMP dark academia · SWD whimsigoth', why: 'El pin de marca. Va al Store porque muestra la colección entera, no una pieza.' },
]

const GROUP_A = [
  { img: 'a1.jpg', title: 'Candle Aesthetic Rooms Need Three Things', save: 288, pc: 659, imp: '16.635', out: 2 },
  { img: 'a2.jpg', title: 'Dark Academia Interiors That Feel Like a Gothic Library', save: 176, pc: 499, imp: '18.151', out: 7 },
  { img: 'a3.jpg', title: 'Moody Home Decor Ideas for Every Budget', save: 95, pc: 230, imp: '6.957', out: 1 },
  { img: 'a4.jpg', title: 'Victorian Gothic Interiors: Layering Is Everything', save: 41, pc: 200, imp: '5.072', out: 1 },
  { img: 'a5.jpg', title: 'How to Mix Pastel + Gothic Without It Looking Like a Mess', save: 24, pc: 82, imp: '3.191', out: 1 },
]

export default function PinterestCampaigns() {
  const { text: trText } = useTranslation()

  useReveal()

  return (
    <>
      <div className="page-header">
        <h1>{trText("Campañas Pinterest — ")}{trText(identity.name)}</h1>
        <p className="page-subtitle">{trText("Todo a Estados Unidos · objetivo Consideration · enlace directo · $35 por día · los tres productos")}</p>
      </div>

      <div style={page}>

        {/* ── Diagnóstico ───────────────────────────────────────────── */}
        <section className="reveal" style={band}>
          <div style={eyebrow}>{trText("Punto de partida · medido el 4 de septiembre")}</div>
          <div style={statRow}>
            {DIAGNOSIS.map(([k, v]) => (
              <div key={k} style={stat}>
                <div style={statVal(k === 'Clics salientes')}>{trText(v)}</div>
                <div style={statKey}>{trText(k)}</div>
              </div>
            ))}
          </div>
          <p style={body}>{trText("Noventa días, 44 pines. El alcance existe y es grande — ")}<b>{trText("69.490 vistas al mes con un solo seguidor")}</b>{trText(". Lo que no existe es la salida: de 2.290 personas que abrieron un pin,")}<b>{trText(" 24 llegaron a un sitio nuestro")}</b>{"."}</p>
          <p style={note}>{trText("En orgánico salir cuesta dos clics: uno abre el pin, otro lleva al destino. ")}<b>{trText("Un pin promocionado con enlace directo se salta ese paso")}</b>{trText(", así que el 1% de hoy no predice lo que hará la pauta.")}</p>
        </section>

        {/* ── Audiencia ─────────────────────────────────────────────── */}
        <section className="reveal" style={band}>
          <div style={eyebrow}>{trText("Quién nos está viendo")}</div>
          <div style={statRow}>
            {AUDIENCE.map(([k, v]) => (
              <div key={k} style={stat}>
                <div style={statVal(k === 'En Estados Unidos')}>{trText(v)}</div>
                <div style={statKey}>{trText(k)}</div>
              </div>
            ))}
          </div>
          <p style={body}>{trText("Intereses dominantes: Art 87% · Home Decor 86% · Entertainment 86% · Education 84% · Design 83% · Beauty 82% · DIY 80%. Ciudades: Los Ángeles, Nueva York, Seattle, Chicago, Phoenix.")}</p>
          <p style={warn}>{trText("Solo tres de cada diez personas que nos ven están en Estados Unidos, y vendemos únicamente en Amazon US. ")}<b>{trText("Toda la pauta va segmentada a EE.UU.")}</b>{trText(" — en orgánico ese 70% restante es gratis; en pago sería tirar la plata.")}</p>
        </section>

        {/* ── Campañas ──────────────────────────────────────────────── */}
        <section className="reveal">
          <h2 style={h2}>{trText("Las tres campañas")}</h2>
          <p style={note}>{trText("Sin campaña al blog: la prioridad es vender en Amazon, y el blog no vende. Los pines de un solo producto van a su listado; el de colección, al Store.")}</p>
          <div style={campRow}>
            {CAMPAIGNS.map((c) => (
              <div key={c.id} style={campCard}>
                <div style={campN}>{trText("Campaña ")}{trText(c.id)}{trText(" · Grupo ")}{trText(c.group)}</div>
                <div style={campName}>{trText(c.name)}</div>
                <div style={campBudget}>{trText(c.budget)}</div>
                <div style={campDest}>{"→ "}{trText(c.dest)}</div>
                <p style={campWhy}>{trText(c.why)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Grupo B ───────────────────────────────────────────────── */}
        <section className="reveal">
          <h2 style={h2}>{trText("Campaña 1 · Grupo B — nunca publicados")}</h2>
          <p style={note}>{trText("Nueve pines nunca publicados donde el producto es el protagonista — seis de la Cuarta tanda (CND y LMP) y tres de SWD que quedaron sin subir de la Tercera (tomas ")}<code style={code}>{trText("detail")}</code>{", "}<code style={code}>{trText("still")}</code>{trText(" y")}{' '}
            <code style={code}>{trText("gesture")}</code>{trText("). El texto va quemado sobre la imagen; abajo está simulado en su posición.")}</p>
          <div style={grid}>
            {GROUP_B.map((p) => (
              <article key={p.img} style={card}>
                <div style={thumbWrap}>
                  <img src={`/pinterest/${p.img}`} alt={trText(p.text)} style={thumb} />
                  <div style={overlay}>{trText(p.text)}</div>
                </div>
                <div style={cardBody}>
                  <div style={cardTitle}>{trText(p.text)}</div>
                  <div style={cardFile}>{trText(p.file)}{trText(".jpeg")}</div>
                  <div style={pillAmazon}>{trText("Amazon · ")}{trText(p.prod)}</div>
                  <p style={cardWhy}>{trText(p.why)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Grupo A ───────────────────────────────────────────────── */}
        <section className="reveal">
          <h2 style={h2}>{trText("Campaña 2 · Grupo A — los que ya rinden")}</h2>
          <p style={note}>{trText("Los cinco más guardados de los últimos 90 días. No se les toca la imagen y ya apuntan a la oferta: lo único que cambia es que en pauta el clic lleva directo, sin el paso intermedio.")}</p>
          <div style={grid}>
            {GROUP_A.map((p) => (
              <article key={p.img} style={card}>
                <div style={thumbWrap}>
                  <img src={`/pinterest/${p.img}`} alt={trText(p.title)} style={thumb} />
                </div>
                <div style={cardBody}>
                  <div style={cardTitle}>{trText(p.title)}</div>
                  <div style={cardNums}>
                    <b>{trText(p.save)}</b>{trText(" guardados · ")}{trText(p.pc)}{trText(" clics al pin · ")}{trText(p.imp)}{trText(" impresiones ·")}{' '}
                    <span style={{ color: '#c9564f' }}>{trText(p.out)}{trText(" salidas")}</span>
                  </div>
                  <div style={pillOffer}>{trText("get.mavra.space/offer/")}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Grupo C ───────────────────────────────────────────────── */}
        <section className="reveal">
          <h2 style={h2}>{trText("Campaña 3 · Grupo C — el pin de colección")}</h2>
          <p style={note}>{trText("Tríptico de tres fotos de escena, una por producto, en 1000 × 1500 — el mismo lenguaje de la portada del grupo. ")}<b>{trText("Es el único que va al Store")}</b>{trText(": muestra la colección entera, así que mandarlo a un listado dejaría fuera dos de los tres.")}</p>
          <div style={grid}>
            {GROUP_C.map((p) => (
              <article key={p.img} style={card}>
                <div style={thumbWrap}>
                  <img src={`/pinterest/${p.img}`} alt={trText(p.text)} style={thumb} />
                </div>
                <div style={cardBody}>
                  <div style={cardTitle}>{trText(p.text)}</div>
                  <div style={cardFile}>{trText(p.file)}</div>
                  <div style={pillAmazon}>{trText("Store de Amazon")}</div>
                  <p style={cardWhy}>{trText(p.why)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Segmentación ──────────────────────────────────────────── */}
        <section className="reveal" style={band}>
          <div style={eyebrow}>{trText("Segmentación · igual en las tres campañas")}</div>
          <p style={body}>{trText("Estados Unidos · mujeres y no especificado · 18–44 · todos los emplazamientos · intereses Home Decor, Art, Design y DIY and Crafts, más 20–30 palabras clave por campaña. Puja Performance+, sin tocar nada la primera semana.")}</p>
          <p style={note}>
            <b>{trText("Qué se mide:")}</b>{trText(" A y B corren a la vez con el mismo objetivo. La diferencia entre A y B es el texto sobre la imagen — a los diez días sabemos si el llamado quemado es lo que faltaba.")}</p>
        </section>

        <div className="global-footer">
          {trText(identity.name)}{trText(" — Campañas Pinterest · ")}<a href="/">{trText("Home")}</a>
        </div>
      </div>
    </>
  )
}

/* ── estilos ──────────────────────────────────────────────────────── */
const page = { maxWidth: 1180, margin: '0 auto', padding: '0 1.5rem 4rem' }
const band = {
  border: '1px solid rgba(var(--fg-rgb),0.12)',
  padding: '1.6rem 1.8rem',
  margin: '0 0 2.4rem',
  background: 'rgba(var(--fg-rgb),0.02)',
}
const eyebrow = {
  fontFamily: "'Josefin Sans',sans-serif", fontSize: '.7rem', letterSpacing: '.22em',
  textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '1.1rem',
}
const h2 = {
  fontFamily: "'Cinzel',serif", fontSize: '1.15rem', letterSpacing: '.1em',
  textTransform: 'uppercase', margin: '2.4rem 0 .5rem',
}
const statRow = { display: 'flex', flexWrap: 'wrap', gap: '2.2rem', marginBottom: '1.2rem' }
const stat = { minWidth: 110 }
const statVal = (alert) => ({
  fontFamily: "'Cinzel',serif", fontSize: '1.7rem', lineHeight: 1.1,
  color: alert ? '#c9564f' : 'var(--fg)',
})
const statKey = {
  fontSize: '.74rem', letterSpacing: '.1em', textTransform: 'uppercase',
  color: 'rgba(var(--fg-rgb),0.5)', marginTop: '.3rem',
}
const body = { fontSize: '.95rem', lineHeight: 1.7, color: 'rgba(var(--fg-rgb),0.8)', margin: '0 0 .7rem' }
const note = { fontSize: '.88rem', lineHeight: 1.65, color: 'rgba(var(--fg-rgb),0.55)', margin: '0 0 1rem' }
const warn = { fontSize: '.92rem', lineHeight: 1.65, color: '#c9564f', margin: 0 }
const campRow = { display: 'flex', flexWrap: 'wrap', gap: '1rem', margin: '1rem 0 1rem' }
const campCard = {
  flex: '1 1 320px', border: '1px solid rgba(var(--copper-rgb),0.3)',
  padding: '1.2rem 1.3rem', background: 'rgba(var(--fg-rgb),0.02)',
}
const campN = {
  fontSize: '.7rem', letterSpacing: '.18em', textTransform: 'uppercase',
  color: 'var(--copper)', marginBottom: '.5rem',
}
const campName = { fontFamily: "'Cinzel',serif", fontSize: '1.05rem', marginBottom: '.35rem' }
const campBudget = { fontFamily: "'Cinzel',serif", fontSize: '1.5rem', marginBottom: '.35rem' }
const campDest = { fontSize: '.85rem', color: 'rgba(var(--fg-rgb),0.65)', marginBottom: '.6rem' }
const campWhy = { fontSize: '.85rem', lineHeight: 1.6, color: 'rgba(var(--fg-rgb),0.55)', margin: 0 }
const grid = { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.2rem' }
const card = {
  flex: '1 1 340px', maxWidth: 480, display: 'flex', gap: '.9rem',
  border: '1px solid rgba(var(--fg-rgb),0.1)', padding: '.7rem', background: 'rgba(var(--fg-rgb),0.02)',
}
const thumbWrap = { width: 108, height: 162, flex: 'none', position: 'relative', overflow: 'hidden', background: '#000' }
const thumb = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
const overlay = {
  position: 'absolute', inset: 'auto 0 0 0', padding: '.5rem .35rem .6rem',
  fontFamily: "'Cinzel',serif", fontSize: '.58rem', lineHeight: 1.15, textAlign: 'center',
  textTransform: 'uppercase', color: '#f5f0e8',
  background: 'linear-gradient(to top, rgba(13,11,10,.95) 45%, rgba(13,11,10,0))',
}
const cardBody = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '.4rem' }
const cardTitle = { fontSize: '.92rem', lineHeight: 1.3 }
const cardFile = { fontFamily: 'ui-monospace,monospace', fontSize: '.66rem', color: 'rgba(var(--copper-rgb),0.8)' }
const cardNums = { fontSize: '.78rem', color: 'rgba(var(--fg-rgb),0.6)' }
const cardWhy = { fontSize: '.76rem', fontStyle: 'italic', color: 'rgba(var(--fg-rgb),0.45)', margin: 0 }
const pillBase = {
  display: 'inline-block', fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase',
  padding: '.2rem .55rem', borderRadius: 99, alignSelf: 'flex-start',
}
const pillAmazon = { ...pillBase, color: '#e0a758', border: '1px solid rgba(var(--copper-rgb),0.45)' }
const pillOffer = { ...pillBase, color: '#9fb0d8', border: '1px solid rgba(120,140,190,0.4)', textTransform: 'none', letterSpacing: '.02em' }
const code = { fontFamily: 'ui-monospace,monospace', fontSize: '.82em', color: 'var(--copper)' }
