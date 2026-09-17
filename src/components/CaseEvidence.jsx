import { Link } from 'react-router-dom'
import useMavraLanguage from './useMavraLanguage.js'
import { visualAssets } from '../content/caseEvidence.js'
import '../case-editorial.css'

export function EvidenceLayout({title,intro,children,id}) {
 const [lang]=useMavraLanguage(); const es=lang==='es'
 return <main className="case-study editorial-case evidence-detail" id={id}>
  <header className="editorial-header"><Link className="editorial-back" to="/#evidence">← {es?'Volver al caso MAVRA':'Back to the MAVRA case'}</Link><p className="case-eyebrow">AGTA / MAVRA</p><h1>{title}</h1><p className="editorial-lead">{intro}</p></header>
  {children}
  <footer className="editorial-footer"><Link to="/brand">{es?'Explorar todo el trabajo':'Explore all the work'} →</Link><Link to="/#contact">{es?'Hablemos de tu marca':'Let’s talk about your brand'} →</Link></footer>
 </main>
}
export function VisualEvidence({indices=[0,1,2]}) {
 const [lang]=useMavraLanguage(); const es=lang==='es'
 return <div className="visual-evidence">{indices.map(i=>{const a=visualAssets[i];return <figure key={a.src}><a href={a.src} target="_blank" rel="noreferrer" aria-label={`${es?'Ampliar':'Enlarge'}: ${a[lang]}`}><img src={a.src} alt={a[lang]} loading="lazy" /></a><figcaption>{a[lang]}<small>{es?'Pieza del archivo Pinterest de MAVRA · Abrir imagen ↗':'From MAVRA’s Pinterest archive · Open image ↗'}</small></figcaption></figure>})}</div>
}
export function AssetNote() {const [lang]=useMavraLanguage();return <p className="editorial-note">{lang==='es'?'Piezas existentes del archivo Pinterest que ilustran la dirección visual. El entregable recuperado en esta página es el brief de producción.':'Existing Pinterest archive pieces illustrate the visual direction. The recovered deliverable on this page is the production brief.'}</p>}
