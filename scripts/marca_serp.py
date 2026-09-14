# -*- coding: utf-8 -*-
"""Cuota de página del vendedor líder: el discriminador marca / estética.

Las tres señales derivadas del TEXTO fracasaron (INFORME_DERIVADOR.md). Esta
mira afuera: **qué fracción de la primera página se lleva un solo vendedor.**

    dewalt drill bit set   → DeWalt 16/16   100%   es de alguien
    carbide drill bit set  → DeWalt  4/16    25%   mercado abierto
    gothic decor           → nadie repite     6%   mercado abierto

Validado sobre 13 keywords: 12 correctas y 1 zona gris honesta.

FLUJO EN DOS TIEMPOS, y es a propósito. El scraper vive en un MCP que solo puede
llamar el agente, no este proceso. Así que:

  1. `pendientes()` escribe la lista de URLs que hay que traer
  2. el agente llama al scraper con esa lista y vuelca el dataset a disco
  3. `clasificar()` lee el dataset y calcula la cuota

Parece un rodeo pero tiene una ventaja: **el dataset queda cacheado por token**,
y un token ya medido no se vuelve a scrapear aunque aparezca en otro nicho.
`dewalt` se mide una vez, no una vez por nicho.
"""
import os, io, json, re, sys
from collections import Counter

CACHE = r"D:\dev\mavra\_staging\derivador\serp"
UMBRAL_MARCA = 0.60      # arriba de esto, la palabra es de alguien
UMBRAL_LIBRE = 0.40      # abajo, mercado abierto. En el medio, zona gris.


def _ruta(token: str) -> str:
    return os.path.join(CACHE, re.sub(r"[^a-z0-9]+", "_", token.lower()) + ".json")


def marca_del_titulo(t: str) -> tuple[str, bool]:
    """(marca, es_inequívoca). El scraper devuelve la marca **pegada** al texto:

        KLEIN TOOLS53614 14-Piece Titanium Drill Bit Set…   ← marca, pegada al SKU
        DEWALTDrill Bit Set, 21 Pc…                          ← marca, pegada
        Step Drill Bits, 5PCS HSS Titanium…                  ← descriptor, suelto

    Esa diferencia **no es cosmética, es el discriminador**. Un prefijo pegado a
    un código de producto solo lo produce el nombre del vendedor; una palabra
    suelta seguida de espacio puede ser cualquier cosa.

    Por eso se devuelve también si es inequívoca:
      · pegada  → cuenta SIEMPRE, aunque coincida con el término buscado
      · suelta  → ambigua; solo cuenta si no es el término ni el núcleo

    Sin esa distinción el filtro se come justo el caso que hay que detectar:
    `klein` pasó de MARCA 94% a LIBRE 6% cuando lo excluí por ser el token."""
    t = (t or "").strip()
    if not t:
        return "", False

    # Las tres ramas van por separado y en este orden. Juntarlas en un regex con
    # alternancia daba nombres truncados —`JALL Digital` devolvía `JAL`— porque el
    # backtracking encontraba un match más corto que también satisfacía el
    # lookahead. Explícito y aburrido es mejor que ingenioso y mal.

    # 1. TODO MAYÚSCULAS pegado a CamelCase o a un dígito → DEWALTDrill, SEIKOQXM
    m = re.match(r"^([A-Z]{2,})(?=[A-Z][a-z]|\d)", t)
    if m:
        return m.group(1).lower(), True

    # 2. Marca de dos palabras en mayúsculas pegada al SKU → KLEIN TOOLS53614
    m = re.match(r"^([A-Z]{2,})\s[A-Z]{2,}(?=\d)", t)
    if m:
        return m.group(1).lower(), True

    # 3. Capitalizada pegada a otra capitalizada → LodgeSeasoned
    m = re.match(r"^([A-Z][a-z]{2,})(?=[A-Z])", t)
    if m:
        return m.group(1).lower(), True

    # 4. Palabra suelta al inicio → Milwaukee 48-89, JALL Digital, Step Drill.
    #    AMBIGUA: puede ser marca o descriptor, y por eso no cuenta cuando
    #    coincide con el término buscado.
    m = re.match(r"^([A-Z][A-Za-z]{2,})\s", t)
    if m:
        return m.group(1).lower(), False
    return "", False


def _marca_declarada(b) -> str:
    """La marca del `<h2>` de la tarjeta, cuando Amazon la sirve suelta.

    No siempre lo hace: en una de las dos variantes de layout ese mismo `<h2>`
    trae el TÍTULO entero. Un título no es una marca, así que se descarta por
    largo y por cantidad de palabras — "Ninja" pasa, "Chefman Air Fryer Oven
    Combo, 12-in-1" no. Ante la duda se devuelve vacío y decide la heurística
    del título, que es el camino que ya estaba validado.
    """
    b = (b or "").strip()
    if not b or len(b) > 24 or len(b.split()) > 3:
        return ""
    return b.lower()


