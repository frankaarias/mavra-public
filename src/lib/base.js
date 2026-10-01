// La web vive bajo agta.io/case (2026-10-01; antes era case.agta.io, que se
// elimino). Vite publica todo con `base: '/case/'`, pero eso solo reescribe lo
// que Vite ve: el HTML, el CSS y los imports. Las rutas a `public/` escritas
// como texto ('/pinterest/x.jpg') y los fetch a '/api/...' no las toca, y en
// agta.io apuntarian a la landing, no a esta web. Por eso pasan por aqui.
export const BASE = import.meta.env.BASE_URL // '/case/'

/** Ruta absoluta de un archivo de `public/` o de una funcion de `api/`. */
export const conBase = (ruta) => BASE + String(ruta).replace(/^\//, '')
