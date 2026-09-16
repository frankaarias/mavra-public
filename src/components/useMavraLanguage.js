import { useCallback, useEffect, useState } from 'react'

const KEY = 'mavra-language'
const EVENT = 'mavra-language-change'
const validLanguage = value => value === 'es' ? 'es' : 'en'

function readLanguage() {
  try { return validLanguage(localStorage.getItem(KEY)) } catch { return 'en' }
}

export default function useMavraLanguage() {
  const [language, setLanguageState] = useState(readLanguage)
  useEffect(() => {
    const sync = event => setLanguageState(validLanguage(event.detail || readLanguage()))
    const storage = event => { if (event.key === KEY || event.key === null) sync(event) }
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', storage)
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', storage) }
  }, [])
  const setLanguage = useCallback(next => {
    const language = validLanguage(next)
    setLanguageState(language)
    try { localStorage.setItem(KEY, language) } catch {}
    window.dispatchEvent(new CustomEvent(EVENT, { detail: language }))
  }, [])
  return [language, setLanguage]
}
