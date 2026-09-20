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
     const path = url.split(/[?#]/)[0]
     assert(routes.has(path)||fs.existsSync('public'+path),page+' broken destination '+url)
    }
   }
  }
  assert.notEqual(outputs[page].en,outputs[page].es,page+' changes language')
  const destinations=html=>[...html.matchAll(/(?:href|src|id)="([^"]+)"/g)].map(m=>m[0])
  assert.deepEqual(destinations(outputs[page].en),destinations(outputs[page].es),page+' keeps the same evidence in both languages')
  console.log('PASS',page,'ES/EN, heading, destinations and assets')
 }
 // The library renders one area at a time: inspect every URL state, not only its first panel.
 const { default: Library } = await vite.ssrLoadModule('/src/pages/Home.jsx')
 const areas = ['research','brand-book','creative','amazon-content','activation']
 const expectedCounts = [2,4,4,4,5]
 const areaLinks = language => {
  globalThis.localStorage = { getItem: () => language }
  return areas.flatMap((area,index) => {
   const html = renderToStaticMarkup(React.createElement(MemoryRouter,{initialEntries:['/brand?area='+area+'#library']},React.createElement(Library)))
   const links = [...html.matchAll(/class="library-resource" href="([^"]+)"/g)].map(match=>match[1])
   assert.equal(links.length,expectedCounts[index],area+' resource count')
   for (const url of links) assert(routes.has(url.split(/[?#]/)[0]),'Unknown library destination '+url)
   for (const [,src] of html.matchAll(/src="([^"]+)"/g)) assert(fs.existsSync('public'+src),'Missing library preview '+src)
   return links
  })
 }
 const libraryEnglish = areaLinks('en')
 assert.equal(new Set(libraryEnglish).size,19,'All 19 library resources remain reachable')
 assert.deepEqual(libraryEnglish,areaLinks('es'),'Library areas preserve destinations across languages')
 console.log('PASS all 19 library resources, five areas, previews and ES/EN destinations')
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
