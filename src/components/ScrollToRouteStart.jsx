import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToRouteStart() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash.slice(1)) : null
      if (target) target.scrollIntoView({ block: 'start' })
      else window.scrollTo({ top: 0, left: 0 })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
