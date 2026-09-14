"""
Construye la UKL (Universe Keyword List) de MAVRA.

La MKL nace del reverse ASIN: solo puede devolver el mundo de los competidores.
La UKL nace de la demanda del nicho, vía Magnet por roots. Lo que entra acá es
lo que NINGUNA de las tres MKL vio.

Cada keyword sale con dos etiquetas independientes:
  cuando: AHORA / DESPUES / NO   — si se puede atacar ya
  para:   VENDER / TARGET / CATALOGO / AUDIENCIA — para qué sirve

Y con `rel` y `ranks` vacíos a propósito: en la UKL ningún competidor la tiene,
y esa ausencia es el dato, no un hueco. La tabla la muestra con rayita.
"""
import json, io, glob, os, re

TOOLS = r"C:\Users\FRANCISCO ARIAS\.claude-bots\tecki\projects\D--bots-tecki\356911ef-4550-4cfb-9b2b-2e1e846852e1\tool-results"
DATA = r"D:\dev\mavra\dashboard\src\data"
MIN_SV = 450          # mismo corte que el MKL: menos que eso no mueve la aguja
TD_LIBRE = 3          # title density hasta acá = el hueco está abierto

# Vocabulario por producto. VENDER = el ASIN puede satisfacer esa búsqueda.
CAT = {
    "LMP": r"\b(lamp|lamps|light|lights|lighting|lampara|nightlight|night light|sconce)\b",
    "CND": r"\b(candle|candles|wax|votive|taper|pillar|wick|vela|velas)\b",
    "SWD": r"\b(wall decor|wall art|wall hanging|wall sculpture|hanging|plaque|mount)\b",
}
# Decoración genérica: la puede satisfacer cualquiera de los tres.
GENERICO = r"\b(decor|decoration|decorations|ornament|aesthetic|home accent|accent)\b"
# Del universo, pero no es decoración: solo dice quién es el cliente.
# OJO — acá vivían `shower curtain`, `bedding`, `blanket` y `rug`, mezclados con
# `hoodie` y `lipstick`. No son ropa: son decoración de hogar, y como este regex
# corre PRIMERO se comía la señal antes de que nada más la mirara. Enterraba 64
# keywords del nicho con 65.942 de volumen y title density de 0 a 4. Ahora van a
# CATALOGO, que es lo que son.
AUDIENCIA = r"\b(clothing|clothes|dress|shirt|hoodie|jacket|pants|skirt|boots|shoes|jewelry|necklace|earrings|ring|rings|bracelet|nails|makeup|lipstick|hair|wig|bag|purse|backpack|tattoo|sticker|stickers|poster|mug|tumbler|phone case|costume|costumes|cosplay|accessories|accessory|outfit|corset|fishnet|choker|belt|socks|gloves|mask|hat|sunglasses|apparel|merch)\b"
# Decoración del nicho que MAVRA NO fabrica con ninguno de sus tres SKU. No se puja
# —no hay producto que mostrar— pero tampoco es audiencia: es la lista de qué lanzar
# después, ordenada por demanda real y por lo abierto que esté el hueco.
CATALOGO = r"\b(curtain|curtains|shower curtain|bedding|comforter|duvet|sheets|blanket|throw|pillow|cushion|rug|carpet|mat|doormat|mirror|shelf|shelves|bookend|bookends|planter|pot|vase|statue|statuette|figurine|bust|clock|coaster|coasters|tray|jar|canister|box|chest|lantern|sign|plaque sign|wind chime|garland|wreath|table runner|placemat|towel|hamper|basket|frame|frames|stand|holder rack|rack|hook|hooks|knob|knobs|drawer pull)\b"

# ── EL GATE QUE FALTABA ──────────────────────────────────────────────────────
# Primera corrida sin esto: la UKL trajo 7.401 keywords y arriba de todo estaban
# "govee lights" (113k), "house decor" (50k) y "cute room decor" (22k). Magnet por
# roots amplios devuelve TODO el vecindario de "decor", no el universo gótico.
# Sin este gate la lista no es un universo: es la categoría entera, y competir ahí
# es justo lo que el nicho evita.
NICHO = r"\b(goth|gothic|skull|skulls|skeleton|skeletons|witch|witchy|witchcraft|dark academia|darkacademia|grunge|emo|vampire|occult|macabre|memento mori|whimsigoth|pastel goth|spooky|horror|creepy|coffin|bat|bats|raven|crow|moon phase|celestial dark|black cat|ouija|tarot|pentagram|crystal ball|apothecary|victorian gothic|edgy|alt|alternative decor|moody|noir)\b"
# Marcas de terceros: no se pujan ni se meten en el listado.
MARCAS = r"\b(govee|philips|hue|ikea|target|walmart|amazon basics|nanoleaf|lifx|yeelight|wyze|sengled|cricut|temu|shein)\b"
# Temporada: MAVRA es decoración permanente y Halloween históricamente no le rinde.
TEMPORADA = r"\b(halloween|christmas|xmas|thanksgiving|easter|valentine)\b"


