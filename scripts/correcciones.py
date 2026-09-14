# -*- coding: utf-8 -*-
"""LA CURACIÓN DE FRANK, APLICADA ANTES DE QUE CUALQUIER SCRIPT TRABAJE.

El problema, en una línea: **Frank curó 3.298 keywords a mano y ningún script
aguas abajo las lee.**

Sus movimientos se guardan en `mavra_mkl_correcciones` (Supabase) — es lo que
hace el dashboard cuando arrastra una keyword de un bucket a otro. Pero los
scripts abren el JSON del MKL y leen el campo `bucket` de ahí, que sigue
diciendo lo que dijo el motor.

El resultado medible: el derivador ve **324** keywords en el UKL de LMP. Con la
curación aplicada ve **1.778**. Frank lo notó mirando la pantalla y diciendo
*"veo 700+"* mientras yo repetía 324 tres veces seguidas.

**No reescribe el JSON.** La corrección se aplica en memoria, al leer. El
archivo queda igual y se puede regenerar cuando haga falta; lo que manda es la
tabla, que es donde vive la decisión del usuario.

Uso, en la primera línea del script:

    from correcciones import aplicar
    keywords = aplicar(keywords, "LMP")

────────────────────────────────────────────────────────────────────────────
Y lo que esto NO resuelve, que está anotado en PENDIENTES.md: la tabla se llama
`mavra_mkl_correcciones` y está atada a MAVRA por diseño. **Cualquier seller que
cure su MKL en AGTA choca con lo mismo**, solo que no se entera — siente que la
herramienta "no aprende". Que la corrección del usuario pese aguas abajo es
diseño de producto, no este parche.
"""
import io, json, os, sys, urllib.request, urllib.parse

SUPABASE = "https://arjjqwluwmpnhwamkskh.supabase.co"
TABLA = "mavra_mkl_correcciones"
# ⚠️ PostgREST devuelve 1.000 filas por consulta y NO avisa. Sin paginar, en LMP
# —que tiene 1.509 correcciones— se leen 1.000 y las otras 509 se pierden en
# silencio. Es el mismo bug que ya mordió al dashboard el 1-ago.
PAGINA = 1000


def _anon() -> str:
    """La clave pública. Sale del entorno si está; si no, de la del dashboard,
    que es la misma y es pública por diseño (solo lectura con RLS)."""
    k = os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")
    if k:
        return k
    js = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                      "..", "src", "lib", "correcciones.js")
    try:
        txt = io.open(js, encoding="utf-8").read()
        return txt.split("const ANON = '")[1].split("'")[0]
    except Exception:
        return ""


def traer(producto: str) -> dict:
    """`{kw_lower: bucket}` con TODAS las correcciones del producto."""
    clave = _anon()
    if not clave:
        print("  ⚠ sin clave de Supabase: la curación NO se aplica", file=sys.stderr)
        return {}
    fuera, desde = {}, 0
    while True:
        q = urllib.parse.urlencode({
            "select": "kw_lower,bucket", "producto": f"eq.{producto}",
            "order": "kw_lower.asc"})
        req = urllib.request.Request(
            f"{SUPABASE}/rest/v1/{TABLA}?{q}",
            headers={"apikey": clave, "Authorization": f"Bearer {clave}",
                     "Range": f"{desde}-{desde + PAGINA - 1}"})
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                lote = json.loads(r.read())
        except Exception as e:
            print(f"  ⚠ no se pudo leer la curación: {e}", file=sys.stderr)
            return fuera
        for x in lote:
            fuera[x["kw_lower"]] = x["bucket"]
        if len(lote) < PAGINA:
            return fuera
        desde += PAGINA


def _ukl(producto: str) -> dict:
    """`{kw_lower: fila}` del UKL del producto, o `{}` si no está en disco.

    La UKL es otra FUENTE, no otro bucket: sale de Magnet por roots y vive en su
    propio archivo. Por eso una keyword puede estar en la UKL y no en el MKL."""
    ruta = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "..", "src", "data", f"{producto.lower()}_ukl.json")
    try:
        d = json.load(io.open(ruta, encoding="utf-8"))
    except Exception:
        return {}
    fuera = {}
    for k in d.get("kws", []):
        fuera[(k.get("kw_lower") or k.get("kw", "")).strip().lower()] = k
    return fuera


def aplicar(keywords: list, producto: str, campo: str = "bucket") -> list:
    """Pisa el `bucket` de cada keyword que el usuario movió. En memoria.

    El match va por `kw_lower` y NO por posición: los JSON del MKL se regeneran
    seguido y el orden cambia entre corridas. Guardar el índice haría que
    después de regenerar, las correcciones cayeran sobre keywords distintas —
    y ese error sería mudo, que es la peor clase.

    ⚠️ Y hace algo más que pisar: **inyecta**. Una corrección puede promover a
    MKL una keyword que vive en la UKL y no en el MKL — `goth girl`, la primera
    keyword de persona que Frank subió, es exactamente eso. Como el JSON del MKL
    no la contiene, pisar no alcanza: hay que traerla de la UKL y agregarla. Sin
    esto, siete ascensos deliberados de CND caían al vacío en silencio."""
    corr = traer(producto)
    if not corr:
        return keywords
    indice, tocadas, dobles = {}, 0, 0
    for k in keywords:
        kw = (k.get("phrase") or k.get("keyword") or k.get("kw") or "").strip().lower()
        if kw in indice:
            dobles += 1          # el MKL trae kw_lower repetidos; la corrección pisa las dos
        indice.setdefault(kw, k)
        nuevo = corr.get(kw)
        if nuevo and k.get(campo) != nuevo:
            k[campo] = nuevo
            tocadas += 1

    # Las que el usuario movió y NO están en esta lista: se buscan en la UKL.
    faltan = [kw for kw in corr if kw not in indice]
    ukl, inyectadas, perdidas = _ukl(producto), 0, []
    for kw in faltan:
        fila = ukl.get(kw)
        if fila is None:
            perdidas.append(kw)
            continue
        nueva = dict(fila)
        nueva[campo] = corr[kw]
        nueva.setdefault("kw_lower", kw)
        nueva["_origen"] = "UKL"      # de dónde salió, para poder auditarlo después
        keywords.append(nueva)
        inyectadas += 1

    extra = ""
    if inyectadas:
        extra += f" · {inyectadas} traídas de la UKL"
    if dobles:
        extra += f" · {dobles} kw duplicadas en el JSON"
    if perdidas:
        extra += f" · ⚠ {len(perdidas)} sin origen: {', '.join(sorted(perdidas)[:5])}"
    print(f"  curación de {producto}: {len(corr):,} guardadas · {tocadas:,} aplicadas{extra}")
    return keywords


if __name__ == "__main__":
    # Diagnóstico: qué hay guardado por producto y cuánto cambia cada bucket.
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    for p in (sys.argv[1:] or ["LMP", "CND", "SWD"]):
        c = traer(p)
        conteo = {}
        for b in c.values():
            conteo[b] = conteo.get(b, 0) + 1
        detalle = " · ".join(f"{b} {n:,}" for b, n in sorted(conteo.items(), key=lambda x: -x[1]))
        print(f"{p}: {len(c):,} correcciones — {detalle}")
