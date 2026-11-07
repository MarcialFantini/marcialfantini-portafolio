#!/usr/bin/env python3
"""Gestor de guiones - local server (stdlib only)."""
import json
import mimetypes
import re
import sqlite3
import sys
import threading
import unicodedata
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

BASE = Path(__file__).resolve().parent
DATA_DIR = BASE / "data"
DB_PATH = DATA_DIR / "guiones.db"
SCHEMA = BASE / "schema.sql"
STATIC = BASE / "static"
EXPORT_DIR = (BASE / ".." / "contenido" / "guiones").resolve()
HOST, PORT = "127.0.0.1", 8765
URL = f"http://{HOST}:{PORT}/"

ESTADOS = ["idea", "borrador", "listo", "grabado", "editado", "publicado"]
PILARES = ["atraer", "confianza", "venta"]
TEXT_COLS = ["titulo", "categoria", "hook_amplio", "hook_filtro", "contenido",
             "cierre", "cta", "guion", "notas", "plataformas", "etiquetas"]
DATE_COLS = ["fecha_grabacion", "fecha_publicacion"]
WRITABLE = TEXT_COLS + DATE_COLS + ["numero", "pilar", "estado", "prioridad"]
ORDENES = {
    "numero": "numero IS NULL, numero ASC, id ASC",
    "prioridad": "prioridad ASC, numero IS NULL, numero ASC, id ASC",
    "fecha_publicacion": "fecha_publicacion IS NULL, fecha_publicacion ASC, numero ASC, id ASC",
    "actualizado": "actualizado DESC, id DESC",
}
SEARCH_COLS = ["titulo", "hook_amplio", "hook_filtro", "contenido", "guion", "notas", "etiquetas"]
EXPORT_ESTADOS = ("listo", "grabado", "editado", "publicado")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class ApiError(Exception):
    def __init__(self, status, msg):
        super().__init__(msg)
        self.status = status
        self.msg = msg


def connect():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    DATA_DIR.mkdir(exist_ok=True)
    conn = connect()
    try:
        conn.executescript(SCHEMA.read_text(encoding="utf-8"))
        conn.commit()
        if conn.execute("SELECT COUNT(*) FROM guiones").fetchone()[0] == 0:
            try:
                import importar_ideas
                n = importar_ideas.importar(conn)
                conn.commit()
                print(f"Importadas {n} ideas.")
            except ImportError:
                print("Aviso: importar_ideas.py no encontrado; base vacia.")
            except Exception as e:  # noqa: BLE001
                print(f"Aviso: fallo la importacion inicial: {e}")
    finally:
        conn.close()


def slugify(text):
    t = unicodedata.normalize("NFKD", text or "")
    t = "".join(c for c in t if not unicodedata.combining(c)).lower()
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t[:60].strip("-") or "guion"


def file_stem(g):
    if g["numero"] is not None:
        prefix = f"{int(g['numero']):03d}"
    else:
        prefix = f"x{g['id']}"
    return f"{prefix}-{slugify(g['titulo'])}"


def to_markdown(g):
    out = [f"# {g['titulo']}", ""]
    meta = [
        ("Numero", g["numero"]), ("Categoria", g["categoria"]), ("Pilar", g["pilar"]),
        ("Estado", g["estado"]), ("Prioridad", g["prioridad"]),
        ("Fecha de grabacion", g["fecha_grabacion"]),
        ("Fecha de publicacion", g["fecha_publicacion"]),
        ("Plataformas", g["plataformas"]), ("Etiquetas", g["etiquetas"]),
    ]
    for k, v in meta:
        if v not in (None, ""):
            out.append(f"- **{k}:** {v}")
    out.append("")
    sections = [("Hook amplio", "hook_amplio"), ("Hook filtro", "hook_filtro"),
                ("Contenido", "contenido"), ("Cierre", "cierre"), ("CTA", "cta"),
                ("Guion", "guion"), ("Notas", "notas")]
    for title, col in sections:
        if (g[col] or "").strip():
            out += [f"## {title}", "", g[col].strip(), ""]
    return "\n".join(out).rstrip() + "\n"


def row(r):
    return dict(r) if r is not None else None


def get_one(conn, gid):
    r = conn.execute("SELECT * FROM guiones WHERE id = ?", (gid,)).fetchone()
    if r is None:
        raise ApiError(404, "Guion no encontrado")
    return r


