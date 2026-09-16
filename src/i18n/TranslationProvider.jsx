import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import useMavraLanguage from '../components/useMavraLanguage.js'
import { translateText, translateHtml } from './translate.js'

const titles = {
  '/': ['Case Study', 'Caso de estudio'], '/brand': ['Brand OS', 'Brand OS'],
  '/brand-guidelines': ['Brand Guidelines', 'Guía de marca'], '/brand-guidelines/source': ['Brand Guidelines — Full guide', 'Guía de marca — Documento completo'],
  '/fonts': ['Typography', 'Tipografía'], '/escenografia': ['Scenography', 'Escenografía'],
  '/corrientes': ['Gothic Currents', 'Corrientes góticas'], '/listings-briefs': ['Listing Architecture', 'Arquitectura de listing'],
  '/copy': ['Search and Growth', 'Búsqueda y crecimiento'], '/campanas': ['Campaigns', 'Campañas'],
  '/sb': ['Sponsored Brands', 'Sponsored Brands'], '/launch': ['Launch', 'Lanzamiento'],
  '/research': ['Research', 'Investigación'], '/skulls': ['Products', 'Productos'],
  '/pinterest': ['Pinterest Campaigns', 'Campañas Pinterest'], '/aplus-briefs': ['A+ Content', 'Contenido A+'],
  '/competitors': ['Visual Competitor Analysis', 'Análisis visual de competencia'], '/briefing': ['Creative Direction', 'Dirección creativa'],
  '/influencers': ['Creator Operations', 'Operaciones con creadores'], '/creators': ['Work With Us', 'Colabora con nosotros'],
  '/filmografia': ['Filmography', 'Filmografía'], '/avatares': ['Avatars', 'Avatares'],
}
const aliases = { '/tipografia': '/fonts', '/scenography': '/escenografia', '/listings': '/listings-briefs', '/sb-preview': '/sb', '/campañas': '/campanas', '/campaigns': '/campanas', '/lanzamiento': '/launch', '/campanas-pinterest': '/pinterest', '/avatars': '/avatares' }

const TranslationContext = createContext(null)

export function TranslationProvider({ children, language: override }) {
  const [selected] = useMavraLanguage()
  const language = override || selected
  const { pathname } = useLocation()
  useEffect(() => {
    document.documentElement.lang = language
    const path = decodeURI(pathname).replace(/\/$/, '') || '/'
    const title = titles[aliases[path] || path]
    if (title) document.title = `${title[language === 'es' ? 1 : 0]} — MAVRA`
  }, [language, pathname])
  const value = useMemo(() => ({
    language,
    text: value => translateText(value, language),
    html: value => translateHtml(value, language),
  }), [language])
  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) throw new Error('useTranslation requires TranslationProvider')
  return context
}
