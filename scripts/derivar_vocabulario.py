"""Deriva el vocabulario de un nicho desde la POSICIÓN de cada palabra.

El problema que resuelve: `construir_ukl.py` tiene el vocabulario gótico escrito a
mano (`goth|gothic|skull|witch|spooky|coffin|raven…`). Eso funciona para MAVRA y para
nadie más — un vendedor de utensilios de cocina necesita otra lista y nadie se la va a
escribir. Sin este paso, el motor de research no sale del nicho de Frank.

LO QUE NO FUNCIONÓ, para que no se vuelva a probar (2026-08-02, medido sobre gaming):

  · `competing_products` bajo = producto. NO: CP bajo significa "pocos lo venden", y eso
    pasa igual con una marca (`govee` CP 1.000, `philips hue` 876) o una franquicia
    licenciada (`minecraft` 9.000, `rick and morty` 2.000).
  · CP bajo + title density alto = marca. NO: `govee lights` tiene **TD 0**, porque los
    listings de Govee dicen "Govee LED Strip Lights" y el TD mide la frase literal.

LO QUE SÍ: dónde cae la palabra dentro de la frase. El núcleo es lo que se compra y va
al final; todo lo que lo describe va antes.

  ratio_final alto  -> NUCLEO de producto   gaming: sign .99 · decor .98 · lamp .92
                                            gótico: decor .98 · lamp .91 · candles .88
  ratio_final ~0    -> MODIFICADOR          gaming: philips .00 · govee .06 · minecraft .09
                                            gótico: gothic .00 · witchy .00 · goth .03
  zona media        -> AMBIVALENTE          home .49 · room .55 · skull .31

Y como "va al principio" agrupa marcas con estética —que no son lo mismo— ahí recién
entra el CP: una marca la vende una sola empresa (`govee` compite con 1.000 productos),
una estética la puede usar cualquiera (`gothic decor`, 100.000).

La validación de que esto no es un truco de gaming: corrido sobre el universo gótico,
la lista de modificadores que sale sola **es el mismo regex que habíamos escrito a
mano**. Nadie tuvo que saber que MAVRA es gótica.

LOS TRES QUE SE ARREGLARON (2026-08-03), cada uno con lo que lo destapó:

  · **Atributos.** `adjustable`, `rechargeable`, `battery`, `suction` van al principio y
    compiten poco, así que caían en MARCA. No son marcas ni son el nicho: son
    características. Ahora salen en su propia clase ATRIBUTO, por dos vías: los sufijos
    productivos (`-able`, `-less`, `-proof`, `-resistant`, `-powered`, `-mounted`) y una
    lista corta de energía y fijación. Las dos son UNIVERSALES —no dependen del nicho—,
    que es lo que las hace legítimas acá: escribir `goth|witchy` a mano ata el motor a
    MAVRA, escribir `rechargeable` no ata a nada.
    Deliberadamente NO se meten colores ni tamaños: `black` es atributo en una lámpara y
    es identidad en el gótico, y decidir por él sería inventar. Quedan donde caigan.
  · **Bigramas partidos.** `mid century` se rompía en `mid` (nicho) y `century` (núcleo)
    porque el conteo era token a token. Ahora se detectan las colocaciones ANTES de
    clasificar: si `mid` va seguido de `century` en casi todas sus apariciones, los dos
    son una sola unidad. Se deriva de los datos, sin lista — y de paso agarra las del
    gótico, `dark academia` y `day of the dead`.
  · **La clase MARCA no era de marcas.** En wall planters salieron 5 y ninguna lo era:
    español, un atributo y contaminación de otro nicho. Probé separarlas por FRECUENCIA
    —una marca aparece mucho, el ruido poco— y **no alcanzó**: sobre el Magnet real de
    wall planters, `veradek` (marca de verdad) aparece en 11 frases y `decoracion` en
    18. El ruido es MÁS frecuente que la marca, así que ese corte no discrimina.
    Lo que la clase realmente agrupa es "va al principio y casi nadie compite por él", y
    ahí adentro caben tres cosas distintas: marcas (`govee`, `veradek`), palabras en otro
    idioma (`decoracion`, `adornos`) y descriptores de poca demanda (`scalloped`,
    `privacy`, `climbing`). Con los números que tenemos no se separan. Así que la clase
    se llama **FUERA** y no MARCA: dice lo que se puede sostener —esto no va al
    vocabulario del nicho— y no promete una identificación que el dato no da.
    Separarlas de verdad pide otra señal (el idioma sale por co-ocurrencia; la marca,
    quizá por cuántos núcleos distintos acompaña). Todavía no está.

LO QUE SIGUE SIN SEPARAR, para no venderlo como cerrado:

  · **Franquicias grandes.** `minecraft` toca CP 9.000, arriba del corte, y pasa como
    vocabulario del nicho. `fortnite` y `pokemon` sí se detectan. Una IP muy vendida se
    parece demasiado a una estética por los números solos.
  · **Otro idioma.** `lampara`, `luces`, `papel` entran sueltas y descolocan la posición.
    Hoy caen en FUERA, que al menos ya no las presenta como marcas.

Y una condición de uso: esto se corre sobre un universo AMPLIO (el Magnet del nicho),
no sobre un MKL ya filtrado. En un MKL las frases son long-tail y ningún token llega a
su techo real de competencia, que es de donde sale la separación marca/estética.
"""
import re
from collections import Counter

