// Trae la primera página de Amazon para cada búsqueda del plan del derivador.
//
// Por qué existe, en vez de usar el actor de Apify que ya andaba: son ~700
// búsquedas y cada nicho nuevo suma más. Acá es headless local — sin costo por
// llamada. Frank, 2026-08-06: "1. headless por favor".
//
// 🔴 Lo que NO funciona, probado hoy: `fetch()` a la SERP desde una pestaña de
// amazon.com. Los primeros 5 vuelven con 200 y 700 KB, y a partir de ahí Amazon
// devuelve 200 con 2,3 KB — la página de "algo salió mal". No es captcha ni
// bloqueo de IP: la navegación normal (goto) sigue andando en la misma sesión.
// O sea que el throttle es del XHR, no del navegador. Por eso acá se NAVEGA.
//
// Se recorta a los primeros 16 ORGÁNICOS a propósito: los 78 tokens ya medidos
// vinieron del actor de Apify, que devolvía 16, y la validación de la señal se
// hizo sobre esa base ("DeWalt 16 de 16"). Una página trae 48: mezclarlos haría
// que la misma marca diera 100% en una medición vieja y 33% en una nueva.
//
// Reanudable: escribe JSONL a medida que avanza y saltea los tokens que ya
// están. Un corte no pierde lo traído.
//
// Necesita playwright, que este repo no tiene. Se corre desde donde sí está:
//
//   cd D:\bots\tecki\_staging\serp_scraper     (npm i playwright + npx playwright install chromium)
//   node D:\dev\mavra\dashboard\scripts\scrape_serp.mjs [--limite N] [--desde N]
//
// Cuando Amazon está bloqueando (páginas 200 sin tarjetas), el ritmo importa más
// que el número de reintentos. Para una corrida larga y tranquila:
//
//   node scrape_serp.mjs --pausa 8000 --racha 8 --descanso 180000
//
// El pipeline completo:
//   1. python plan_serp.py      → serp_plan.json   (qué buscar, de qué token)
//   2. node   scrape_serp.mjs   → serp_headless.jsonl
//   3. python ingest_serp.py    → el caché de cuota, un archivo por token
//   4. python correr_nichos.py --todos --solo-cache   → reclasifica gratis

import fs from 'node:fs'
import path from 'node:path'

// playwright no está en este repo — vive en el dir del scraper. Un import ESM se
// resuelve desde la UBICACIÓN DEL ARCHIVO, no desde el cwd, así que "correrlo
// desde donde sí está" no alcanza. Antes se resolvía copiando este archivo al
// dir del scraper, y esa copia es exactamente el patrón de las dos fuentes del
// mismo dato que se desincronizan sin que nadie se entere.
const RESERVA = 'file:///D:/bots/tecki/_staging/serp_scraper/node_modules/playwright/index.mjs'
const { chromium } = await import('playwright').catch(() => import(RESERVA))

