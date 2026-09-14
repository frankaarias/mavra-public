import { useState } from 'react'

const s = {
  h1: { fontFamily: "var(--font-condensed)", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 400, color: 'var(--fg)', marginBottom: '8px' },
  sub: { fontFamily: "'IM Fell English', serif", fontStyle: 'italic', color: 'rgba(var(--fg-rgb),0.45)', fontSize: '1rem', marginBottom: '40px' },
  sectionLabel: { fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--copper-bright)', marginBottom: '16px', marginTop: '48px' },
  divider: { borderColor: 'rgba(var(--copper-rgb),0.15)', margin: '40px 0' },
  note: { fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: 'rgba(var(--copper-bright-rgb),0.8)', marginTop: '4px' },
  badge: { display: 'inline-block', fontFamily: "var(--font-sans)", fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', marginRight: '4px', marginBottom: '2px' },
}

// ─────────────────────────────────────────────────────────────────────────────
// CRITERIO DE SCORING — cinco señales, ninguna atada a un nicho.
//
// El criterio anterior decía "gótico puro" y se atribuía a "Megan Vasquez /
// Thrasio". Dos problemas: solo servía para MAVRA, y la atribución no tiene
// fuente — no hay estudio ni número detrás. Reescrito el 2026-08-05 para que
// sirva a cualquier marca, y con la hipótesis marcada COMO hipótesis.
//
//   1 ENCAJE        ¿su contenido cruza con la categoría del producto?
//   2 MONETIZACIÓN  ¿tiene storefront de Amazon? (ya sabe vender ahí)
//   3 AUDIENCIA     engagement real, no cantidad de seguidores
//   4 AMPLITUD      ¿recomienda varios productos o vive de un solo tema?
//   5 RIESGO        ¿trabaja con un competidor? ¿su geo compra donde vendés?
//
// A = encaje + storefront + audiencia real            → contactar ya
// B = encaje + audiencia real, sin storefront          → gifting o pago por contenido
// C = encaje parcial o data insuficiente               → UGC barato, no relación
// D = riesgo de competidor, geo que no compra, o sin encaje real → descartar
//
// La AMPLITUD desempata entre A y B: quien recomienda varias cosas tiene
// audiencia acostumbrada a comprarle. Eso es lo que marca `megan: true`.
// ⚠️ Es una HIPÓTESIS nuestra, no un dato de nadie. Se valida o se descarta
// con los resultados del primer lote de outreach.
// ─────────────────────────────────────────────────────────────────────────────

const A1 = [
  // TikTok
  { handle: '@deeeeenacraxy', name: 'Deeena Craxy', platform: 'TikTok', followers: '16K', posts: '—', eng: '7.48% · alc 0.07', content: 'Gothic home, dark decor, spooky Amazon finds', storefront: '✅', score: 'A', megan: false },
  { handle: '@kcallanott', name: 'Kara', platform: 'TikTok', followers: '22K', posts: '—', eng: '10.33% · alc 0.13', content: 'Dark academia interior design, reading nooks, black walls', storefront: '✅', score: 'A', megan: false },
  { handle: '@witchy..aesthetic', name: '—', platform: 'TikTok', followers: '—', posts: '—', eng: '14.58% · alc 12.0', content: '⛔ CUENTA VACIA — Dark Academia, witchy home decor, aesthetic room tours', storefront: '✅', score: 'D', megan: false },
  // ⛔ GEO — Frank, 2026-08-06: es de Australia y MAVRA vende en EE.UU. Su
  // audiencia no compra donde vendemos, así que el alcance no importa. Es la
  // señal 5 (riesgo) y descarta sin mirar métricas, igual que el competidor.
  { handle: '@thegrimmremains', name: '—', platform: 'TikTok', followers: '—', posts: '—', eng: '10.09% · alc 0.25', content: '⛔ GEO AUSTRALIA — su audiencia no compra en el marketplace donde vendemos. Gothic cottagecore, dark interiors.', storefront: '✅', score: 'D', megan: false },
  { handle: '@v.i.x.e.n.x', name: 'Vixenxx', platform: 'TikTok', followers: '113K', posts: '—', eng: '11.04% · alc 0.1', content: 'Alt goth style, dark aesthetic', storefront: '✅', score: 'A', megan: false },
  { handle: '@jasminescozydiary', name: "jasmine's cozy diary", platform: 'TikTok', followers: '79K', posts: '—', eng: '14.43% · alc 0.07', content: '✅ verificado 6-ago — Cozy dark home decor, moody aesthetic', storefront: '✅', score: 'A', megan: false },
  { handle: '@houseofjwls', name: 'HOUSE OF JWLS', platform: 'TikTok', followers: '81K', posts: '—', eng: '9.8% · alc 0.01', content: '✅ verificado 6-ago — Gothic jewelry + home decor', storefront: '✅', score: 'A', megan: false },
  { handle: '@crystalabarista', name: 'Crysta', platform: 'TikTok', followers: '40K', posts: '—', eng: '6.48% · alc 0.07', content: 'Alt style, dark thrifter, gothic finds', storefront: '✅', score: 'A', megan: false },
  { handle: '@themoodyhaus', name: 'themoodyhaus', platform: 'TikTok', followers: '41K', posts: '—', eng: '6.47% · alc 0.67', content: 'Moody gothic home decor, dark interiors', storefront: '✅', score: 'A', megan: false },
  { handle: '@jkcreativecanton', name: 'JKCreativeCanton', platform: 'TikTok', followers: '41K', posts: '—', eng: '8.56% · alc 0.05', content: '✅ verificado 6-ago — Dark creative home decor, gothic aesthetic', storefront: '✅', score: 'A', megan: false },
  { handle: '@lindsayyyvolk', name: 'Lindsay🦇', platform: 'TikTok', followers: '23K', posts: '—', eng: '15.0% · alc 0.16', content: 'Gothic alt lifestyle, dark home content', storefront: '✅', score: 'A', megan: false },
  { handle: '@andsowebuiltalifewelove', name: 'And So We Built a Life We Love', platform: 'TikTok', followers: '20K', posts: '—', eng: '11.28% · alc 0.08', content: 'Dark home building, gothic interior style', storefront: '✅', score: 'A', megan: false },
  { handle: '@ttrickorrtreatt', name: 'Tricks and Treats', platform: 'TikTok', followers: '15K', posts: '—', eng: '7.37% · alc 0.05', content: '⛔ NO NICHO — Halloween decor, spooky gothic home', storefront: '✅', score: 'D', megan: false },
  { handle: '@nikkidrinkscraft', name: 'Nikki Drinks Craft', platform: 'TikTok', followers: '102K', posts: '—', eng: '4.36% · alc 0.04', content: '✅ verificado 6-ago — Curvy alt fashion, goth home decor', storefront: '✅', score: 'A', megan: false },
  { handle: '@countessmanor', name: 'Countess Manor', platform: 'TikTok', followers: '68K', posts: '—', eng: '4.92% · alc 0.03', content: '✅ verificado 6-ago — Vampire, spooky home decor, gothic lifestyle', storefront: '✅', score: 'A', megan: false },
  { handle: '@bridgetteturco', name: 'Bridgette Turco', platform: 'TikTok', followers: '53K', posts: '—', eng: '8.92% · alc 0.02', content: '✅ verificado 6-ago — Gothic home & garden, antiques, dark aesthetic', storefront: '✅', score: 'A', megan: false },
  { handle: '@thejohnsonlair', name: 'The Johnson Lair', platform: 'TikTok', followers: '40K', posts: '—', eng: '6.64% · alc 0.24', content: 'Gothic interiors & decor, dark souls aesthetic', storefront: '✅', score: 'A', megan: false },
  { handle: '@koffinbxnny', name: 'Koffin Bunny', platform: 'TikTok', followers: '24K', posts: '—', eng: '11.23% · alc 0.33', content: 'Southern vampire, home decor & vampy fits', storefront: '✅', score: 'A', megan: false },
  { handle: '@jacquelin.x', name: 'Jacquelin', platform: 'TikTok', followers: '19K', posts: '—', eng: '12.66% · alc 0.15', content: 'Mexigoth, gothic Amazon finds', storefront: '✅', score: 'A', megan: false },
  // TikTok/IG
  { handle: '@_withmandie', name: 'Mandie', platform: 'TikTok/IG', followers: 'IG 90K', posts: '—', eng: '8.23% · alc 0.07', content: '⛔ GEO Alemania — Gothic home decor Amazon finds, goth girl summer, corporate goth', storefront: '✅', score: 'D', megan: true },
  { handle: '@saturns_elixir', name: 'Jivan Fabre', platform: 'TikTok/IG', followers: 'IG 949', posts: '—', eng: '10.25% · alc 0.16', content: 'Whimsigothic Amazon finds, multi-aesthetic (mermaid, coquette, dark)', storefront: '✅', score: 'A', megan: false },
  { handle: '@lexidevail', name: 'Lexi Devail', platform: 'TikTok/IG', followers: '—', posts: '—', eng: '9.91% · alc 0.26', content: 'Whimsigoth bedroom, dark academia room decor', storefront: '✅', score: 'A', megan: false },
  { handle: '@easttnelvira', name: 'East TN Elvira', platform: 'TikTok/IG', followers: '—', posts: '—', eng: '9.36% · alc 0.1', content: 'Witchy home decor, gothic cottagecore, vintage antiques', storefront: '✅', score: 'A', megan: false },
  { handle: '@rebyhardy', name: 'Reby Hardy', platform: 'TikTok/IG', followers: '2.4M', posts: '—', eng: '10.26% · alc 0.01', content: '⛔ NO NICHO — Gothic gallery wall, witchy kitchen, dark home hauls', storefront: '✅', score: 'D', megan: true },
  { handle: '@noirnegina', name: 'Noir Negina', platform: 'TikTok/IG', followers: '82K TT / IG 11K', posts: '—', eng: '9.66% · alc 0.01', content: '✅ verificado 6-ago — Goth mom creator, romantic gothic home decor, Amazon hauls', storefront: '✅', score: 'A', megan: true },
  { handle: '@ashandrosee', name: 'Mia Rose', platform: 'TikTok/IG', followers: '143.3K', posts: '—', eng: '9.37% · alc 0.04', content: '⛔ NO NICHO — Witchy y whimsy home decor, dark aesthetic', storefront: '✅', score: 'D', megan: false },
  // IG
  { handle: '@lavender_daydream_', name: '—', platform: 'IG', followers: '134K', posts: '—', eng: '5.0%', content: 'Goth grunge lifestyle, dark aesthetic', storefront: '✅', score: 'A', megan: false },
  { handle: '@kunnzii', name: 'Veronica', platform: 'IG', followers: '119K', posts: '—', eng: '5.7%', content: 'Witch, dark style, metalhead lifestyle', storefront: '✅', score: 'A', megan: false },
  { handle: '@thehauntina', name: 'Hauntina/Tina', platform: 'IG', followers: '52K', posts: '—', eng: '—', content: 'Halloween, horror, dark home style', storefront: '✅', score: 'A', megan: false },

  // ── Aportados por Frank el 2026-08-05 y medidos ese mismo día. Estuvieron un
  // día entero solo escritos en el chat: el directorio no los tenía, así que
  // NO MOSTRABA a los dos mejores de toda la lista. `storefront: '?'` es
  // literal — no está verificado, y sin esa señal el criterio los deja en B,
  // que para un lote de gifting es la categoría correcta de todos modos.
  { handle: '@dinonuggetshop', name: '—', platform: 'TikTok', followers: '7.964', posts: '—', eng: '9.03% · alc 9.38', content: '🔴 El alcance más alto de los 66 medidos: 74.727 vistas medianas con 7.964 seguidores — casi diez veces su propia audiencia por video', storefront: '?', score: 'B', megan: false },
  { handle: '@sparklefairy679', name: '—', platform: 'TikTok', followers: '50.353', posts: '—', eng: '9.21% · alc 4.00', content: '🔴 201.321 vistas medianas por video. No vende a sus seguidores: la descubre gente nueva cada vez', storefront: '?', score: 'B', megan: false },
  { handle: '@evdreadful', name: '—', platform: 'TikTok', followers: '914.011', posts: '—', eng: '4.92% · alc 0.13', content: '⛔ NO NICHO — El único grande que sí mueve: 122.913 vistas medianas', storefront: '?', score: 'D', megan: false },
  { handle: '@heatherrichh', name: '—', platform: 'TikTok', followers: '120.623', posts: '—', eng: '4.86% · alc 0.09', content: '⛔ NO NICHO — 10.640 vistas medianas', storefront: '?', score: 'D', megan: false },
  { handle: '@mimanorinthewoods', name: '—', platform: 'TikTok', followers: '23.201', posts: '—', eng: '5.35% · alc 0.08', content: '✅ verificado 6-ago — 1.932 vistas medianas', storefront: '?', score: 'A', megan: false },
  { handle: '@modernxmoody', name: '—', platform: 'TikTok', followers: '10.502', posts: '—', eng: '4.83% · alc 0.08', content: '⛔ NO NICHO — 792 vistas medianas', storefront: '?', score: 'D', megan: false },
  { handle: '@veemarhalloween', name: '—', platform: 'TikTok', followers: '17.011', posts: '—', eng: '20.92% · alc 0.07', content: '✅ verificado 6-ago — Engagement altísimo sobre una audiencia que casi no lo ve: 1.259 vista', storefront: '?', score: 'A', megan: false },
  { handle: '@saramarleyy', name: '—', platform: 'TikTok', followers: '33.286', posts: '—', eng: '13.66% · alc 0.06', content: '2.023 vistas medianas', storefront: '?', score: 'C', megan: false },
  { handle: '@cozycovenstickershop', name: '—', platform: 'TikTok', followers: '23.697', posts: '—', eng: '5.03% · alc 0.02', content: '⛔ NO NICHO — 555 vistas medianas', storefront: '?', score: 'D', megan: false },
  { handle: '@.rusticbones', name: '—', platform: 'TikTok', followers: '139.907', posts: '—', eng: '16.10% · alc 0.02', content: '⛔ NO NICHO — 2.866 vistas medianas', storefront: '?', score: 'D', megan: false },
  { handle: '@katherineannsm', name: '—', platform: 'TikTok', followers: '579.405', posts: '—', eng: '8.94% · alc 0.01', content: '⛔ NO NICHO — Medio millón de seguidores y 7.577 vistas medianas', storefront: '?', score: 'D', megan: false },
  { handle: '@_mystic_moon_witch', name: '—', platform: 'TikTok', followers: '536.615', posts: '—', eng: '10.05% · alc 0.01', content: '⛔ GEO Italia — 2.691 vistas medianas', storefront: '?', score: 'D', megan: false },
  { handle: '@justineschiavone1', name: '—', platform: 'TikTok', followers: '435.992', posts: '—', eng: '9.65% · alc 0.01', content: '⛔ NO NICHO — 4.898 vistas medianas', storefront: '?', score: 'D', megan: false },
  { handle: '@neriah.thrifts', name: '—', platform: 'TikTok', followers: '—', posts: '—', eng: '—', content: 'No devolvió datos: cuenta cerrada, privada o renombrada. Sin puntuar — no es lo mismo descartar por no encajar que por falta de datos', storefront: '?', score: undefined, megan: false },
]

const A2 = [
  // TikTok
  { handle: '@chaoticwitchaunt', name: 'Frankie Anne Castanea', platform: 'TikTok', followers: '1.4M', posts: '—', eng: '—', content: '⛔ NO NICHO — Witch lifestyle, decor alternativo, rituales', storefront: '❌ tienda propia', score: 'D', megan: false },
  { handle: '@moonstreetkits', name: 'Andrea Samayoa', platform: 'TikTok', followers: '826.7K', posts: '—', eng: '—', content: '⛔ NO NICHO — Witch lifestyle, decor esotérico, kits rituales', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@coko_thewitch', name: '—', platform: 'TikTok', followers: '580.3K', posts: '—', eng: '—', content: '⛔ NO NICHO — Witch, dark lifestyle, decor oscuro', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@astralwitch', name: 'Ezra', platform: 'TikTok', followers: '518.4K', posts: '—', eng: '—', content: '⛔ CUENTA VACIA — Witch lifestyle, dark aesthetic, espiritual', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@spiritspacecollective', name: 'Stella Morton', platform: 'TikTok', followers: '419.4K', posts: '—', eng: '—', content: '⛔ CUENTA VACIA — Spiritual lifestyle decor, espacio sagrado', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@ayanamadrone', name: '—', platform: 'TikTok', followers: '407.4K', posts: '—', eng: '—', content: '⛔ NO NICHO — Witch lifestyle, dark aesthetic', storefront: '❌ Patreon/Substack', score: 'D', megan: false },
  { handle: '@ivancouture', name: 'Ivan Couture', platform: 'TikTok', followers: '126.5K', posts: '—', eng: '—', content: '⛔ GEO Croacia — Balkan witch, lifestyle alternativo, fashion + decor', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@cocos.cauldron', name: '—', platform: 'TikTok', followers: '110.2K', posts: '—', eng: '—', content: '⛔ GEO Turquia — Witch, cauldron aesthetic, dark decor', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@nikkshae', name: '—', platform: 'TikTok', followers: '—', posts: '—', eng: '—', content: '✅ verificado 6-ago — Victorian gothic, dark coquette, vampire aesthetic home decor', storefront: '❌ Etsy/BloodandBaroque', score: 'A', megan: false },
  { handle: '@aleagueofherhome', name: '—', platform: 'TikTok', followers: '—', posts: '—', eng: '—', content: '✅ verificado 6-ago — Dark gothic home decor educator, Southern Gothic, moody, tropigoth', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@cat.damian', name: '—', platform: 'TikTok', followers: '—', posts: '—', eng: '—', content: '⛔ NO NICHO — Gothic home/kitchen decor DIY, black interiors', storefront: '⚠ link en bio', score: 'D', megan: false },
  { handle: '@spooky_morgz', name: '—', platform: 'TikTok', followers: '—', posts: '—', eng: '—', content: '⛔ NO NICHO — Gothic + cottagecore home decor, first home journey', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@thecraftygoth', name: 'Shianne / The Crafty Goth', platform: 'TikTok', followers: '93K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Gothic DIY crafts, dark home decor, goth lifestyle', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@dominiquebirdxo', name: 'dominiquebirdxo', platform: 'TikTok', followers: '211K', posts: '—', eng: '—', content: '⛔ NO NICHO — Alt lifestyle, dark aesthetic content', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@tayfawn', name: 'Tayl_or_treat', platform: 'TikTok', followers: '172K', posts: '—', eng: '—', content: '⛔ NO NICHO — Halloween, gothic decor, spooky aesthetic', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@xsuchiix', name: '⛧Spooky Suchii⛧', platform: 'TikTok', followers: '233K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Spooky gothic aesthetic, dark lifestyle (Kuwait, EN)', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@enchantedprab', name: 'Enchanted Prab', platform: 'TikTok', followers: '64K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Vintage home, enchanted aesthetic, dark cottagecore', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@theshadowedrosa', name: 'theshadowedrosa', platform: 'TikTok', followers: '10K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Gothic home decor, shadowed aesthetic — "Amazon Storefront ⤵️" en bio ', storefront: '⚠ link en bio', score: 'A', megan: false },
  { handle: '@darkstarhome', name: 'Janelle 🖤 Dark ⭐ Home Decor', platform: 'TikTok', followers: '17K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Dark star home decor, gothic interiors', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@dergothhouse', name: 'DerGothHouse', platform: 'TikTok', followers: '6K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Gothic house content', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@riss.green', name: 'karissa ✨', platform: 'TikTok', followers: '7K', posts: '—', eng: '—', content: 'Alt/gothic aesthetic', storefront: '❌ sin Amazon', score: 'C', megan: false },
  { handle: '@sammitery', name: 'Sammitery', platform: 'TikTok', followers: '435K', posts: '—', eng: '—', content: '⛔ NO NICHO — Alt/goth fashion + dark home decor', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@yung.planet', name: 'Yung Planet', platform: 'TikTok', followers: '416K', posts: '—', eng: '—', content: '⛔ NO NICHO — Dark fashion & beauty, LA', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@kevincharlesdc', name: 'Kevin Charles', platform: 'TikTok', followers: '566K', posts: '—', eng: '—', content: '⛔ NO NICHO — Video creator & designer, dark aesthetic', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@yourfriendthewitch', name: '—', platform: 'TikTok', followers: '246K', posts: '—', eng: '—', content: '⛔ NO NICHO — Witch lifestyle, book author', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@thewolfinlace', name: '—', platform: 'TikTok', followers: '179K', posts: '—', eng: '—', content: '⛔ NO NICHO — Dark fashion, fragrance, folklore', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@summertstyles', name: 'Summer T Styles', platform: 'TikTok', followers: '312K', posts: '—', eng: '—', content: 'Elevated home finds — Amazon & Wayfair', storefront: '❌ sin Amazon', score: 'B', megan: true },
  { handle: '@caitlinorellanahome', name: 'Caitlin Orellana', platform: 'TikTok', followers: '124K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Spooky girl, New Orleans gothic decor', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@opheliathewitch111', name: '—', platform: 'TikTok', followers: '115K', posts: '—', eng: '—', content: '⛔ NO NICHO — Witch, tarot, YouTube, dark lifestyle', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@msvicious', name: 'Ms Vicious', platform: 'TikTok', followers: '121K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Professional thrifter, vintage eclectic interiors', storefront: '❌ sin Amazon', score: 'A', megan: true },
  { handle: '@paintedblackdecor', name: 'Painted Black Decor', platform: 'TikTok', followers: '137K', posts: '—', eng: '—', content: '⛔ COMPETIDOR (paintedblackdecor.com) — Artist of the Dead, vintage junkie, dark decor', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@ilove.skull', name: '—', platform: 'TikTok', followers: '144K', posts: '—', eng: '—', content: '⛔ COMPETIDOR (skullstores.com/shop) — Skulls lover, gothic darkness', storefront: '⚠ posible competidor', score: 'D', megan: false },
  { handle: '@samanthathebat', name: 'Samantha The Bat', platform: 'TikTok', followers: '85K', posts: '—', eng: '—', content: '⛔ NO NICHO — Local Texas vampire, Austin TX gothic lifestyle', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@ultraviolencedreams', name: '—', platform: 'TikTok', followers: '72K', posts: '—', eng: '—', content: '⛔ NO NICHO — Dark alt aesthetic, gothic lifestyle', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@sagestormdesigns', name: 'Sage Storm Designs', platform: 'TikTok', followers: '95K', posts: '—', eng: '—', content: '⛔ NO NICHO — Plus size alt fashion, Denver', storefront: '❌ sin Amazon', score: 'D', megan: false },
  { handle: '@moodyygoodyy', name: 'Moodyygoodyy', platform: 'TikTok', followers: '101K', posts: '—', eng: '—', content: '⛔ COMPETIDOR (Moodygoods.com) — Home decor, dark aesthetic', storefront: '❌ sin Amazon', score: 'D', megan: true },
  { handle: '@ccrystalx66', name: '—', platform: 'TikTok', followers: '47K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Moody goth home, DIYs & finds', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@houseonoctoberdrive', name: 'House on October Drive', platform: 'TikTok', followers: '49K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Gothic decor, spooky lifestyle, SF', storefront: '❌ sin Amazon', score: 'A', megan: false },
  { handle: '@yourghoulfren', name: '—', platform: 'TikTok', followers: '15K', posts: '—', eng: '—', content: '✅ verificado 6-ago — Ghouly things, home/style/hair', storefront: '❌ sin Amazon', score: 'A', megan: false },
  // IG
  { handle: '@heidimaetrix', name: 'Heidi Mae', platform: 'IG', followers: '196K', posts: '—', eng: '—', content: 'Horror movies, alt fashion/lifestyle, spooky finds', storefront: '❌ Depop/Ulta', score: 'B', megan: false },
  { handle: '@jamiekoala', name: 'Jamie Koala', platform: 'IG', followers: '138K', posts: '—', eng: '—', content: 'Dark artist, fashion designer, alternative lifestyle', storefront: '❌ tienda propia', score: 'B', megan: false },
  { handle: '@thegothichaus', name: 'Cherry Lee', platform: 'IG', followers: '21K', posts: '—', eng: '—', content: 'Cozy goth homemaking, bibliophile, dark cozy content', storefront: '❌ sin Amazon', score: 'B', megan: true },
  { handle: '@christinemcconnell', name: 'Christine McConnell', platform: 'IG/Patreon', followers: '—', posts: '—', eng: '—', content: 'Whimsigoth artista, presencia Netflix, decor elaborado', storefront: '❌ sin Amazon', score: 'C', megan: false },
]

const A3 = [
  // IG hubs
  { handle: '@darkhomes', platform: 'IG', followers: '264K', type: 'Aggregator hub', notes: 'Dark homes, interiors, renders — gran audiencia interesada en dark home' },
  { handle: '@ronniefloweerfloral', platform: 'IG', followers: '235K', type: 'Influencer-hub', notes: 'Alt goth & witchy florista + moody home decor, audience comprometida' },
  { handle: '@gothicdecor', platform: 'IG', followers: '200K', type: 'Feature hub', notes: '"Tag to be featured" — gothic/spooky decor, features small businesses' },
  { handle: '@mydarkhome_', platform: 'IG', followers: '155K', type: 'Influencer-hub', notes: 'Eniko Kirkwood — dark maximalist home decor, amplia audiencia' },
  { handle: '@gothic.homes.and.lifestyle', platform: 'IG', followers: '124K', type: 'Feature hub', notes: '"Welcome, Tag Feature Account" — gothic homes y lifestyle' },
  { handle: '@gothichomegarden', platform: 'IG + TikTok + FB', followers: 'IG 90K · TT 79.6K · FB 700K', type: 'Multi-platform hub', notes: 'GothicHomeGarden.com — comunidad multi-plataforma, ideal para paid collab' },
  { handle: '@dark.interiors', platform: 'IG', followers: '75K', type: 'Inspiration hub', notes: '"Dramatic dwellings and cabinets of curiosity" — antiques, oddities' },
  { handle: '@gothic_home', platform: 'IG', followers: '—', type: 'Repost hub', notes: 'Dark interior designs curation/repost account' },
  { handle: '@ladyvampmanor', platform: 'IG', followers: '—', type: 'Influencer-hub', notes: 'Lady Vamp — Victorian Gothic home, artista/diseñadora' },
  { handle: '@beautifully_gothic', platform: 'IG', followers: '—', type: 'Creator', notes: 'Donna Boorman — gothic home decor' },
  { handle: '@hausofroweinteriors', platform: 'IG', followers: '25K', type: 'Designer-hub', notes: 'Western Gothic interior design, award-winning — audience de alto poder adquisitivo' },
  { handle: '@houseofbaroque', platform: 'IG', followers: '16K', type: 'Niche hub', notes: '"Victorian lover, Goth obsessed" — baroque y dark interior decor' },
  // TikTok hubs
  // ⛔ COMPETIDOR — Frank, 2026-08-05. Es una marca de decoración gótica, no un
  // creador. El filtro de alcance ya lo dejaba fuera (0,01), pero por el motivo
  // equivocado: si mañana su engagement sube, una regla basada en números lo
  // dejaría entrar. El riesgo de competidor descarta SIEMPRE, sin mirar métricas.
  { handle: '@theblackenedteeth', platform: 'TikTok', followers: '166.5K / 1.6M likes', type: 'Brand creator', notes: '⛔ COMPETIDOR — Rebecca & Lee, marca de Gothic Home Decor (UK). Descartado por riesgo, no por alcance.', score: 'D' },
  { handle: '@greycourtmanor', platform: 'TikTok', followers: '207K likes/video', type: 'Viral creator', notes: 'Dark academia / gothic Victorian home — contenido viral, paid collabs' , score: 'A'},
  { handle: '@countessmanor', platform: 'TikTok', followers: '—', type: 'Creator', notes: 'Gothic home decor, Amazon affiliate activo — audience alineada con MAVRA', score: 'A' },
  { handle: '@stormymagic', platform: 'TikTok', followers: '—', type: 'Creator', notes: 'Dark home decor, gothic aesthetic' , score: 'D'},
  { handle: '@thedyerghoulhouse', platform: 'TikTok', followers: '—', type: 'Creator', notes: 'Victorian Gothic Architecture — house tour content' },
  { handle: '@darkroseinteriors', platform: 'TikTok', followers: '—', type: 'Creator', notes: 'Gothic home library tours, dark academia interior — paid collab' },
  { handle: '@gothichomegarden', platform: 'TikTok', followers: '79.6K', type: 'Multi-platform hub', notes: 'Ver IG arriba — misma cuenta, cross-platform reach' },
  { handle: '@spiraldirect', platform: 'TikTok', followers: '26K', type: 'Brand', notes: 'Gothic/Alt brand con gothic house tours y home decor content' , score: 'D'},
]

// A4 — Descubiertos por el pipeline de ig-analytics (hashtag discovery, 2026-07-27).
// Ninguno estaba en A1/A2/A3. Ordenados por el video mas visto encontrado.
const A4 = [
  { handle: '@shippingjoy', platform: 'TikTok', followers: '1.8M top video', type: 'Descubierto', notes: 'Mejor video detectado: 1,800,000 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@misspurplesnail', platform: 'TikTok', followers: '503K top video', type: 'Descubierto', notes: 'Mejor video detectado: 503,300 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@zabe1151edp', platform: 'TikTok', followers: '362K top video', type: 'Descubierto', notes: 'Mejor video detectado: 362,100 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@antiquariant', platform: 'TikTok', followers: '304K top video', type: 'Descubierto', notes: 'Mejor video detectado: 303,900 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@katmademebuyit', platform: 'TikTok', followers: '230K top video', type: 'Descubierto', notes: 'Mejor video detectado: 230,200 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@.sara_parker', platform: 'TikTok', followers: '133K top video', type: 'Descubierto', notes: 'Mejor video detectado: 132,700 views — via #gothichome / #gothichomedecor' },
  { handle: '@madnatorr2', platform: 'TikTok', followers: '118K top video', type: 'Descubierto', notes: 'Mejor video detectado: 118,500 views — via #gothichome / #gothichomedecor' , score: 'A'},
  { handle: '@f4d1ng_f4st', platform: 'TikTok', followers: '73K top video', type: 'Descubierto', notes: 'Mejor video detectado: 73,100 views — via #gothichome / #gothichomedecor', score: 'D' },
  { handle: '@lacyndybaby', platform: 'TikTok', followers: '72K top video', type: 'Descubierto', notes: 'Mejor video detectado: 72,200 views — via #gothichome / #gothichomedecor', score: 'D' },
  { handle: '@haraldaustad', platform: 'TikTok', followers: '71K top video', type: 'Descubierto', notes: '⛔ SIN ENCAJE — se define como "el lado colorido de TikTok". Entró por hashtag, no por contenido.', score: 'D' },
  { handle: '@kxjpebs', platform: 'TikTok', followers: '44K top video', type: 'Descubierto', notes: 'Mejor video detectado: 43,700 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@thehickoryhouse', platform: 'TikTok', followers: '38K top video', type: 'Descubierto', notes: '⛔ SIN ENCAJE — Frank lo revisó 2026-08-06: Laura, contenido de fe, nada de la marca. Entró por hashtag y por alcance (0,27), no por contenido.', score: 'D' },
  { handle: '@vivthev4mpire', platform: 'TikTok', followers: '32K top video', type: 'Descubierto', notes: 'Mejor video detectado: 32,200 views — via #gothichome / #gothichomedecor' },
  { handle: '@brittanywhealon', platform: 'TikTok', followers: '29K top video', type: 'Descubierto', notes: '⛔ SIN ENCAJE — no muestra casa ni decoración. Entró por hashtag, no por contenido.', score: 'D' },
  { handle: '@project_thirteen_', platform: 'TikTok', followers: '28K top video', type: 'Descubierto', notes: 'Mejor video detectado: 27,600 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@thewitch_and_theraven', platform: 'TikTok', followers: '23K top video', type: 'Descubierto', notes: 'Mejor video detectado: 22,600 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@wildfein', platform: 'TikTok', followers: '17K top video', type: 'Descubierto', notes: 'Mejor video detectado: 16,600 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@purranormaldecor', platform: 'TikTok', followers: '6K top video', type: 'Descubierto', notes: 'Mejor video detectado: 6,348 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@kerenrosegoth', platform: 'TikTok', followers: '817 top video', type: 'Descubierto', notes: 'Mejor video detectado: 817 views — via #gothichome / #gothichomedecor' , score: 'D'},
  { handle: '@darkinteriorband', platform: 'TikTok', followers: '344 top video', type: 'Descubierto', notes: '⛔ SIN ENCAJE — es una banda de música, no una cuenta de decoración. El nombre engañó al filtro.', score: 'D' },
]

const SCORE_CONFIG = {
  A: { label: 'A — Outreach Ya', color: 'var(--copper-bright)', bg: 'rgba(var(--copper-bright-rgb),0.12)', border: 'rgba(var(--copper-bright-rgb),0.35)' },
  B: { label: 'B — Worth It', color: '#7aacb8', bg: 'rgba(122,172,184,0.10)', border: 'rgba(122,172,184,0.25)' },
  C: { label: 'C — UGC/Gifting', color: 'rgba(var(--fg-rgb),0.35)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(var(--copper-rgb),0.15)' },
  D: { label: 'D — Skip', color: 'rgba(196,65,65,0.5)', bg: 'rgba(196,65,65,0.06)', border: 'rgba(196,65,65,0.15)' },
}

const PLATFORM_ORDER = ['TikTok', 'TikTok/IG', 'IG', 'IG/Patreon', 'IG + TikTok + FB']

function ScoreBadge({ score, megan }) {
  const cfg = SCORE_CONFIG[score] || SCORE_CONFIG.C
  return (
    <span style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: '0.52rem', letterSpacing: '0.12em',
        textTransform: 'uppercase', padding: '2px 6px',
        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}>{score}</span>
      {megan && (
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: '0.52rem', padding: '2px 6px',
          background: 'rgba(96,184,160,0.12)', color: '#60b8a0', border: '1px solid rgba(96,184,160,0.25)',
          whiteSpace: 'nowrap',
        }}>🎯</span>
      )}
    </span>
  )
}

function getPlatformLabel(p) {
  if (p === 'TikTok') return '▶ TikTok'
  if (p.startsWith('TikTok/IG')) return '▶ TikTok + Instagram'
  if (p.startsWith('IG + TikTok')) return '◆ Multi-plataforma'
  return '◆ Instagram'
}

function PlatformDivider({ label }) {
  return (
    <div style={{
      padding: '5px 14px',
      background: 'rgba(var(--copper-rgb),0.07)',
      borderBottom: '1px solid rgba(var(--copper-rgb),0.12)',
      borderTop: '1px solid rgba(var(--copper-rgb),0.08)',
    }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(var(--copper-bright-rgb),0.65)' }}>
        {getPlatformLabel(label)}
      </span>
    </div>
  )
}

function groupByPlatform(arr) {
  const groups = {}
  arr.forEach(item => {
    if (!groups[item.platform]) groups[item.platform] = []
    groups[item.platform].push(item)
  })
  const keys = PLATFORM_ORDER.filter(k => groups[k])
    .concat(Object.keys(groups).filter(k => !PLATFORM_ORDER.includes(k)))
  return keys.map(k => ({ platform: k, items: groups[k] }))
}

function CreatorRow({ item, index }) {
  const isVerified = item.storefront === '✅'
  const hasLink = item.storefront === '⚠ link en bio'
  const isNo = item.storefront.startsWith('❌')
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '160px 100px 50px 50px 1fr 80px',
      gap: '0 10px',
      alignItems: 'start',
      padding: '10px 14px',
      background: index % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
      borderBottom: '1px solid rgba(var(--copper-rgb),0.08)',
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.78rem', color: 'var(--fg)', letterSpacing: '0.02em' }}>{item.handle}</div>
        {item.name && item.name !== '—' && <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: 'rgba(var(--fg-rgb),0.35)' }}>{item.name}</div>}
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: item.followers !== '—' ? 'var(--fg)' : 'rgba(var(--fg-rgb),0.25)' }}>{item.followers}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: item.posts !== '—' ? 'var(--fg)' : 'rgba(var(--fg-rgb),0.25)' }}>{item.posts}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: item.eng !== '—' ? '#60b060' : 'rgba(var(--fg-rgb),0.25)' }}>{item.eng}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.68rem', color: 'rgba(var(--fg-rgb),0.5)', lineHeight: 1.5, flex: 1, minWidth: '120px' }}>{item.content}</span>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '2px 7px', flexShrink: 0, whiteSpace: 'nowrap',
          background: isVerified ? 'rgba(96,176,96,0.12)' : hasLink ? 'rgba(var(--copper-bright-rgb),0.12)' : isNo ? 'rgba(196,65,65,0.08)' : 'rgba(255,255,255,0.04)',
          color: isVerified ? '#60b060' : hasLink ? 'var(--copper-bright)' : isNo ? 'rgba(196,65,65,0.6)' : 'rgba(var(--fg-rgb),0.3)',
          border: `1px solid ${isVerified ? 'rgba(96,176,96,0.2)' : hasLink ? 'rgba(var(--copper-bright-rgb),0.25)' : isNo ? 'rgba(196,65,65,0.15)' : 'rgba(var(--copper-rgb),0.12)'}`,
        }}>{item.storefront}</span>
      </div>
      <ScoreBadge score={item.score} megan={item.megan} />
    </div>
  )
}