def cargar_magnet():
    """Los tres roots de Magnet, deduplicados por frase (gana el mayor volumen)."""
    vistos = {}
    for f in glob.glob(os.path.join(TOOLS, "mcp-claude_ai_Helium10-get_keywords_by_keyword-*.txt")):
        d = json.load(io.open(f, encoding="utf-8"))
        for k in d["data"]["keywords"]:
            frase = (k.get("phrase") or "").strip().lower()
            sv = k.get("search_volume") or 0
            if not frase or sv < MIN_SV:
                continue
            if frase not in vistos or sv > vistos[frase]["search_volume"]:
                vistos[frase] = k
    return vistos


def kws_conocidas():
    """Todo lo que ya vio cualquiera de las tres MKL, sin importar el bucket."""
    conocidas = set()
    for p in ("lmp", "cnd", "swd"):
        d = json.load(io.open(os.path.join(DATA, f"{p}_mkl_v3.json"), encoding="utf-8"))
        for k in d["kws"]:
            conocidas.add((k.get("kw_lower") or k["kw"]).strip().lower())
    return conocidas


def etiquetar(frase, td, producto):
    """Clasifica una keyword en DOS EJES independientes, y de ahí deriva la acción.

    Antes esto devolvía una sola etiqueta (`para`) que mezclaba dos preguntas
    distintas, y por eso quedaba atada a MAVRA: `CATALOGO` significaba a la vez
    "es otro producto" y "MAVRA no lo fabrica". En un nicho donde el seller no
    vende nada, esa etiqueta no significa nada.

    Los ejes, que sí se separan:

      relacion  — QUÉ ES la keyword respecto del producto. Sale del nicho:
                  MISMO (este ASIN la satisface) · OTRO (es otro producto del
                  nicho) · AJENO (no es decoración, solo dice quién es el cliente).
      vende     — QUIÉN LO VENDE. Sale del catálogo del seller, no del nicho.
                  Solo tiene sentido cuando relacion == OTRO.

    La acción sale del CRUCE, y es lo único que cambia entre un seller y otro:
      MISMO                 -> se puja
      OTRO + lo vende       -> el tráfico va al listado hermano, no a este
      OTRO + no lo vende    -> hueco de línea: demanda medida sin SKU que la cubra
      AJENO                 -> audiencia

    Lo que acá NO se decide: si un OTRO es sustituto (te roba la compra) o
    complementario (se compra además). Eso no sale del vocabulario —`skull lamp`
    es complementaria de una pared y sustituta de otra lámpara, misma frase— sino
    de dónde solapan los competidores que la dominan. Se resuelve con el segundo
    run del dive, no acá, y hasta entonces queda en None en vez de inventado.
    """
    if re.search(AUDIENCIA, frase):
        return "NO", "AUDIENCIA", "AJENO", None
    propio = re.search(CAT[producto], frase)
    otro_sku = any(re.search(v, frase) for k, v in CAT.items() if k != producto)
    if propio or (not otro_sku and re.search(GENERICO, frase)):
        # El producto puede satisfacer esta búsqueda.
        if re.search(TEMPORADA, frase):
            return "DESPUES", "VENDER", "MISMO", None   # existe, pero no es el posicionamiento
        return ("AHORA" if td <= TD_LIBRE else "DESPUES"), "VENDER", "MISMO", None
    if otro_sku:
        # Otro producto del nicho que MAVRA SÍ vende: no se puja desde acá, el
        # clic tiene que ir al listado que lo cubre.
        return "NO", "TARGET", "OTRO", True
    if re.search(CATALOGO, frase):
        # Otro producto del nicho que MAVRA NO vende. No se puja hoy porque no hay
        # nada que mostrar; se lee como demanda para el próximo SKU.
        return "NO", "CATALOGO", "OTRO", False
    # Default conservador. La primera versión devolvía VENDER acá, y en pantalla
    # quedaron "emo" (29.541), "raven costume" y "grunge accessories" marcadas como
    # vendibles: son del universo estético pero nadie las busca para comprar una
    # lámpara. Si no hay evidencia de que la frase sea de DECORACIÓN, no se afirma
    # que el producto la satisface: es señal de audiencia hasta que se demuestre
    # lo contrario.
    return "NO", "AUDIENCIA", "AJENO", None


