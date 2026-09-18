import useMavraLanguage from './useMavraLanguage.js'

export default function LanguageToggle() {
  const [language, setLanguage] = useMavraLanguage()
  return <div className="language-toggle" data-language={language} role="group" aria-label={language === 'es' ? 'Idioma' : 'Language'}>
    <button type="button" aria-pressed={language === 'en'} lang="en" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
    <span aria-hidden="true">/</span>
    <button type="button" aria-pressed={language === 'es'} lang="es" className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
  </div>
}