function TableHeader() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '160px 100px 50px 50px 1fr 80px',
      gap: '0 10px',
      padding: '8px 14px',
      borderBottom: '1px solid rgba(var(--copper-rgb),0.25)',
      marginBottom: '2px',
    }}>
      {['Handle', 'Seguidores', 'Posts', 'Eng%', 'Contenido + Storefront', 'Score'].map(h => (
        <div key={h} style={{ fontFamily: "var(--font-sans)", fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-bright-rgb),0.7)' }}>{h}</div>
      ))}
    </div>
  )
}

function HubRow({ item, index }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '160px 160px 100px 1fr',
      gap: '0 12px',
      alignItems: 'start',
      padding: '10px 14px',
      background: index % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
      borderBottom: '1px solid rgba(var(--copper-rgb),0.08)',
    }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.78rem', color: 'var(--fg)', letterSpacing: '0.02em' }}>{item.handle}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: item.followers !== '—' ? 'var(--fg)' : 'rgba(var(--fg-rgb),0.25)' }}>{item.followers}</div>
      <div>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', background: 'rgba(var(--copper-rgb),0.12)', color: 'var(--copper-bright)', border: '1px solid rgba(var(--copper-rgb),0.2)' }}>{item.type}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.68rem', color: 'rgba(var(--fg-rgb),0.5)', lineHeight: 1.5 }}>{item.notes}</div>
    </div>
  )
}

