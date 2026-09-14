# -*- coding: utf-8 -*-
"""Cuota de página del vendedor líder — el discriminador marca / estética.

Las tres señales derivadas del TEXTO fracasaron (ver INFORME_DERIVADOR.md), y
las tres por la misma razón: `dewalt drill bit set` y `carbide drill bit set` se
escriben igual. Lo que las distingue no está en la frase.

Esta mira afuera: **qué fracción de la primera página se lleva un solo vendedor.**
En `dewalt drill bit set` DeWalt se lleva 16 de 16. En `carbide drill bit set`
compiten siete marcas distintas.

LA MARCA SE SACA DEL TÍTULO, y ahí hay un detalle del scraper que importa: los
títulos vienen con la marca **pegada** al texto —`LodgeSeasoned Cast Iron…`,
`DEWALTDrill Bit Set`— sin espacio. Por eso no se puede partir por palabras: hay
que buscar el prefijo en mayúsculas o la primera palabra capitalizada.

Como eso es frágil, el conteo se hace de DOS formas y se comparan:
  1. por prefijo de marca inferido del título
  2. por presencia del token buscado en el título

Si las dos coinciden, el número es confiable. Si no, se reporta la discrepancia
en vez de elegir una — que es lo que haría un script que quiere tener razón.
"""
import json, io, sys, re
from collections import Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")


def marca_del_titulo(t: str) -> str:
    """La marca es el prefijo pegado al inicio. Heurística deliberadamente
    conservadora: si no se puede afirmar, devuelve cadena vacía y esa fila no
    cuenta para nadie — mejor perder señal que inventarla."""
    t = (t or "").strip()
    if not t:
        return ""
    # Caso 1: TODO EN MAYÚSCULAS pegado a texto normal → "DEWALTDrill", "SEIKOQXM"
    m = re.match(r"^([A-Z]{3,})(?=[A-Z][a-z]|[0-9])", t)
    if m:
        return m.group(1).lower()
    # Caso 2: Capitalizada pegada a otra capitalizada → "LodgeSeasoned"
    m = re.match(r"^([A-Z][a-z]{2,})(?=[A-Z])", t)
    if m:
        return m.group(1).lower()
    # Caso 3: primera palabra suelta, solo si parece nombre propio
    m = re.match(r"^([A-Z][A-Za-z]{2,})\s", t)
    if m:
        return m.group(1).lower()
    return ""


def cuota(items, token):
    """Devuelve (cuota_por_marca, cuota_por_token, n, marca_lider)."""
    n = len(items)
    if not n:
        return None, None, 0, ""
    marcas = Counter(m for m in (marca_del_titulo(i.get("title")) for i in items) if m)
    lider, cnt = (marcas.most_common(1) or [("", 0)])[0]
    por_marca = cnt / n
    tok = token.lower()
    por_token = sum(1 for i in items if tok in (i.get("title") or "").lower()) / n
    return por_marca, por_token, n, lider


def main(ruta, mapa):
    """mapa: {url_fragmento: (token, etiqueta_esperada)}"""
    items = json.load(io.open(ruta, encoding="utf-8"))
    porurl = {}
    for it in items:
        porurl.setdefault(it.get("input", ""), []).append(it)

    print(f"{'keyword':32} {'marca líder':14} {'cuota':>7} {'token':>7}  esperado")
    print("─" * 78)
    filas = []
    for url, its in sorted(porurl.items()):
        clave = next((k for k in mapa if k in url), None)
        if not clave:
            continue
        token, esperado = mapa[clave]
        pm, pt, n, lider = cuota(its, token)
        kw = url.split("k=")[-1].replace("+", " ")
        print(f"{kw:32} {lider:14} {pm:6.0%} {pt:6.0%}   {esperado}")
        filas.append((kw, pm, esperado))

    print("\n─── veredicto con umbral 60% ───")
    ok = 0
    for kw, pm, esperado in filas:
        pred = "marca" if pm > 0.60 else "no-marca"
        bien = pred == esperado
        ok += bien
        print(f"  {'✓' if bien else '✗'} {kw:30} predijo {pred:9} · era {esperado}")
    print(f"\n{ok}/{len(filas)} correctas")


if __name__ == "__main__":
    print("Este script se alimenta del dataset del scraper; ver INFORME_DERIVADOR.md")
