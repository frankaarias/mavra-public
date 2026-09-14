# -*- coding: utf-8 -*-
"""Corre el derivador de vocabulario sobre N nichos, CON CACHÉ A DISCO.

⚠️ Lo primero que hace el archivo es forzar UTF-8 en la salida, y no es un
detalle de estilo: la consola de Windows es cp1252 y el separador «─» del
final del reporte hacía morir el script DESPUÉS de haber impreso y guardado
todo. El mismo patrón que ya tumbó un worker de Amazon: el trabajo estaba
hecho, y el proceso terminaba con traceback igual.

Esta es la pieza que faltaba, y faltaba por una razón concreta: el 2-ago corrí
gaming y wall planters **en memoria de la sesión** y se perdieron los dos. Para
revalidar al día siguiente hubo que volver a pedirle el universo a Magnet — o
sea, pagar cuota de nuevo por un dato que ya teníamos. Yo mismo lo advertí en el
canal y me pasó igual.

Con 20 nichos y varias vueltas de umbrales, sin caché la cuota no alcanza. Por
eso acá **el universo crudo se guarda ANTES de clasificar**: si mañana cambia un
umbral, se reclasifica sobre lo mismo, gratis y comparable.

  _staging/derivador/<nicho>.json   → la respuesta cruda de Magnet, con fecha
  _staging/derivador/<nicho>.txt    → la clasificación legible de esa corrida

LOS 20 NICHOS están elegidos por LO QUE ROMPEN, no por variedad, así que si el
derivador aguanta los 20 sabemos POR QUÉ aguanta:

  marcas dominantes  → prueba la clase FUERA (Ninja, Optimum, Stanley, Owlet)
  sin marcas         → prueba que no invente marcas donde no las hay
  estética fuerte    → prueba el NICHO: deberían salir boho, farmhouse,
                       cottagecore — los `gothic` de otros nichos
  funcional puro     → prueba lo contrario: un taladro no tiene estética, y si
                       acá devuelve una lista de NICHO está alucinando
  franquicias        → Disney y Bluey en night lights; tallas y colores en el resto

Uso:
    python correr_nichos.py --bloque estetica
    python correr_nichos.py --nicho "wall clock"
    python correr_nichos.py --todos
    python correr_nichos.py --bloque estetica --solo-cache   # reclasifica, no pide
"""

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

import os, io, json, sys, argparse, datetime

CACHE = r"D:\dev\mavra\_staging\derivador"

BLOQUES = {
    # Cada bloque prueba una forma distinta de fallar.
    "marcas": ["air fryer", "protein powder", "water bottle", "baby monitor"],
    "sin_marcas": ["desk organizer", "resistance bands", "shower curtain hooks"],
    "estetica": ["throw pillow covers", "wall clock", "jewelry box", "coffee mug"],
    "funcional": ["drill bits", "car phone holder", "garden hose", "cast iron skillet"],
    "franquicias": ["kids night light", "dog bed", "cat tree", "hair clips", "yoga mat"],
}

# Lo que se ESPERA de cada bloque. Se escribe acá y no en la cabeza: sin una
# expectativa previa, cualquier salida "parece razonable" y el test no prueba nada.
ESPERADO = {
    "marcas": "marcas reales en FUERA (ninja, optimum, stanley, owlet)",
    "sin_marcas": "FUERA casi vacío o solo ruido — no debería inventar marcas",
    "estetica": "NICHO con estéticas (boho, farmhouse, cottagecore, minimalist)",
    "funcional": "NICHO VACÍO o casi — un taladro no tiene estética",
    "franquicias": "franquicias en FUERA (disney, bluey) y tallas/colores fuera del NICHO",
}