def main():
    magnet = cargar_magnet()
    conocidas = kws_conocidas()
    sin_ver = {f: k for f, k in magnet.items() if f not in conocidas}
    del_nicho = {f: k for f, k in sin_ver.items() if re.search(NICHO, f)}
    nuevas = {f: k for f, k in del_nicho.items() if not re.search(MARCAS, f)}

    print(f"Magnet (3 roots, SV>={MIN_SV}): {len(magnet)} keywords")
    print(f"Ya vistas por alguna MKL:       {len(magnet) - len(sin_ver)}")
    print(f"Sin ver, pero fuera del nicho:  {len(sin_ver) - len(del_nicho)}  (descartadas: house decor, govee, cute room decor...)")
    print(f"Con marca de tercero:           {len(del_nicho) - len(nuevas)}")
    print(f"NUEVAS Y DEL NICHO (la UKL):    {len(nuevas)}")
    print(f"Volumen nuevo:                  {sum(k['search_volume'] for k in nuevas.values()):,}")

    salida = {}
    for prod in ("LMP", "CND", "SWD"):
        filas = []
        for frase, k in nuevas.items():
            td = k.get("title_density") or 0
            cuando, para, relacion, vende = etiquetar(frase, td, prod)
            filas.append({
                "kw": k["phrase"], "kw_lower": frase,
                "vol": k["search_volume"], "td": td,
                "cp": k.get("competing_products") or 0,
                "sp": k.get("sponsored_asins_count") or 0,
                "cpr": k.get("cpr") or 0, "iq": k.get("iq_score") or 0,
                "words": len(frase.split()),
                "rel": None, "ranks": {},          # nadie la tiene: la ausencia ES el dato
                "bucket": "UKL", "cuando": cuando, "para": para,
                # Los dos ejes crudos. `para` es el cruce ya resuelto y es lo que
                # pinta la tabla; estos dos son los que viajan a otro nicho.
                "relacion": relacion, "vende_seller": vende,
                "sustitucion": None,   # sustituto o complementario: lo dice el solape
                                       # de competidores, no el vocabulario.
            })
        filas.sort(key=lambda r: (-r["vol"]))
        salida[prod] = filas
        n_ahora = sum(1 for r in filas if r["cuando"] == "AHORA")
        vol_ahora = sum(r["vol"] for r in filas if r["cuando"] == "AHORA")
        reparto = {p: sum(1 for r in filas if r["para"] == p)
                   for p in ("VENDER", "TARGET", "CATALOGO", "AUDIENCIA")}
        print(f"\n{prod}: {len(filas)} keywords | AHORA {n_ahora} ({vol_ahora:,} de volumen)")
        print(f"   reparto: " + " · ".join(f"{k} {v}" for k, v in reparto.items()))
        for r in [x for x in filas if x["cuando"] == "AHORA"][:8]:
            print(f"   {r['kw'][:44]:46} SV {r['vol']:>7,}  TD {r['td']:>2}")
        cat = [x for x in filas if x["para"] == "CATALOGO"]
        print(f"   CATALOGO: {len(cat)} keywords, {sum(x['vol'] for x in cat):,} de volumen "
              f"— demanda del nicho sin producto MAVRA que la cubra")
        ejes = {}
        for r in filas:
            ejes[(r["relacion"], r["vende_seller"])] = ejes.get((r["relacion"], r["vende_seller"]), 0) + 1
        print("   ejes: " + " · ".join(
            f"{rel}{'' if ven is None else ('/propio' if ven else '/ajeno')} {n}"
            for (rel, ven), n in sorted(ejes.items(), key=lambda x: -x[1])))

    meta = {
        "fuente": "H10 Magnet — roots: goth decor, skull decor, gothic home decor",
        "generado": __import__("datetime").date.today().isoformat(),
        "min_sv": MIN_SV, "td_libre": TD_LIBRE,
        "total_magnet": len(magnet), "ya_en_mkl": len(magnet) - len(nuevas),
        "total_ukl": len(nuevas),
        "nota": "rel y ranks van vacíos a propósito: en la UKL ningún competidor "
                "del MKL la tiene. La ausencia es el dato.",
    }
    for prod, filas in salida.items():
        destino = os.path.join(DATA, f"{prod.lower()}_ukl.json")
        io.open(destino, "w", encoding="utf-8").write(
            json.dumps({"meta": meta, "kws": filas}, ensure_ascii=False))
        print(f"\nescrito {destino} ({len(filas)} filas)")


if __name__ == "__main__":
    main()