# Un token tiene que aparecer al menos esto para que su posición signifique algo.
# Con 3 apariciones, dos casualidades ya lo mandan a cualquier lado.
MIN_APARICIONES = 8
# Los cortes del ratio. Entre medio queda la zona ambivalente, que NO se fuerza a un
# lado: `skull` es núcleo en "skull decor" y modificador en "skull candle", y decidir
# por él sería inventar.
UMBRAL_NUCLEO = 0.70
UMBRAL_MODIF = 0.25
# Qué separa una marca de una estética, entre los que van al principio.
#
# Se mide contra el CP **máximo** de las frases donde aparece el token, no contra la
# mediana. Con la mediana el corte se rompía: en un MKL de velas góticas las keywords
# son long-tail y `gothic` daba CP~748, indistinguible de `govee` (~479). Con el máximo
# se separan, porque una estética SIEMPRE aparece en alguna frase amplia y una marca
# NUNCA — `gothic` toca 100.000 en `gothic decor`; `govee` no pasa de 1.000 en ninguna
# de sus 352 frases.
#
# Y el corte es RELATIVO al universo, no un número fijo. Con umbral absoluto de 12.000
# el gótico perdía `witchy` (9.000), `witch` y `horror` (10.000) como si fueran marcas;
# bajarlo a 5.000 los salvaba pero dejaba entrar `minecraft` y `sonic` (9.000) en
# gaming. El techo de competencia depende del tamaño del universo, así que se compara
# contra el techo del propio universo.
CP_MARCA_FRACCION = 0.02

VACIAS = {"the", "a", "an", "of", "for", "with", "in", "on", "to", "by", "at",
          "from", "and", "or", "de", "para", "con", "y"}

# ── ATRIBUTOS ────────────────────────────────────────────────────────────────────
# Dos vías, las dos universales. No describen NINGÚN nicho: describen cómo funciona o
# cómo se sujeta una cosa, y eso es igual en velas, sartenes y suplementos.
SUFIJOS_ATRIBUTO = ("able", "ible", "less", "proof", "resistant", "powered",
                    "operated", "mounted", "friendly", "washable")
# Excepciones al sufijo: palabras que terminan igual pero no son atributos. `table` y
# `candle` no terminan en "-able"/"-ible" por derivación, es coincidencia de letras.
NO_ATRIBUTO = {"table", "cable", "candle", "bible", "marble", "visible", "possible",
               "vegetable", "collectible", "unless", "dress", "glass", "brass"}
