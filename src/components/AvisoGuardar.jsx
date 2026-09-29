import { useEffect, useState } from 'react'
import { entrarConGoogle, sesion, alCambiarSesion } from '../lib/correcciones'
import { textoAviso } from '../lib/avisoGuardar'

/**
 * Dónde antes se guardaba en silencio, ahora avisa si no se puede.
 *
 * La pestaña es pública y cualquiera puede mover una keyword para probar: eso
 * se queda en SU navegador. Escribir en la base exige la sesión de un admin
 * (ver lib/correcciones.js). Este aviso solo aparece cuando hay un movimiento
 * que no se pudo subir; con todo guardado no se ve nada, como hasta ahora.
 */
export default function AvisoGuardar({ estado, lang = 'es' }) {
  const [conSesion, setConSesion] = useState(false)
  useEffect(() => {
    sesion().then((s) => setConSesion(!!s))
    return alCambiarSesion((s) => setConSesion(!!s))
  }, [])

  if (estado === 'ok') return null
  const { texto, entrar } = textoAviso(estado, lang)

  return (
    <div
      role="status"
      data-aviso-guardar={estado}
      style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 8,
        background: '#111', color: '#fff', font: '500 13px/1.3 system-ui, sans-serif',
        boxShadow: '0 4px 16px rgba(0,0,0,.25)',
      }}
    >
      <span>{texto}</span>
      {estado === 'sin-sesion' && !conSesion && (
        <button
          type="button"
          onClick={() => entrarConGoogle()}
          style={{ background: '#fff', color: '#111', border: 0, borderRadius: 6, padding: '4px 10px', font: 'inherit', cursor: 'pointer' }}
        >
          {entrar}
        </button>
      )}
    </div>
  )
}