def cuota(items, token: str = "", nucleo: str = "") -> tuple[float, str, int]:
    """(cuota del líder, quién es, cuántos resultados). Los patrocinados se
    excluyen: un anuncio no dice quién RANKEA, dice quién pagó.

    ⚠️ **El propio término buscado no puede contar como marca.** El extractor lee
    el prefijo del título, y muchos títulos genéricos empiezan con el descriptor:
    `Large Wall Clock…`, `Step Drill Bit…`, `Outdoor Clock…`. Sin este filtro,
    `step` daba 31% con "step" de líder — que no es concentración de marca, es que
    la palabra está en el título, como corresponde.

    El riesgo era real: un descriptor muy usado podía cruzar el 60% y quedar
    marcado como marca. La señal debe medir **cuántos productos son del mismo
    vendedor**, no cuántos títulos repiten la palabra buscada.
    """
    organicos = [i for i in items if not i.get("isSponsored")]
    n = len(organicos)
    if n < 8:                       # con menos de media página no se afirma nada
        return 0.0, "", n
    propias = {w for w in (token + " " + nucleo).lower().replace("_", " ").split() if w}

    # ⚠️ SE AGRUPA POR LOS PRIMEROS 5 CARACTERES, y no es un atajo perezoso.
    # El SKU viene pegado al nombre y muchas veces también en mayúsculas, así que
    # el mismo vendedor sale con nombres distintos:
    #     SEIKOQXM607BRHZ · SEIKOQXA520WLH · SEIKOQHA019LLH · SEIKOMusical
    # Contados por separado, Seiko daba 7 de 16 = 44% → GRIS. Es 16 de 16 = 100%.
    # Fragmentar la marca real es el peor error posible acá: hunde justo la señal
    # que se quiere detectar. Dos marcas con las mismas 5 letras iniciales son
    # mucho menos probables que un SKU pegado.
    marcas, nombres = Counter(), {}
    for i in organicos:
        # 🔴 Si el scraper trajo la marca DECLARADA por Amazon, se usa esa y no
        # se adivina. Todo `marca_del_titulo` es una heurística para reconstruir
        # este dato desde el texto — y falla justo donde más importa cuando la
        # marca va suelta al principio del título:
        #
        #     "Gourmia Air Fryer, 7 Qt…"   Gourmia se lleva 16 de 16
        #     heurística                    cuota 0,00 · LIBRE   ← la señal, perdida
        #     marca declarada               cuota 1,00 · MARCA
        #
        # Medido el 2026-08-06 con el scraper headless. Con los títulos que daba
        # el actor de Apify la marca venía PEGADA al SKU (`KLEIN TOOLS53614…`) y
        # la heurística la agarraba; el `alt` de la galería de la SERP trae el
        # título tal cual lo escribió el vendedor, y ahí la marca queda suelta.
        #
        # Y con la marca declarada NO hace falta el filtro de `propias`: ese
        # filtro existía porque el prefijo del título podía ser un descriptor
        # genérico (`Large Wall Clock…`). Amazon no declara "Large" como marca.
        declarada = _marca_declarada(i.get("brand"))
        if declarada:
            m, clave = declarada, declarada[:5]
        else:
            m, inequivoca = marca_del_titulo(i.get("title"))
            # La pegada cuenta siempre; la suelta, solo si no es el término.
            if not (m and (inequivoca or m not in propias)):
                continue
            clave = m[:5]
        if m:
            marcas[clave] += 1
            # Para mostrar, el nombre más corto del grupo: `seiko`, no `seikoqxa`.
            if clave not in nombres or len(m) < len(nombres[clave]):
                nombres[clave] = m
    if not marcas:
        return 0.0, "", n
    lider, cnt = marcas.most_common(1)[0]
    return cnt / n, nombres.get(lider, lider), n


def veredicto(c: float, token: str = "", lider: str = "") -> str:
    """Alta concentración NO significa "es una marca". Significa "un solo
    vendedor se lleva la página", y hay dos maneras muy distintas de que eso pase:

        klein  88%  líder klein    → la palabra ES de ese vendedor   → MARCA
        copper 81%  líder pocket   → genérico que Pocket Hose copó   → DOMINADO
        deep   62%  líder lodge    → genérico que Lodge copó         → DOMINADO

    `copper` es un material y `deep` es un tamaño; ninguno es marca. Lo que pasa
    es que alguien domina esa búsqueda. Sin esta distinción el clasificador los
    mandaba a MARCA y sacaba del vocabulario del nicho dos palabras legítimas.

    **El discriminador es si el líder ES el token.** Y `DOMINADO` no es un
    descarte: es de las señales más útiles del research — un término abierto en
    el papel donde en la práctica hay un incumbente instalado."""
    if c <= UMBRAL_LIBRE:
        return "LIBRE"
    t, l = token.lower().replace("_", " "), (lider or "").lower()
    # El líder puede venir recortado por el SKU pegado (`dewal` de DEWALTDrill),
    # así que se comparan por prefijo en vez de por igualdad exacta.
    propio = bool(l) and (t.startswith(l[:5]) or l.startswith(t[:5]))
    if c > UMBRAL_MARCA:
        return "MARCA" if propio else "DOMINADO"
    return "GRIS" if propio else "DOMINADO"