ATRIBUTOS_FUNCIONALES = {
    # energía
    "battery", "batteries", "cordless", "corded", "plug", "usb", "electric",
    "solar", "wireless", "rechargeable", "dimmable", "dimming",
    # fijación y montaje
    "suction", "adhesive", "magnetic", "screw", "screws", "nail", "nails",
    "velcro", "clamp", "clip", "peel", "stick", "stickable",
}
# A propósito NO están acá los colores ni los tamaños. `black` es un atributo en una
# lámpara y es identidad en el gótico; mandarlo a una clase fija sería decidir por el
# nicho, que es justo lo que este archivo existe para no hacer.

# Nota de lo que NO se pudo: separar las marcas del resto de este bucket. Ver el
# docstring — `veradek` (marca) aparece en 11 frases y `decoracion` (español) en 18, así
# que la frecuencia no discrimina. La clase se emite como FUERA, sin prometer más.

# ── COLOCACIONES ────────────────────────────────────────────────────────────────
# `mid century` se partía en dos y cada mitad caía en una clase distinta. Un par se
# fusiona cuando el primero casi siempre arrastra al segundo.
COLOC_MIN_PAR = 6      # apariciones del par para siquiera mirarlo
COLOC_P_SIGUIENTE = 0.75  # P(sigue b | apareció a)


def _tokens(frase):
    return [t for t in re.findall(r"[a-z0-9']+", frase.lower()) if t not in VACIAS]


def _es_atributo(token):
    """Universal, no del nicho: cómo funciona o cómo se sujeta la cosa."""
    for parte in token.split("_"):
        if parte in ATRIBUTOS_FUNCIONALES:
            return True
        if parte in NO_ATRIBUTO:
            continue
        if len(parte) > 6 and parte.endswith(SUFIJOS_ATRIBUTO):
            return True
    return False


def _colocaciones(frases):
    """Pares adyacentes que van casi siempre juntos. Sale de los datos, sin lista.

    La condición es asimétrica a propósito: mira P(b | a), no la inversa. `dark academia`
    cumple porque `academia` casi nunca va sola, aunque `dark` sí aparezca suelta en
    `dark decor` — y ahí `dark` se sigue contando aparte, que es lo correcto.
    """
    par, izq = Counter(), Counter()
    for w in frases:
        for i in range(len(w) - 1):
            par[(w[i], w[i + 1])] += 1
            izq[w[i]] += 1
    fusiones = {}
    for (a, b), n in par.items():
        if n < COLOC_MIN_PAR:
            continue
        if n / izq[a] >= COLOC_P_SIGUIENTE:
            fusiones[(a, b)] = n
    return fusiones


def _aplicar_fusiones(w, fusiones):
    out, i = [], 0
    while i < len(w):
        if i + 1 < len(w) and (w[i], w[i + 1]) in fusiones:
            out.append(w[i] + "_" + w[i + 1])
            i += 2
        else:
            out.append(w[i])
            i += 1
    return out


