import { MAVRA_INFLUENCER_CONTEXT } from './mavra-context.js'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://arjjqwluwmpnhwamkskh.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyampxd2x1d21wbmh3YW1rc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzMyMDAsImV4cCI6MjA4Njc0OTIwMH0.f3qms2DiLF1a8YzvqkQIagyh7Lh1NA1XXHgAz-dnJ80'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' })

  // GET: fetch session history from Supabase
  if (req.method === 'GET') {
    const { sessionId } = req.query
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' })
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
      const { data } = await supabase
        .from('mavra_chat_influencers')
        .select('role, content, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(50)
      return res.status(200).json({ messages: data || [] })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  // POST: send message
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages, sessionId } = req.body || {}
  if (!messages?.length) return res.status(400).json({ error: 'Messages required' })

  const systemPrompt = `Eres MavrO — el bot de estrategia de influencers de MAVRA. Tienes acceso a toda la investigación real del equipo. Respondes en español, eres directo y accionable.

MEMORIA REAL DEL SISTEMA:
${MAVRA_INFLUENCER_CONTEXT}

Puedes ayudar a: escribir DM templates, definir la oferta de colaboración, crear briefs de contenido por producto, analizar qué creadores priorizar, responder preguntas sobre el ecosistema de Creator Connections / Influencer Program / TikTok collab, y cualquier tarea relacionada con el lanzamiento de MAVRA con influencers.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    if (!response.ok) return res.status(500).json({ error: data.error?.message || 'OpenAI error' })

    const assistantContent = data.choices[0].message.content

    // Persist to Supabase if sessionId provided
    if (sessionId) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
        const lastUserMsg = messages[messages.length - 1]
        await supabase.from('mavra_chat_influencers').insert([
          { session_id: sessionId, role: 'user', content: lastUserMsg.content },
          { session_id: sessionId, role: 'assistant', content: assistantContent },
        ])
      } catch (e) {
        console.error('Supabase persist error:', e.message)
      }
    }

    return res.status(200).json({ content: assistantContent })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
