// Last scraped: 2026-05-18 via Apify

const TT = '🎵' // TikTok icon text fallback
const IG = '📸'

const PRIORITY = [
  { handle: '@rebyhardy', followers: '2.5M', hearts: '159.6M', videos: 3558, verified: true, niche: 'Gothic Baby · NYC/LA/NC', product: 'SWD · CND · LMP', fit: 'mega', platform: 'tt', email: 'rebyhardy@grail-talent.com', note: 'Verified, talent agent — Creator Connections tier' },
  { handle: '@chaoticwitchaunt', followers: '1.4M', hearts: '93.5M', videos: 3333, verified: false, niche: 'Folk witch · lifestyle', product: 'CND · LMP', fit: 'high', platform: 'tt', note: 'DMs may be closed, has IG + YT' },
  { handle: '@moonstreetkits', followers: '832.4K', hearts: '15.2M', videos: 2307, verified: false, niche: 'Witchtok Tia · esotérico', product: 'CND', fit: 'high', platform: 'tt', note: 'DMs CLOSED' },
  { handle: '@sammitery', followers: '435.2K', hearts: '9.4M', videos: 1160, verified: false, niche: 'Alt/goth · fashion · home', product: 'SWD · LMP', fit: 'high', platform: 'tt' },
  { handle: '@yung.planet', followers: '416.5K', hearts: '10.8M', videos: 1185, verified: false, niche: 'Dark fashion & beauty · LA', product: 'LMP · CND', fit: 'high', platform: 'tt' },
  { handle: '@nikkshae', followers: '252.3K', hearts: '8.6M', videos: null, verified: false, niche: 'Decor · fantasy · tutorials', product: 'SWD · LMP', fit: 'high', platform: 'tt', note: 'Also on IG' },
  { handle: '@yourfriendthewitch', followers: '246.4K', hearts: '3.4M', videos: null, verified: false, niche: 'Witch lifestyle · book author', product: 'CND', fit: 'medium', platform: 'tt' },
  { handle: '@thewolfinlace', followers: '179K', hearts: '7.1M', videos: null, verified: false, niche: 'Dark fashion · fragrance · folklore', product: 'CND · LMP', fit: 'medium', platform: 'tt' },
  { handle: '@kevincharlesdc', followers: '566.6K', hearts: '5.2M', videos: null, verified: false, niche: 'Video creator · designer', product: 'SWD', fit: 'medium', platform: 'tt', email: 'kevincharlesdc@gmail.com' },
  { handle: '@caitlinorellanahome', followers: '124.1K', hearts: '4.1M', videos: null, verified: false, niche: 'Spooky girl · New Orleans 🖤⚜️', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt', email: 'caitlinobremski@outlook.com' },
  { handle: '@aleagueofherhome', followers: '108.5K', hearts: '3.6M', videos: 1198, verified: false, niche: 'Dark Eclectic Decor · Vintage Treasure Hunter', product: 'SWD · LMP', fit: 'exact', platform: 'tt' },
  { handle: '@nikkidrinkscraft', followers: '102.1K', hearts: '1.4M', videos: null, verified: false, niche: 'Curvy alt fashion & goth home decor', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt', email: 'hello@nikkidrinkscraft.com', note: 'Has collab email ✅' },
  { handle: '@moodyygoodyy', followers: '101.9K', hearts: '1.4M', videos: null, verified: false, niche: 'Home decor · dark aesthetic', product: 'SWD · LMP', fit: 'medium', platform: 'tt' },
  { handle: '@sagestormdesigns', followers: '95.5K', hearts: '2M', videos: null, verified: false, niche: 'Plus size alt fashion · Denver', product: 'CND', fit: 'medium', platform: 'tt', email: 'sagestormdesigns@gmail.com' },
  { handle: '@opheliathewitch111', followers: '115.9K', hearts: '5.2M', videos: null, verified: false, niche: 'Witch · tarot · YouTube', product: 'CND', fit: 'medium', platform: 'tt' },
  { handle: '@paintedblackdecor', followers: '137.6K', hearts: '1.4M', videos: null, verified: false, niche: 'Artist of the Dead · Vintage Junkie', product: 'SWD · LMP', fit: 'exact', platform: 'tt' },
  { handle: '@ilove.skull', followers: '144.1K', hearts: '1.8M', videos: null, verified: false, niche: 'Skulls Lover · Gothic darkness', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt', note: '⚠️ Puede ser competidor' },
  { handle: '@summertstyles', followers: '312.8K', hearts: '6.8M', videos: null, verified: false, niche: 'Elevated home finds · Amazon & Wayfair', product: 'SWD', fit: 'medium', platform: 'tt' },
  { handle: '@samanthathebat', followers: '85.6K', hearts: '2.6M', videos: null, verified: false, niche: 'Local Texas vampire · Austin TX', product: 'SWD · LMP', fit: 'exact', platform: 'tt', email: 'sam@brotege.com' },
  { handle: '@ultraviolencedreams', followers: '72.1K', hearts: '5.7M', videos: null, verified: false, niche: '⚔️🕯️🏰🏹 dark aesthetic', product: 'SWD · LMP', fit: 'high', platform: 'tt' },
  { handle: '@houseofjwls', followers: '81.5K', hearts: '4.5M', videos: null, verified: false, niche: 'Rock n roll home · mother/artist', product: 'SWD', fit: 'high', platform: 'tt', email: 'houseofjwls@gmail.com' },
  { handle: '@msvicious', followers: '121.6K', hearts: '2.2M', videos: null, verified: false, niche: 'Professional Thrifter · Vintage Eclectic Interiors', product: 'SWD', fit: 'high', platform: 'tt' },
  { handle: '@countessmanor', followers: '68.2K', hearts: '2M', videos: null, verified: false, niche: 'Vampire · Spooky · Home decor', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt' },
  { handle: '@bridgetteturco', followers: '53.2K', hearts: '1.5M', videos: null, verified: false, niche: 'Gothic home & garden · Antiques', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt' },
  { handle: '@ccrystalx66', followers: '47.2K', hearts: '1.7M', videos: null, verified: false, niche: 'Moody goth home | DIYs & finds', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt' },
  { handle: '@houseonoctoberdrive', followers: '49.8K', hearts: '575.3K', videos: null, verified: false, niche: 'Gothic decor · spooky lifestyle · SF', product: 'SWD · LMP', fit: 'exact', platform: 'tt', email: 'houseonoctoberdrive@gmail.com', note: 'Email disponible ✅' },
  { handle: '@thejohnsonlair', followers: '40.2K', hearts: '795.3K', videos: null, verified: false, niche: 'Gothic Interiors & Decor · dark souls', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt' },
  { handle: '@themoodyhaus', followers: '41.2K', hearts: '1.2M', videos: null, verified: false, niche: 'Renovating my home 🖤', product: 'SWD', fit: 'high', platform: 'tt' },
  { handle: '@koffinbxnny', followers: '24.1K', hearts: '537.4K', videos: null, verified: false, niche: 'Southern Vampire · Home Decor & Vampy Fits', product: 'SWD · CND', fit: 'exact', platform: 'tt', note: 'Southern Gothic exact match' },
  { handle: '@kcallanott', followers: '22.4K', hearts: '1M', videos: 128, verified: false, niche: 'Cozy home + books 📖🕯️🖤', product: 'SWD · LMP', fit: 'high', platform: 'tt', email: 'kcallanott@gmail.com' },
  { handle: '@deeeeenacraxy', followers: '16.3K', hearts: '849.9K', videos: 101, verified: false, niche: '🕷 Spooky season everyday', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt' },
  { handle: '@lexidevail', followers: '17.9K', hearts: '779.4K', videos: 200, verified: false, niche: 'Whimsigoth · alt · nostalgia living 🇵🇷', product: 'LMP', fit: 'high', platform: 'tt' },
  { handle: '@yourghoulfren', followers: '15.9K', hearts: '616.7K', videos: null, verified: false, niche: 'Ghouly things · Home | Style | Hair', product: 'SWD · CND', fit: 'high', platform: 'tt' },
  { handle: '@theshadowedrosa', followers: '10.7K', hearts: '499.8K', videos: null, verified: false, niche: 'Home decor | art 🥀', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt', note: '✅ Amazon Storefront activo' },
  { handle: '@jacquelin.x', followers: '19.1K', hearts: '1.2M', videos: 327, verified: false, niche: 'Mexigoth · Gothic Amazon finds', product: 'SWD · CND · LMP', fit: 'exact', platform: 'tt', note: 'Has IG: Jacquelin.x' },
  { handle: '@easttnelvira', followers: '9.5K', hearts: '358K', videos: 137, verified: false, niche: 'Boudoir Photographer · Antiques · Plants', product: 'CND', fit: 'high', platform: 'tt' },
]

const FLAGGED = [
  { handle: '@witchy..aesthetic', reason: 'Cuenta muerta — 4 seguidores, 1 video' },
  { handle: '@saturns_elixir', reason: 'Artista musical — sin contenido de home decor' },
  { handle: '@_withmandie', reason: 'Basada en Alemania (📍Germany en bio) — no US' },
]

const PHASES = [
  { label: 'Identificados', count: 35, color: '#6090d0', bg: 'rgba(40,80,180,0.12)' },
  { label: 'Contactados', count: 0, color: '#c0a030', bg: 'rgba(140,120,20,0.12)' },
  { label: 'Negociando', count: 0, color: '#c470e0', bg: 'rgba(120,50,180,0.12)' },
  { label: 'Enviado', count: 0, color: '#60b080', bg: 'rgba(40,140,80,0.12)' },
  { label: 'Live', count: 0, color: '#60c0b0', bg: 'rgba(40,160,140,0.12)' },
]

const fitConfig = {
  exact: { bg: 'rgba(100,50,180,0.18)', color: '#a070e0', label: 'Exact Match' },
  high: { bg: 'rgba(40,80,180,0.15)', color: '#6090d0', label: 'High Fit' },
  medium: { bg: 'rgba(var(--copper-rgb),0.15)', color: 'var(--copper-bright)', label: 'Medium Fit' },
  mega: { bg: 'rgba(var(--copper-bright-rgb),0.2)', color: '#FFB830', label: 'Mega' },
}

const PlatformIcon = ({ p }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', background: p === 'tt' ? 'rgba(0,0,0,0.3)' : 'rgba(180,80,100,0.2)', borderRadius: '4px', fontSize: '9px', color: p === 'tt' ? 'var(--fg)' : '#F080A0', flexShrink: 0 }}>
    {p === 'tt' ? 'TT' : 'IG'}
  </span>
)

export default function Pipeline() {
  return (
    <div style={{ maxWidth: '1600px' }}>
      <div style={{ marginBottom: '48px' }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--copper-bright)', marginBottom: '16px' }}>Pipeline · Outreach</p>
        <h1 style={{ fontFamily: "var(--font-condensed)", fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 400, color: 'var(--fg)', marginBottom: '12px', lineHeight: 1.1 }}>
          35 creadores identificados
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: '1rem', color: 'rgba(var(--fg-rgb),0.45)', lineHeight: 1.7, maxWidth: '640px' }}>
          Datos reales de seguidores vía Apify · Scraped 2026-05-18 · Objetivo: 50+ en pipeline
        </p>
      </div>

      {/* Funnel */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '64px' }}>
        {PHASES.map((p, i) => (
          <div key={i} style={{ flex: 1, padding: '20px 16px', background: 'rgba(255,255,255,0.02)', borderTop: `3px solid ${p.color}40`, textAlign: 'center' }}>
            <div style={{ fontFamily: "var(--font-condensed)", fontSize: '2.4rem', color: p.color, lineHeight: 1, marginBottom: '8px' }}>{p.count}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.4)', letterSpacing: '0.05em' }}>{p.label}</div>
          </div>
        ))}
      </div>

      {/* Creator cards */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'baseline', gap: '16px', borderBottom: '1px solid rgba(var(--copper-rgb),0.15)', paddingBottom: '16px' }}>
        <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: '1.1rem', fontWeight: 400, color: 'var(--fg)' }}>Pipeline completo</h2>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.3)' }}>{PRIORITY.length} creadores · TikTok principal</span>
        <span style={{ marginLeft: 'auto', fontFamily: "var(--font-sans)", fontSize: '0.6rem', color: 'rgba(var(--fg-rgb),0.3)' }}>
          ✅ Con email  ·  ⚠️ Flag  ·  📱 Storefront
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '10px', marginBottom: '48px' }}>
        {PRIORITY.map((c, i) => {
          const fc = fitConfig[c.fit] || fitConfig.medium
          return (
            <a
              key={i}
              href={`https://tiktok.com/${c.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(var(--copper-rgb),0.1)', borderLeft: c.fit === 'exact' ? '3px solid rgba(var(--copper-bright-rgb),0.5)' : c.fit === 'mega' ? '3px solid #FFB830' : '3px solid rgba(var(--copper-rgb),0.2)', padding: '16px 18px' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(var(--copper-rgb),0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <PlatformIcon p={c.platform} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.9rem', color: 'var(--copper-bright)', fontWeight: 600, flex: 1 }}>{c.handle}</span>
                {c.verified && <span style={{ fontSize: '0.6rem', color: '#6090d0', background: 'rgba(40,80,180,0.15)', padding: '1px 5px', fontFamily: "var(--font-sans)" }}>VERIFIED</span>}
                <span style={{ display: 'inline-block', background: fc.bg, color: fc.color, fontFamily: "var(--font-sans)", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 6px', fontWeight: 600 }}>{fc.label}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <span style={{ fontFamily: "var(--font-condensed)", fontSize: '1rem', color: 'var(--fg)' }}>{c.followers}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.65rem', color: 'rgba(var(--fg-rgb),0.3)' }}>{c.hearts} hearts</span>
                {c.videos && <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.65rem', color: 'rgba(var(--fg-rgb),0.25)' }}>{c.videos} videos</span>}
              </div>

              <p style={{ fontFamily: "var(--font-sans)", fontSize: '0.75rem', color: 'rgba(var(--fg-rgb),0.45)', marginBottom: c.email || c.note ? '8px' : '0', lineHeight: 1.5 }}>{c.niche}</p>

              {(c.email || c.note) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {c.email && <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: '#60b060', background: 'rgba(40,120,40,0.1)', padding: '2px 6px' }}>✉ {c.email}</span>}
                  {c.note && <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: 'rgba(var(--fg-rgb),0.35)', fontStyle: 'italic' }}>{c.note}</span>}
                </div>
              )}
              <div style={{ marginTop: '8px', fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: 'rgba(var(--copper-rgb),0.6)' }}>Producto: {c.product}</div>
            </a>
          )
        })}
      </div>

      {/* Flagged */}
      <div style={{ marginBottom: '48px' }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,65,65,0.7)', marginBottom: '12px' }}>
          Eliminados del pipeline
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {FLAGGED.map((f, i) => (
            <div key={i} style={{ background: 'rgba(196,65,65,0.06)', border: '1px solid rgba(196,65,65,0.15)', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.8rem', color: 'rgba(196,65,65,0.7)', textDecoration: 'line-through' }}>{f.handle}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.68rem', color: 'rgba(var(--fg-rgb),0.3)' }}>{f.reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next */}
      <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(var(--copper-bright-rgb),0.15)', padding: '28px 32px' }}>
        <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: '1rem', fontWeight: 400, color: 'var(--fg)', marginBottom: '20px' }}>Próximos pasos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--copper-bright)', marginBottom: '12px' }}>Para llegar a 50+</p>
            {['2do run de hashtags en progreso (#witchhome #darkdecor)', 'Buscar en Instagram (cuentas de dark home decor US)', 'Scraping YouTube: "gothic home decor Amazon haul"', 'Verificar handles sin followers reales aún (7 pendientes)'].map((t, i) => (
              <div key={i} style={{ fontFamily: "var(--font-sans)", fontSize: '0.8rem', color: 'rgba(var(--fg-rgb),0.5)', padding: '7px 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.07)', display: 'flex', gap: '10px' }}>
                <span style={{ color: '#6090d0' }}>◉</span>{t}
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)', marginBottom: '12px' }}>Decisiones pendientes de Frank</p>
            {['Oferta: producto / comisión / mixto', 'Qué producto enviar primero', 'Amazon listings live (para links en brief)', 'Follower mínimo para gifting'].map((t, i) => (
              <div key={i} style={{ fontFamily: "var(--font-sans)", fontSize: '0.8rem', color: 'rgba(var(--fg-rgb),0.5)', padding: '7px 0', borderBottom: '1px solid rgba(var(--copper-rgb),0.07)', display: 'flex', gap: '10px' }}>
                <span style={{ color: 'rgba(var(--copper-bright-rgb),0.4)' }}>☐</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