def derivar(keywords, min_sv=300):
    """keywords: iterable de dicts con `phrase`/`kw`, `search_volume`/`vol` y
    `competing_products`/`cp`. Devuelve {token: (clase, ratio, apariciones, cp_medio)}.

    Los nombres de campo vienen distintos según de dónde salga la lista (Magnet crudo
    o un MKL ya construido), así que se aceptan los dos en vez de obligar a normalizar
    antes: es la única razón de los `or` de abajo.
    """
    # Primera pasada: quedarse con las frases que pasan el filtro de volumen y detectar
    # las colocaciones. Hay que verlas TODAS antes de clasificar la primera, porque
    # `mid century` solo se ve como unidad mirando el conjunto.
    filtradas = []
    for k in keywords:
        frase = k.get("phrase") or k.get("kw") or ""
        sv = k.get("search_volume") or k.get("vol") or 0
        if sv < min_sv:
            continue
        cp = k.get("competing_products") or k.get("cp") or 0
        filtradas.append((_tokens(frase), cp))
    fusiones = _colocaciones([w for w, _ in filtradas])

    primero, ultimo, total = Counter(), Counter(), Counter()
    cp_max = Counter()
    for w, cp in filtradas:
        w = _aplicar_fusiones(w, fusiones)
        # El CP se acumula desde TODAS las frases, incluidas las de una palabra: es
        # justo ahí —`gothic` solo, `govee` solo— donde el techo de competencia se ve
        # más claro. La posición, en cambio, solo tiene sentido con dos o más.
        for t in set(w):
            cp_max[t] = max(cp_max[t], cp)
        if len(w) < 2:
            continue
        primero[w[0]] += 1
        ultimo[w[-1]] += 1
        for t in set(w):
            total[t] += 1

    # El techo de competencia del universo entero: contra él se mide si el techo de un
    # token es "bajo". Sin esto el corte solo sirve para el nicho donde se calibró.
    techo_universo = max(cp_max.values()) if cp_max else 0
    corte_marca = techo_universo * CP_MARCA_FRACCION

    fuera = {}
    for t, n in total.items():
        if n < MIN_APARICIONES:
            continue
        extremos = primero[t] + ultimo[t]
        if not extremos:
            continue
        ratio = ultimo[t] / extremos
        techo = cp_max[t]
        if _es_atributo(t):
            # Antes que nada: un atributo no es ni núcleo ni nicho ni marca, vaya donde
            # vaya su posición. `rechargeable` va al principio como `gothic` y compite
            # poco como `govee`, y no es ninguno de los dos.
            clase = "ATRIBUTO"
        elif ratio >= UMBRAL_NUCLEO:
            clase = "NUCLEO"
        elif ratio <= UMBRAL_MODIF:
            # Acá se aparta lo que no es del nicho, y es el único punto donde miramos CP.
            # FUERA mezcla marcas, otro idioma y descriptores raros: los tres comparten
            # que van al principio y que casi nadie compite por ellos, y con los números
            # que hay no se distinguen entre sí. Lo que sí es cierto de los tres es que
            # no son el vocabulario del nicho, y eso es lo que el nombre dice.
            clase = "FUERA" if techo and techo < corte_marca else "NICHO"
        else:
            clase = "AMBIVALENTE"
        fuera[t] = (clase, round(ratio, 2), n, techo)
    return fuera


