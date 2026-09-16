import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { TranslationProvider } = await vite.ssrLoadModule('/src/i18n/TranslationProvider.jsx')
const names = ['Launch','Campanas','Competitors','Creators','Avatares','Filmografia','PinterestCampaigns','Skulls','Corrientes','Escenografia','BrandGuidelinesSource','Tipografia','SbPreview','CopyAds','influencers/Influencers']
fs.mkdirSync('/tmp/mavra-rendered', {recursive:true})
const { translateText, translateHtml } = await vite.ssrLoadModule('/src/i18n/translate.js')
assert.equal(translateText('Checklist de lanzamiento', 'en'), 'Launch checklist')
assert.equal(translateText('B0GGJG2WFR', 'es'), 'B0GGJG2WFR')
assert.equal(translateText('skull wall decor', 'es'), 'skull wall decor')
assert.equal(translateText(125, 'es'), 125)
const element = React.createElement('b', null, 'MAVRA')
assert.equal(translateText(element, 'es'), element)
assert.equal(translateText(' Dimensiones ', 'en'), ' Dimensions ')
assert.equal(translateText(translateText('Dimensiones', 'en'), 'es'), 'Dimensiones')
assert.equal(translateHtml('<strong data-id="Dimensiones">Dimensiones</strong>', 'en'), '<strong data-id="Dimensiones">Dimensions</strong>')
for (const name of names) {
 try {
  const { default: Page } = await vite.ssrLoadModule('/src/pages/'+name+'.jsx')
  const rendered = {}
  for (const language of ['es','en']) {
   const markup=renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(TranslationProvider,{language}, React.createElement(Page))))
   rendered[language] = markup
   fs.writeFileSync(`/tmp/mavra-rendered/${name.replaceAll('/','-')}-${language}.html`,markup)
  }
  assert.notEqual(rendered.en, rendered.es, name + ' must change its content')
  const links = html => [...html.matchAll(/(?:href|id)="([^"]*)"/g)].map(match => match[0])
  assert.deepEqual(links(rendered.en), links(rendered.es), name + ' must preserve links and anchor IDs')
  console.log('Rendered',name,'ES + EN')
 } catch(e) { console.error('FAIL',name,e.message);process.exitCode=1 }
}
await vite.close()
