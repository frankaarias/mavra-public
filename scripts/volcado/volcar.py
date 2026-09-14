# -*- coding: utf-8 -*-
"""
Regenera el volcado de texto y las capturas que lee una LLM.

El sitio es una SPA: el HTML servido va vacio y todo lo dibuja el JavaScript,
asi que un extractor sin navegador no ve nada. Este script abre cada pagina con
Chromium, clickea las pestanas internas (hay contenido que SOLO aparece con
clic: Influencers pasa de 3.600 a 31.000 caracteres) y escribe:

    public/llm.txt            texto de las paginas del sitio
    public/llm-research.txt   el visor de Research, aparte por tamano
    public/shots/*.jpg        captura de pagina completa de cada una

Uso:  python scripts/volcado/volcar.py [--base URL]
"""
import argparse, asyncio, io, os, sys
from playwright.async_api import async_playwright
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PUBLIC = os.path.join(RAIZ, "public")
SHOTS = os.path.join(PUBLIC, "shots")

PAGES = [
    ("/",                 "Home",                "General"),
    ("/brand-guidelines", "Brand Guidelines",    "Marca"),
    ("/fonts",            "Tipografia",          "Marca"),
    ("/scenography",      "Escenografia",        "Marca"),
    ("/filmografia",      "Filmografia",         "Marca"),
    ("/avatares",         "Avatares",            "Marca"),
    ("/skulls",           "Productos",           "Producto"),
    ("/listings-briefs",  "Listings",            "Producto"),
    ("/aplus-briefs",     "A+ Content",          "Producto"),
    ("/copy",             "Copy & Ads",          "Producto"),
    ("/campanas",         "Campanas",            "Producto"),
    ("/pinterest",        "Campanas Pinterest",  "Producto"),
    ("/launch",           "Launch",              "Producto"),
    ("/sb",               "SB Preview",          "Producto"),
    ("/corrientes",       "Corrientes",          "Estrategia"),
    ("/competitors",      "Competitors",         "Estrategia"),
    ("/research",         "Research (MKL)",      "Estrategia"),
    ("/briefing",         "Briefing",            "Estrategia"),
    ("/influencers",      "Influencers",         "Influencers"),
    ("/creators",         "Creators",            "Influencers"),
]

NAV = {"MAVRA", "HOME", "BRAND ▾", "PRODUCTO ▾", "ESTRATEGIA ▾",
       "INFLUENCERS", "CREATORS"}
CHAT_BTN = "✦"   # el boton flotante del chat, no es una pestana
ALTO_MAX = 12000      # las capturas mas largas se cortan aca
# Research son 17 vistas de tablas de keywords: una captura por vista pesaria
# mas que todo el resto del sitio junto y no aporta nada al analisis de marca.
SIN_SUBCAPTURAS = {"research"}
ABRIR_DETALLES = "document.querySelectorAll('details').forEach(function(d){d.open=true})"

BASE = "https://mavra-public.vercel.app"


def limpiar(t):
    lines = [l.rstrip() for l in t.split("\n")]
    while lines and lines[0].strip() in NAV:
        lines.pop(0)
    out, vacias = [], 0
    for l in lines:
        if not l.strip():
            vacias += 1
            if vacias > 1:
                continue
        else:
            vacias = 0
        out.append(l)
    return "\n".join(out).strip()


async def capturar(pg, path, slug):
    await pg.goto(BASE + path, wait_until="networkidle", timeout=120000)
    await pg.wait_for_timeout(2200)
    await pg.evaluate(ABRIR_DETALLES)
    await pg.wait_for_timeout(300)

    base = await pg.evaluate("document.body.innerText")
    seen = set(l.strip() for l in base.split("\n"))
    vistas = [["(vista inicial)", base]]
    png = os.path.join(SHOTS, slug + ".png")
    await pg.screenshot(path=png, full_page=True)
    shots = [(slug, png)]

    # Las pestanas hay que clickearlas con force: sin eso, las de sidebar
    # sticky fallan por timeout y su contenido se pierde en silencio.
    etiquetas = []
    for i, h in enumerate(await pg.query_selector_all("button")):
        try:
            t = (await h.inner_text()).strip().replace("\n", " ")
            if await h.is_visible() and t and t != CHAT_BTN and len(t) < 70:
                etiquetas.append((i, t))
        except Exception:
            pass

    for i, lbl in etiquetas:
        try:
            hs = await pg.query_selector_all("button")
            if i >= len(hs):
                continue
            await hs[i].click(force=True, timeout=8000)
            await pg.wait_for_timeout(1400)
            await pg.evaluate(ABRIR_DETALLES)
            t = await pg.evaluate("document.body.innerText")
        except Exception:
            continue
        nuevas = [l for l in t.split("\n") if l.strip() and l.strip() not in seen]
        if len(nuevas) >= 2:
            for l in nuevas:
                seen.add(l.strip())
            vistas.append([lbl, "\n".join(nuevas)])
            if slug in SIN_SUBCAPTURAS:
                continue
            sub = "%s-%d" % (slug, len(vistas) - 1)
            p2 = os.path.join(SHOTS, sub + ".png")
            try:
                await pg.screenshot(path=p2, full_page=True)
                shots.append((sub, p2))
            except Exception:
                pass
    return vistas, shots


