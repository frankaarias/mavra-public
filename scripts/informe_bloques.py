# -*- coding: utf-8 -*-
"""El veredicto del derivador, bloque por bloque, contra lo que se esperaba.

Los 20 nichos están elegidos por LO QUE ROMPEN. Este informe pone al lado, para
cada bloque, la expectativa escrita de antemano y lo que salió — porque sin la
expectativa delante cualquier salida "parece razonable" y la prueba no prueba
nada.

Lo que se mide por nicho:
  · cuántos tokens en cada clase
  · **cobertura**: qué fracción de los ambiguos tiene la cuota de página medida.
    Un informe que no dice su cobertura se lee como si estuviera entero.
  · el vocabulario de NICHO, que es la salida que le importa al usuario

Uso:
    python informe_bloques.py            # a pantalla
    python informe_bloques.py --md       # + INFORME_BLOQUES.md en el caché
"""
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import os, io, argparse
from collections import Counter

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

from correr_nichos import (CACHE, BLOQUES, ESPERADO, TESTIGOS,
                           cargar_cache, clasificar, aplicar_gate)

CLASES = ("NICHO", "NICHO*", "MARCA", "NUCLEO", "ATRIBUTO", "FUERA",
          "GRIS", "AMBIVALENTE", "NICHO?", "FUERA?", "AMBIVALENTE?")