def clean(body, creating):
    """Validate and normalise body into dict of whitelisted columns."""
    if not isinstance(body, dict):
        raise ApiError(400, "El cuerpo debe ser un objeto JSON")
    data = {}
    for k in WRITABLE:
        if k not in body:
            continue
        v = body[k]
        if k in TEXT_COLS:
            if v is None:
                v = ""
            if not isinstance(v, str):
                raise ApiError(400, f"'{k}' debe ser texto")
            if k == "titulo" and not v.strip():
                raise ApiError(400, "'titulo' es obligatorio")
        elif k in DATE_COLS:
            if v in (None, ""):
                v = None
            elif not isinstance(v, str) or not DATE_RE.match(v):
                raise ApiError(400, f"'{k}' debe ser YYYY-MM-DD")
        elif k == "numero":
            if v in (None, ""):
                v = None
            elif isinstance(v, bool) or not isinstance(v, int):
                raise ApiError(400, "'numero' debe ser entero")
        elif k == "estado":
            if v not in ESTADOS:
                raise ApiError(400, "'estado' invalido")
        elif k == "pilar":
            if v not in PILARES:
                raise ApiError(400, "'pilar' invalido")
        elif k == "prioridad":
            if isinstance(v, bool) or v not in (1, 2, 3):
                raise ApiError(400, "'prioridad' debe ser 1, 2 o 3")
        data[k] = v
    if creating and not str(data.get("titulo", "")).strip():
        raise ApiError(400, "'titulo' es obligatorio")
    return data


def list_guiones(conn, qs):
    where, params = [], []
    q = (qs.get("q") or [""])[0].strip()
    if q:
        esc = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        where.append("(" + " OR ".join(f"{c} LIKE ? ESCAPE '\\'" for c in SEARCH_COLS) + ")")
        params += [f"%{esc}%"] * len(SEARCH_COLS)
    for col in ("estado", "categoria", "pilar"):
        v = (qs.get(col) or [""])[0]
        if v:
            where.append(f"{col} = ?")
            params.append(v)
    p = (qs.get("prioridad") or [""])[0]
    if p:
        try:
            params.append(int(p))
        except ValueError:
            raise ApiError(400, "'prioridad' invalida")
        where.append("prioridad = ?")
    orden = (qs.get("orden") or ["numero"])[0] or "numero"
    order_sql = ORDENES.get(orden)
    if order_sql is None:
        raise ApiError(400, "'orden' invalido")
    sql = "SELECT * FROM guiones"
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY " + order_sql
    return {"items": [dict(r) for r in conn.execute(sql, params).fetchall()]}


def meta(conn):
    cats = [r[0] for r in conn.execute(
        "SELECT DISTINCT categoria FROM guiones WHERE categoria <> '' ORDER BY categoria COLLATE NOCASE")]
    conteo = {e: 0 for e in ESTADOS}
    for r in conn.execute("SELECT estado, COUNT(*) FROM guiones GROUP BY estado"):
        conteo[r[0]] = r[1]
    return {"categorias": cats, "estados": ESTADOS, "pilares": PILARES,
            "conteo_estados": conteo, "total": sum(conteo.values())}


