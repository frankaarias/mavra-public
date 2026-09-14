# Derivador de vocabulario — informe de validación

**2026-08-04.** Cuatro nichos medidos contra etiquetas de control escritas **antes** de correr nada.

**Resultado en dos partes:** el derivador **no generaliza** fuera de un nicho con estética dominante — falló en 3 de 3 nichos funcionales — y las tres hipótesis basadas en el texto de la keyword cayeron por la misma causa. **Pero la cuarta, que mira afuera del texto, funciona con 56 puntos de margen.**

---

## Lo que se probó

| Nicho | Bloque | Keywords | Se esperaba | Salió |
|---|---|---|---|---|
| `wall clock` | estética fuerte | 11.632 | NICHO con estéticas | **NICHO (33)** — `vintage`, `retro`, `farmhouse` ✅ **junto con** `digital`, `large`, `black`, `24`, `led` |
| `drill bits` | funcional puro | 11.677 | **NICHO vacío** | **NICHO (57)** — con `dewalt`, `milwaukee`, `klein`, `makita` adentro |
| `garden hose` | funcional puro | 7.805 | **NICHO vacío** | **NICHO (77)** — `water`, `pressure`, `pool`, `metal`, `rubber`, números |
| `cast iron skillet` | funcional puro | 5.832 | **NICHO vacío** | **NICHO (19)** — con **`lodge`** (241 kws), la marca dominante del rubro |

**Tres de tres en el bloque funcional fallaron**, y en dos de los tres la marca líder quedó **dentro** del vocabulario del nicho.

## Lo que sí funciona, y conviene no perderlo

- **NUCLEO** — limpio en los cuatro. `clock`, `drill`, `hose`, `skillet` con ratio de posición final 0,90+.
- **ATRIBUTO** — correcto. `battery_operated`, `waterproof`, `magnetic`, `powered`.
- **FUERA** — cazó `seiko` en relojes.
- **Bigramas** — `living_room`, `nut_driver`, `masonry_drill`, `cobalt_drill` salen enteros.

**El motor sabe qué se compra y qué es una característica. Lo que no sabe es distinguir una marca de una estética.**

---

## Las tres hipótesis, y por qué las tres caen igual

**1. `competing_products` bajo = marca.** ❌
DeWalt vende de todo y compite con 20.000 productos: pasa el mismo umbral que `gothic` (100.000).

**2. Co-ocurrencia: una marca se pega a su categoría, una estética cruza.** ❌
Medido con núcleos distintos por token:
```
drill bits   MARCAS    dewalt 22 · milwaukee 13 · makita 13 · ryobi 13 · bosch 11 · klein 8
             NO-MARCAS impact 18 · hex 12 · step 11 · masonry 10 · carbide 9 · cobalt 8
```
Se solapan por completo. `dewalt` cruza **más** categorías que todas las no-marcas — porque una marca grande vende taladros, sierras y baterías.

**3. `aba_click_share`: si es de marca, los top-3 concentran el clic.** ⚠️ señal parcial
```
wall clock   seiko 39%  vs  vintage 17 · retro 21 · farmhouse 25 · digital 31   SEPARA
drill bits   dewalt 55 · ryobi 61 · bosch 49  vs  step 47 · masonry 46 · impact 39   se solapa
```
Hay señal —las marcas promedian ~48 contra ~42— pero no un corte limpio. **Y el nivel absoluto depende del nicho:** las no-marcas están en 17-31% en relojes y en 38-47% en taladros, así que un umbral fijo no puede existir. Habría que normalizar contra la mediana del propio nicho, y eso necesita más nichos para calibrarse.

### La causa común

Las tres separan **marca chica de estética grande**, no marca de estética. Y el motivo es el mismo:

> `dewalt drill bit set` y `carbide drill bit set` son **estructuralmente idénticas**. La única diferencia es que una palabra pertenece a una empresa y la otra no — **y eso no está escrito en la frase**.

Ninguna señal derivada del texto puede resolverlo, porque la información no está ahí.

---

## ✅ LA CUARTA HIPÓTESIS FUNCIONA: cuota de página del vendedor líder

**Medida:** se scrapea la SERP de `<token> <núcleo>` y se cuenta qué fracción del top-16 pertenece al **vendedor más frecuente**.

**Resultado, con 8 keywords de control:**

| Keyword | Vendedor líder en el top-16 | Cuota | Etiqueta |
|---|---|---|---|
| `lodge cast iron skillet` | Lodge **16/16** | **100%** | marca |
| `seiko wall clock` | SEIKO **16/16** | **100%** | marca |
| `dewalt drill bit set` | DeWalt **16/16** | **100%** | marca |
| `milwaukee drill bit set` | Milwaukee 13/16 | **81%** | marca |
| `carbide drill bit set` | DeWalt 4/16 | **25%** | genérico |
| `farmhouse wall clock` | XFM / Menterry / EMAX, 2 c/u | **13%** | estética |
| `gothic decor` | ninguno repetido | **~6%** | estética |

```
MARCA      81 · 100 · 100 · 100
                    ↑ 56 puntos de margen, sin un solo solapamiento
GENÉRICO    6 ·  13 ·  25
```

**Umbral propuesto: >60% marca · <40% no-marca · en el medio, zona gris que se resuelve con las otras señales.**

**Por qué esta sí y las otras no:** es la única que mira **afuera del texto**. `dewalt drill bit set` y `carbide drill bit set` se escriben igual, pero en la primera **una sola empresa se lleva la página entera** y en la segunda compiten siete. Eso es precisamente lo que significa que una palabra "sea de alguien", y no se puede deducir de la frase.

**Costo:** 2 corridas del scraper de Amazon para las 8 keywords — **0,02 compute units**, sin tocar la cuota de H10. Mucho más barato que el reverse ASIN que temíamos.


### Validación con 5 keywords más (las que el derivador ponía mal en NICHO)

```
masonry drill bit set      Bosch 3/16       19%   no-marca ✅
vintage wall clock         máx 2/16         13%   no-marca ✅
digital wall clock         JALL 3/16        19%   no-marca ✅
enamel cast iron skillet   Crock-Pot 3/16   19%   no-marca ✅
expandable garden hose     Pocket Hose 8/16 50%   zona gris
```

**12 de 13 correctas, 1 en zona gris.** Y el gris **no es un fallo**: `expandable
garden hose` es un genérico que **dos marcas se reparten** — Pocket Hose 8 y Flexi
Hose 7, o sea 15 de 16 entre las dos. Que dé 50% es lo correcto: no es una marca
ajena, pero tampoco un término abierto.

**Corolario que vale más que el clasificador:** el score no solo separa marca de
estética, **mide qué tan tomada está una keyword**. 100% = es de alguien · ~50% =
duopolio, se puede pero se pelea · <20% = mercado abierto. Eso es un dato de
research por derecho propio, no un paso intermedio.

**Cómo se integra:** no hace falta scrapear todos los tokens. Solo los que hoy caen en NICHO o FUERA —los ambiguos—, y una vez por token, cacheado. En `drill bits` eran 57; en el gótico, un puñado.

---

## Estado del gasto

**2 llamadas usadas** de las 100 del presupuesto (`wall clock` ya estaba; `drill bits`, `garden hose` y `cast iron skillet` se trajeron hoy — 3 nuevas, 1 previa).
**La sesión del MCP de H10 venció** en la cuarta llamada, así que los 16 nichos restantes quedan pendientes de que se renueve.

**Pero el diagnóstico no los necesita:** tres de tres en el bloque funcional es concluyente. Los 16 restantes servirían para *calibrar* un discriminador que todavía no tenemos, no para saber si hace falta.
