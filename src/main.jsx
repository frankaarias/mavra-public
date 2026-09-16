import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { TranslationProvider } from './i18n/TranslationProvider.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TranslationProvider><App /></TranslationProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
