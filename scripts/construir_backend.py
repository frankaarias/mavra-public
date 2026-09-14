#!/usr/bin/env python3
"""Backend (generic_keyword) de los tres productos, generado del MKL + UKL.

Reglas que manda Amazon y que aca se respetan:
  - 249 BYTES, no caracteres.
  - No repetir lo que ya esta en titulo / Item Highlight / vinetas: eso no suma
    indexacion, solo gasta espacio.
  - Sin marca propia (ya esta en el titulo) ni marcas de terceros.
  - Sin comas: Amazon separa por espacios.
  - Amazon NO hace stemming: `goth` y `gothic` son dos palabras distintas y las
    dos tienen que estar escritas si las dos importan.
"""
import json, io, os, sys, re, urllib.request, urllib.parse
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import sys as _sys
_sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from correcciones import aplicar as aplicar_correcciones

DATA = r"D:\dev\mavra\dashboard\src\data"
ENV = r"C:/Users/FRANCISCO ARIAS/.claude/channels/discord-tecki/.env"
LIMITE = 249
PROD = {"SWD": "MVWSKLBLK", "CND": "MVCSKLBLK", "LMP": "MVLSKLBLK"}

TIH = json.load(io.open(os.path.join(DATA, "titulos_ih.json"), encoding="utf-8"))
# Formas que MAVRA no fabrica. Vienen del reverse ASIN —los competidores venden
# lamparas de cuervo, murcielagos, gatos— y colarlas al backend promete algo que
# la foto no muestra: el clic se paga igual y no convierte, y si convierte vuelve
# como devolucion. Frank lo cazo con `crow` en el Item Highlight del LMP
# (2026-08-01): "crow? crow? crow???". El producto es una calavera.
FORMAS_AJENAS = re.compile(
    r"\b(crow|crows|raven|ravens|bat|bats|ghost|ghosts|coffin|coffins|pumpkin|"
    r"pumpkins|cat|cats|moon|spider|spiders|cauldron|snake|snakes|butterfly|"
    r"mushroom|mushrooms|frog|frogs|owl|owls|wolf|dragon)\b", re.I)

# Objetos de OTRA categoria que se cuelan porque la keyword dice "gothic": una
# pecera gotica sigue siendo una pecera. Y terminos de compra mayorista, que
# describen a otro comprador.
OTRA_COSA = re.compile(r"\b(aquarium|fish|tank|car|cake|bulk|clearance|farmhouse|"
                       r"bathroom|toilet|shower|nursery|baby|dog|puppy)\b", re.I)

# El gate del nicho sale del generador de la UKL, no de una copia: si manana se
# afina el vocabulario gotico, el backend lo hereda solo.
sys.path.insert(0, r"D:\dev\mavra\dashboard\scripts")
from construir_ukl import NICHO, CAT  # noqa: E402
# Coherencia con el PPC: si la marca decidio no aparecer en esa busqueda, tampoco
# se la escribe en el backend. Sale de la misma lista, no de una copia a mano.
NEG = json.load(io.open(os.path.join(DATA, "negativos_marca.json"), encoding="utf-8"))
_ex = [n["t"] for n in NEG["global"] if n["activo"]]
EXCLUIDAS = re.compile(r"\b(" + "|".join(re.escape(t) for t in _ex) + r")\b", re.I)

# Palabras que no aportan indexacion: no vale la pena gastarles bytes.
VACIAS = set("""a an the and or for with of in on to from by at is are be this that
your you my our it its as not no than then so if but very more most best top new
set pack piece pieces item items product products thing things""".split())
# Marcas: propias y de terceros. Ninguna va al backend.
MARCAS = re.compile(r"\b(mavra|govee|philips|hue|ikea|target|walmart|nanoleaf|lifx|"
                    r"yeelight|wyze|sengled|cricut|temu|shein|nomnu|ovanus|shandaglo|"
                    r"ehuoyan|eppara|livemax|tradeopia|yyzzh|suck uk)\b", re.I)

env = {}
for line in io.open(ENV, encoding="utf-8"):
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1); env[k.strip()] = v.strip()
AGTA = "https://arjjqwluwmpnhwamkskh.supabase.co"; AK = env["SUPABASE_SERVICE_ROLE_KEY"]


def gj(u, h):
    with urllib.request.urlopen(urllib.request.Request(u, headers=h), timeout=90) as r:
        return json.loads(r.read().decode())


hd = {"apikey": AK, "Authorization": f"Bearer {AK}"}
lst = gj(f"{AGTA}/rest/v1/sp_listings?seller_id=eq.A21K7VPXZAEEFR&select=*"
         "&order=updated_at.desc.nullslast&limit=80", hd)
por_sku = {}
for r in lst:
    if r.get("sku") and r["sku"] not in por_sku:
        por_sku[r["sku"]] = r


def palabras(txt):
    return set(re.findall(r"[a-z0-9]+", (txt or "").lower()))


