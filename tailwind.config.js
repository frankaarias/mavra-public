/**
 * Tailwind en el dashboard de MAVRA — 2026-07-30.
 *
 * Frank: *"esto así no puede seguir, meter Tailwind y Radix al dashboard de
 * MAVRA ahora, estoy cansado de estas ediciones así"*. Y tenía razón: cada
 * primitiva que en `agta-app` viene resuelta (popover, tooltip, apilamiento)
 * acá estaba escrita a mano, y cada arreglo destapaba el siguiente.
 *
 * Dos decisiones que hacen que esto conviva con lo que ya existe:
 *
 * 1. `preflight: false`. El reset de Tailwind pisaría las 2.400 líneas de CSS
 *    propio de un saque. Las clases nuevas conviven con las viejas y la
 *    migración puede ser gradual en vez de un big bang que rompe la pantalla
 *    con la que Frank está trabajando ahora mismo.
 *
 * 2. Los colores NO son valores fijos: apuntan a las mismas variables CSS que
 *    ya usa el dashboard, que son las que cambian con el tema claro/oscuro. Así
 *    `bg-surface` funciona en los dos temas sin escribir una variante dark, y
 *    el componente que se migre sigue respetando el tema.
 *
 * Los nombres de token son los de `agta-app` (surface, fg, muted, border) para
 * que la tabla del MKL se pueda mover allá sin renombrar nada.
 */
/**
 * OJO con la sintaxis: las variables del dashboard guardan los canales separados
 * por COMA (`--bg-rgb: 13,11,10`). Tailwind por defecto arma `rgb(var(--x) / .6)`
 * con barra, y mezclar comas con la barra de opacidad es CSS inválido: el
 * navegador descarta la regla entera y el color queda transparente sin avisar.
 * Con `rgba(var(--x), .6)` la coma es válida y funciona en los dos casos.
 */
const rgb = (v) => ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(${v}))` : `rgba(var(${v}), ${opacityValue})`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: rgb('--bg-rgb'),
        surface: rgb('--surface-rgb'),
        fg: rgb('--fg-rgb'),
        copper: rgb('--copper-rgb'),
        'copper-bright': rgb('--copper-bright-rgb'),
        burgundy: rgb('--burgundy-rgb'),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        condensed: ['var(--font-condensed)'],
      },
      fontSize: {
        // La tabla vive en tamaños que Tailwind no trae: son los que ya usa el
        // MKL, para que migrar una celda no la cambie de tamaño.
        micro: ['0.54rem', { lineHeight: '1.2' }],
        dato: ['0.72rem', { lineHeight: '1.25' }],
        kw: ['0.76rem', { lineHeight: '1.25' }],
      },
      zIndex: {
        // El orden de apilamiento del encabezado, escrito una vez y en un solo
        // lugar. Los números sueltos repartidos por el CSS fueron el origen del
        // tooltip tapado: dos reglas distintas empataban en 40.
        'th-fila3': '6',
        'th-fila2': '7',
        'th-fila1': '8',
        'th-foco': '50',
        'th-ayuda': '80',
        flotante: '90',
      },
    },
  },
  plugins: [],
}
