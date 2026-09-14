import { useState } from 'react'
import { LOTE, PENDIENTES, REGLA } from './loteGifting.js'

const label = {
  fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase',
  color: 'rgba(var(--copper-rgb),0.6)', marginBottom: '6px',
}
const card = {
  border: '1px solid rgba(var(--copper-rgb),0.15)', borderRadius: '4px',
  padding: '16px 18px', marginBottom: '10px', background: 'rgba(var(--copper-rgb),0.03)',
}
const p = { fontSize: '0.8rem', lineHeight: 1.6, color: 'rgba(var(--fg-rgb),0.72)', margin: 0 }

const PROD = {
  SWD: { n: 'Wall decor', c: 'rgba(150,170,220,0.9)' },
  CND: { n: 'Candle set', c: 'rgba(220,160,120,0.9)' },
  LMP: { n: 'Skull lamp', c: 'rgba(180,150,220,0.9)' },
}

export default function Lote() {
  const [abierto, setAbierto] = useState(null)
  const [copiado, setCopiado] = useState(null)

  function copiar(handle, texto) {
    navigator.clipboard?.writeText(texto)
    setCopiado(handle)
    setTimeout(() => setCopiado(null), 1600)
  }

  return (
    <div style={{ maxWidth: '880px' }}>
      <p style={label}>Lote 1 · gifting</p>
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 6px', fontWeight: 400 }}>
        10 creadores, 10 unidades, mensajes listos
      </h2>
      <p style={{ ...p, color: 'rgba(var(--fg-rgb),0.5)', marginBottom: '20px' }}>
        Cupo de <strong>10 unidades en total</strong>, no 10 por producto. Los diez storefronts
        fueron verificados <strong>abriendo el link</strong>, no leyendo el campo del directorio.
      </p>

      <div style={{ ...card, borderColor: 'rgba(220,80,80,0.35)', background: 'rgba(220,80,80,0.05)' }}>
        <p style={{ ...p, marginBottom: '8px' }}>
          <strong style={{ color: 'rgba(230,120,120,0.95)' }}>🔴 PROHIBIDO</strong> — {REGLA.prohibido}
        </p>
        <p style={{ ...p, marginBottom: '8px' }}>
          <strong style={{ color: 'rgba(140,220,140,0.95)' }}>🟢 PERMITIDO</strong> — {REGLA.permitido}
        </p>
        <p style={{ ...p, color: 'rgba(var(--fg-rgb),0.55)', fontSize: '0.76rem' }}>{REGLA.matiz}</p>
      </div>

      <p style={{ ...label, marginTop: '26px' }}>Los 10</p>
      {LOTE.map((c, i) => (
        <div key={c.handle} style={card}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(var(--copper-rgb),0.5)', fontSize: '0.75rem' }}>{i + 1}</span>
            <a href={`https://www.tiktok.com/${c.handle}`} target="_blank" rel="noreferrer"
               style={{ color: 'var(--copper-bright)', fontSize: '0.95rem', textDecoration: 'none' }}>
              {c.handle}
            </a>
            <span style={{ fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.4)' }}>
              {c.seguidores.toLocaleString('es')} seg
            </span>
            <span style={{
              fontSize: '0.62rem', letterSpacing: '0.12em', padding: '2px 7px',
              borderRadius: '2px', background: 'rgba(var(--copper-rgb),0.12)', color: PROD[c.producto].c,
            }}>{PROD[c.producto].n}</span>
          </div>

          <p style={{ ...p, fontSize: '0.76rem', color: 'rgba(var(--fg-rgb),0.5)', margin: '6px 0 4px' }}>
            “{c.bio}”
          </p>
          <p style={{ ...p, fontSize: '0.72rem', fontFamily: 'var(--font-mono, monospace)', color: 'rgba(140,200,140,0.85)' }}>
            ✅ {c.storefront}
          </p>
          {c.nota && (
            <p style={{ ...p, fontSize: '0.74rem', color: 'rgba(var(--fg-rgb),0.45)', marginTop: '6px' }}>{c.nota}</p>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button onClick={() => setAbierto(abierto === c.handle ? null : c.handle)}
              style={btn}>{abierto === c.handle ? 'Ocultar mensaje' : 'Ver mensaje'}</button>
            <button onClick={() => copiar(c.handle, c.mensaje)} style={btn}>
              {copiado === c.handle ? '✓ copiado' : 'Copiar'}
            </button>
          </div>

          {abierto === c.handle && (
            <pre style={{
              marginTop: '12px', padding: '14px', whiteSpace: 'pre-wrap',
              background: 'rgba(0,0,0,0.25)', borderRadius: '3px',
              fontSize: '0.76rem', lineHeight: 1.6, color: 'rgba(var(--fg-rgb),0.8)',
              fontFamily: 'var(--font-sans)',
            }}>{c.mensaje}</pre>
          )}
        </div>
      ))}

      <p style={{ ...label, marginTop: '26px' }}>Antes de que salga la primera unidad</p>
      {PENDIENTES.map(x => (
        <div key={x.id} style={{ ...card, borderColor: 'rgba(220,150,80,0.3)' }}>
          <p style={{ ...p, marginBottom: '4px' }}>⚠️ {x.texto}</p>
          <p style={{ ...p, fontSize: '0.75rem', color: 'rgba(var(--fg-rgb),0.5)' }}>{x.porque}</p>
          <p style={{ ...p, fontSize: '0.75rem', color: 'rgba(220,150,80,0.85)', marginTop: '4px' }}>
            Bloqueado por: {x.bloqueadoPor}
          </p>
        </div>
      ))}
    </div>
  )
}

const btn = {
  background: 'transparent',
  border: '1px solid rgba(var(--copper-rgb),0.3)',
  color: 'rgba(var(--copper-rgb),0.9)',
  padding: '5px 12px',
  borderRadius: '3px',
  fontSize: '0.7rem',
  letterSpacing: '0.05em',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
}
