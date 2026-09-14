# -*- coding: utf-8 -*-
"""Mete lo que trajo el scraper headless en el caché de cuota de página.

El scraper (Node) escribe `serp_headless.jsonl` — una línea por búsqueda, con
sus resultados. Acá se agrupa por token y se llama a marca_serp.guardar(), que
es quien calcula la cuota del líder. **El cálculo no se duplica**: el scraper
solo trae títulos, la señal la produce una sola implementación.

Uso:
    python ingest_serp.py            # ingiere todo lo que haya
    python ingest_serp.py --dry      # muestra qué haría, sin escribir
"""
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import os, io, json, argparse
from collections import Counter

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

from correr_nichos import CACHE
from marca_serp import guardar, leer

JSONL = os.path.join(CACHE, "serp_headless.jsonl")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    ap.add_argument("--remedir", action="store_true",
                    help="pisa lo ya guardado. Solo cuando CAMBIA la fórmula de "
                         "la señal (pasó el 2026-08-06 al empezar a usar la marca "
                         "declarada): si no, dos tokens quedan medidos con reglas "
                         "distintas y el informe mezcla dos escalas.")
    a = ap.parse_args()

    if not os.path.exists(JSONL):
        print(f"no hay nada que ingerir: {JSONL}")
        return

    nuevos, ya, vacios = 0, 0, 0
    veredictos = Counter()
    for linea in io.open(JSONL, encoding="utf-8"):
        linea = linea.strip()
        if not linea:
            continue
        d = json.loads(linea)
        token, items = d["token"], d.get("items") or []
        if not items:
            vacios += 1
            continue
        # Una búsqueda ya medida NO se pisa: el caché es la memoria de la señal
        # y sobrescribirla con una corrida nueva borraría la comparación.
        if leer(token) is not None and not a.remedir:
            ya += 1
            continue
        if a.dry:
            nuevos += 1
            continue
        r = guardar(token, items, d.get("nucleo", ""))
        veredictos[r["veredicto"]] += 1
        nuevos += 1

    print(f"ingeridos {nuevos} · ya estaban {ya} · sin resultados {vacios}")
    if veredictos:
        print("  " + " · ".join(f"{k} {v}" for k, v in veredictos.most_common()))


if __name__ == "__main__":
    main()
