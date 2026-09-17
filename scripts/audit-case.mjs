import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import fs from 'node:fs'
import assert from 'node:assert/strict'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const routes = new Set([...fs.readFileSync('src/App.jsx','utf8').matchAll(/path="([^"]+)"/g)].map(m=>m[1]))
const pages = ['CaseStudy','Home','Listings','AplusBriefs','Briefing','BrandGuidelines']
const outputs = {}
const originalError = console.error
console.error = (...args) => { if (!String(args[0]).includes('useLayoutEffect does nothing on the server')) originalError(...args) }
try {
 for (const page of pages) {
  const { default: Component } = await vite.ssrLoadModule('/src/pages/'+page+'.jsx')
  outputs[page] = {}
  for (const language of ['en','es']) {
   globalThis.localStorage = { getItem: () => language }
   const html = renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(Component)))
   outputs[page][language] = html
   assert.equal((html.match(/<h1[ >]/g)||[]).length,1,page+' has one page heading')
   for (const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (url.startsWith('/') && !url.startsWith('//')) {
     const path = url.split('#')[0]
     assert(routes.has(path)||fs.existsSync('public'+path),page+' broken destination '+url)
    }
   }
  }
  assert.notEqual(outputs[page].en,outputs[page].es,page+' changes language')
  const destinations=html=>[...html.matchAll(/(?:href|src|id)="([^"]+)"/g)].map(m=>m[0])
  assert.deepEqual(destinations(outputs[page].en),destinations(outputs[page].es),page+' keeps the same evidence in both languages')
  console.log('PASS',page,'ES/EN, heading, destinations and assets')
 }
 assert(outputs.CaseStudy.es.includes('Lideramos'))
 assert(!outputs.CaseStudy.es.includes('Cuéntame'))
 assert(!outputs.CaseStudy.en.includes('Amazon Brand Management'))
 assert(outputs.CaseStudy.en.includes('href="#evidence"'))
 assert.equal((outputs.Listings.en.match(/<details/g)||[]).length,20)
 assert.equal((outputs.CaseStudy.en.match(/<form/g)||[]).length,1)
 assert(outputs.CaseStudy.en.includes('name="website"'))
 assert(outputs.AplusBriefs.en.includes('recovered deliverable on this page is the production brief'))
 console.log('PASS collective voice, primary CTA, 20 briefs, contact form and evidence status')
} finally { delete globalThis.localStorage; console.error = originalError; await vite.close() }