def render(pags, titulo, cabecera, capturas):
    b = ["=" * 78, titulo, "=" * 78, "", cabecera, "",
         "-" * 78, "INDICE", "-" * 78]
    g = None
    for p in pags:
        if p["group"] != g:
            g = p["group"]
            b += ["", "[" + g.upper() + "]"]
        vs = [v[0] for v in p["vistas"] if v[0] != "(vista inicial)"]
        extra = "   (secciones: " + ", ".join(vs) + ")" if vs else ""
        b.append("  %s  —  %s%s" % (p["title"], p["path"], extra))
    b.append("")
    for p in pags:
        b += ["", "#" * 78,
              "# PAGINA: %s   [%s]   ruta: %s" % (p["title"], p["group"], p["path"]),
              "#" * 78, ""]
        for lbl, txt in p["vistas"]:
            if lbl != "(vista inicial)":
                b += ["", "-" * 60, "--- SECCION: " + lbl, "-" * 60]
            b += [txt, ""]
    b += ["", "=" * 78,
          "CAPTURAS DE PANTALLA (para juzgar el diseno, no el texto)", "=" * 78, "",
          "Cada archivo es la pagina completa renderizada a 1440 px de ancho, de arriba",
          "a abajo, en el tema oscuro por defecto. Sirven para leer margenes, jerarquia",
          "tipografica, densidad y uso de color — lo que el volcado de texto no muestra.",
          "Las paginas mas largas estan cortadas a %d px de alto." % ALTO_MAX, ""]
    for c in capturas:
        b.append("  " + BASE + "/shots/" + c)
    b.append("")
    return "\n".join(b)


CAB = """Volcado de texto del dashboard de marca de MAVRA (%(base)s).

QUE ES ESTO
El sitio es una aplicacion de una sola pagina: el servidor entrega un documento
vacio y el navegador dibuja todo el contenido con JavaScript. Un extractor web
que no ejecuta JavaScript ve la pagina vacia. Este archivo es el texto ya
dibujado de las paginas del sitio, capturado con un navegador real, incluyendo
las pestanas y vistas internas que solo aparecen al hacer clic.

COMO LEERLO
Cada pagina va bajo un bloque "# PAGINA:" con su ruta original. Las vistas
internas van bajo "--- SECCION:". El orden respeta la navegacion del sitio:
Marca, Producto, Estrategia, Influencers.

QUE NO ESTA ACA
- El diseno visual (tipografias en pantalla, margenes, jerarquias, color en uso).
  Para eso estan las capturas listadas al final.
- Tres paginas de cifras financieras, excluidas a proposito de la copia publica.
- El visor de Research (keywords de Amazon) va aparte por tamano:
  %(base)s/llm-research.txt

Generado automaticamente por scripts/volcado/volcar.py en cada despliegue.
"""

CAB_R = """Volcado del visor de Research (MKL) del dashboard de MAVRA.

Son los datos de investigacion de keywords y mercado de Amazon para los tres
productos. Va separado del volcado principal (%(base)s/llm.txt) por tamano: es
el grueso del contenido del sitio y casi nada de esto hace al analisis de marca.
Capturado con un navegador real, con sus vistas internas expandidas.
"""

ROBOTS = """# El sitio no se indexa en buscadores. El volcado para lectura automatica si
# esta permitido: es el motivo por el que existe.
User-agent: *
Allow: /llm.txt
Allow: /llm-research.txt
Allow: /shots/
Disallow: /
"""


async def correr():
    os.makedirs(SHOTS, exist_ok=True)
    for f in os.listdir(SHOTS):
        os.remove(os.path.join(SHOTS, f))

    paginas, pngs = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 1440, "height": 1000})
        pg = await ctx.new_page()
        for path, title, group in PAGES:
            slug = (path.strip("/") or "home").replace("/", "-")
            try:
                vistas, shots = await capturar(pg, path, slug)
            except Exception as e:
                print("FALLO %s: %s" % (path, e), file=sys.stderr)
                return 1
            vistas = [[l, limpiar(t)] for l, t in vistas]
            vistas = [v for v in vistas if v[1]]
            paginas.append({"path": path, "title": title, "group": group,
                            "vistas": vistas})
            pngs += shots
            print("%-20s vistas=%2d chars=%d"
                  % (path, len(vistas), sum(len(v[1]) for v in vistas)))
        await b.close()

    capturas = []
    for slug, png in pngs:
        im = Image.open(png).convert("RGB")
        if im.height > ALTO_MAX:
            im = im.crop((0, 0, im.width, ALTO_MAX))
        jpg = slug + ".jpg"
        im.save(os.path.join(SHOTS, jpg), "JPEG", quality=82, optimize=True)
        os.remove(png)
        capturas.append(jpg)
    capturas.sort()

    principal = [p for p in paginas if p["path"] != "/research"]
    research = [p for p in paginas if p["path"] == "/research"]
    caps_r = [c for c in capturas if c.startswith("research")]
    caps_p = [c for c in capturas if not c.startswith("research")]

    t1 = render(principal,
                "MAVRA — DASHBOARD DE MARCA · VOLCADO DE TEXTO COMPLETO",
                CAB % {"base": BASE}, caps_p)
    t2 = render(research, "MAVRA — RESEARCH (MKL) · VOLCADO DE TEXTO",
                CAB_R % {"base": BASE}, caps_r)
    io.open(os.path.join(PUBLIC, "llm.txt"), "w", encoding="utf-8").write(t1)
    io.open(os.path.join(PUBLIC, "llm-research.txt"), "w", encoding="utf-8").write(t2)
    io.open(os.path.join(PUBLIC, "robots.txt"), "w", encoding="utf-8").write(ROBOTS)

    print("")
    print("llm.txt          %7d chars" % len(t1))
    print("llm-research.txt %7d chars" % len(t2))
    print("capturas         %7d" % len(capturas))
    if len(t1) < 100000 or len(capturas) < 15:
        print("ABORTA: el volcado salio sospechosamente corto", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=BASE)
    BASE = ap.parse_args().base.rstrip("/")
    sys.exit(asyncio.run(correr()))
