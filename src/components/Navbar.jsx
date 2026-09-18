import { useState, useRef, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import brand from '../brand/brand.json'
import { NavLink } from 'react-router-dom'
import LanguageToggle from './LanguageToggle.jsx'
import useMavraLanguage from './useMavraLanguage.js'

const { identity } = brand

function getInitialTheme() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme || (typeof localStorage !== 'undefined' && localStorage.getItem('mavra-theme')) || 'dark'
}
// ⚠️ LOS TRES BOTONES DE LA DERECHA NO TIENEN TEXTO: son iconos, y lo único que
// dicen qué hacen es su `aria-label` y su `title`. Estaban clavados en castellano
// —«Menú», «Cambiar tema», «Modo oscuro»— y ahí no los ve nadie: no se leen en
// pantalla, así que un barrido mirando la página los da por limpios. Es el mismo
// escondite que el placeholder del buscador de /research. (2026-09-16)
const ROTULOS = {
  es: { menu: 'Menú', tema: 'Cambiar tema', oscuro: 'Modo oscuro', claro: 'Modo claro' },
  en: { menu: 'Menu', tema: 'Switch theme', oscuro: 'Dark mode', claro: 'Light mode' },
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButton = useRef(null)
  useEffect(() => {
    if (!mobileOpen) return
    const onEscape = event => { if (event.key === 'Escape') { setMobileOpen(false); menuButton.current?.focus() } }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [mobileOpen])
  const [theme, setTheme] = useState(getInitialTheme)
  const [lang] = useMavraLanguage()
  const t = ROTULOS[lang === 'en' ? 'en' : 'es']
  const close = () => setMobileOpen(false)
  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next); document.documentElement.dataset.theme = next
    try { localStorage.setItem('mavra-theme', next) } catch {}
  }
  return <nav className="global-nav">
    <NavLink to="/" className="nav-brand" onClick={close}>{identity.name}</NavLink>
    <div className="nav-right">
      <div id="primary-navigation" className={`nav-links${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={close}>{lang === 'es' ? 'Caso de estudio' : 'Case Study'}</NavLink>
        <NavLink to="/brand" onClick={close}>Brand OS</NavLink>
        <a href="/#contact" onClick={close}>{lang === 'es' ? 'Contacto' : 'Contact'}</a>
      </div>
      <LanguageToggle />
      <button className="theme-toggle" onClick={toggleTheme} aria-label={t.tema} title={theme === 'light' ? t.oscuro : t.claro}>{theme === 'light' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</button>
      <button ref={menuButton} className={`nav-toggle${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(open => !open)} aria-label={t.menu} aria-expanded={mobileOpen} aria-controls="primary-navigation"><span /><span /><span /></button>
    </div>
  </nav>
}
