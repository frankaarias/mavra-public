/**
 * Las correcciones a mano de la master del MKL, guardadas en Supabase.
 *
 * Antes vivían solo en el `localStorage` del navegador: sobrevivían al reload
 * —que era lo que Frank había pedido— pero no salían de su máquina. Cuando dijo
 * *"mirá mis cambios hasta el momento"* no pude: su trabajo era invisible desde
 * afuera. Para eso tienen que estar en un lugar compartido.
 *
 * Se guarda POR KEYWORD y no por posición: los JSON del MKL se regeneran
 * seguido y el orden cambia entre corridas.
 *
 * El localStorage se mantiene como respaldo: si Supabase no responde, el
 * trabajo no se pierde y se sube en el próximo guardado que sí entre.
 *
 * ── Leer y escribir van por caminos distintos (2026-09-29) ─────────────────
 *
 * LEER sigue siendo con la llave pública: la pestaña es pública y la lee
 * cualquiera, igual que los scripts `correcciones.py`.
 *
 * ESCRIBIR ya no. Esta página no tiene login y la llave pública podía
 * reescribir o borrar las 3.306 filas; la migración 041 de agta-app lo cerró.
 * Ahora se escribe por `/api/correcciones` (vive en mavra.vercel.app, que es
 * la web que tiene la llave de servicio) con el token de la sesión de Google
 * de Supabase, y el servidor exige que el correo sea de un admin. Sin sesión,
 * `guardarCorrecciones` no escribe y devuelve 'sin-sesion'.
 *
 * ── Dos bugs arreglados el 2026-08-01 ──────────────────────────────────────
 *
 * 1. PostgREST devuelve 1.000 filas por consulta: `traerCorrecciones` pagina.
 * 2. Se manda solo lo que cambió contra el último estado sincronizado, no
 *    todas las filas en cada movimiento.
 */
import { createClient } from '@supabase/supabase-js'

const URL = 'https://arjjqwluwmpnhwamkskh.supabase.co'
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyampxd2x1d21wbmh3YW1rc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzMyMDAsImV4cCI6MjA4Njc0OTIwMH0.f3qms2DiLF1a8YzvqkQIagyh7Lh1NA1XXHgAz-dnJ80'
const TABLA = 'mavra_mkl_correcciones'
const PAGINA = 1000

/** En mavra.vercel.app la ruta es propia; desde case.agta.io se cruza. */
export function rutaGuardar(host = typeof location !== 'undefined' ? location.hostname : '') {
  return host === 'mavra.vercel.app' || host === 'localhost' || host === '127.0.0.1'
    ? '/api/correcciones'
    : 'https://mavra.vercel.app/api/correcciones'
}

let cliente = null
const db = () => (cliente ||= createClient(URL, ANON))

/** La sesión de Google de Supabase, o null. */
export async function sesion() {
  try {
    const { data } = await db().auth.getSession()
    return data?.session ?? null
  } catch {
    return null
  }
}

export function alCambiarSesion(fn) {
  const { data } = db().auth.onAuthStateChange((_e, s) => fn(s ?? null))
  return () => data?.subscription?.unsubscribe()
}

export function entrarConGoogle() {
  return db().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href },
  })
}

/** Lo último que se leyó o escribió, por producto: contra esto va el delta. */
const sincronizado = {}

/** Lo que hay guardado para un producto: `{ [kw_lower]: bucket }`. */
export async function traerCorrecciones(producto) {
  try {
    const acc = {}
    for (let desde = 0; ; desde += PAGINA) {
      const { data, error } = await db()
        .from(TABLA)
        .select('kw_lower,bucket')
        .eq('producto', producto)
        .order('kw_lower', { ascending: true })
        .range(desde, desde + PAGINA - 1)
      if (error) throw error
      ;(data || []).forEach((r) => { acc[r.kw_lower] = r.bucket })
      if (!data || data.length < PAGINA) break
    }
    sincronizado[producto] = { ...acc }
    return acc
  } catch (e) {
    console.warn('[correcciones] no se pudo leer de Supabase, uso el navegador:', e.message)
    return null
  }
}

/**
 * Sincroniza el estado. `movidas` es `{ kw_lower: bucket }` con SOLO las que
 * difieren del cálculo del motor. Devuelve:
 *   'ok'          guardado (o no había nada que guardar)
 *   'sin-sesion'  no hay sesión: no se escribe nada
 *   'sin-permiso' la sesión no es de un admin
 *   'error'       la red o el servidor fallaron; se reintenta en el próximo
 *
 * Si no se guarda, el estado sincronizado no se mueve: el próximo guardado que
 * sí entre manda todo lo pendiente.
 */
export async function guardarCorrecciones(producto, movidas, meta = {}, deps = {}) {
  const previo = sincronizado[producto] || {}
  const cambiadas = Object.entries(movidas).filter(([kw, b]) => previo[kw] !== b)
  const borrar = Object.keys(previo).filter((kw) => !(kw in movidas))
  if (!cambiadas.length && !borrar.length) return 'ok'

  const s = await (deps.sesion || sesion)()
  if (!s?.access_token) return 'sin-sesion'

  const filas = cambiadas.map(([kw_lower, bucket]) => ({
    kw_lower,
    bucket,
    bucket_orig: meta[kw_lower]?.orig ?? null,
    vol: Number.isInteger(meta[kw_lower]?.vol) ? meta[kw_lower].vol : null,
  }))
  try {
    const r = await (deps.fetch || fetch)(rutaGuardar(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}` },
      body: JSON.stringify({ producto, filas, borrar }),
    })
    if (r.status === 401) return 'sin-sesion'
    if (r.status === 403) return 'sin-permiso'
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    sincronizado[producto] = { ...movidas }
    return 'ok'
  } catch (e) {
    console.warn('[correcciones] no se pudo guardar:', e.message)
    return 'error'
  }
}

/** Solo para tests: fija el estado sincronizado de un producto. */
export function _fijarSincronizado(producto, estado) {
  sincronizado[producto] = { ...estado }
}
