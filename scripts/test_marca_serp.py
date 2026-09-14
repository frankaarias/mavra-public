# -*- coding: utf-8 -*-
"""Casos reales de la cuota de página. Se corre solo: `python test_marca_serp.py`.

Los casos NO son inventados: son los que rompieron la señal de verdad y la
fecha en que lo hicieron. Un test que protege un caso hipotético envejece; uno
que protege el bug que ya pasó, no.
"""
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from marca_serp import cuota, veredicto, es_marca_registrada, _marca_declarada

fallos = []


def check(nombre, real, esperado):
    ok = real == esperado
    print(f"  {'ok ' if ok else 'FALLA'} {nombre}: {real!r}" + ("" if ok else f" ≠ {esperado!r}"))
    if not ok:
        fallos.append(nombre)


def items(*pares, sponsored=0):
    """(marca declarada, título) × n, más N patrocinados que no deben contar."""
    out = [{"brand": b, "title": t, "isSponsored": False} for b, t in pares]
    out += [{"brand": "Anuncio", "title": "Anuncio " + str(i), "isSponsored": True}
            for i in range(sponsored)]
    return out


print("\n_marca_declarada — un título NO es una marca")
check("marca corta", _marca_declarada("Ninja"), "ninja")
check("marca de dos palabras", _marca_declarada("Instant Pot"), "instant pot")
check("título entero se descarta",
      _marca_declarada("Chefman Air Fryer Oven Combo, 12-in-1 Countertop"), "")
check("vacío", _marca_declarada(None), "")

print("\ncuota — la marca declarada le gana a adivinar por el título")
# 2026-08-06: con la heurística del título, `gourmia` daba 0,00 y es 16 de 16.
# La marca va suelta al principio ("Gourmia Air Fryer, 7 Qt") y como coincidía
# con lo buscado, el filtro anti-descriptor la borraba.
g = items(*[("Gourmia", f"Gourmia Air Fryer, {i} Qt") for i in range(16)])
c, lider, n = cuota(g, "gourmia", "air fryer")
check("gourmia domina su página", (round(c, 2), lider, n), (1.0, "gourmia", 16))
check("gourmia es MARCA", veredicto(c, "gourmia", lider), "MARCA")

print("\ncuota — los patrocinados no cuentan")
mix = items(*[("Ninja", "Ninja Air Fryer") for _ in range(10)], sponsored=6)
c2, _, n2 = cuota(mix, "ninja", "air fryer")
check("solo se miran los orgánicos", n2, 10)

print("\ncuota — un genérico repartido sigue siendo del nicho")
libre = items(("Chefman", "Chefman Convection"), ("Ninja", "Ninja Convection"),
              ("Cosori", "Cosori Convection"), ("Instant", "Instant Convection"),
              ("Bella", "Bella Convection"), ("Dash", "Dash Convection"),
              ("Gourmia", "Gourmia Convection"), ("Nuwave", "Nuwave Convection"))
c3, l3, _ = cuota(libre, "convection", "air fryer")
check("convection queda LIBRE", veredicto(c3, "convection", l3), "LIBRE")

print("\nes_marca_registrada — la marca que NO domina su búsqueda")
# 2026-08-06: `bella` (6 de 16) y `emeril` quedaban como vocabulario del nicho.
b = items(*[("BELLA", "BELLA Air Fryer") for _ in range(6)],
          *[("Chefman", "Chefman Air Fryer") for _ in range(10)])
check("bella se declara 6 veces", es_marca_registrada(b, "bella"), 6)
check("chef NO hereda de Chefman", es_marca_registrada(b, "chef"), 0)
check("instant sí, por Instant Pot",
      es_marca_registrada(items(("Instant Pot", "Instant Pot Duo"),
                                ("Instant Pot", "Instant Pot Pro")), "instant"), 2)

print("\ncuota — sin media página no se afirma nada")
c4, _, n4 = cuota(items(("Ninja", "Ninja"), ("Ninja", "Ninja")), "ninja", "")
check("con 2 resultados, cuota 0", c4, 0.0)

print()
if fallos:
    print(f"❌ {len(fallos)} FALLAS: {', '.join(fallos)}")
    sys.exit(1)
print("✅ todo verde")
