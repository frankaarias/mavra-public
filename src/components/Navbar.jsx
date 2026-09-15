import { useState } from 'react'
import brand from '../brand/brand.json'
import { NavLink } from 'react-router-dom'

const { identity } = brand

function SunIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
}
function MoonIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
}
function getInitialTheme() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme || (typeof localStorage !== 'undefined' && localStorage.getItem('mavra-theme')) || 'dark'
}
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const close = () => setMobileOpen(false)
  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next); document.documentElement.dataset.theme = next
    try { localStorage.setItem('mavra-theme', next) } catch {}
  }
  return <nav className="global-nav">
    <NavLink to="/" className="nav-brand" onClick={close}>{identity.name}</NavLink>
    <div className="nav-right">
      <div className={`nav-links${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={close}>Case Study</NavLink>
        <NavLink to="/brand" onClick={close}>Brand OS</NavLink>
        <a href="/#contact" onClick={close}>Contact</a>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema" title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}>{theme === 'light' ? <MoonIcon /> : <SunIcon />}</button>
      <button className={`nav-toggle${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(open => !open)} aria-label="Menú"><span /><span /><span /></button>
    </div>
  </nav>
}
