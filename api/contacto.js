/**
 * El formulario de contacto de case.agta.io, que hasta hoy no mandaba nada.
 *
 * 🔴 QUÉ PASABA. `handleSubmit` en CaseStudy.jsx hacía `setSubmitted(true)` y
 * nada más. El visitante escribía, le salía un aviso de confirmación y se iba
 * convencido de que su mensaje había llegado. No llegaba a ningún sitio y no
 * quedaba registro: un prospecto perdido sin que nadie se enterara, que es la
 * peor forma de perderlo.
 *
 * Ahora el mensaje sale por Resend hacia DESTINO, con el correo de quien
 * escribe en `reply_to` para poder contestarle directamente desde la bandeja.
 *
 * ⚠️ `agta.io` está verificado en Resend y `mavra.com` no, así que el remitente
 * es de agta.io aunque el sitio sea el caso de MAVRA. Comprobado el 2026-09-17
 * contra la API: un envío desde `no-reply@mavra.com` devuelve 403.
 *
 * Variables que necesita en Vercel:
 *   RESEND_API_KEY   la clave de envío (la restringida sirve: solo envía)
 *   CONTACTO_DESTINO opcional; si no está, va a info@agta.io
 */

const REMITENTE = 'MAVRA · case.agta.io <no-reply@agta.io>'
const DESTINO_POR_DEFECTO = 'info@agta.io'
const LIMITE = { campo: 5000, nombre: 200, empresa: 200 }

function limpio(v, tope) {
  return String(v ?? '').trim().slice(0, tope)
}

function escapar(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Sin clave no se puede enviar, y es mejor decirlo que fingir que se envió:
    // el aviso de exito sobre un envio que no ocurrio es justo el bug de origen.
    console.error('[contacto] falta RESEND_API_KEY en el entorno')
    return res.status(500).json({ error: 'not_configured' })
  }

  const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  const nombre = limpio(cuerpo.name, LIMITE.nombre)
  const email = limpio(cuerpo.email, LIMITE.nombre)
  const empresa = limpio(cuerpo.company, LIMITE.empresa)
  const mensaje = limpio(cuerpo.message, LIMITE.campo)
  const trampa = limpio(cuerpo.website, 80) // campo señuelo: los humanos no lo ven

  if (trampa) return res.status(200).json({ ok: true }) // bot: se le dice que sí y no se manda nada
  if (!nombre || !email || !mensaje) return res.status(400).json({ error: 'campos_incompletos' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'email_invalido' })

  const lineas = [
    ['Nombre', nombre],
    ['Email', email],
    ['Empresa', empresa || '—'],
  ]
    .map(([k, v]) => `<p style="margin:0 0 4px"><strong>${escapar(k)}:</strong> ${escapar(v)}</p>`)
    .join('')

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: REMITENTE,
        to: [process.env.CONTACTO_DESTINO || DESTINO_POR_DEFECTO],
        reply_to: email,
        subject: `case.agta.io · ${nombre}${empresa ? ` (${empresa})` : ''}`,
        html:
          `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5">` +
          lineas +
          `<hr style="border:0;border-top:1px solid #e3e6ea;margin:14px 0">` +
          `<div style="white-space:pre-wrap">${escapar(mensaje)}</div>` +
          `<p style="margin-top:18px;color:#868e96;font-size:12px">` +
          `Enviado desde el formulario de case.agta.io</p></div>`,
        text: `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa || '—'}\n\n${mensaje}`,
      }),
    })

    if (!r.ok) {
      const detalle = await r.text()
      console.error('[contacto] Resend respondió', r.status, detalle.slice(0, 300))
      return res.status(502).json({ error: 'envio_fallido' })
    }

    const { id } = await r.json()
    return res.status(200).json({ ok: true, id })
  } catch (e) {
    console.error('[contacto] error al enviar:', e?.message)
    return res.status(502).json({ error: 'envio_fallido' })
  }
}
