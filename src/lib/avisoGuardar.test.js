// node --test src/lib/avisoGuardar.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { textoAviso, TEXTOS } from './avisoGuardar.js'

test('sigue el selector: ES y EN', () => {
  assert.equal(textoAviso('sin-sesion', 'es').texto, 'Inicia sesión para guardar')
  assert.equal(textoAviso('sin-sesion', 'en').texto, 'Sign in to save')
  assert.equal(textoAviso('sin-sesion', 'en').entrar, 'Sign in with Google')
  assert.equal(textoAviso('sin-sesion', 'es').entrar, 'Entrar con Google')
})

test('los dos idiomas tienen las mismas claves y ningún texto se repite entre ellos', () => {
  assert.deepEqual(Object.keys(TEXTOS.en).sort(), Object.keys(TEXTOS.es).sort())
  for (const k of Object.keys(TEXTOS.es)) assert.notEqual(TEXTOS.es[k], TEXTOS.en[k], k)
})

test('idioma desconocido cae en castellano; estado desconocido, en el de error', () => {
  assert.equal(textoAviso('sin-permiso', 'fr').texto, TEXTOS.es['sin-permiso'])
  assert.equal(textoAviso('raro', 'en').texto, TEXTOS.en.error)
})

test('la pestaña Research le pasa el idioma del selector al aviso', async () => {
  const { readFileSync } = await import('node:fs')
  const src = readFileSync(new URL('../pages/Research.jsx', import.meta.url), 'utf8')
  assert.match(src, /<AvisoGuardar estado=\{estadoGuardado\} lang=\{lang\} \/>/)
  const aviso = readFileSync(new URL('../components/AvisoGuardar.jsx', import.meta.url), 'utf8')
  assert.match(aviso, /textoAviso\(estado, lang\)/)
  assert.doesNotMatch(aviso, /Inicia sesión para guardar|Entrar con Google/)
})
