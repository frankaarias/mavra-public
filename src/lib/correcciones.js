/**
 * Las correcciones a mano de la master del MKL, guardadas en Supabase.
 *
 * Antes vivían solo en el `localStorage` del navegador: sobrevivían al reload
 * —que era lo que Frank había pedido— pero no salían de su máquina. Cuando dijo
 * *"mirá mis cambios hasta el momento"* no pude: su trabajo era invisible desde
 * afuera. Y después: *"¿ahora sí podés ver en vivo mis cambios?"*. Para eso
 * tienen que estar en un lugar compartido.
 *
 * Se guarda POR KEYWORD y no por posición: los JSON del MKL se regeneran
 * seguido y el orden cambia entre corridas. Guardar el índice haría que después
 * de regenerar las correcciones cayeran sobre keywords distintas, y el error
 * sería mudo.
 *
 * El localStorage se mantiene como respaldo: si Supabase no responde, el
 * trabajo no se pierde y se sube en el próximo guardado que sí entre.
 *
 * ── Dos bugs arreglados el 2026-08-01 ──────────────────────────────────────
 *
 * 1. PostgREST devuelve 1.000 filas por consulta. `traerCorrecciones` no
 *    paginaba, así que en un producto con más correcciones que eso se leía una
 *    parte... y el guardado siguiente BORRABA el resto, porque su lista de
 *    "vivas" no las incluía. LMP tenía 1.509 correcciones: 509 se perdían en
 *    silencio cada vez que se tocaba una keyword. Ahora se pagina.
 *
 * 2. El guardado reescribía TODAS las filas en cada movimiento, con
 *    `updated_at` nuevo. Frank movía 4 keywords y la tabla decía que se habían
 *    tocado 726, así que no había forma de saber qué se movió y cuándo. Ahora
 *    se manda solo lo que cambió contra el último estado sincronizado.
 */
import { createClient } from '@supabase/supabase-js'

const URL = 'https://arjjqwluwmpnhwamkskh.supabase.co'
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyampxd2x1d21wbmh3YW1rc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzMyMDAsImV4cCI6MjA4Njc0OTIwMH0.f3qms2DiLF1a8YzvqkQIagyh7Lh1NA1XXHgAz-dnJ80'
const TABLA = 'mavra_mkl_correcciones'
const PAGINA = 1000

let cliente = null
const db = () => (cliente ||= createClient(URL, ANON))

/** Lo último que se leyó o escribió, por producto. Es contra esto que se
 *  calcula el delta: sin esta referencia habría que reescribir todo. */
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
 * difieren del cálculo del motor.
 *
 * Manda únicamente lo que cambió y borra lo que dejó de estar: si una keyword
 * volvió a su bucket original, su fila tiene que desaparecer. Sin ese borrado,
 * deshacer un movimiento no se propagaría y la próxima carga lo resucitaría.
 */
export async function guardarCorrecciones(producto, movidas, meta = {}) {
  const previo = sincronizado[producto] || {}
  const cambiadas = Object.entries(movidas).filter(([kw, b]) => previo[kw] !== b)
  const borradas = Object.keys(previo).filter((kw) => !(kw in movidas))
  // Nada que hacer: ni una escritura. Antes acá se reescribían las 726 filas.
  if (!cambiadas.length && !borradas.length) return true

  const filas = cambiadas.map(([kw_lower, bucket]) => ({
    producto,
    kw_lower,
    bucket,
    bucket_orig: meta[kw_lower]?.orig ?? null,
    vol: meta[kw_lower]?.vol ?? null,
    updated_at: new Date().toISOString(),
  }))
  try {
    if (filas.length) {
      const { error } = await db().from(TABLA).upsert(filas, { onConflict: 'producto,kw_lower' })
      if (error) throw error
    }
    // Se borra por lista explícita, no por "todo lo que no está en `movidas`":
    // así un fallo de lectura no puede llevarse por delante lo que no se leyó.
    for (let i = 0; i < borradas.length; i += 100) {
      const lote = borradas.slice(i, i + 100)
      const { error } = await db().from(TABLA).delete().eq('producto', producto).in('kw_lower', lote)
      if (error) throw error
    }
    sincronizado[producto] = { ...movidas }
    return true
  } catch (e) {
    console.warn('[correcciones] no se pudo guardar en Supabase:', e.message)
    return false
  }
}
