import { useState } from 'react'
import brand from '../brand/brand.json'

const { identity } = brand
import { NavLink, useLocation } from 'react-router-dom'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

function getInitialTheme() {
  if (typeof document === 'undefined') return 'dark'
  return (
    document.documentElement.dataset.theme ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('mavra-theme')) ||
    'dark'
  )
}

const GROUPS = [
  {
    label: 'Brand',
    items: [
      { to: '/brand-guidelines', label: 'Brand Guidelines' },
      { to: '/fonts', label: 'Tipografía' },
      { to: '/scenography', label: 'Escenografía' },
      { to: '/filmografia', label: 'Filmografía' },
      { to: '/avatares', label: 'Avatares' },
    ],
  },
  {
    label: 'Producto',
    items: [
      { to: '/skulls', label: 'Productos' },
      { to: '/listings-briefs', label: 'Listings' },
      { to: '/aplus-briefs', label: 'A+ Content' },
      { to: '/copy', label: 'Copy & Ads' },
      { to: '/campanas', label: 'Campañas' },
      { to: '/pinterest', label: 'Campañas Pinterest' },
      { to: '/launch', label: 'Launch' },
    ],
  },
  {
    label: 'Estrategia',
    items: [
      { to: '/corrientes', label: 'Corrientes' },
      { to: '/competitors', label: 'Competitors' },
      { to: '/research', label: 'Research (MKL)' },
      { to: '/briefing', label: 'Briefing' },
    ],
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [theme, setTheme] = useState(getInitialTheme)
  const location = useLocation()

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('mavra-theme', next)
    } catch (e) {
      /* ignore */
    }
  }

  function isGroupActive(group) {
    return group.items.some(item => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))
  }

  function close() {
    setMobileOpen(false)
    setHovered(null)
  }

  return (
    <nav className="global-nav">
      <NavLink to="/" className="nav-brand" onClick={close}>
        {identity.name}
      </NavLink>

      <div className="nav-right">
        <div className={`nav-links${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={close}>Home</NavLink>

        {GROUPS.map(group => (
          <div
            key={group.label}
            className={`nav-group${isGroupActive(group) ? ' active' : ''}`}
            onMouseEnter={() => setHovered(group.label)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className={`nav-group-label${hovered === group.label || isGroupActive(group) ? ' hovered' : ''}`}>
              {group.label} <span style={{ fontSize: '0.5rem', opacity: 0.6 }}>▾</span>
            </span>
            {hovered === group.label && (
              <div className="nav-dropdown">
                {group.items.map(item => (
                  <NavLink key={item.to} to={item.to} onClick={close}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}

        <NavLink to="/influencers" onClick={close}>Influencers</NavLink>
        <NavLink to="/creators" onClick={close}>Creators</NavLink>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        <button
          className={`nav-toggle${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