# TESTIGOS: token → clase que DEBE tener, por nicho.
#
# Por qué existen aparte de ESPERADO: ESPERADO es una frase, y una frase la
# interpreta el que lee el informe. Acá el veredicto lo dicta el dato. Un token
# que cambia de clase entre dos corridas lo dice esta lista, no mi lectura.
#
# ⚠️ Se escribieron ANTES de correr los 11 nichos nuevos, a propósito. Declarar
# los testigos después de ver la salida no prueba nada: convierte cualquier
# resultado en el esperado. Si alguno de estos falla, es información — no un
# testigo a corregir.
#
# MARCA se afirma solo de marcas que existen de verdad en ese nicho; NICHO, de
# vocabulario que un comprador usaría y ninguna marca posee.
#
# ── CORREGIDOS EL 2026-08-06, y por qué se dice en vez de editarlos en silencio:
# la primera versión pedía NICHO para `magnetic`, `washable` y `expandable`, y las
# tres salieron ATRIBUTO. Fui a ver el código antes de tocar el testigo: las tres
# están ahí a propósito — `magnetic` figura literal en ATRIBUTOS_FUNCIONALES, y
# las otras dos caen por el sufijo `-able`. La razón está escrita en el módulo:
# describen cómo funciona o cómo se sujeta una cosa, y eso es igual en velas,
# sartenes y suplementos, así que no son vocabulario DEL nicho.
#
# O sea: el derivador tenía razón y mi expectativa estaba mal. Se corrigen esos
# tres a ATRIBUTO. **Los demás que fallan NO se tocan** — `dashboard`, `vent`,
# `thick` y `travel` salen AMBIVALENTE, y eso no es una clase correcta para
# ellos: es la zona media del ratio de posición, y a AMBIVALENTE no la resuelve
# nadie después (la cuota de página se mide solo para NICHO y FUERA). Ese hueco
# se reporta, no se disfraza moviendo el testigo.
TESTIGOS = {
    # marcas — el bloque donde la marca TIENE que separarse del vocabulario
    "air fryer":            {"ninja": "MARCA", "cuisinart": "MARCA", "cosori": "MARCA",
                             "convection": "NICHO", "mini": "NICHO"},
    "protein powder":       {"orgain": "MARCA", "dymatize": "MARCA",
                             "vegan": "NICHO", "unflavored": "NICHO"},
    "water bottle":         {"owala": "MARCA", "stanley": "MARCA", "contigo": "MARCA",
                             "insulated": "NICHO", "straw": "NICHO"},
    "baby monitor":         {"nanit": "MARCA", "vtech": "MARCA", "motorola": "MARCA",
                             "wifi": "NICHO"},
    # sin_marcas — no puede inventar marcas donde no hay
    "desk organizer":       {"wooden": "NICHO", "acrylic": "NICHO", "bamboo": "NICHO"},
    "resistance bands":     {"heavy": "NICHO", "fabric": "NICHO"},
    "shower curtain hooks": {"rustproof": "NICHO", "decorative": "NICHO", "metal": "NICHO"},
    # estetica — acá el NICHO tiene que traer estilos
    "throw pillow covers":  {"boho": "NICHO", "farmhouse": "NICHO", "velvet": "NICHO"},
    "wall clock":           {"vintage": "NICHO", "modern": "NICHO"},
    "jewelry box":          {"velvet": "NICHO", "wooden": "NICHO"},
    "coffee mug":           {"funny": "NICHO", "ceramic": "NICHO"},
    # funcional — lo contrario: si devuelve estéticas, alucina
    "drill bits":           {"dewalt": "MARCA", "impact": "NICHO", "carbide": "NICHO"},
    "car phone holder":     {"magnetic": "ATRIBUTO", "dashboard": "NICHO", "vent": "NICHO"},
    "garden hose":          {"expandable": "ATRIBUTO", "brass": "NICHO"},
    "cast iron skillet":    {"enameled": "NICHO", "preseasoned": "NICHO"},
    # franquicias — la franquicia sale, el vocabulario queda
    "kids night light":     {"bluey": "MARCA", "star": "NICHO"},
    "dog bed":              {"orthopedic": "NICHO", "washable": "ATRIBUTO", "calming": "NICHO"},
    "cat tree":             {"tall": "NICHO", "small": "NICHO"},
    "hair clips":           {"claw": "NICHO", "matte": "NICHO"},
    "yoga mat":             {"thick": "NICHO", "travel": "NICHO"},
}


def aplicar_gate(keywords, min_relevancia):
    """Descarta lo que rankea menos de N competidores. UNA sola definición.

    🔴 Vivió escrita tres veces —- en este runner, en plan_serp y en
    informe_bloques—- y las tres tenían el MISMO bug: `(k.get("relevancia") or
    1) >= min_rel`. Los universos traídos de Magnet no tienen el campo, así que
    caían al 1, y con un umbral de 2 el gate los borraba ENTEROS. El informe
    entonces decía «drill bits 0 kws · cobertura 100%»: cobertura completa de
    nada. Lo cazaron los testigos, no la lectura del informe.

    La regla correcta: **si la keyword no trae relevancia, no hay nada que
    filtrar y pasa.** El gate solo opina de los universos que la traen
    (`cerebro-multi`); sobre los de Magnet no tiene información, y no tenerla no
    es motivo para descartar.
    """
    if min_relevancia <= 1:
        return list(keywords)
    return [k for k in keywords
            if k.get("relevancia") is None or k["relevancia"] >= min_relevancia]


def ruta(nicho):
    return os.path.join(CACHE, nicho.replace(" ", "_") + ".json")


def cargar_cache(nicho):
    p = ruta(nicho)
    if not os.path.exists(p):
        return None
    d = json.load(io.open(p, encoding="utf-8"))
    return d


