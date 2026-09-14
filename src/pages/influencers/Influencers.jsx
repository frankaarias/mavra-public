import { useState } from 'react'
import Ecosystem from './Ecosystem.jsx'
import Pipeline from './Pipeline.jsx'
import Directorio from './Directorio.jsx'
import Motor from './Motor.jsx'
import Lote from './Lote.jsx'
import ChatWidget from '../../components/ChatWidget.jsx'

const TABS = [
  { id: 'ecosystem', label: 'El Ecosistema', icon: '◈' },
  { id: 'pipeline', label: 'Pipeline', icon: '◉' },
  { id: 'directorio', label: 'Directorio', icon: '◇' },
  { id: 'lote', label: 'Lote 1 · gifting', icon: '✉' },
  { id: 'motor', label: 'Motor de selección', icon: '⚙' },
]

export default function Influencers() {
  const [activeTab, setActiveTab] = useState('ecosystem')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '60px' }}>
      {/* Left sidebar - sub-tabs */}
      <aside style={{
        width: '200px',
        flexShrink: 0,
        borderRight: '1px solid rgba(var(--copper-rgb),0.15)',
        padding: '32px 0',
        position: 'sticky',
        top: '60px',
        height: 'calc(100vh - 60px)',
        background: 'rgba(var(--bg-rgb),0.95)',
      }}>
        <div style={{ padding: '0 20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(var(--copper-rgb),0.6)', marginBottom: '4px' }}>Influencers</p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(var(--fg-rgb),0.3)', lineHeight: 1.4 }}>126 creadores · 86 verificados uno por uno · 41 en A</p>
        </div>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 20px',
              background: activeTab === tab.id ? 'rgba(var(--copper-rgb),0.12)' : 'transparent',
              border: 'none',
              borderLeft: activeTab === tab.id ? '2px solid var(--copper-bright)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--fg)' : 'rgba(var(--fg-rgb),0.4)',
              fontFamily: "var(--font-sans)",
              fontSize: '0.78rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ color: activeTab === tab.id ? 'var(--copper-bright)' : 'rgba(var(--copper-rgb),0.4)', fontSize: '0.7rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px 56px 120px' }}>
        {activeTab === 'ecosystem' && <Ecosystem />}
        {activeTab === 'pipeline' && <Pipeline />}
        {activeTab === 'directorio' && <Directorio />}
        {activeTab === 'lote' && <Lote />}
        {activeTab === 'motor' && <Motor />}
      </main>

      {/* Chat widget always visible */}
      <ChatWidget context="influencers" />
    </div>
  )
}
