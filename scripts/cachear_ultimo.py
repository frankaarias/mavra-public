# -*- coding: utf-8 -*-
"""Mueve la última respuesta de Magnet al caché del derivador.

El MCP de H10 devuelve ~3 MB por nicho, así que el runtime lo escribe a un
archivo en vez de pasarlo por el contexto. Este script lo levanta de ahí y lo
guarda con el nombre del nicho, que es lo que `correr_nichos.py` espera.

Se usa así, una vez por nicho, justo después de la llamada al MCP:
    python cachear_ultimo.py "garden hose"

⚠️ Toma el .txt MÁS RECIENTE del directorio de tool-results. Si se llamó al MCP
dos veces sin cachear en el medio, la primera se pierde — y en cuota eso duele.
Por eso el script IMPRIME la keyword semilla que encontró dentro del archivo:
si no coincide con el nicho que pasaste, algo se cruzó y hay que mirarlo.
"""
import json, io, os, sys, glob

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from correr_nichos import guardar_cache, ruta

TOOLS = (r"C:\Users\FRANCISCO ARIAS\.claude-bots\tecki\projects\D--bots-tecki"
         r"\dc06ca65-34b7-46d1-9c40-893b3720be37\tool-results")


def main():
    if len(sys.argv) < 2:
        sys.exit("uso: python cachear_ultimo.py \"nombre del nicho\" [ruta_del_volcado]")
    nicho = sys.argv[1]

    # ⚠️ La ruta explícita NO es un lujo: cuando esto corre en paralelo (varios
    # nichos a la vez), "el más reciente" es una carrera. Dos llamadas a Magnet
    # sin cachear en el medio y el segundo se queda con el universo del primero
    # — cacheado con el nombre equivocado, que es el peor final posible: no
    # falla, clasifica mal y nadie se entera. Con paralelismo, pasala siempre.
    if len(sys.argv) > 2:
        archivos = [sys.argv[2]]
    else:
        patron = os.path.join(TOOLS, "mcp-claude_ai_Helium10-get_keywords_by_keyword-*.txt")
        archivos = sorted(glob.glob(patron), key=os.path.getmtime, reverse=True)
    if not archivos:
        sys.exit("no hay respuestas de Magnet en tool-results")

    d = json.load(io.open(archivos[0], encoding="utf-8"))
    kws = d["data"]["keywords"]

    # Control de que no se cruzó con otra llamada: la semilla suele ser la
    # keyword más corta o la de más volumen del set.
    top = max(kws, key=lambda k: k.get("search_volume") or 0)
    print(f"archivo: {os.path.basename(archivos[0])}")
    print(f"  {len(kws):,} keywords · la de más volumen: \"{top.get('phrase')}\"")
    if nicho.lower().split()[0] not in (top.get("phrase") or "").lower():
        print(f"  ⚠️ OJO: esperaba algo con \"{nicho}\" y la top no lo tiene. Verificá.")

    guardar_cache(nicho, kws, "magnet")
    print(f"  → {ruta(nicho)}")


if __name__ == "__main__":
    main()
