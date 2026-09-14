# `brand.json` — el esquema de una marca

> Extraído el 2026-08-28 leyendo las 16 páginas del dashboard (5.904 LOC, sin
> `CopyAds` ni `Research`, que son el visor del research de keywords y quedan
> fuera del template por decisión de Frank).

## Por qué existe

Hoy el contenido de marca está **tipeado dentro del JSX**: 494 bloques de texto
repartidos en 16 archivos, mezclados con estilos inline. De ahí los 172 "MAVRA"
en 23 archivos. Replicar el dashboard a otra marca significa hoy abrir 16
archivos y reescribir 494 párrafos a mano.

El template no es la página: es **este esquema**. Un `brand.json` por marca y 16
componentes que solo saben renderizarlo.

## Qué páginas alimenta cada bloque

| Bloque | Páginas que lo consumen |
|---|---|
| `identity` | Home · BrandGuidelines · Briefing |
| `positioning` | BrandGuidelines · Home |
| `audience` | BrandGuidelines · Avatares |
| `competitors` | Competitors · BrandGuidelines |
| `visual.palette` · `visual.typography` | Home · Tipografia · BrandGuidelines |
| `visual.photography` · `visual.cameraLanguage` | Escenografia · Briefing |
| `currents` | Corrientes · Escenografia · Briefing |
| `products` | Skulls · Listings · AplusBriefs · Briefing |
| `film` | Filmografia |
| `campaigns` | Campanas · SbPreview · Launch |
| `creators` | Creators |

## El esquema

```jsonc
{
  "identity": {
    "name": "MAVRA",
    "tagline": "Inhabit your shadow.",
    "movement": "Dark Renaissance",          // permanente, no estacional
    "archetype": "The Liberator",
    "market": "USA",
    "language": "en-US",
    "voice": {
      "descriptors": ["dense", "real", "severe"],
      "always": ["…"],                       // Home.siempre
      "never": ["…"],                        // Home.nunca
      "keywords": ["…"]                      // Home.keywords
    }
  },

  "positioning": {
    "pyramid":      [{ "label": "", "top": "", "mid": "", "body": "" }],
    "purpose":      [{ "label": "", "body": "" }],   // las 3 P
    "values":       [{ "title": "", "body": "" }],
    "narratives":   [{ "title": "", "body": "" }],
    "commandments": ["…"],
    "sensory":      [{ "label": "", "body": "" }],
    "isNot":        ["Halloween", "…"]        // lo que la marca NO es
  },

  "audience": {
    "matrix": {                               // The Dog Matrix
      "buyer": "", "user": "", "aspiration": "", "lost": ""
    },
    "feelMap": [["", ""]],
    "journey": [["", ""]],
    "avatars": [{ "id": "", "name": "", "age": "", "profile": "", "wardrobe": "" }]
  },

  "competitors": [{
    "id": "", "name": "", "url": "",
    "analysis": { "identity": "", "composition": "", "lighting": "", "palette": "" },
    "products": [{ "name": "", "price": "" }],
    "takeaways": ["…"],
    "applyToUs": ["…"]
  }],

  "visual": {
    "palette": {
      "main": [{ "name": "", "hex": "", "border": false }],
      "ui":   [{ "name": "", "hex": "" }],
      "board":[{ "name": "", "hex": "" }]
    },
    "typography": {
      "display": { "family": "", "weights": [] },
      "body":    { "family": "", "weights": [] },
      "accent":  { "family": "", "style": "" },
      "combos":  [{ "label": "", "content": "", "bg": "" }]
    },
    "laws": [{ "title": "", "body": "" }],    // las 5 leyes invariables
    "photography": {
      "lighting":    { "temp": "2400K", "angle": "", "rules": ["…"] },
      "backgrounds": { "approved": ["…"], "forbidden": ["…"] },
      "surfaces":    { "approved": ["…"] },
      "props":       { "approved": [{ "label": "", "items": ["…"] }],
                       "forbidden": { "seasonal": ["…"], "material": ["…"] } },
      "wardrobe":    { "approved": ["…"], "forbidden": ["…"] }
    },
    "cameraLanguage": {                        // term → qué es → cómo se promptea
      "shotSizes":   [{ "term": "", "desc": "", "prompt": "" }],
      "angles":      [{ "term": "", "desc": "", "prompt": "" }],
      "lensDepth":   [{ "term": "", "desc": "", "prompt": "" }],
      "composition": [{ "term": "", "desc": "", "prompt": "" }]
    }
  },

  "currents": [{                               // las corrientes/estéticas
    "id": "c1", "title": "Victorian Gothic", "sub": "", "badge": "",
    "mood": "", "identity": "", "home": "", "wardrobe": "",
    "palette": ["…"],
    "props": { "wall": ["…"], "furniture": ["…"], "surface": ["…"],
               "curtains": ["…"], "floor": ["…"], "room": ["…"] },
    "lighting": "", "surfaces": ["…"],
    "never": ["…"],                            // C3 tiene prohibiciones propias
    "brandNote": ""
  }],

  "products": [{
    "id": "", "sku": "", "asin": "", "label": "", "title": "", "headline": "",
    "concept": "", "diff": "",
    "specs":  [{ "k": "", "v": "" }],
    "claims": ["…"],                           // los que están verificados
    "stats":  [{ "k": "", "v": "" }],
    "support":["…"],
    "attribution": { "email": "maas_…" },       // tag por canal
    "assets": { "front": "url", "set": "url", "box": "url" }
  }],

  "film": {
    "principles": ["…"],
    "heroSlots":  [{ "name": "", "desc": "", "prompt": "" }],
    "brolls":     [{ "name": "", "desc": "" }],
    "forbidden":  ["…"]
  },

  "campaigns": {
    "banks":  [{ "id": "", "name": "", "items": ["…"] }],
    "launch": [{ "phase": "", "items": [{ "task": "", "done": false }] }]
  },

  "creators": {
    "pitch": "", "offer": [{ "title": "", "body": "" }],
    "faqs":  [{ "q": "", "a": "" }]
  }
}
```

## Reglas del esquema

1. **Ningún componente nombra la marca.** Todo sale de `identity.name`. Si un
   componente necesita "MAVRA" escrito, el esquema está incompleto.
2. **Ningún componente conoce los productos por su id.** Hoy hay 214 menciones
   de `CND`/`LMP`/`SWD` en el código; con el esquema, `products` es una lista y
   las páginas iteran.
3. **Los assets van por URL, nunca por ruta local.** `public/` pesa 204 MB y no
   puede viajar en un template.
4. **Lo que no aplique a una marca se omite.** Una marca sin corrientes deja
   `currents` vacío y la página no se renderiza — no se rellena con placeholders.

## Lo que falta decidir

- **Dónde vive el JSON.** Import estático como hoy (simple, pero vuelve al
  bundle de 10 MB) o `fetch` desde Supabase (obligatorio si son varias marcas).
- **Quién lo escribe.** El objetivo es que salga de los documentos de marca por
  agente, no a mano: `documentos → agente → brand.json → sitio`.
- **El nacimiento de marca** — repo desde template, proyecto Vercel, dominio y
  rebuild al cambiar el JSON. Eso es de Tecki.
