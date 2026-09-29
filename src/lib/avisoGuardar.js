// Los textos de <AvisoGuardar>, aparte para poder probarlos sin React.
/** Los textos en los dos idiomas del selector de la página (EN/ES). */
export const TEXTOS = {
  es: {
    'sin-sesion': 'Inicia sesión para guardar',
    'sin-permiso': 'Esta cuenta no puede guardar',
    error: 'No se pudo guardar; se reintenta al próximo cambio',
    entrar: 'Entrar con Google',
  },
  en: {
    'sin-sesion': 'Sign in to save',
    'sin-permiso': 'This account can’t save',
    error: 'Couldn’t save; it will retry on the next change',
    entrar: 'Sign in with Google',
  },
}

export function textoAviso(estado, lang = 'es') {
  const t = TEXTOS[lang === 'en' ? 'en' : 'es']
  return { texto: t[estado] ?? t.error, entrar: t.entrar }
}
