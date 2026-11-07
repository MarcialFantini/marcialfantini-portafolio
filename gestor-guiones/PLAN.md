# Gestor de guiones — plan y contrato

App local para terminar, clasificar y planificar guiones de video. Doble clic → se abre en el navegador.

## Stack

- Python 3.12 **stdlib only** (no pip installs): `http.server.ThreadingHTTPServer`, `sqlite3`, `json`, `webbrowser`.
- Frontend: vanilla HTML + CSS + JS (ES modules allowed, no build step, no CDN — must work offline).
- DB file: `gestor-guiones/data/guiones.db` (created on first run from `schema.sql`).
- Port: `8765` on `127.0.0.1`. If the port is taken by an already running instance, just open the browser and exit.

## File ownership (one owner per file — do not touch others' files)

| File | Owner |
|---|---|
| `schema.sql`, `PLAN.md`, `Gestor de guiones.bat`, `README.md` | orchestrator |
| `server.py` | agent BACKEND |
| `static/index.html`, `static/styles.css`, `static/app.js` | agent FRONTEND |
| `importar_ideas.py` | agent IMPORTER |

## Runtime

- `python server.py` → ensures `data/` exists, applies `schema.sql` (`executescript`, idempotent), imports ideas automatically on first run if the table is empty by calling `importar_ideas.importar(conn)` (wrap in try/except ImportError so the server still works without it), starts server, opens `http://127.0.0.1:8765/` in the browser.
- Static files served from `static/` (`/` → `static/index.html`). Correct MIME types for .html/.css/.js/.svg.
- `updated` timestamp: backend sets `actualizado = datetime('now','localtime')` on every PUT.

## REST API (JSON, UTF-8)

Guion object = every column of `guiones` table, same names. `prioridad` integer, dates `"YYYY-MM-DD"` or `null`.

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/guiones` | List. Query params (all optional): `q` (search in titulo, hook_amplio, hook_filtro, contenido, guion, notas, etiquetas — case-insensitive LIKE), `estado`, `categoria`, `pilar`, `prioridad`, `orden` one of `numero` (default), `prioridad`, `fecha_publicacion`, `actualizado`. Returns `{"items": [guion, ...]}`. |
| GET | `/api/guiones/{id}` | One guion, 404 `{"error": "..."}` if missing. |
| POST | `/api/guiones` | Create. Body: partial guion, `titulo` required (400 if missing). Returns created guion, 201. |
| PUT | `/api/guiones/{id}` | Partial update: only known columns are applied (ignore `id`, `creado`, unknown keys). Validates `estado`, `pilar`, `prioridad` (400 on invalid). Returns updated guion. |
| DELETE | `/api/guiones/{id}` | Delete. Returns `{"ok": true}`. |
| GET | `/api/meta` | `{"categorias": [distinct non-empty, sorted], "estados": ["idea","borrador","listo","grabado","editado","publicado"], "pilares": ["atraer","confianza","venta"], "conteo_estados": {"idea": n, ...}, "total": n}` |
| GET | `/api/guiones/{id}/markdown` | `text/markdown; charset=utf-8` export of one guion (title, metadata list, each section as `##` heading). Header `Content-Disposition: attachment; filename="NNN-slug.md"`. |
| POST | `/api/exportar` | Writes every guion with estado in (`listo`,`grabado`,`editado`,`publicado`) or that has non-empty `guion` to `../contenido/guiones/NNN-slug.md` (same markdown as above; NNN = numero zero-padded to 3, or `id` prefixed with `x` when numero is null). Returns `{"ok": true, "archivos": n, "carpeta": "<abs path>"}`. |

Errors: JSON `{"error": "message"}` with proper status. Server must never crash on bad input.

## Importer (`importar_ideas.py`)

- Source: `../contenido/ideas-contenido-redes.md` (path relative to the script file).
- Expose `importar(conn) -> int` (inserted count) and a `__main__` that opens `data/guiones.db`, applies `schema.sql`, and imports.
- Parse: `## N. Category name (a–b)` headings → categoria (strip number prefix and the range in parentheses). `### N. Title` → numero + titulo. Bullets `- **Hook amplio:**`, `- **Hook filtro:**`, `- **Contenido:**`, `- **Cierre amplio:**` (→ `cierre`), `- **CTA:**`.
- Ignore everything before the first `## 1.` and the "Fuentes" section.
- Pilar mapping by category: Detrás de escena + Casos reales → `confianza`; Precios + Mitos → `venta`; everything else → `atraer`.
- Idempotent: `INSERT OR IGNORE` on unique `numero`. Must end with exactly 200 rows on a fresh DB.

## Frontend UX (keep it simple and fast)

- Layout: left sidebar (search box, filters estado / categoría / pilar / prioridad, counts per estado), middle list, right editor. Mobile not required; min width 1100px is fine.
- List rows: `#numero`, titulo, estado badge, prioridad dot (1 red, 2 amber, 3 gray), fecha_publicacion. Click opens in editor. Keyboard: ↑/↓ moves selection.
- Editor: titulo input; selects estado, pilar, prioridad; inputs categoria (datalist from meta), fecha_grabacion, fecha_publicacion (type=date), plataformas (checkboxes tiktok/instagram/youtube/linkedin → comma string), etiquetas (text). Textareas: hook_amplio, hook_filtro, contenido, cierre, cta, guion (big, auto-grow), notas.
- **Autosave**: debounce 600 ms on any change → PUT; show "Guardando…" / "Guardado" indicator. Flush on blur and before switching guion.
- Live stats on `guion` textarea: word count and estimated duration (words / 2.5 per second → "≈ 42 s").
- Buttons: Nuevo (Ctrl+N), Duplicar, Eliminar (custom inline confirm, NO `window.confirm`), Exportar .md (downloads `/api/guiones/{id}/markdown`), Exportar todos a carpeta (POST `/api/exportar`, show toast with count).
- Ctrl+K or `/` focuses search. Esc clears search.
- Optional second view "Tablero": columns per estado, cards draggable between columns (drag updates estado via PUT). Toggle List/Tablero in top bar.
- Visual: clean, dark-friendly (`prefers-color-scheme`), system font stack, no external fonts. Spanish UI copy (neutral, voseo OK: "Buscá…").
- Remember last selected id and view in `localStorage` (wrapped in try/catch).

## Definition of done

1. Double-click `Gestor de guiones.bat` → browser opens with 200 ideas listed.
2. Edit a field, reload page → value persisted.
3. Filters, search, create, duplicate, delete, export work.
