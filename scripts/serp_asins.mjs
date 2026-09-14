// Para cada nicho, trae los ASINs que rankean orgánicamente en la primera página.
//
// Por qué existe: el universo de keywords del derivador lo daba Magnet
// (get_keywords_by_keyword), y esa tool del MCP de Helium 10 devuelve
// `session expired` mientras las otras 45 responden — probado una por una el
// 2026-08-06. Cerebro (reverse ASIN) sí anda, así que el universo se arma como
// lo arma el dueño de un MKL: los competidores que rankean, y las keywords por
// las que rankean.
//
// Lo que se gana en el cambio, y no es consuelo: Magnet devolvía keywords
// sueltas. La unión de N competidores dice ADEMÁS en cuántos de ellos aparece
// cada keyword — la RELEVANCIA, que es el gate que separa el nicho del ruido de
// categoría. El universo sale con la señal adentro en vez de tener que
// inferirla después.
//
// Se toman ORGÁNICOS solamente: un patrocinado dice quién pagó, no quién
// rankea, y para reverse-ASIN quiero a los que Amazon eligió.
//
//   cd D:\bots\tecki\_staging\serp_scraper
//   node D:\dev\mavra\dashboard\scripts\serp_asins.mjs [--top 8]
//
// Salida: _staging/derivador/asins_nichos.json  → {nicho: [asin, ...]}
// Reanudable: los nichos ya resueltos no se vuelven a pedir.

import fs from 'node:fs'
import path from 'node:path'

// playwright no está en este repo — vive en el dir del scraper. Un import ESM se
// resuelve desde la UBICACIÓN DEL ARCHIVO, no desde el cwd, así que correrlo
// "desde donde sí está" no alcanza: hay que decirle la ruta. Se intenta primero
// el import normal para que el día que el repo tenga playwright esto no estorbe.
const RESERVA = 'file:///D:/bots/tecki/_staging/serp_scraper/node_modules/playwright/index.mjs'
const { chromium } = await import('playwright').catch(() => import(RESERVA))

const CACHE = 'D:\\dev\\mavra\\_staging\\derivador'
const OUT = path.join(CACHE, 'asins_nichos.json')

// Los 11 que faltan de los 20. Mismos nombres que BLOQUES en correr_nichos.py:
// el caché se indexa por nombre de nicho, así que un typo acá es un nicho que
// se paga dos veces.
const NICHOS = [
  'water bottle',
  'desk organizer',
  'shower curtain hooks',
  'throw pillow covers',
  'jewelry box',
  'coffee mug',
  'car phone holder',
  'dog bed',
  'cat tree',
  'hair clips',
  'yoga mat',
]

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const arg = (n, d) => {
  const i = process.argv.indexOf(n)
  return i > -1 ? Number(process.argv[i + 1]) : d
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const TOP = arg('--top', 8)

const previo = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {}
const pendientes = NICHOS.filter((n) => !(previo[n]?.length >= TOP))
console.log(`nichos ${NICHOS.length} · ya resueltos ${NICHOS.length - pendientes.length} · a traer ${pendientes.length}`)

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ userAgent: UA, locale: 'en-US', viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await ctx.route('**/*', (route) => {
  const t = route.request().resourceType()
  return t === 'image' || t === 'font' || t === 'media' ? route.abort() : route.continue()
})

// Calentamiento. El primer `goto` de un navegador recién abierto vuelve sin
// tarjetas —- Amazon aún no plantó cookies de sesión—, y en las dos corridas de
// hoy el nicho que se perdió fue SIEMPRE el primero de la lista: `water bottle`
// las dos veces. Reintentar no lo arregla porque vuelve a caer primero.
try {
  await page.goto('https://www.amazon.com/?language=en_US', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await sleep(1500)
} catch {}

for (const nicho of pendientes) {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(nicho)}&language=en_US`
  let filas = []
  for (let intento = 1; intento <= 3 && filas.length === 0; intento++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      filas = await page.evaluate((tope) => {
        const cards = [...document.querySelectorAll('[data-component-type="s-search-result"]')]
        const out = []
        for (const c of cards) {
          const asin = c.getAttribute('data-asin')
          if (!asin) continue
          const sponsored =
            !!c.querySelector('.puis-sponsored-label-text, .s-sponsored-label-text') ||
            /^sponsored$/i.test((c.querySelector('.a-color-secondary .a-size-mini')?.textContent || '').trim())
          if (sponsored) continue
          out.push({
            asin,
            // La marca la DECLARA Amazon en la tarjeta; adivinarla desde el
            // título daba `gourmia` 0,00 siendo 16 de 16.
            brand: (c.querySelector('h2')?.textContent || '').trim(),
            title: (c.querySelector('img.s-image')?.getAttribute('alt') || '').trim(),
          })
          if (out.length >= tope) break
        }
        return out
      }, TOP)
    } catch {
      filas = []
    }
    if (filas.length === 0) await sleep(5000 * intento)
  }
  previo[nicho] = filas
  fs.writeFileSync(OUT, JSON.stringify(previo, null, 1))
  console.log(`${nicho.padEnd(22)} ${filas.length} asins  ${filas.map((f) => f.asin).join(' ')}`)
  await sleep(900 + Math.random() * 900)
}

await browser.close()
const total = Object.values(previo).reduce((a, v) => a + v.length, 0)
console.log(`LISTO · ${Object.keys(previo).length} nichos · ${total} ASINs · ${OUT}`)
