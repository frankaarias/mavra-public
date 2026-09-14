import { useState, useRef, useEffect } from 'react'
import brand from '../brand/brand.json'

const { identity } = brand

function getSessionId() {
  let sid = localStorage.getItem('mavra_chat_session')
  if (!sid) {
    sid = 'mavra_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
    localStorage.setItem('mavra_chat_session', sid)
  }
  return sid
}

export default function ChatWidget({ context }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const sessionId = useRef(getSessionId())
  const bottomRef = useRef(null)

  // Load history from Supabase on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setLoadingHistory(true)
      fetch(`/api/chat?sessionId=${sessionId.current}`)
        .then(r => r.json())
        .then(data => {
          if (data.messages?.length) {
            setMessages(data.messages.map(m => ({ role: m.role, content: m.content })))
          } else {
            setMessages([{ role: 'assistant', content: `Hola Frank. Tengo cargada toda la investigación de influencers ${identity.name} — 9 transcripts, 58 creadores, estrategia completa. ¿En qué te ayudo?` }])
          }
        })
        .catch(() => {
          setMessages([{ role: 'assistant', content: `Hola Frank. Tengo cargada toda la investigación de influencers ${identity.name}. ¿En qué te ayudo?` }])
        })
        .finally(() => setLoadingHistory(false))
    }
  }, [open])

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, sessionId: sessionId.current }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.content || 'Error al responder.' }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Error de conexión. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  function clearSession() {
    localStorage.removeItem('mavra_chat_session')
    sessionId.current = getSessionId()
    setMessages([{ role: 'assistant', content: 'Sesión nueva iniciada. ¿En qué te ayudo?' }])
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '48px', height: '48px', borderRadius: '50%',
          background: open ? '#1a1614' : 'var(--copper)',
          border: '1px solid rgba(var(--copper-bright-rgb),0.5)', cursor: 'pointer',
          color: 'var(--fg)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
        title="Chat con MavrO"
      >
        {open ? '×' : '✦'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '80px', right: '24px', zIndex: 999,
          width: '380px', height: '500px',
          background: '#100d0c', border: '1px solid rgba(var(--copper-rgb),0.3)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
        }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(var(--copper-rgb),0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: '0.72rem', color: 'var(--copper-bright)', letterSpacing: '0.15em' }}>MAVRO</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: '0.58rem', color: 'rgba(var(--fg-rgb),0.3)' }}>· Influencer Strategy · Memoria en Supabase</span>
            <button
              onClick={clearSession}
              style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(var(--fg-rgb),0.25)', cursor: 'pointer', fontSize: '0.62rem', fontFamily: "var(--font-sans)", padding: '2px 4px' }}
              title="Nueva sesión"
            >
              nueva sesión
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loadingHistory ? (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.3)', textAlign: 'center', marginTop: '20px' }}>cargando historial...</p>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background: m.role === 'user' ? 'rgba(var(--copper-rgb),0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(var(--copper-rgb),0.3)' : 'rgba(255,255,255,0.06)'}`,
                  padding: '8px 12px',
                  fontFamily: "var(--font-sans)",
                  fontSize: '0.78rem',
                  color: m.role === 'user' ? 'var(--fg)' : 'rgba(var(--fg-rgb),0.8)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              ))
            )}
            {loading && (
              <div style={{ alignSelf: 'flex-start', fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'rgba(var(--fg-rgb),0.3)', padding: '8px 0' }}>pensando...</div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(var(--copper-rgb),0.15)', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Pregunta o pide algo..."
              disabled={loading || loadingHistory}
              style={{
                flex: 1, padding: '8px 12px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(var(--copper-rgb),0.2)',
                color: 'var(--fg)', fontFamily: "var(--font-sans)", fontSize: '0.78rem', outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim() || loadingHistory}
              style={{
                padding: '8px 14px', background: 'transparent',
                border: '1px solid rgba(var(--copper-rgb),0.4)', color: 'var(--copper-bright)',
                fontFamily: "var(--font-sans)", fontSize: '0.7rem',
                letterSpacing: '0.1em', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                opacity: (loading || !input.trim()) ? 0.5 : 1,
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  )
}
