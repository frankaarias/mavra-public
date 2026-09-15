import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import brand from '../brand/brand.json'

const { identity } = brand

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <nav className="global-nav case-nav">
      <NavLink to="/" className="nav-brand" onClick={close}>{identity.name}</NavLink>
      <div className={`nav-links${open ? ' open' : ''}`}>
        <NavLink to="/" end onClick={close}>Case Study</NavLink>
        <NavLink to="/brand" onClick={close}>Evidence</NavLink>
        <a href="/#contact" onClick={close}>Contact</a>
      </div>
      <button className={`nav-toggle${open ? ' open' : ''}`} onClick={() => setOpen(value => !value)} aria-label="Open navigation">
        <span /><span /><span />
      </button>
    </nav>
  )
}