function HubHeader() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '160px 160px 100px 1fr',
      gap: '0 12px',
      padding: '8px 14px',
      borderBottom: '1px solid rgba(var(--copper-rgb),0.25)',
      marginBottom: '2px',
    }}>
      {['Handle', 'Audiencia', 'Tipo', 'Notas para outreach'].map(h => (
        <div key={h} style={{ fontFamily: "var(--font-sans)", fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-bright-rgb),0.7)' }}>{h}</div>
      ))}
    </div>
  )
}

function FilterBar({ active, onChange }) {
  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'A', label: 'A — Outreach Ya' },
    { key: 'B', label: 'B — Worth It' },
    { key: 'C', label: 'C — UGC/Gifting' },
    { key: 'D', label: 'D — Skip' },
    { key: 'megan', label: '🎯 Megan Profile' },
  ]
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
      {filters.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '5px 12px',
            cursor: 'pointer',
            border: active === f.key ? '1px solid var(--copper-bright)' : '1px solid rgba(var(--copper-rgb),0.25)',
            background: active === f.key ? 'rgba(var(--copper-bright-rgb),0.15)' : 'transparent',
            color: active === f.key ? 'var(--copper-bright)' : 'rgba(var(--fg-rgb),0.5)',
            transition: 'all 0.15s',
          }}
        >{f.label}</button>
      ))}
    </div>
  )
}

