# -*- coding: utf-8 -*-
"""Arma el universo de keywords de un nicho uniendo el reverse-ASIN de sus competidores.

POR QUÉ EXISTE (2026-08-06)
El universo lo daba Magnet (`get_keywords_by_keyword`). Esa tool del MCP de
Helium 10 devuelve `session expired` mientras las otras 45 responden — probado
una por una, incluido Cerebro. Frank aclaró además que en H10 de hoy Cerebro y
Magnet son la misma herramienta, así que la data no baja de calidad al cambiar
de puerta.

Y el cambio deja algo que Magnet NO daba: **relevancia**. Magnet devolvía
keywords sueltas de una semilla. Acá, cada keyword sabe **en cuántos de los N
competidores aparece**, que es exactamente el gate que separa el nicho del ruido
de categoría — la lección del MKL de JULZEN, donde ordenar por volumen metió
`coffee table` (SV 734k, relevancia 1) en un nicho de libros decorativos.

CÓMO ENTRA LA DATA
El MCP vive en la sesión del bot, no acá: las llamadas a Cerebro las hace el bot
y el runtime deja cada respuesta en un archivo de `tool-results/`. Este script
NO llama al MCP — barre esos archivos. El ASIN no está en el nombre del archivo,
pero **cada keyword trae `current_asin` adentro**, así que el agrupamiento sale
del contenido y no del orden en que se hicieron las llamadas.

    python universo_cerebro.py                      # todos los nichos con ASINs
    python universo_cerebro.py --nicho "dog bed"
    python universo_cerebro.py --min-relevancia 2   # descarta la cola de 1 solo

Salida: el mismo caché que consume correr_nichos.py
    _staging/derivador/<nicho>.json   con origen "cerebro-multi"
"""

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

import os, io, json, glob, argparse, datetime

CACHE = r"D:\dev\mavra\_staging\derivador"
ASINS = os.path.join(CACHE, "asins_nichos.json")

# Donde el runtime deja las respuestas del MCP que no caben en el contexto.
TOOL_RESULTS = os.path.join(
    os.path.expanduser("~"),
    r".claude-bots\tecki\projects\D--bots-tecki",
)


def respuestas_cerebro(raiz=TOOL_RESULTS):
    """{asin: [keywords]} leyendo todo tool-results de get_keywords_by_asin.

    Se recorre TODO el árbol de sesiones: los archivos de una corrida anterior
    valen igual, y volver a pedir un ASIN ya traído es pagar cuota dos veces por
    el mismo dato. Si el mismo ASIN aparece en dos archivos gana el que trae más
    keywords (una respuesta truncada o a medio camino no debería pisar la buena).
    """
    por_asin = {}
    patron = os.path.join(raiz, "**", "*get_keywords_by_asin*.txt")
    for ruta in glob.glob(patron, recursive=True):
        try:
            d = json.load(io.open(ruta, encoding="utf-8"))
            ks = d["data"]["keywords"]
        except Exception:
            continue
        if not ks:
            continue
        asin = ks[0].get("current_asin")
        if not asin:
            continue
        if asin not in por_asin or len(ks) > len(por_asin[asin]):
            por_asin[asin] = ks
    return por_asin


def unir(keywords_por_asin, min_relevancia=1):
    """Une los reverse-ASIN en un universo con relevancia por keyword.

    Cada frase queda una sola vez. `search_volume` y `competing_products` son
    de la keyword, no del ASIN, así que se toma el máximo visto: un 0 suele ser
    dato faltante de esa corrida, no volumen cero.
    """
    uni = {}
    for asin, ks in keywords_por_asin.items():
        for k in ks:
            frase = (k.get("phrase") or "").strip().lower()
            if not frase:
                continue
            r = uni.setdefault(frase, {
                "phrase": frase,
                "search_volume": 0,
                "competing_products": 0,
                "title_density": 0,
                "iq_score": 0,
                "keyword_sales_weekly": 0,
                "asins": set(),
            })
            r["asins"].add(asin)
            for campo in ("search_volume", "competing_products", "title_density",
                          "iq_score", "keyword_sales_weekly"):
                v = k.get(campo) or 0
                if v > r[campo]:
                    r[campo] = v

    n = len(keywords_por_asin)
    salida = []
    for r in uni.values():
        rel = len(r.pop("asins"))
        if rel < min_relevancia:
            continue
        r["relevancia"] = rel
        r["relevancia_pct"] = round(rel / n, 3) if n else 0
        # IDN v1: Keyword Sales × (relevancia/N). Las ventas crudas del término
        # son de OTROS productos cuando la relevancia es baja — la trampa que
        # metió `book ends` (2.035 ventas, relevancia 0) en el MKL de JULZEN.
        r["idn"] = round((r["keyword_sales_weekly"] or 0) * (rel / n), 2) if n else 0
        salida.append(r)
    salida.sort(key=lambda x: (-x["relevancia"], -x["search_volume"]))
    return salida


def guardar(nicho, keywords, n_asins, min_rel):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, nicho.replace(" ", "_") + ".json")
    json.dump({"nicho": nicho,
               "origen": "cerebro-multi",
               "asins": n_asins,
               "min_relevancia": min_rel,
               "traido": datetime.datetime.now().isoformat(timespec="seconds"),
               "n": len(keywords),
               "keywords": keywords},
              io.open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--nicho")
    ap.add_argument("--min-relevancia", type=int, default=1)
    ap.add_argument("--dry", action="store_true", help="no escribe el caché")
    a = ap.parse_args()

    mapa = json.load(io.open(ASINS, encoding="utf-8"))
    traidas = respuestas_cerebro()
    print(f"respuestas de Cerebro en disco: {len(traidas)} ASINs\n")

    nichos = [a.nicho] if a.nicho else list(mapa)
    for nicho in nichos:
        filas = mapa.get(nicho) or []
        pedidos = [f["asin"] for f in filas]
        tengo = {x: traidas[x] for x in pedidos if x in traidas}
        faltan = [x for x in pedidos if x not in traidas]
        if not tengo:
            print(f"{nicho:22} SIN DATA · faltan los {len(pedidos)} ASINs")
            continue

        uni = unir(tengo, a.min_relevancia)
        # La cobertura se dice SIEMPRE: un universo armado con 3 de 8
        # competidores no es el mismo universo, y un informe que no lo aclara
        # se lee como si estuviera entero.
        rel = {}
        for r in uni:
            rel[r["relevancia"]] = rel.get(r["relevancia"], 0) + 1
        detalle = " ".join(f"rel{k}:{rel[k]}" for k in sorted(rel, reverse=True))
        print(f"{nicho:22} {len(uni):>6} kws · {len(tengo)}/{len(pedidos)} asins · {detalle}")
        if faltan:
            print(f"{'':22} faltan: {', '.join(faltan)}")
        if not a.dry:
            guardar(nicho, uni, len(tengo), a.min_relevancia)


if __name__ == "__main__":
    main()
