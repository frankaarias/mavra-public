import { FILTROS_DUROS, SENALES, CASOS } from './motorSeleccion.js'

const card = {
  border: '1px solid rgba(var(--copper-rgb),0.15)',
  borderRadius: '4px',
  padding: '20px 22px',
  marginBottom: '14px',
  background: 'rgba(var(--copper-rgb),0.03)',
}
const label = {
  fontSize: '0.58rem',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: 'rgba(var(--copper-rgb),0.6)',
  marginBottom: '6px',
}
const p = { fontSize: '0.82rem', lineHeight: 1.65, color: 'rgba(var(--fg-rgb),0.72)', margin: '0 0 10px' }

export default function Motor() {
  return (
    <div style={{ maxWidth: '860px' }}>
      <p style={label}>Motor de selección</p>
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 6px', fontWeight: 400 }}>
        Cómo se decide a quién se le manda producto
      </h2>
      <p style={{ ...p, color: 'rgba(var(--fg-rgb),0.5)' }}>
        Escrito el 6 de agosto de 2026, después de abrir <strong>86 cuentas</strong> del
        directorio una por una. De esas: 27 del nicho, <strong>6 competidores</strong> y
        5 con geo fuera de EE.UU.
      </p>

      <div style={{ ...card, borderColor: 'rgba(220,80,80,0.35)', background: 'rgba(220,80,80,0.05)' }}>
        <p style={{ ...p, margin: 0, fontSize: '0.9rem' }}>
          <strong>Las tres cosas que descalifican a un creador —competidor, geo y encaje—
          no se ven en ningún número.</strong> Hay que abrir el perfil. El scorer ordena
          una lista larga; no decide quién entra.
        </p>
      </div>

      <p style={{ ...label, marginTop: '28px' }}>Los 4 filtros duros</p>
      <p style={{ ...p, color: 'rgba(var(--fg-rgb),0.45)' }}>
        Si falla uno, queda fuera. No se compensan con alcance.
      </p>

      {FILTROS_DUROS.map((f, i) => (
        <div key={f.id} style={card}>
          <p style={{ fontSize: '0.95rem', margin: '0 0 4px' }}>
            <span style={{ color: 'var(--copper-bright)', marginRight: '10px' }}>{i + 1}</span>
            {f.titulo}
          </p>
          <p style={{ ...p, fontStyle: 'italic', color: 'rgba(var(--fg-rgb),0.5)' }}>{f.pregunta}</p>
          <p style={p}><strong style={{ color: 'rgba(var(--copper-rgb),0.85)' }}>Por qué: </strong>{f.porque}</p>
          <p style={{ ...p, margin: 0 }}><strong style={{ color: 'rgba(var(--copper-rgb),0.85)' }}>Cómo se verifica: </strong>{f.comoSeVerifica}</p>
        </div>
      ))}

      <p style={{ ...label, marginTop: '28px' }}>Señales</p>
      <p style={{ ...p, color: 'rgba(var(--fg-rgb),0.45)' }}>
        Ordenan a los que ya pasaron los filtros. No deciden.
      </p>
      {SENALES.map(s => (
        <div key={s.id} style={card}>
          <p style={{ fontSize: '0.92rem', margin: '0 0 4px' }}>{s.titulo}</p>
          <p style={{ ...p, fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--copper-bright)' }}>{s.formula}</p>
          <p style={{ ...p, margin: s.piso ? '0 0 8px' : 0 }}>{s.porque}</p>
          {s.piso && <p style={{ ...p, margin: 0, color: 'rgba(220,150,80,0.9)' }}>⚠️ {s.piso}</p>}
        </div>
      ))}

      <p style={{ ...label, marginTop: '28px' }}>Lo que costó aprenderlo</p>
      <p style={{ ...p, color: 'rgba(var(--fg-rgb),0.45)' }}>
        Casos reales. Cada uno es una regla de arriba.
      </p>
      {CASOS.map(c => (
        <div key={c.handle} style={{ ...card, padding: '14px 18px', marginBottom: '8px' }}>
          <p style={{ ...p, margin: 0, fontSize: '0.8rem' }}>
            <strong style={{ color: 'var(--copper-bright)' }}>{c.handle}</strong>
            <span style={{
              margin: '0 10px',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              padding: '2px 7px',
              borderRadius: '2px',
              background: c.motivo === 'FALSA ALARMA' ? 'rgba(120,200,120,0.15)' : 'rgba(220,80,80,0.15)',
              color: c.motivo === 'FALSA ALARMA' ? 'rgba(140,220,140,0.95)' : 'rgba(230,120,120,0.95)',
            }}>{c.motivo}</span>
            {c.detalle}
          </p>
        </div>
      ))}
    </div>
  )
}