const CACHE = 'D:\\dev\\mavra\\_staging\\derivador'
const PLAN = path.join(CACHE, 'serp_plan.json')
const OUT = path.join(CACHE, 'serp_headless.jsonl')
const TOPE_ORGANICOS = 16

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const arg = (n, d) => {
  const i = process.argv.indexOf(n)
  return i > -1 ? Number(process.argv[i + 1]) : d
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Ritmo entre búsquedas, en ms. El default de 900 anduvo para 673 seguidas y
// después Amazon empezó a devolver páginas sin tarjetas: 4 con datos de cada 40.
// Se hace configurable en vez de fijar un número nuevo porque el umbral se
// mueve — lo que hoy pasa a 8 s mañana puede necesitar 15.
const PAUSA = arg('--pausa', 900)

// Frenos ante bloqueo. Reintentar 3 veces CADA búsqueda mientras Amazon está
// bloqueando no la recupera: mantiene la presión y quema 15 s por búsqueda
// perdida. Cuando hay una racha de vacías, lo que sirve es dejar de pedir un
// rato largo, y si aun así no vuelve, salir limpio en vez de gastar la noche.
const RACHA_ALERTA = arg('--racha', 8)      // vacías consecutivas para frenar
const DESCANSO_MS = arg('--descanso', 120000)  // cuánto se espera en el freno
const MAX_FRENOS = arg('--max-frenos', 4)   // frenos seguidos sin recuperar → salir

const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'))

// Tokens ya traídos CON DATOS en corridas anteriores (reanudar sin repetir).
//
// 🔴 Antes contaba como "hecho" cualquier línea escrita, incluidas las que
// volvieron con 0 resultados. El 2026-08-06 Amazon empezó a bloquear a mitad de
// corrida y devolvió 26 vacías seguidas: las 26 quedaron marcadas como traídas y
// **el reanudador no las iba a reintentar nunca**. La ingesta las saltea (no
// envenena el caché), así que el hueco no daba error en ninguna parte — solo
// bajaba la cobertura en silencio.
//
// Un vacío es "no lo pude traer", no "no hay nada". Se reintenta.
// Se COMPACTA al leer: una línea por token, la que trajo datos si existe. Sin
// esto el archivo crece con la misma búsqueda vacía repetida en cada corrida
// —y ya iba en 114— hasta que el conteo de "vacías previas" dejara de significar
// algo. El archivo es la memoria de lo traído, no el log de los intentos.
const hechos = new Set()
const mejor = new Map()
if (fs.existsSync(OUT)) {
  for (const linea of fs.readFileSync(OUT, 'utf8').split('\n')) {
    if (!linea.trim()) continue
    try {
      const d = JSON.parse(linea)
      const n = (d.items || []).length
      const prev = mejor.get(d.token)
      if (!prev || n > (prev.items || []).length) mejor.set(d.token, d)
      if (n) hechos.add(d.token)
    } catch {}
  }
  const compactado = [...mejor.values()].map((d) => JSON.stringify(d)).join('\n') + '\n'
  fs.writeFileSync(OUT, compactado)
}
const vacias_previas = mejor.size - hechos.size
console.log(`en disco ${mejor.size} búsquedas · con datos ${hechos.size}` +
            (vacias_previas ? ` · ${vacias_previas} sin resultados, se reintentan` : ''))

const pendientes = plan.slice(arg('--desde', 0)).filter((p) => !hechos.has(p.token))
const total = Math.min(pendientes.length, arg('--limite', pendientes.length))
console.log(`plan ${plan.length} · ya traídos ${hechos.size} · a traer ${total}`)

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({
  userAgent: UA,
  locale: 'en-US',
  viewport: { width: 1440, height: 900 },
})
const page = await ctx.newPage()
// Sin imágenes ni fuentes: la SERP pesa ~4 MB y de eso no se usa un solo píxel.
// Bajó el tiempo por búsqueda de ~1,7 s a ~1,0 s.
await ctx.route('**/*', (route) => {
  const t = route.request().resourceType()
  return t === 'image' || t === 'font' || t === 'media' ? route.abort() : route.continue()
})

const salida = fs.createWriteStream(OUT, { flags: 'a' })
let ok = 0
let vacias = 0
let racha = 0        // vacías consecutivas AHORA
let frenos = 0       // frenos seguidos sin recuperar una sola
const t00 = Date.now()

for (let i = 0; i < total; i++) {
  const p = pendientes[i]
  // Con el bloqueo activo, reintentar dentro de la búsqueda es tirar tiempo:
  // un solo intento y que el freno de la racha haga el trabajo.
  const intentos = racha >= RACHA_ALERTA / 2 ? 1 : 3
  let items = []
  for (let intento = 1; intento <= intentos && items.length === 0; intento++) {
    try {
      await page.goto(p.url + '&language=en_US', { waitUntil: 'domcontentloaded', timeout: 30000 })
      items = await page.evaluate((tope) => {
        const cards = [...document.querySelectorAll('[data-component-type="s-search-result"]')]
        const out = []
        for (const c of cards) {
          const sponsored =
            !!c.querySelector('.puis-sponsored-label-text, .s-sponsored-label-text') ||
            /^sponsored$/i.test((c.querySelector('.a-color-secondary .a-size-mini')?.textContent || '').trim())
          const title = (c.querySelector('img.s-image')?.getAttribute('alt') || '').trim()
          if (!title) continue
          out.push({ title, brand: (c.querySelector('h2')?.textContent || '').trim(), isSponsored: sponsored })
          // El tope cuenta ORGÁNICOS: un anuncio no dice quién rankea, dice
          // quién pagó, y no puede desplazar a un orgánico de la muestra.
          if (out.filter((x) => !x.isSponsored).length >= tope) break
        }
        return out
      }, TOPE_ORGANICOS)
    } catch (e) {
      items = []
    }
    if (items.length === 0) {
      vacias++
      await sleep(5000 * intento) // el throttle de Amazon afloja solo; se le da aire
    }
  }
  salida.write(JSON.stringify({ token: p.token, nucleo: p.nucleo, url: p.url, items }) + '\n')
  if (items.length) { ok++; racha = 0; frenos = 0 } else racha++

  // El freno. Una racha de vacías no es mala suerte: es Amazon cerrando la
  // puerta, y la única cosa que la reabre es dejar de golpearla. El descanso
  // crece con cada freno seguido, y si tras MAX_FRENOS no volvió una sola, se
  // sale limpio: lo traído queda en disco y la próxima corrida lo retoma —
  // ahora que las vacías ya no cuentan como hechas.
  if (racha >= RACHA_ALERTA) {
    frenos++
    if (frenos > MAX_FRENOS) {
      console.log(`\nBLOQUEO SOSTENIDO · ${frenos - 1} descansos sin recuperar una sola. ` +
                  `Salgo con ${ok} de ${i + 1}. Lo pendiente se retoma en la próxima corrida.`)
      break
    }
    const espera = DESCANSO_MS * frenos
    console.log(`freno ${frenos}/${MAX_FRENOS} · ${racha} vacías seguidas · ` +
                `descanso de ${Math.round(espera / 1000)} s`)
    await sleep(espera)
    racha = 0
  }
  if ((i + 1) % 25 === 0 || i + 1 === total) {
    const min = (Date.now() - t00) / 60000
    console.log(
      `${i + 1}/${total} · con datos ${ok} · vacías ${vacias} · ${min.toFixed(1)} min · ` +
        `quedan ~${(((total - i - 1) * min) / (i + 1)).toFixed(0)} min`,
    )
  }
  await sleep(PAUSA + Math.random() * PAUSA)
}

salida.end()
await browser.close()
console.log(`LISTO · ${ok} de ${total} con datos · ${((Date.now() - t00) / 60000).toFixed(1)} min`)
