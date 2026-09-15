import { Routes, Route } from 'react-router-dom'
import './public-case.css'
import Navbar from './components/Navbar.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import BrandOS from './pages/BrandOS.jsx'
import EvidencePage from './pages/EvidencePage.jsx'

const routes = {
  strategy: ['/brand-guidelines'],
  typography: ['/fonts', '/tipografia'],
  scenography: ['/scenography', '/escenografia'],
  territory: ['/corrientes'],
  retail: ['/listings-briefs', '/listings'],
  aplus: ['/aplus-briefs'],
  demand: ['/copy', '/campanas', '/campañas', '/campaigns'],
  launch: ['/launch', '/lanzamiento'],
  research: ['/research', '/competitors'],
  products: ['/skulls'],
  distribution: ['/pinterest', '/campanas-pinterest'],
  creative: ['/briefing'],
  creators: ['/influencers', '/creators'],
  film: ['/filmografia'],
  avatars: ['/avatares', '/avatars'],
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CaseStudy />} />
        <Route path="/brand" element={<BrandOS />} />
        {Object.entries(routes).flatMap(([area, paths]) => paths.map(path => (
          <Route key={path} path={path} element={<EvidencePage area={area} />} />
        )))}
        <Route path="*" element={<CaseStudy />} />
      </Routes>
    </>
  )
}
