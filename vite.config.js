import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La web se sirve en agta.io/case (2026-10-01): la landing de agta.io reescribe
// /case/* hacia este proyecto. Por eso todo se publica bajo /case/ y el build
// sale a dist/case, asi los archivos existen en Vercel en la misma ruta que en
// agta.io. Las rutas escritas como texto pasan por src/lib/base.js.
export default defineConfig({
  base: '/case/',
  plugins: [react()],
  build: { outDir: 'dist/case', emptyOutDir: true },
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
})