def exportar(conn):
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    marks = ",".join("?" * len(EXPORT_ESTADOS))
    rows = conn.execute(
        f"SELECT * FROM guiones WHERE estado IN ({marks}) OR TRIM(guion) <> '' ORDER BY id",
        EXPORT_ESTADOS).fetchall()
    for r in rows:
        (EXPORT_DIR / f"{file_stem(r)}.md").write_text(to_markdown(r), encoding="utf-8")
    return {"ok": True, "archivos": len(rows), "carpeta": str(EXPORT_DIR)}


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "Gestor/1.0"

    def log_message(self, fmt, *args):  # quiet
        pass

    # ---- helpers
    def send_bytes(self, status, body, ctype, extra=None):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def send_json(self, status, obj):
        self.send_bytes(status, json.dumps(obj, ensure_ascii=False).encode("utf-8"),
                        "application/json; charset=utf-8", {"Cache-Control": "no-store"})

    def read_body(self):
        try:
            n = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            raise ApiError(400, "Content-Length invalido")
        if n > 10_000_000:
            raise ApiError(400, "Cuerpo demasiado grande")
        raw = self.rfile.read(n) if n else b""
        if not raw:
            return {}
        try:
            return json.loads(raw.decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            raise ApiError(400, "JSON invalido")

    def dispatch(self, method):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if path.startswith("/api/"):
            try:
                self.api(method, path.rstrip("/"), parse_qs(parsed.query))
            except ApiError as e:
                self.send_json(e.status, {"error": e.msg})
            except sqlite3.IntegrityError as e:
                self.send_json(400, {"error": f"Datos invalidos: {e}"})
            except Exception as e:  # noqa: BLE001
                self.send_json(500, {"error": f"Error interno: {e}"})
        elif method in ("GET", "HEAD"):
            self.static(path)
        else:
            self.send_json(405, {"error": "Metodo no permitido"})

    do_GET = lambda self: self.dispatch("GET")  # noqa: E731
    do_HEAD = lambda self: self.dispatch("HEAD")  # noqa: E731
    do_POST = lambda self: self.dispatch("POST")  # noqa: E731
    do_PUT = lambda self: self.dispatch("PUT")  # noqa: E731
    do_DELETE = lambda self: self.dispatch("DELETE")  # noqa: E731

    # ---- static
    def static(self, path):
        rel = "index.html" if path in ("", "/") else path.lstrip("/")
        try:
            target = (STATIC / rel).resolve()
            target.relative_to(STATIC.resolve())
        except (ValueError, OSError):
            return self.send_json(403, {"error": "Prohibido"})
        if not target.is_file():
            return self.send_json(404, {"error": "No encontrado"})
        ctype = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json", "image/svg+xml"):
            ctype += "; charset=utf-8"
        if target.suffix == ".js":
            ctype = "text/javascript; charset=utf-8"
        self.send_bytes(200, target.read_bytes(), ctype, {"Cache-Control": "no-cache"})

    # ---- api
    def api(self, method, path, qs):
        conn = connect()
        try:
            if path == "/api/meta" and method == "GET":
                return self.send_json(200, meta(conn))
            if path == "/api/exportar" and method == "POST":
                return self.send_json(200, exportar(conn))
            if path == "/api/guiones":
                if method == "GET":
                    return self.send_json(200, list_guiones(conn, qs))
                if method == "POST":
                    data = clean(self.read_body(), True)
                    cols = list(data)
                    cur = conn.execute(
                        f"INSERT INTO guiones ({','.join(cols)}) VALUES ({','.join('?' * len(cols))})",
                        [data[c] for c in cols])
                    conn.commit()
                    return self.send_json(201, row(get_one(conn, cur.lastrowid)))
                raise ApiError(405, "Metodo no permitido")
            m = re.fullmatch(r"/api/guiones/(\d+)(/markdown)?", path)
            if not m:
                raise ApiError(404, "Ruta no encontrada")
            gid = int(m.group(1))
            if m.group(2):
                if method != "GET":
                    raise ApiError(405, "Metodo no permitido")
                g = get_one(conn, gid)
                fname = file_stem(g) + ".md"
                return self.send_bytes(200, to_markdown(g).encode("utf-8"),
                                       "text/markdown; charset=utf-8",
                                       {"Content-Disposition": f'attachment; filename="{fname}"',
                                        "Cache-Control": "no-store"})
            if method == "GET":
                return self.send_json(200, row(get_one(conn, gid)))
            if method == "PUT":
                get_one(conn, gid)
                data = clean(self.read_body(), False)
                sets = [f"{c} = ?" for c in data] + ["actualizado = datetime('now','localtime')"]
                conn.execute(f"UPDATE guiones SET {', '.join(sets)} WHERE id = ?",
                             [*data.values(), gid])
                conn.commit()
                return self.send_json(200, row(get_one(conn, gid)))
            if method == "DELETE":
                get_one(conn, gid)
                conn.execute("DELETE FROM guiones WHERE id = ?", (gid,))
                conn.commit()
                return self.send_json(200, {"ok": True})
            raise ApiError(405, "Metodo no permitido")
        finally:
            conn.close()


def main():
    no_browser = "--no-browser" in sys.argv
    init_db()
    try:
        httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    except OSError:
        print(f"Puerto {PORT} ocupado: ya hay una instancia corriendo.")
        if not no_browser:
            webbrowser.open(URL)
        sys.exit(0)
    print(f"Gestor de guiones en {URL}  (Ctrl+C para salir)")
    if not no_browser:
        threading.Timer(0.5, lambda: webbrowser.open(URL)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