salida = {}
for p, sku in PROD.items():
    L = por_sku.get(sku, {})
    bullets = L.get("bullets") or []
    if isinstance(bullets, str):
        try: bullets = json.loads(bullets)
        except Exception: bullets = [bullets]
    tih = TIH[p]

    # Lo que ya esta indexado por otro campo. El titulo que cuenta es el NUEVO:
    # el backend se escribe para convivir con el listado que vamos a subir.
    ya = palabras(tih["titulo"]) | palabras(tih["ih"]) | palabras(" ".join(map(str, bullets)))
    ya |= VACIAS

    # Segunda corrida: ponderar PALABRAS por volumen tampoco sirve. `bathroom`
    # sumaba 544.433 y se comia el backend de SWD junto a `pink` y `lemon`: son
    # palabras gordas de keywords marginales. El backend no se llena con palabras
    # caras, se llena CUBRIENDO las mejores keywords enteras. Asi que las keywords
    # se ordenan por IDN —demanda del nicho, ya calculada— y se van agregando sus
    # palabras faltantes en ese orden hasta llenar los 249 bytes.
    candidatas = []      # (idn, kw) ya filtradas
    peso = defaultdict(int)
    origen = defaultdict(set)

    # Primera corrida: usaba TODAS las kws del archivo y el backend salio con
    # `tapestry`, `western` y `poster` —que son negativos de marca— mas `scentsy`
    # y `hello kitty`. El MKL v3 ya viene clasificado en buckets y 939 keywords
    # estan en `Negatives`: hay que leer el bucket, no el volumen.
    mkl = json.load(io.open(os.path.join(DATA, f"{p.lower()}_mkl_v3.json"), encoding="utf-8"))
    # La curación de Frank ANTES de mirar ningún bucket. Sin esto, el filtro de
    # abajo descarta las keywords que él sacó de `Residue` a mano: son 3.298
    # decisiones que hasta hoy solo leía el dashboard.
    mkl["kws"] = aplicar_correcciones(mkl["kws"], p)
    for k in mkl["kws"]:
        kw = (k.get("kw_lower") or k.get("kw") or "").lower()
        vol = k.get("vol") or 0
        if k.get("bucket") not in ("MKL", "Outliers"):
            continue          # Residue, Trash y Negatives no van al listado
        if k.get("branded") or MARCAS.search(kw):
            continue          # marca de tercero: ni al backend ni a la puja
        if (k.get("fit") or 0) < 0.5:
            continue          # el producto no satisface esa busqueda
        if EXCLUIDAS.search(kw) or FORMAS_AJENAS.search(kw) or OTRA_COSA.search(kw):
            continue          # negativos de marca y formas que el producto no tiene
        if not kw or vol < 300:
            continue
        # Tercera corrida: seguian entrando `bathroom decor`, `spongebob`,
        # `sea turtle` y `soap dispenser`. No es un bug del filtro: los
        # competidores del reverse ASIN venden decoracion generica, asi que su
        # universo arrastra todo eso. El backend de MAVRA tiene que ser gotico o
        # de su categoria; lo demas no describe el producto.
        if not (re.search(NICHO, kw) or re.search(CAT[p], kw)):
            continue
        candidatas.append((k.get("idn") or vol, kw, k.get("kw") or kw))

    ukl = json.load(io.open(os.path.join(DATA, f"{p.lower()}_ukl.json"), encoding="utf-8"))
    for k in ukl["kws"]:
        # Del universo entra lo que el producto PUEDE satisfacer. CATALOGO no:
        # es demanda sin producto, meterla al backend seria prometer lo que no hay.
        if k["para"] != "VENDER":
            continue
        kw = k["kw_lower"]; vol = k.get("vol") or 0
        if MARCAS.search(kw) or EXCLUIDAS.search(kw) or FORMAS_AJENAS.search(kw) or OTRA_COSA.search(kw):
            continue
        # la UKL no tiene IDN (ningun competidor la tiene): ordena por volumen
        candidatas.append((vol, kw, k["kw"]))

    candidatas.sort(key=lambda z: -z[0])
    elegidas, usados, cubiertas = [], 0, []
    for score, kw, original in candidatas:
        faltan = [w for w in dict.fromkeys(re.findall(r"[a-z0-9]+", kw))
                  if w not in ya and len(w) >= 3 and w not in elegidas
                  and not FORMAS_AJENAS.fullmatch(w) and not OTRA_COSA.fullmatch(w)]
        if not faltan:
            continue
        costo = sum(len(w.encode("utf-8")) for w in faltan) + len(faltan)
        if usados + costo > LIMITE:
            continue          # no entra entera: se saltea y sigue la que si entre
        for w in faltan:
            peso[w] = score
            origen[w].add(original)
        elegidas += faltan
        usados += costo
        cubiertas.append(original)
    backend = " ".join(elegidas)

    salida[p] = {
        "asin": tih["asin"], "sku": sku, "backend": backend,
        "bytes": len(backend.encode("utf-8")), "palabras": len(elegidas),
        "keywords_cubiertas": cubiertas,
        "top": [{"palabra": w, "score": peso[w], "ej": sorted(origen[w])[:2]}
                for w in elegidas[:12]],
    }
    print(f"=== {p} — {len(backend.encode('utf-8'))}/{LIMITE} bytes · {len(elegidas)} palabras "
          f"· cubre {len(cubiertas)} keywords enteras")
    print(f"    {backend}")
    print(f"    cubre: " + " · ".join(cubiertas[:10]))
    print()

json.dump(salida, io.open(r"D:\dev\mavra\dashboard\src\data\backend.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print("-> backend_propuesto.json")
