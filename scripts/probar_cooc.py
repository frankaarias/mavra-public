# -*- coding: utf-8 -*-
"""¿La co-ocurrencia distingue MARCA de ESTÉTICA? Medido, no supuesto.

El problema (2026-08-04): la clase NICHO del derivador se llenó de marcas. En
`drill bits` salieron `dewalt` (153 kws), `milwaukee` (114), `klein` y `makita`
DENTRO del vocabulario del nicho. El filtro que debía sacarlas es el
`competing_products` bajo, y con marcas grandes no sirve: DeWalt vende de todo y
compite con 20.000 productos, así que pasa el mismo umbral que `gothic`.

**La hipótesis a probar:** una marca se pega a SU categoría; una estética cruza
categorías. `dewalt` aparece con drill, saw, battery, impact — todo herramienta.
`farmhouse` aparece con clock, decor, sign, curtain — cosas distintas entre sí.

**Cómo se mide sin pedirle nada a nadie:** para cada token, se miran los NÚCLEOS
con los que co-ocurre (los tokens que el propio derivador clasificó como NUCLEO).
Si un token convive con muchos núcleos distintos, cruza categorías.

⚠️ Y esto se corre ANTES de tocar el derivador, porque el 2-ago ya pasó lo
contrario: "frecuencia = marca" parecía obvio, se implementó, y sobre datos
reales `veradek` (marca) salía 11 veces y `decoracion` (ruido) 18. La corazonada
estaba al revés que el dato.
"""
import json, io, os, sys
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from derivar_vocabulario import derivar

CACHE = r"D:\dev\mavra\_staging\derivador"

# Lo que ya sabemos de cada nicho, para tener contra qué medir. Sin etiqueta de
# control el resultado no se puede evaluar: cualquier número "parece razonable".
CONTROL = {
    "drill_bits": {
        "marca": ["dewalt", "milwaukee", "klein", "makita", "bosch", "ryobi"],
        "no_marca": ["impact", "hex", "carbide", "step", "cobalt", "masonry"],
    },
    "wall_clock": {
        "marca": ["seiko", "casio"],
        "no_marca": ["vintage", "farmhouse", "retro", "modern", "digital", "large"],
    },
}


def tokens(frase):
    return [t for t in frase.lower().replace("-", " ").split() if t]


def analizar(archivo):
    d = json.load(io.open(os.path.join(CACHE, archivo + ".json"), encoding="utf-8"))
    kws = d["keywords"]
    clases = derivar(kws)
    nucleos = {t for t, v in clases.items() if v[0] == "NUCLEO"}

    # Con qué núcleos convive cada token, y en cuántas keywords aparece.
    convive = defaultdict(set)
    veces = defaultdict(int)
    for k in kws:
        ts = set(tokens(k.get("phrase", "")))
        nn = ts & nucleos
        for t in ts:
            veces[t] += 1
            convive[t] |= (nn - {t})

    print(f"\n{'='*64}\n{archivo}  ·  {len(kws):,} keywords  ·  {len(nucleos)} núcleos")
    ctl = CONTROL.get(archivo, {})
    for etiqueta in ("marca", "no_marca"):
        print(f"\n  {etiqueta.upper()}")
        for t in ctl.get(etiqueta, []):
            if veces[t] < 5:
                print(f"    {t:14} (aparece {veces[t]}, muy poco para medir)")
                continue
            n = len(convive[t])
            print(f"    {t:14} convive con {n:>2} núcleos distintos   (en {veces[t]:>3} kws)")
    return convive, veces, nucleos


for a in ("drill_bits", "wall_clock"):
    if os.path.exists(os.path.join(CACHE, a + ".json")):
        analizar(a)

print("\n" + "=" * 64)
print("LECTURA: si las marcas conviven con MENOS núcleos que las no-marcas,")
print("la hipótesis se sostiene y el discriminador sirve. Si se solapan, no.")
