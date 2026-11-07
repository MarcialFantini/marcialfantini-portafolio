-- Script manager schema. Single source of truth: every component must match this file.
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS guiones (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  numero            INTEGER,                         -- idea number from the ideas bank (1-200), nullable
  titulo            TEXT    NOT NULL,
  categoria         TEXT    NOT NULL DEFAULT '',     -- e.g. "Planillas y caos operativo"
  pilar             TEXT    NOT NULL DEFAULT 'atraer'
                    CHECK (pilar IN ('atraer','confianza','venta')),
  hook_amplio       TEXT    NOT NULL DEFAULT '',
  hook_filtro       TEXT    NOT NULL DEFAULT '',
  contenido         TEXT    NOT NULL DEFAULT '',
  cierre            TEXT    NOT NULL DEFAULT '',
  cta               TEXT    NOT NULL DEFAULT '',
  guion             TEXT    NOT NULL DEFAULT '',     -- final full script (free text / markdown)
  notas             TEXT    NOT NULL DEFAULT '',     -- recording notes, screens/b-roll needed
  estado            TEXT    NOT NULL DEFAULT 'idea'
                    CHECK (estado IN ('idea','borrador','listo','grabado','editado','publicado')),
  prioridad         INTEGER NOT NULL DEFAULT 2 CHECK (prioridad IN (1,2,3)),  -- 1 alta, 2 media, 3 baja
  fecha_grabacion   TEXT,                            -- ISO date YYYY-MM-DD or NULL
  fecha_publicacion TEXT,                            -- ISO date YYYY-MM-DD or NULL
  plataformas       TEXT    NOT NULL DEFAULT '',     -- comma separated: tiktok,instagram,youtube,linkedin
  etiquetas         TEXT    NOT NULL DEFAULT '',     -- comma separated free tags
  creado            TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  actualizado       TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_guiones_numero ON guiones(numero) WHERE numero IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guiones_estado ON guiones(estado);
CREATE INDEX IF NOT EXISTS idx_guiones_pub ON guiones(fecha_publicacion);
