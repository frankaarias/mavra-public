// node --test src/lib/correcciones.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { guardarCorrecciones, rutaGuardar, _fijarSincronizado } from './correcciones.js'

function red(status = 200) {
  const llamadas = []
  return { llamadas, fetch: async (url, opts) => { llamadas.push({ url, opts }); return { status, ok: status < 300 } } }
}
const conSesion = async () => ({ access_token: 'tok' })
const sinSesion = async () => null

test('sin sesión: no llama a la red y avisa', async () => {
  _fijarSincronizado('CND', {})
  const r = red()
  assert.equal(await guardarCorrecciones('CND', { 'kw a': 'MKL' }, {}, { sesion: sinSesion, fetch: r.fetch }), 'sin-sesion')
  assert.equal(r.llamadas.length, 0)
})

test('con sesión: manda solo el delta, con el token, a la ruta de servidor', async () => {
  _fijarSincronizado('CND', { 'kw vieja': 'UKL', 'kw igual': 'MKL' })
  const r = red()
  const res = await guardarCorrecciones('CND', { 'kw igual': 'MKL', 'kw nueva': 'MKL' },
    { 'kw nueva': { orig: 'UKL', vol: 50 } }, { sesion: conSesion, fetch: r.fetch })
  assert.equal(res, 'ok')
  assert.equal(r.llamadas.length, 1)
  const { url, opts } = r.llamadas[0]
  assert.match(url, /\/api\/correcciones$/)
  assert.equal(opts.headers.Authorization, 'Bearer tok')
  const body = JSON.parse(opts.body)
  assert.deepEqual(body.filas, [{ kw_lower: 'kw nueva', bucket: 'MKL', bucket_orig: 'UKL', vol: 50 }])
  assert.deepEqual(body.borrar, ['kw vieja'])
})

test('tras guardar, el mismo estado no vuelve a escribir', async () => {
  _fijarSincronizado('SWD', {})
  const r = red()
  await guardarCorrecciones('SWD', { x: 'MKL' }, {}, { sesion: conSesion, fetch: r.fetch })
  await guardarCorrecciones('SWD', { x: 'MKL' }, {}, { sesion: conSesion, fetch: r.fetch })
  assert.equal(r.llamadas.length, 1)
})

test('si el servidor rechaza, lo pendiente se vuelve a mandar', async () => {
  _fijarSincronizado('LMP', {})
  const mal = red(403)
  assert.equal(await guardarCorrecciones('LMP', { y: 'UKL' }, {}, { sesion: conSesion, fetch: mal.fetch }), 'sin-permiso')
  const bien = red(200)
  assert.equal(await guardarCorrecciones('LMP', { y: 'UKL' }, {}, { sesion: conSesion, fetch: bien.fetch }), 'ok')
  assert.equal(bien.llamadas.length, 1)
})

test('401 del servidor cuenta como sin sesión; 500 como error', async () => {
  _fijarSincronizado('A', {})
  assert.equal(await guardarCorrecciones('A', { z: 'MKL' }, {}, { sesion: conSesion, fetch: red(401).fetch }), 'sin-sesion')
  assert.equal(await guardarCorrecciones('A', { z: 'MKL' }, {}, { sesion: conSesion, fetch: red(500).fetch }), 'error')
})

test('un volumen no entero viaja como null (el servidor lo rechazaría)', async () => {
  _fijarSincronizado('B', {})
  const r = red()
  await guardarCorrecciones('B', { z: 'MKL' }, { z: { orig: 'UKL', vol: 12.5 } }, { sesion: conSesion, fetch: r.fetch })
  assert.equal(JSON.parse(r.llamadas[0].opts.body).filas[0].vol, null)
})

test('case.agta.io escribe cruzando a mavra.vercel.app; mavra.vercel.app en casa', () => {
  assert.equal(rutaGuardar('case.agta.io'), 'https://mavra.vercel.app/api/correcciones')
  assert.equal(rutaGuardar('mavra.vercel.app'), '/api/correcciones')
})