def es_marca_registrada(items, token: str) -> int:
    """En cuántos resultados Amazon declara que la marca ES este token.

    La cuota de página mide DOMINANCIA, y por eso se le escapa la marca que no
    domina ni su propia búsqueda. Medido el 2026-08-06 en `air fryer`:

        bella       BELLA 6 de 16     38%  → LIBRE   y es una marca
        panasonic   Panasonic 2 de 16 12%  → LIBRE   y es una marca
        emeril      Chefman le gana en su propio nombre

    Los tres quedaban dentro del vocabulario del nicho. No son vocabulario: son
    empresas chicas o desplazadas. Amazon ya nos dice quién es cada producto —
    si el token ES una marca declarada, es una marca, gane o pierda su página.

    Se compara por PALABRA COMPLETA, no por prefijo: `chef` no puede volverse
    marca porque exista `Chefman`, pero `instant` sí lo es porque la marca
    declarada es `Instant Pot`, que empieza con esa palabra."""
    t = (token or "").lower().replace("_", " ").strip()
    if not t:
        return 0
    n = 0
    for i in items:
        if i.get("isSponsored"):
            continue
        b = _marca_declarada(i.get("brand"))
        if b and (b == t or b.startswith(t + " ")):
            n += 1
    return n


# Con menos de esto no se afirma: una sola tarjeta puede ser un vendedor
# oportunista que puso el término como nombre de tienda.
MIN_DECLARACIONES = 2


def guardar(token: str, items, nucleo: str = "") -> dict:
    os.makedirs(CACHE, exist_ok=True)
    c, lider, n = cuota(items, token, nucleo)
    declarada = es_marca_registrada(items, token)
    v = veredicto(c, token, lider)
    if declarada >= MIN_DECLARACIONES and v == "LIBRE":
        v = "MARCA"
    d = {"token": token, "cuota": round(c, 3), "lider": lider, "resultados": n,
         "declarada": declarada, "veredicto": v}
    json.dump(d, io.open(_ruta(token), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return d


def leer(token: str) -> dict | None:
    p = _ruta(token)
    return json.load(io.open(p, encoding="utf-8")) if os.path.exists(p) else None


def medible(token: str) -> bool:
    """¿Vale la pena gastar una búsqueda en este token?

    Dos casos que hay que descartar ANTES de scrapear, porque no son búsquedas
    reales y la respuesta sería basura con la que después habría que lidiar:

    · **Números sueltos** — `1`, `25`, `10`. Buscar "1 drill bit set" devuelve
      cualquier cosa. Son tamaños y cantidades, no vocabulario, y ya tenían que
      haber salido en ATRIBUTO.
    · **Tokens de un solo carácter** o vacíos.

    Los bigramas SÍ se miden, pero hay que devolverles el espacio: el derivador
    los guarda como `nut_driver` y la búsqueda real es `nut driver`.
    """
    t = (token or "").strip()
    return len(t) > 2 and not t.replace("_", "").replace(".", "").isdigit()


def pendientes(tokens, nucleo: str) -> list[str]:
    """Las URLs que faltan traer. Un token ya medido no se vuelve a pedir aunque
    aparezca en otro nicho — por eso el caché es por TOKEN y no por nicho."""
    faltan = [t for t in tokens if medible(t) and leer(t) is None]
    return [f"https://www.amazon.com/s?k="
            f"{(t.replace('_', ' ') + ' ' + nucleo).replace(' ', '+')}"
            for t in faltan]


if __name__ == "__main__":
    if len(sys.argv) > 1:
        for t in sys.argv[1:]:
            d = leer(t)
            print(f"  {t:18} {d['veredicto']:6} {d['cuota']:.0%} ({d['lider'] or '—'})"
                  if d else f"  {t:18} sin medir")
    else:
        print(f"caché: {CACHE}")
        if os.path.isdir(CACHE):
            for f in sorted(os.listdir(CACHE)):
                d = json.load(io.open(os.path.join(CACHE, f), encoding="utf-8"))
                print(f"  {d['token']:22} {d['veredicto']:6} {d['cuota']:.0%}  {d['lider']}")
