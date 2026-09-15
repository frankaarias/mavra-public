import { useEffect, useState } from 'react'

const KEY = 'mavra-language'
const EVENT = 'mavra-language-change'

function readLanguage() {
  try { return localStorage.getItem(KEY) || 'en' } catch { return 'en' }
}

export default function useMavraLanguage() {
  const [language, setLanguageState] = useState(readLanguage)

  useEffect(() => {
    const sync = event => setLanguageState(event.detail || readLanguage())
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])

  const setLanguage = next => {
    setLanguageState(next)
    try { localStorage.setItem(KEY, next) } catch {}
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }))
  }

  return [language, setLanguage]
}
