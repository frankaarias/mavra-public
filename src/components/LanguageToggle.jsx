import useMavraLanguage from './useMavraLanguage.js'

export default function LanguageToggle() {
  const [language, setLanguage] = useMavraLanguage()
  return <div className="language-toggle" aria-label="Language selector">
    <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
    <span aria-hidden="true">/</span>
    <button type="button" className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
  </div>
}
