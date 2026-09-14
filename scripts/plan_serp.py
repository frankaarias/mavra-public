# -*- coding: utf-8 -*-
"""Arma el PLAN de búsquedas pendientes: qué URL, de qué token, de qué nicho.

`urls_pendientes.txt` guardaba solo la URL, y con eso solo no se puede ingerir el
resultado: la cuota se guarda POR TOKEN (`dewalt`), no por URL, y de
`?k=dewalt+drill+bit+set` hay que adivinar dónde termina el token y empieza el
núcleo. Adivinar ahí es cómo se termina guardando la medición de `dewalt` bajo
`dewalt drill`.

Este script escribe el mapeo explícito:

    serp_plan.json   [{url, token, nucleo}, …]

El scraper (Node, headless) lo consume y devuelve los títulos por URL; luego
ingest_serp.py agrupa por token y llama a marca_serp.guardar().

Uso:
    python plan_serp.py            # todos los nichos cacheados
    python plan_serp.py --todos    # ídem, explícito
"""
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import os, io, json, argparse

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

from correr_nichos import CACHE, BLOQUES, cargar_cache, aplicar_gate
from derivar_vocabulario import derivar
from marca_serp import leer, medible

PLAN = os.path.join(CACHE, "serp_plan.json")


def url_de(token: str, nucleo: str) -> str:
    """La MISMA construcción que marca_serp.pendientes(). Si las dos se separan,
    el plan y lo que se scrapea dejan de ser lo mismo y nadie se entera."""
    q = (token.replace("_", " ") + " " + nucleo).replace(" ", "+")
    return f"https://www.amazon.com/s?k={q}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--todos", action="store_true")
    ap.add_argument("--remedir-viejos", action="store_true",
                    help="incluye los tokens medidos ANTES de que existiera la marca "
                         "declarada (su JSON no tiene la clave `declarada`). Sin esto "
                         "conviven dos escalas: los viejos no pueden detectar la marca "
                         "que no domina su propia búsqueda.")
    # TIENE que ser el mismo umbral con el que se clasifica en correr_nichos.py.
    # Si acá entra más ancho, se scrapean tokens que la clasificación descarta
    # igual: búsquedas pagadas por un dato que nadie va a leer.
    ap.add_argument("--min-relevancia", type=int, default=1)
    a = ap.parse_args()

    nichos = [n for b in BLOQUES.values() for n in b]
    plan, sin_cache, ya_medidos = [], [], 0
    vistos = set()

    for n in nichos:
        c = cargar_cache(n)
        if c is None:
            sin_cache.append(n)
            continue
        clases = derivar(aplicar_gate(c["keywords"], a.min_relevancia))
        # Solo NICHO y FUERA: son los ambiguos. NUCLEO y ATRIBUTO ya salen bien
        # y gastar una búsqueda ahí es pagar por confirmar lo que ya se sabe.
        for t, v in clases.items():
            if v[0] not in ("NICHO", "FUERA") or not medible(t):
                continue
            medido = leer(t)
            if medido is not None and not (a.remedir_viejos and "declarada" not in medido):
                ya_medidos += 1
                continue
            if t in vistos:      # el caché es por TOKEN: no se mide dos veces
                continue
            vistos.add(t)
            plan.append({"url": url_de(t, n), "token": t, "nucleo": n})

    json.dump(plan, io.open(PLAN, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"plan: {len(plan)} búsquedas · {ya_medidos} ya medidas · "
          f"{len(nichos) - len(sin_cache)} nichos con universo")
    if sin_cache:
        print(f"sin universo ({len(sin_cache)}): {', '.join(sin_cache)}")
    print(PLAN)


if __name__ == "__main__":
    main()
