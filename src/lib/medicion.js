// La medicion de agta.io/case: el aviso de cookies y la etiqueta de Google.
//
// Desde el 2026-10-01 esta web se sirve DENTRO de agta.io (la landing reescribe
// /case/* hacia aqui). Comparte origen con la landing, asi que comparte sus
// cookies de consentimiento en `.agta.io`: quien ya acepto o rechazo en agta.io
// no vuelve a ver el aviso aqui, y al reves.
//
// Es un gemelo, en pequeno, de tres archivos de agta-landing; si cambian alli,
// cambian aqui:
//   lib/consentimiento.ts       agta_consent + agta_consent_v (version 2)
//   lib/pixeles.ts              agta_marketing = si | no
//   components/BannerCookies    el texto y los dos botones del mismo peso
//
// Solo carga Google (G-CKCKN1D42D). Ni PostHog ni Meta: esta pagina no los
// tenia y el aviso no obliga a cargar todo lo que permite.
//
// ⚠️ Fuera de agta.io no mide ni pregunta: en mavra-public.vercel.app y en
// local no hay cookies de agta.io que leer, y medir ahi seria medir el origen
// del proxy, no la pagina que ve la gente.

const ID_GOOGLE = 'G-CKCKN1D42D'
const VERSION = 2
const DIAS = 180

const TEXTOS = {
  es: {
    aria: 'Consentimiento de cookies',
    parrafo:
      'Usamos cookies de analítica y de publicidad. Las de analítica nos dicen cómo se usa AGTA, incluido el recorrido que haces por la pantalla; y las de publicidad, para llegar a más personas.',
    noCargamos: 'No se cargan hasta que aceptes.',
    politica: 'Política de privacidad',
    rechazar: 'Rechazar',
    aceptar: 'Aceptar',
  },
  en: {
    aria: 'Cookie consent',
    parrafo:
      'We use analytics and advertising cookies. Analytics cookies show us how AGTA is used, including how you move around the screen; and advertising cookies help us reach more people.',
    noCargamos: "They aren't loaded until you accept.",
    politica: 'Privacy Policy',
    rechazar: 'Reject',
    aceptar: 'Accept',
  },
}

const enAgta = () => location.hostname === 'agta.io' || location.hostname.endsWith('.agta.io')

function leer(nombre) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + nombre + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : null
}

function escribir(nombre, valor) {
  const exp = new Date(Date.now() + DIAS * 864e5).toUTCString()
  document.cookie = `${nombre}=${valor}; path=/; expires=${exp}; SameSite=Lax; domain=.agta.io; Secure`
}

function consentimiento() {
  const v = leer('agta_consent')
  return v === 'todo' || v === 'analitica' || v === 'nada' ? v : null
}

function versionDecidida() {
  const v = Number(leer('agta_consent_v'))
  if (Number.isInteger(v) && v > 0) return v
  return leer('agta_marketing') !== null ? 2 : 1
}

function hayQuePreguntar() {
  const v = consentimiento()
  if (v === null) return true
  if (v === 'nada') return false
  return versionDecidida() < VERSION
}

function puedeAnunciar() {
  const v = consentimiento()
  return (v === 'todo' || v === 'analitica') && versionDecidida() >= VERSION && leer('agta_marketing') === 'si'
}

function cargarGoogle() {
  if (window.gtag || document.getElementById('pixel-google')) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  const s = document.createElement('script')
  s.id = 'pixel-google'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID_GOOGLE}`
  document.head.appendChild(s)
  window.gtag('js', new Date())
  window.gtag('config', ID_GOOGLE)
}

function borrarCookiesDeGoogle() {
  const nombres = document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^(_fbp|_fbc|_gcl_|_ga|_gid|_gat)/.test(n))
  for (const n of nombres) {
    for (const a of ['', '; domain=.agta.io', `; domain=${location.hostname}`]) {
      document.cookie = `${n}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${a}`
    }
  }
}

function idioma() {
  try { return localStorage.getItem('mavra-language') === 'es' ? 'es' : 'en' } catch { return 'en' }
}

function mostrarAviso() {
  if (document.getElementById('banner-cookies')) return
  const t = TEXTOS[idioma()]
  const caja = document.createElement('div')
  caja.id = 'banner-cookies'
  caja.setAttribute('role', 'dialog')
  caja.setAttribute('aria-modal', 'false')
  caja.setAttribute('aria-label', t.aria)
  const ancho = window.matchMedia('(min-width: 640px)').matches
  Object.assign(caja.style, {
    position: 'fixed', zIndex: '9999', bottom: ancho ? '20px' : '12px',
    left: ancho ? 'auto' : '12px', right: ancho ? '20px' : '12px', maxWidth: ancho ? '420px' : 'none',
    background: '#16191C', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '14px 16px',
    fontFamily: 'Inter, system-ui, sans-serif', color: '#E9ECEF', fontSize: '12.5px', lineHeight: '1.5',
    textAlign: 'left', letterSpacing: 'normal', textTransform: 'none',
  })
  const p = document.createElement('p')
  p.style.margin = '0 0 12px'
  p.append(t.parrafo + ' ')
  const fuerte = document.createElement('strong')
  fuerte.textContent = t.noCargamos
  fuerte.style.fontWeight = '600'
  p.append(fuerte, ' ')
  const enlace = document.createElement('a')
  enlace.href = 'https://agta.io/privacy'
  enlace.target = '_blank'
  enlace.rel = 'noopener noreferrer'
  enlace.textContent = t.politica
  Object.assign(enlace.style, { color: '#FFE600', textDecoration: 'underline', textUnderlineOffset: '2px' })
  p.append(enlace)
  const fila = document.createElement('div')
  Object.assign(fila.style, { display: 'flex', gap: '8px' })
  const boton = (texto, primario, alClicar) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.textContent = texto
    Object.assign(b.style, {
      flex: ancho ? 'none' : '1', whiteSpace: 'nowrap', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
      fontFamily: "'Space Grotesk', Inter, sans-serif", fontSize: '12.5px', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: '0.04em',
      background: primario ? '#FFE600' : 'transparent', color: primario ? '#000' : '#E9ECEF',
      border: primario ? '1px solid #FFE600' : '1px solid rgba(255,255,255,0.25)',
    })
    b.addEventListener('click', alClicar)
    return b
  }
  // Mismo tamano los dos: rechazar no puede costar mas que aceptar.
  fila.append(
    boton(t.rechazar, false, () => decidir(false)),
    boton(t.aceptar, true, () => decidir(true)),
  )
  caja.append(p, fila)
  document.body.appendChild(caja)

  function decidir(si) {
    // Primero la de marketing, como en la landing: cuando la decision queda
    // escrita, el permiso de la etiqueta ya esta.
    escribir('agta_marketing', si ? 'si' : 'no')
    escribir('agta_consent', si ? 'todo' : 'nada')
    escribir('agta_consent_v', String(VERSION))
    caja.remove()
    if (si) cargarGoogle()
    else borrarCookiesDeGoogle()
  }
}

export function arrancarMedicion() {
  if (typeof window === 'undefined' || !enAgta()) return
  try {
    if (puedeAnunciar()) cargarGoogle()
    if (hayQuePreguntar()) {
      if (document.body) mostrarAviso()
      else window.addEventListener('DOMContentLoaded', mostrarAviso, { once: true })
    }
  } catch {
    // Sin cookies o sin DOM: no se mide, nunca se mide sin permiso.
  }
}
