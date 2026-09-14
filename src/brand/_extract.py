# -*- coding: utf-8 -*-
"""Extrae a JSON los arrays de datos declarados dentro de una página del dashboard.

Se usa una sola vez por página al migrarla al esquema `brand.json`. La idea es no
re-tipear 494 bloques de contenido a mano: lo que ya está estructurado en el JSX
se saca con esto, y solo la prosa suelta se mueve a mano.
"""
import re, io, json, sys

BS = chr(92)  # backslash


def bloque(texto, nombre):
    m = re.search(r"^const " + nombre + r"\s*=\s*(\[)", texto, re.M)
    if not m:
        raise ValueError("no encontrado: " + nombre)
    i = m.start(1)
    d = 0
    for j in range(i, len(texto)):
        if texto[j] == "[":
            d += 1
        elif texto[j] == "]":
            d -= 1
            if d == 0:
                return texto[i:j + 1]
    raise ValueError("sin cerrar: " + nombre)


def js_a_json(s):
    s = re.sub(r"//.*", "", s)
    s = re.sub(r"\{\s*([A-Za-z_]\w*)\s*:", lambda m: '{"' + m.group(1) + '":', s)
    s = re.sub(r",\s*([A-Za-z_]\w*)\s*:", lambda m: ',"' + m.group(1) + '":', s)
    s = re.sub(r",(\s*[\]}])", r"\1", s)
    out, i = [], 0
    while i < len(s):
        c = s[i]
        if c == '"':
            # string ya en comillas dobles (JS lo hace cuando el texto lleva
            # apóstrofes): se copia tal cual, es JSON válido
            j = i + 1
            out.append('"')
            while j < len(s):
                if s[j] == BS:
                    out.append(s[j:j + 2])
                    j += 2
                    continue
                out.append(s[j])
                if s[j] == '"':
                    break
                j += 1
            i = j + 1
        elif c == "'" or c == "`":
            # string en comillas simples o template literal sin interpolación
            cierre = c
            j, buf = i + 1, []
            while j < len(s):
                if s[j] == BS:
                    # \' es escape válido en JS pero no en JSON: se desescapa
                    buf.append(s[j + 1] if s[j + 1] in "'`" else s[j:j + 2])
                    j += 2
                    continue
                if s[j] == cierre:
                    break
                buf.append(s[j])
                j += 1
            txt = "".join(buf).replace('"', BS + '"')
            txt = txt.replace("\n", BS + "n").replace("\r", "")
            out.append('"' + txt + '"')
            i = j + 1
        else:
            out.append(c)
            i += 1
    return json.loads("".join(out))


if __name__ == "__main__":
    archivo, destino = sys.argv[1], sys.argv[2]
    nombres = sys.argv[3:]
    t = io.open(archivo, encoding="utf-8").read()
    data = {n: js_a_json(bloque(t, n)) for n in nombres}
    for k, v in data.items():
        print("%-16s %s" % (k, len(v)))
    io.open(destino, "w", encoding="utf-8").write(
        json.dumps(data, ensure_ascii=False, indent=1))
    print("OK ->", destino)