function filterData(data, activeFilter) {
  if (activeFilter === 'all') return data
  if (activeFilter === 'megan') return data.filter(i => i.megan)
  return data.filter(i => i.score === activeFilter)
}

function GroupedCreators({ data, activeFilter }) {
  const filtered = filterData(data, activeFilter)
  const groups = groupByPlatform(filtered)
  let idx = 0
  if (filtered.length === 0) return (
    <div style={{ padding: '20px 14px', fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.3)' }}>
      Sin resultados para este filtro en esta sección.
    </div>
  )
  return (
    <>
      {groups.map(({ platform, items }) => (
        <div key={platform}>
          <PlatformDivider label={platform} />
          {items.map(item => <CreatorRow key={item.handle} item={item} index={idx++} />)}
        </div>
      ))}
    </>
  )
}

function GroupedHubs({ data }) {
  const groups = groupByPlatform(data)
  let idx = 0
  return (
    <>
      {groups.map(({ platform, items }) => (
        <div key={platform}>
          <PlatformDivider label={platform} />
          {items.map(item => <HubRow key={item.handle + item.platform} item={item} index={idx++} />)}
        </div>
      ))}
    </>
  )
}

export default function Directorio() {
  const [filter, setFilter] = useState('all')

  const allCreators = [...A1, ...A2]
  const totalA = allCreators.filter(i => i.score === 'A').length
  const totalMegan = allCreators.filter(i => i.megan).length

  return (
    <div style={{ maxWidth: '100%' }}>
      <h1 style={s.h1}>Directorio de Creadores</h1>
      <p style={s.sub}>A1 — 29 storefronts confirmados · A2 — 43 sin storefront · A3 — 20 hubs para paid ads · A4 — 20 descubiertos por pipeline</p>

      {/* Scoring legend */}
      <div style={{ background: 'rgba(var(--copper-rgb),0.06)', border: '1px solid rgba(var(--copper-rgb),0.18)', padding: '14px 16px', marginBottom: '24px' }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--copper-bright)', marginBottom: '10px' }}>
          Scoring — Criterios Megan Vasquez (Thrasio)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {Object.entries(SCORE_CONFIG).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.52rem', padding: '2px 6px', background: v.bg, color: v.color, border: `1px solid ${v.border}` }}>{k}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: 'rgba(var(--fg-rgb),0.45)' }}>{v.label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.52rem', padding: '2px 6px', background: 'rgba(96,184,160,0.12)', color: '#60b8a0', border: '1px solid rgba(96,184,160,0.25)' }}>🎯</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: 'rgba(var(--fg-rgb),0.45)' }}>Megan Profile — lifestyle multi-product, convert best</span>
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: '0.62rem', color: 'rgba(var(--fg-rgb),0.35)', marginTop: '10px', lineHeight: 1.7 }}>
          {totalA} creators Score A · {totalMegan} Megan Profiles · Señales clave: Amazon storefront activo + contenido home/lifestyle (no solo niche gótico puro) + engagement stories real
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar active={filter} onChange={setFilter} />

      {/* A1 TABLE */}
      {(filter === 'all' || filter === 'A' || filter === 'B' || filter === 'C' || filter === 'D' || filter === 'megan') && (
        <>
          <p style={s.sectionLabel}>A1 — Amazon Storefront Confirmado (29 creadores)</p>
          <div style={{ border: '1px solid rgba(var(--copper-rgb),0.15)', marginBottom: '16px' }}>
            <TableHeader />
            <GroupedCreators data={A1} activeFilter={filter} />
          </div>
          <p style={s.note}>✅ = amazon.com/shop/{'{handle}'} verificado vía curl HTTP 200.</p>
          <hr style={s.divider} />
        </>
      )}

      {/* A2 TABLE */}
      {(filter === 'all' || filter === 'A' || filter === 'B' || filter === 'C' || filter === 'D' || filter === 'megan') && (
        <>
          <p style={s.sectionLabel}>A2 — Nicho Confirmado, Sin Storefront Amazon (43 creadores)</p>
          <div style={{ border: '1px solid rgba(var(--copper-rgb),0.15)', marginBottom: '16px' }}>
            <TableHeader />
            <GroupedCreators data={A2} activeFilter={filter} />
          </div>
          <p style={s.note}>
            Para outreach paid/gifting priority: @chaoticwitchaunt (1.4M TikTok), @heidimaetrix (196K IG).
          </p>
          <hr style={s.divider} />
        </>
      )}

      {/* A3 HUBS */}
      {(filter === 'all') && (
        <>
          <p style={s.sectionLabel}>A3 — Hubs para Paid Ads (20 cuentas — IG + TikTok)</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: '0.8rem', color: 'rgba(var(--fg-rgb),0.5)', marginBottom: '16px', lineHeight: 1.7 }}>
            Cuentas aggregator/hub con audiencias dark/gothic home decor para <span style={{ color: 'var(--fg)' }}>shoutouts y posts patrocinados</span> — el target exacto de MAVRA.
          </p>
          <div style={{ border: '1px solid rgba(var(--copper-rgb),0.15)', marginBottom: '16px' }}>
            <HubHeader />
            <GroupedHubs data={A3} />
          </div>
          <p style={s.note}>
            Prioridad IG (engagement real, no seguidores): @houseofbaroque (15,8K · 7,33%) → @thehauntina (67,7K · 2,88%) → @lavender_daydream_ (589K · 1,20%)<br />
            Prioridad TikTok (alcance = vistas medianas ÷ seguidores): @dinonuggetshop (9,38) → @sparklefairy679 (4,00) → @gothichomegarden (2,92)<br />
            <span style={{ color: 'rgba(196,65,65,0.75)' }}>
              ⛔ @theblackenedteeth queda fuera: es competidor. Y las cuentas grandes rinden peor —
              @gothicdecor 200K con 0,09%, @darkhomes 264K con 0,58%: la prioridad anterior las ponía primero por tamaño.
            </span>
          </p>
        </>
      )}

      {/* A4 — DESCUBIERTOS POR EL PIPELINE */}
      {(filter === 'all') && (
        <>
          <hr style={s.divider} />
          <p style={s.sectionLabel}>A4 — Descubiertos por hashtag (20 creadores)</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: '0.8rem', color: 'rgba(var(--fg-rgb),0.5)', marginBottom: '16px', lineHeight: 1.7 }}>
            Salidos del pipeline de <span style={{ color: 'var(--fg)' }}>ig-analytics</span> rastreando #gothichome y #gothichomedecor.
            Ninguno estaba en A1/A2/A3, y su punta rinde muy por encima del directorio curado.
          </p>
          <div style={{ border: '1px solid rgba(var(--copper-rgb),0.15)', marginBottom: '16px' }}>
            <HubHeader />
            <GroupedHubs data={A4} />
          </div>
          <p style={s.note}>
            Referencia del nicho: @shippingjoy — 1.8M views con manos de pared que sostienen velas (wall decor funcional).
          </p>
        </>
      )}
    </div>
  )
}
