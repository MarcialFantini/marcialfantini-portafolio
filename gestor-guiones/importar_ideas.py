"""Importa el banco de ideas (markdown) a la tabla guiones."""
import re
import sqlite3
from pathlib import Path

BASE = Path(__file__).parent
FUENTE = BASE.parent / "contenido" / "ideas-contenido-redes.md"

RE_CAT = re.compile(r"^##\s+\d+\.\s+(.*?)\s*(?:\(\s*\d+\s*[–—-]\s*\d+\s*\))?\s*$")
RE_IDEA = re.compile(r"^###\s+(\d+)\.\s+(.*\S)\s*$")
RE_BULLET = re.compile(r"^-\s+\*\*(.+?):\*\*\s*(.*)$")
CAMPOS = {
    "hook amplio": "hook_amplio",
    "hook filtro": "hook_filtro",
    "contenido": "contenido",
    "cierre amplio": "cierre",
    "cierre": "cierre",
    "cta": "cta",
}


def _pilar(categoria: str) -> str:
    if "Detrás de escena" in categoria or "Casos reales" in categoria:
        return "confianza"
    if "Precios" in categoria or "Mitos" in categoria:
        return "venta"
    return "atraer"


def parsear(texto: str) -> list[dict]:
    ideas: list[dict] = []
    categoria = None
    actual = None
    ultimo = None
    for linea in texto.splitlines():
        s = linea.rstrip()
        if s.startswith("## "):
            m = RE_CAT.match(s)
            categoria = m.group(1).strip() if m else None
            actual = None
            continue
        if categoria is None:
            continue
        m = RE_IDEA.match(s)
        if m:
            actual = {
                "numero": int(m.group(1)), "titulo": m.group(2).strip(),
                "categoria": categoria, "pilar": _pilar(categoria),
                "hook_amplio": "", "hook_filtro": "", "contenido": "",
                "cierre": "", "cta": "",
            }
            ideas.append(actual)
            ultimo = None
            continue
        if actual is None:
            continue
        m = RE_BULLET.match(s)
        if m:
            ultimo = CAMPOS.get(m.group(1).strip().lower())
            if ultimo:
                actual[ultimo] = m.group(2).strip()
        elif ultimo and s.strip() and not s.startswith((">", "---", "#")):
            actual[ultimo] += " " + s.strip()  # línea de continuación
    return ideas


def importar(conn: sqlite3.Connection) -> int:
    ideas = parsear(FUENTE.read_text(encoding="utf-8"))
    antes = conn.total_changes
    conn.executemany(
        "INSERT OR IGNORE INTO guiones (numero, titulo, categoria, pilar, hook_amplio,"
        " hook_filtro, contenido, cierre, cta) VALUES (:numero, :titulo, :categoria,"
        " :pilar, :hook_amplio, :hook_filtro, :contenido, :cierre, :cta)",
        ideas,
    )
    conn.commit()
    return conn.total_changes - antes


if __name__ == "__main__":
    (BASE / "data").mkdir(exist_ok=True)
    con = sqlite3.connect(BASE / "data" / "guiones.db")
    con.executescript((BASE / "schema.sql").read_text(encoding="utf-8"))
    n = importar(con)
    total = con.execute("SELECT COUNT(*) FROM guiones").fetchone()[0]
    print(f"Insertadas: {n} | Total: {total}")
    con.close()