def con_serp(clases, nucleo):
    """Reclasifica los ambiguos con la señal que SÍ funciona: la cuota de página.

    Las tres señales del texto no distinguen marca de estética, y las tres fallan
    por lo mismo — `dewalt drill bit set` y `carbide drill bit set` se escriben
    igual. Lo que las separa es **quién se lleva la primera página**: DeWalt 16 de
    16, carbide 4 de 16 repartido entre siete marcas.

    Se consultan NICHO, FUERA y **AMBIVALENTE**. NUCLEO y ATRIBUTO ya salen bien y
    no se tocan: gastar scraping ahí sería pagar por confirmar lo que ya se sabe.

    🔴 AMBIVALENTE quedó afuera hasta el 2026-08-06, y eso lo volvía una clase
    MUERTA: es la zona media del ratio de posición, o sea el "no sé" del texto, y
    era justo la que más necesitaba la segunda señal. Nadie la resolvía nunca. En
    los 20 nichos había **1.011 tokens** ahí, y el informe no los contaba ni como
    medidos ni como pendientes: invisibles.
    Lo que decidió enchufarla no fue el razonamiento sino el dato: 254 de esos
    1.011 YA tenían cuota medida en el caché (el caché es por token, así que
    venían de otro nicho) y salían LIBRE con cuota 0,06 a 0,38 — `kitchen`,
    `glass`, `compact`, `chocolate`, `chrome`. Vocabulario del nicho, sin ninguna
    marca, esperando que alguien lo mirara. Esos 254 se resuelven sin una sola
    búsqueda nueva.

    Un token sin medir se queda como está y **se marca**, en vez de asumir. Que la
    clase diga "no verificado" es información; que mienta con confianza, no.
    """
    from marca_serp import leer
    out = {}
    for t, v in clases.items():
        clase = v[0]
        if clase not in ("NICHO", "FUERA", "AMBIVALENTE"):
            out[t] = v
            continue
        d = leer(t)
        if d is None:
            # Sin medición, cada clase se marca conservando de dónde venía: un
            # `AMBIVALENTE?` dice "estaba en el limbo y sigue sin medir", que no
            # es lo mismo que un NICHO sin confirmar.
            out[t] = ({"NICHO": "NICHO?", "FUERA": "FUERA?",
                       "AMBIVALENTE": "AMBIVALENTE?"}[clase],) + tuple(v[1:])
            continue
        # MARCA     → fuera del vocabulario: la palabra es de una empresa.
        # DOMINADO  → SIGUE SIENDO del nicho. `copper`, `deep`, `pre seasoned`
        #             son material, tamaño y acabado; que Pocket Hose o Lodge
        #             copen esa búsqueda no los convierte en marcas. Se quedan en
        #             NICHO, pero marcados: es un término abierto en el papel con
        #             un incumbente instalado, y eso el research lo quiere saber.
        # LIBRE     → mercado abierto, vocabulario del nicho sin más.
        # GRIS      → concentración media con el propio nombre: probable marca
        #             chica, se deja sin decidir en vez de forzar.
        nueva = {"MARCA": "MARCA", "DOMINADO": "NICHO*", "LIBRE": "NICHO",
                 "GRIS": "GRIS"}[d["veredicto"]]
        out[t] = (nueva,) + tuple(v[1:])
    return out


def vocabulario_nicho(keywords, min_sv=300):
    """Solo los tokens de identidad — el reemplazo del regex NICHO escrito a mano."""
    d = derivar(keywords, min_sv)
    return sorted((t for t, v in d.items() if v[0] == "NICHO"),
                  key=lambda t: -d[t][2])


def fuera_del_nicho(keywords, min_sv=300):
    """Lo que va al principio y casi nadie compite: marcas, otro idioma y descriptores
    raros, sin separar entre sí. Reemplaza al regex de MARCAS escrito a mano, pero se
    lee como lista de descarte, no como lista de marcas."""
    d = derivar(keywords, min_sv)
    return sorted((t for t, v in d.items() if v[0] == "FUERA"), key=lambda t: -d[t][2])


if __name__ == "__main__":
    import json, io, os, sys
    DATA = r"D:\dev\mavra\dashboard\src\data"
    fuente = sys.argv[1] if len(sys.argv) > 1 else os.path.join(DATA, "cnd_mkl_v3.json")
    d = json.load(io.open(fuente, encoding="utf-8"))
    kws = d["kws"] if isinstance(d, dict) and "kws" in d else d["data"]["keywords"]

    # La curación del usuario, si la fuente es un MKL de MAVRA. El producto sale
    # del nombre del archivo (`lmp_mkl_v3.json` → LMP).
    #
    # Sin esto, el derivador ve 324 keywords en el UKL de LMP cuando Frank movió
    # 1.454 a mano — trabaja sobre el criterio del motor y no sobre el suyo, que
    # es justo lo que hay que corregir.
    base = os.path.basename(fuente).upper()
    for p in ("LMP", "CND", "SWD"):
        if base.startswith(p):
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            from correcciones import aplicar
            kws = aplicar(kws, p)
            break

    res = derivar(kws)
    for clase in ("NICHO", "NUCLEO", "ATRIBUTO", "FUERA", "AMBIVALENTE"):
        items = [(t, v) for t, v in res.items() if v[0] == clase]
        items.sort(key=lambda x: -x[1][2])
        print(f"\n{clase} ({len(items)})")
        for t, (_, ratio, n, cp) in items[:25]:
            print(f"   {t:16} ratio {ratio:.2f}  en {n:>4} kws  CP~{cp:,}")