def revisar_testigos(nicho, res):
    """Cada testigo contra su clase real. Devuelve (ok, fallos, ausentes).

    Un testigo AUSENTE del universo no es lo mismo que uno mal clasificado, y
    se cuenta aparte: que `owala` no aparezca significa que el universo no lo
    trajo — un problema de cobertura, no de la señal. Mezclarlos escondería
    cuál de los dos está roto.

    `NICHO*` y `NICHO?` cuentan como NICHO a medias: la primera está decidida
    pero marcada, la segunda no está decidida. Se informan aparte.
    """
    esperados = TESTIGOS.get(nicho, {})
    ok, fallos, ausentes, sin_medir = [], [], [], []
    for token, clase in esperados.items():
        v = res.get(token)
        if v is None:
            ausentes.append(token)
            continue
        real = v[0]
        if real == clase or real == clase + "*":
            ok.append(token)
        elif real == clase + "?":
            sin_medir.append(f"{token}→{real}")
        else:
            fallos.append(f"{token} esperaba {clase}, salió {real}")
    return ok, fallos, ausentes, sin_medir


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--md", action="store_true")
    # El MISMO umbral con el que se clasifica. Distinto acá y el informe
    # describiría una corrida que no es la que quedó en disco.
    ap.add_argument("--min-relevancia", type=int, default=1)
    a = ap.parse_args()

    lineas = []
    def P(s=""):
        print(s)
        lineas.append(s)

    veredictos = {}
    for bloque, nichos in BLOQUES.items():
        P(f"\n{'=' * 70}\nBLOQUE {bloque.upper()}")
        P(f"se espera: {ESPERADO[bloque]}")
        b_ok, b_fallos, b_ausentes, b_sinmedir, b_sinuniverso = 0, [], [], [], 0
        for n in nichos:
            c = cargar_cache(n)
            if c is None:
                P(f"\n  {n:24} — sin universo (falta traerlo de Helium 10)")
                b_sinuniverso += 1
                continue
            kws = aplicar_gate(c["keywords"], a.min_relevancia)
            _, res = clasificar(n, kws)
            cnt = Counter(v[0] for v in res.values())
            # AMBIVALENTE? entra acá desde que la clase se consulta contra la
            # cuota de página: antes era una clase muerta y no contaba en ningún
            # lado, ni medida ni pendiente.
            sin_medir = cnt["NICHO?"] + cnt["FUERA?"] + cnt["AMBIVALENTE?"]
            ambiguos = sin_medir + cnt["NICHO"] + cnt["NICHO*"] + cnt["MARCA"] + cnt["FUERA"] + cnt["DOMINADO"]
            # 🔴 Sin ambiguos NO es «cobertura 100%». Es que no hay nada que
            # cubrir, y se veía idéntico a estar completo: así se leyó «drill
            # bits 0 kws · cobertura 100%» cuando el gate había borrado el
            # universo entero. Un cero tiene que verse como un cero.
            cob = f"{100 * (1 - sin_medir / ambiguos):.0f}%" if ambiguos else "SIN AMBIGUOS"
            # AMBIVALENTE + GRIS no entraban en la cobertura ni como medidos ni
            # como pendientes: eran invisibles, y encima nadie los resolvía —
            # `con_serp` miraba solo NICHO y FUERA. Eran 1.011 tokens en los 20
            # nichos. Desde que AMBIVALENTE se consulta contra la cuota de
            # página, los medidos se deciden y los que faltan salen como
            # `AMBIVALENTE?`, que ya cuenta en «sin medir».
            # Lo que queda acá es el residuo real: GRIS (concentración media con
            # el propio nombre, que se deja sin forzar) y los AMBIVALENTE que la
            # señal tampoco separa.
            sin_decidir = cnt["AMBIVALENTE"] + cnt["GRIS"]
            P(f"\n  {n:24} {len(kws):>5} kws · {c.get('origen','?')} · cobertura {cob}"
              + (f" ({sin_medir} sin medir)" if sin_medir else "")
              + (f" · {sin_decidir} sin decidir (GRIS + los que la señal tampoco separa)"
                 if sin_decidir else ""))
            P("    " + " · ".join(f"{k} {cnt[k]}" for k in CLASES if cnt[k]))
            nicho = sorted(((t, v) for t, v in res.items() if v[0] == "NICHO"),
                           key=lambda x: -x[1][2])[:12]
            if nicho:
                P("    NICHO: " + ", ".join(t for t, _ in nicho))
            marcas = sorted(((t, v) for t, v in res.items() if v[0] == "MARCA"),
                            key=lambda x: -x[1][2])[:10]
            if marcas:
                P("    MARCA: " + ", ".join(t for t, _ in marcas))

            ok, fallos, ausentes, smd = revisar_testigos(n, res)
            tot = len(ok) + len(fallos) + len(ausentes) + len(smd)
            if tot:
                P(f"    testigos {len(ok)}/{tot}"
                  + (f" · FALLA: {'; '.join(fallos)}" if fallos else "")
                  + (f" · sin medir: {', '.join(smd)}" if smd else "")
                  + (f" · ausentes del universo: {', '.join(ausentes)}" if ausentes else ""))
            b_ok += len(ok); b_fallos += fallos; b_ausentes += ausentes; b_sinmedir += smd

        # El veredicto del bloque: pasa cuando ningún testigo salió MAL. Un
        # testigo ausente o sin medir NO lo tumba —- eso es cobertura, y la
        # cobertura se informa aparte para no disfrazar un hueco de aprobado.
        pasa = not b_fallos and not b_sinuniverso
        estado = "PASA" if pasa else ("NO PASA" if b_fallos else "INCOMPLETO")
        veredictos[bloque] = (estado, b_ok, b_fallos, b_ausentes, b_sinmedir, b_sinuniverso)
        P(f"\n  → {bloque.upper()}: {estado} · {b_ok} testigos correctos"
          + (f" · {len(b_fallos)} mal clasificados" if b_fallos else "")
          + (f" · {len(b_sinmedir)} sin cuota medida" if b_sinmedir else "")
          + (f" · {len(b_ausentes)} ausentes" if b_ausentes else "")
          + (f" · {b_sinuniverso} nichos sin universo" if b_sinuniverso else ""))

    P(f"\n{'=' * 70}\nVEREDICTO")
    for b, (estado, ok, fallos, ausentes, smd, su) in veredictos.items():
        P(f"  {b:14} {estado}")
    P(f"\n  {sum(1 for v in veredictos.values() if v[0] == 'PASA')} de {len(veredictos)} bloques pasan")

    if a.md:
        p = os.path.join(CACHE, "INFORME_BLOQUES.md")
        io.open(p, "w", encoding="utf-8").write("\n".join(lineas))
        print(f"\n→ {p}")


if __name__ == "__main__":
    main()
