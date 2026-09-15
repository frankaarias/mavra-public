import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { lazy, Suspense } from 'react'

// Las dos paginas del visor de research pesan 11,3 MB en datos — el 93% del
// bundle. Van con carga diferida para que abrir el dashboard no las traiga.
const CopyAds = lazy(() => import('./pages/CopyAds.jsx'))
const Research = lazy(() => import('./pages/Research.jsx'))
const Cargando = () => <div style={{ padding: '4rem 2rem', fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)' }}>Cargando…</div>
import Navbar from './components/Navbar.jsx'
import ScrollToRouteStart from './components/ScrollToRouteStart.jsx'
import Home from './pages/Home.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import BrandGuidelines from './pages/BrandGuidelines.jsx'
import BrandGuidelinesSource from './pages/BrandGuidelinesSource.jsx'
import Tipografia from './pages/Tipografia.jsx'
import Escenografia from './pages/Escenografia.jsx'
import Corrientes from './pages/Corrientes.jsx'
import Listings from './pages/Listings.jsx'
import Campanas from './pages/Campanas.jsx'
import SbPreview from './pages/SbPreview.jsx'
import Launch from './pages/Launch.jsx'
import Skulls from './pages/Skulls.jsx'
import PinterestCampaigns from './pages/PinterestCampaigns.jsx'
import Competitors from './pages/Competitors.jsx'
import Briefing from './pages/Briefing.jsx'
import AplusBriefs from './pages/AplusBriefs.jsx'
import Influencers from './pages/influencers/Influencers.jsx'
import Creators from './pages/Creators.jsx'
import Filmografia from './pages/Filmografia.jsx'
import Avatares from './pages/Avatares.jsx'

export default function App() {
  return (
    <>
      <ScrollToRouteStart />
      <Navbar />
      <Suspense fallback={<Cargando />}>
      <Routes>
        <Route path="/" element={<CaseStudy />} />
        <Route path="/brand" element={<Home />} />
        <Route path="/brand-guidelines" element={<BrandGuidelines />} />
        <Route path="/brand-guidelines/source" element={<BrandGuidelinesSource />} />
        <Route path="/fonts" element={<Tipografia />} />
        <Route path="/tipografia" element={<Tipografia />} />
        <Route path="/scenography" element={<Escenografia />} />
        <Route path="/escenografia" element={<Escenografia />} />
        <Route path="/corrientes" element={<Corrientes />} />
        <Route path="/listings-briefs" element={<Listings />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/copy" element={<CopyAds />} />
        <Route path="/campanas" element={<Campanas />} />
        <Route path="/sb" element={<SbPreview />} />
        <Route path="/sb-preview" element={<SbPreview />} />
        <Route path="/campañas" element={<Campanas />} />
        <Route path="/campaigns" element={<Campanas />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/lanzamiento" element={<Launch />} />
        <Route path="/research" element={<Research />} />
        <Route path="/skulls" element={<Skulls />} />
        <Route path="/pinterest" element={<PinterestCampaigns />} />
        <Route path="/campanas-pinterest" element={<PinterestCampaigns />} />
        <Route path="/aplus-briefs" element={<AplusBriefs />} />
        <Route path="/competitors" element={<Competitors />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/influencers" element={<Influencers />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/filmografia" element={<Filmografia />} />
        <Route path="/avatares" element={<Avatares />} />
        <Route path="/avatars" element={<Avatares />} />
      </Routes>
      </Suspense>
    </>
  )
}