def guardar_cache(nicho, keywords, origen):
    os.makedirs(CACHE, exist_ok=True)
    json.dump({"nicho": nicho, "origen": origen,
               "traido": datetime.datetime.now().isoformat(timespec="seconds"),
               "n": len(keywords), "keywords": keywords},
              io.open(ruta(nicho), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


def clasificar(nicho, keywords, con_cuota=True):
    """Corre el derivador y devuelve el texto del informe.

    🔴 `con_serp` —la cuota de página, que es LA señal que separa marca de
    estética— estaba escrita en derivar_vocabulario.py y este runner no la
    llamaba. Se corría solo `derivar()`, o sea la parte que ya sabíamos que NO
    distingue: `dewalt drill bit set` y `carbide drill bit set` se escriben
    igual. Por eso `dewalt` (153 kws), `milwaukee` (114) y `lodge` (241) salían
    clasificados como vocabulario DEL NICHO — que es justo lo contrario.

    No había que escribir nada: había que enchufarlo. Mismo patrón que el motor
    de listings, escrito y desconectado.

    Un token sin SERP medida queda marcado con `?` y NO se decide. Ver
    marca_serp.pendientes() para las URLs que faltan traer.
    """
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from derivar_vocabulario import derivar, con_serp
    res = derivar(keywords)
    if con_cuota:
        res = con_serp(res, nicho)
    lineas = [f"# {nicho} — {len(keywords)} keywords"]
    for clase in ("NICHO", "NICHO*", "MARCA", "NUCLEO", "ATRIBUTO", "FUERA",
                  "GRIS", "AMBIVALENTE", "NICHO?", "FUERA?"):
        items = sorted(((t, v) for t, v in res.items() if v[0] == clase),
                       key=lambda x: -x[1][2])
        lineas.append(f"\n{clase} ({len(items)})")
        for t, (_, ratio, n, cp) in items[:25]:
            lineas.append(f"   {t:18} ratio {ratio:.2f}  en {n:>4} kws  CP~{cp:,}")
    return "\n".join(lineas), res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bloque", choices=list(BLOQUES))
    ap.add_argument("--nicho")
    ap.add_argument("--todos", action="store_true")
    ap.add_argument("--solo-cache", action="store_true",
                    help="reclasifica lo cacheado sin pedirle nada a Magnet")
    # El gate va acá y NO en el que arma el caché: el universo se guarda crudo
    # para poder mover el umbral sin volver a pagar cuota. Solo aplica a los
    # universos de `cerebro-multi`, que son los que traen `relevancia`.
    ap.add_argument("--min-relevancia", type=int, default=1,
                    help="descarta las keywords que rankea menos de N competidores")
    a = ap.parse_args()

    if a.nicho: nichos = [a.nicho]
    elif a.bloque: nichos = BLOQUES[a.bloque]
    elif a.todos: nichos = [n for b in BLOQUES.values() for n in b]
    else: ap.error("elegí --bloque, --nicho o --todos")

    if a.bloque:
        print(f"BLOQUE {a.bloque} · se espera: {ESPERADO[a.bloque]}\n")

    faltan = []
    for n in nichos:
        c = cargar_cache(n)
        if c is None:
            faltan.append(n); continue
        antes = len(c["keywords"])
        kws = aplicar_gate(c["keywords"], a.min_relevancia)
        if len(kws) != antes:
            print(f"gate relevancia ≥{a.min_relevancia}: {antes} → {len(kws)} keywords")
        txt, res = clasificar(n, kws)
        io.open(os.path.join(CACHE, n.replace(" ", "_") + ".txt"),
                "w", encoding="utf-8").write(txt)
        print(txt)

        # Cuánto de la clasificación descansa en la cuota de página y cuánto
        # quedó sin medir. Se dice SIEMPRE: un informe que no aclara su cobertura
        # se lee como si estuviera entero, y ahí es donde se cuela el error.
        sin_medir = [t for t, v in res.items() if v[0].endswith("?")]
        if sin_medir:
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            from marca_serp import pendientes
            urls = pendientes(sin_medir, n)
            print(f"\n⚠️ {len(sin_medir)} tokens SIN cuota de página medida "
                  f"(quedaron con ?) · {len(urls)} búsquedas por traer")
            io.open(os.path.join(CACHE, "urls_pendientes.txt"), "a",
                    encoding="utf-8").write("\n".join(urls) + "\n")
        print("\n" + "─" * 60 + "\n")

    if faltan and not a.solo_cache:
        print(f"⚠️ SIN CACHÉ ({len(faltan)}): {', '.join(faltan)}")
        print("   El universo se trae con el MCP de Helium 10 y se guarda con")
        print("   guardar_cache(nicho, keywords, 'magnet'). Este script NO llama")
        print("   al MCP a propósito: la llamada vive donde está la sesión de H10,")
        print("   y acá quedaría un dato traído a medias si la sesión venció.")


if __name__ == "__main__":
    main()
