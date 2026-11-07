// Gestor de guiones - vanilla ES module, sin dependencias.
const $ = (id) => document.getElementById(id);
const ESTADOS_DEF = ['idea', 'borrador', 'listo', 'grabado', 'editado', 'publicado'];
const PILARES_DEF = ['atraer', 'confianza', 'venta'];
const FIELDS = ['titulo', 'estado', 'pilar', 'prioridad', 'categoria', 'fecha_grabacion', 'fecha_publicacion',
  'etiquetas', 'hook_amplio', 'hook_filtro', 'contenido', 'cierre', 'cta', 'guion', 'notas'];

const state = {
  meta: { categorias: [], estados: ESTADOS_DEF, pilares: PILARES_DEF, conteo_estados: {}, total: 0 },
  items: [],
  selId: null,
  cur: null,
  view: 'lista',
};
const dirty = new Set();
let saveTimer = null;
let saveChain = Promise.resolve();
let saving = 0;

// ---------- utilidades ----------
function lsGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, String(v)); } catch { /* sin storage */ } }

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}

function toast(msg, isErr) {
  const t = el('div', 'toast' + (isErr ? ' err' : ''), msg);
  $('toasts').appendChild(t);
  setTimeout(() => t.remove(), isErr ? 5000 : 3000);
}

async function api(method, path, body, opts = {}) {
  const init = { method, headers: {} };
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  if (opts.keepalive) init.keepalive = true;
  let res;
  try {
    res = await fetch(path, init);
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }
  let data = null;
  try { data = await res.json(); } catch { /* sin cuerpo */ }
  if (!res.ok) throw new Error((data && data.error) || `Error ${res.status}`);
  return data;
}

function fmtDate(d) {
  if (!d) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : d;
}

function inField() {
  const a = document.activeElement;
  return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT');
}

// ---------- meta ----------
async function loadMeta() {
  try {
    const m = await api('GET', '/api/meta');
    state.meta = m;
    renderMeta();
  } catch (e) { toast(e.message, true); }
}

function fillSelect(sel, values, keepFirst) {
  const prev = sel.value;
  while (sel.options.length > (keepFirst ? 1 : 0)) sel.remove(keepFirst ? 1 : 0);
  for (const v of values) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = v.charAt(0).toUpperCase() + v.slice(1);
    sel.appendChild(o);
  }
  sel.value = prev;
}

function renderMeta() {
  const m = state.meta;
  fillSelect($('f-estado'), m.estados, true);
  fillSelect($('f-pilar'), m.pilares, true);
  const fc = $('f-categoria');
  const prev = fc.value;
  while (fc.options.length > 1) fc.remove(1);
  for (const c of m.categorias) {
    const o = document.createElement('option');
    o.value = c; o.textContent = c; fc.appendChild(o);
  }
  fc.value = prev;
  // editor selects (only fill once or when empty)
  if ($('f_estado').options.length !== m.estados.length) fillSelect($('f_estado'), m.estados, false);
  if ($('f_pilar').options.length !== m.pilares.length) fillSelect($('f_pilar'), m.pilares, false);
  if (state.cur) {
    $('f_estado').value = state.cur.estado;
    $('f_pilar').value = state.cur.pilar;
  }
  const dl = $('dl-categorias');
  dl.textContent = '';
  for (const c of m.categorias) { const o = document.createElement('option'); o.value = c; dl.appendChild(o); }
  $('total').textContent = `${m.total} guiones`;

  const ul = $('counts');
  ul.textContent = '';
  const active = $('f-estado').value;
  for (const e of m.estados) {
    const li = el('li');
    const b = el('button', active === e ? 'active' : '');
    b.type = 'button';
    b.appendChild(el('span', 'badge e-' + e, e));
    b.appendChild(el('span', 'n', String((m.conteo_estados || {})[e] || 0)));
    b.addEventListener('click', () => {
      $('f-estado').value = active === e ? '' : e;
      onFilterChange();
    });
    li.appendChild(b);
    ul.appendChild(li);
  }
}

// ---------- lista ----------
function listQuery() {
  const p = new URLSearchParams();
  const q = $('q').value.trim();
  if (q) p.set('q', q);
  for (const [id, key] of [['f-estado', 'estado'], ['f-categoria', 'categoria'], ['f-pilar', 'pilar'],
    ['f-prioridad', 'prioridad'], ['f-orden', 'orden']]) {
    const v = $(id).value;
    if (v) p.set(key, v);
  }
  return p.toString();
}

let listSeq = 0;
async function loadList() {
  const seq = ++listSeq;
  try {
    const r = await api('GET', '/api/guiones?' + listQuery());
    if (seq !== listSeq) return;
    state.items = r.items || [];
    renderItems();
  } catch (e) { toast(e.message, true); }
}

function renderItems() {
  if (state.view === 'lista') renderList(); else renderBoard();
}

function makeRow(g) {
  const r = el('div', 'row' + (g.id === state.selId ? ' sel' : ''));
  r.dataset.id = g.id;
  r.appendChild(el('span', 'num', g.numero != null ? '#' + g.numero : '-'));
  r.appendChild(el('span', 't', g.titulo || '(sin título)'));
  r.appendChild(el('span', 'badge e-' + g.estado, g.estado));
  const d = el('span', 'dot p' + g.prioridad);
  d.title = ['', 'Prioridad alta', 'Prioridad media', 'Prioridad baja'][g.prioridad] || '';
  r.appendChild(d);
  r.appendChild(el('span', 'date', fmtDate(g.fecha_publicacion)));
  r.addEventListener('click', () => selectId(g.id));
  return r;
}

function renderList() {
  const box = $('list');
  box.textContent = '';
  if (!state.items.length) { box.appendChild(el('div', 'nores', 'Sin resultados.')); return; }
  const frag = document.createDocumentFragment();
  for (const g of state.items) frag.appendChild(makeRow(g));
  box.appendChild(frag);
}

function makeCard(g) {
  const c = el('div', 'card' + (g.id === state.selId ? ' sel' : ''));
  c.draggable = true;
  c.dataset.id = g.id;
  const meta = el('div', 'meta');
  meta.appendChild(el('span', 'dot p' + g.prioridad));
  meta.appendChild(el('span', null, g.numero != null ? '#' + g.numero : '-'));
  if (g.fecha_publicacion) meta.appendChild(el('span', null, fmtDate(g.fecha_publicacion)));
  c.appendChild(meta);
  c.appendChild(el('div', null, g.titulo || '(sin título)'));
  c.addEventListener('click', () => selectId(g.id));
  c.addEventListener('dragstart', (ev) => {
    ev.dataTransfer.setData('text/plain', String(g.id));
    ev.dataTransfer.effectAllowed = 'move';
    c.classList.add('dragging');
  });
  c.addEventListener('dragend', () => c.classList.remove('dragging'));
  return c;
}

function renderBoard() {
  const box = $('board');
  box.textContent = '';
  for (const e of state.meta.estados) {
    const col = el('div', 'col');
    col.dataset.estado = e;
    const items = state.items.filter((g) => g.estado === e);
    const h = el('h3', 'e-' + e);
    h.appendChild(el('span', null, e));
    h.appendChild(el('span', 'muted', String(items.length)));
    col.appendChild(h);
    const cards = el('div', 'cards');
    for (const g of items) cards.appendChild(makeCard(g));
    col.appendChild(cards);
    col.addEventListener('dragover', (ev) => { ev.preventDefault(); ev.dataTransfer.dropEffect = 'move'; col.classList.add('over'); });
    col.addEventListener('dragleave', (ev) => { if (!col.contains(ev.relatedTarget)) col.classList.remove('over'); });
    col.addEventListener('drop', (ev) => {
      ev.preventDefault();
      col.classList.remove('over');
      const id = Number(ev.dataTransfer.getData('text/plain'));
      if (id) moveToEstado(id, e);
    });
    box.appendChild(col);
  }
}

function markSelection() {
  for (const n of document.querySelectorAll('.row.sel, .card.sel')) n.classList.remove('sel');
  const n = document.querySelector(`.row[data-id="${state.selId}"], .card[data-id="${state.selId}"]`);
  if (n) { n.classList.add('sel'); n.scrollIntoView({ block: 'nearest' }); }
}

function replaceItem(g) {
  const i = state.items.findIndex((x) => x.id === g.id);
  if (i >= 0) state.items[i] = g;
  return i >= 0;
}

function setView(v) {
  state.view = v;
  lsSet('gg.view', v);
  $('btn-lista').classList.toggle('active', v === 'lista');
  $('btn-tablero').classList.toggle('active', v === 'tablero');
  $('list').hidden = v !== 'lista';
  $('board').hidden = v !== 'tablero';
  renderItems();
}

async function moveToEstado(id, estado) {
  const g = state.items.find((x) => x.id === id);
  if (!g || g.estado === estado) return;
  if (state.cur && state.cur.id === id) await flush();
  const prev = g.estado;
  g.estado = estado;
  renderItems();
  try {
    const upd = await api('PUT', `/api/guiones/${id}`, { estado });
    replaceItem(upd);
    if (state.cur && state.cur.id === id) {
      state.cur = upd;
      $('f_estado').value = upd.estado;
      $('ed-meta').textContent = metaText(upd);
    }
    renderItems();
    loadMeta();
  } catch (e) {
    g.estado = prev;
    renderItems();
    toast(e.message, true);
  }
}

// ---------- editor ----------
function metaText(g) {
  return `Creado ${g.creado || '-'} · Actualizado ${g.actualizado || '-'}`;
}

function autoGrow(t) {
  t.style.height = 'auto';
  t.style.height = t.scrollHeight + 2 + 'px';
}

function updateStats() {
  const txt = $('f_guion').value.trim();
  const words = txt ? txt.split(/\s+/).length : 0;
  const secs = Math.round(words / 2.5);
  const dur = secs >= 60 ? `${Math.floor(secs / 60)} min ${secs % 60} s` : `${secs} s`;
  $('stats').textContent = `${words} palabras · ≈ ${dur}`;
}

function fillEditor(g) {
  state.cur = g;
  dirty.clear();
  $('empty').hidden = true;
  $('editor').hidden = false;
  $('ed-num').textContent = g.numero != null ? '#' + g.numero : 'Sin número';
  for (const f of FIELDS) {
    const inp = document.querySelector(`[data-field="${f}"]`);
    const v = g[f];
    inp.value = v === null || v === undefined ? '' : String(v);
  }
  const plats = (g.plataformas || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  for (const cb of document.querySelectorAll('[data-plat]')) cb.checked = plats.includes(cb.dataset.plat);
  $('btn-md').href = `/api/guiones/${g.id}/markdown`;
  $('ed-meta').textContent = metaText(g);
  cancelDelete();
  setInd('');
  for (const t of document.querySelectorAll('#editor textarea')) autoGrow(t);
  updateStats();
}

function closeEditor() {
  state.cur = null;
  state.selId = null;
  dirty.clear();
  $('editor').hidden = true;
  $('empty').hidden = false;
}

async function selectId(id) {
  if (state.cur && state.cur.id === id) { markSelection(); return; }
  await flush();
  state.selId = id;
  markSelection();
  let g = state.items.find((x) => x.id === id);
  try {
    g = await api('GET', `/api/guiones/${id}`);
  } catch (e) {
    toast(e.message, true);
    if (!g) { state.selId = null; return; }
  }
  if (state.selId !== id) return; // el usuario cambió mientras cargaba
  lsSet('gg.sel', id);
  fillEditor(g);
  markSelection();
}

function readField(f) {
  if (f === 'plataformas') {
    return [...document.querySelectorAll('[data-plat]')].filter((c) => c.checked).map((c) => c.dataset.plat).join(',');
  }
  const v = document.querySelector(`[data-field="${f}"]`).value;
  if (f === 'prioridad') return Number(v);
  if (f === 'fecha_grabacion' || f === 'fecha_publicacion') return v || null;
  return v;
}

function setInd(txt, err) {
  const i = $('save-ind');
  i.textContent = txt;
  i.classList.toggle('err', !!err);
}

function markDirty(f) {
  if (!state.cur) return;
  dirty.add(f);
  setInd('Guardando…');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 600);
}

function flush() {
  clearTimeout(saveTimer);
  saveTimer = null;
  if (state.cur && dirty.size) {
    const id = state.cur.id;
    const body = {};
    for (const f of dirty) body[f] = readField(f);
    dirty.clear();
    saveChain = saveChain.then(() => doSave(id, body));
  }
  return saveChain;
}

async function doSave(id, body) {
  saving++;
  try {
    const upd = await api('PUT', `/api/guiones/${id}`, body);
    replaceItem(upd);
    if (state.cur && state.cur.id === id) {
      state.cur = { ...state.cur, ...upd, ...Object.fromEntries([...dirty].map((f) => [f, state.cur[f]])) };
      $('ed-meta').textContent = metaText(upd);
      if (!dirty.size) setInd('Guardado');
      $('ed-num').textContent = upd.numero != null ? '#' + upd.numero : 'Sin número';
    }
    renderItems();
    if ('estado' in body || 'categoria' in body) loadMeta();
  } catch (e) {
    if (state.cur && state.cur.id === id) {
      for (const f of Object.keys(body)) if (!dirty.has(f)) dirty.add(f);
      setInd('Error al guardar', true);
    }
    toast('No se guardó: ' + e.message, true);
  } finally {
    saving--;
  }
}

function onEditorInput(ev) {
  const t = ev.target;
  if (t.matches('textarea')) autoGrow(t);
  if (t.id === 'f_guion') updateStats();
  if (t.dataset.plat) markDirty('plataformas');
  else if (t.dataset.field) markDirty(t.dataset.field);
}

// ---------- acciones ----------
async function nuevo() {
  await flush();
  try {
    const g = await api('POST', '/api/guiones', { titulo: 'Nuevo guion' });
    state.items.unshift(g);
    state.selId = g.id;
    lsSet('gg.sel', g.id);
    fillEditor(g);
    renderItems();
    markSelection();
    loadMeta();
    const t = $('f_titulo');
    t.focus(); t.select();
  } catch (e) { toast(e.message, true); }
}

async function duplicar() {
  if (!state.cur) return;
  await flush();
  const src = state.cur;
  const copy = { ...src };
  for (const k of ['id', 'numero', 'creado', 'actualizado']) delete copy[k];
  copy.titulo = (src.titulo || '') + ' (copia)';
  try {
    const g = await api('POST', '/api/guiones', copy);
    const i = state.items.findIndex((x) => x.id === src.id);
    state.items.splice(i >= 0 ? i + 1 : 0, 0, g);
    state.selId = g.id;
    lsSet('gg.sel', g.id);
    fillEditor(g);
    renderItems();
    markSelection();
    loadMeta();
    toast('Guion duplicado');
  } catch (e) { toast(e.message, true); }
}

let delTimer = null;
function askDelete() {
  $('btn-del').hidden = true;
  $('del-confirm').hidden = false;
  clearTimeout(delTimer);
  delTimer = setTimeout(cancelDelete, 6000);
}
function cancelDelete() {
  clearTimeout(delTimer);
  $('btn-del').hidden = false;
  $('del-confirm').hidden = true;
}
async function eliminar() {
  if (!state.cur) return;
  const id = state.cur.id;
  clearTimeout(saveTimer);
  dirty.clear();
  await saveChain;
  try {
    await api('DELETE', `/api/guiones/${id}`);
    const i = state.items.findIndex((x) => x.id === id);
    if (i >= 0) state.items.splice(i, 1);
    const next = state.items[Math.min(i, state.items.length - 1)];
    closeEditor();
    renderItems();
    loadMeta();
    toast('Guion eliminado');
    if (next) selectId(next.id);
  } catch (e) { toast(e.message, true); cancelDelete(); }
}

async function exportarTodos() {
  await flush();
  try {
    const r = await api('POST', '/api/exportar', {});
    toast(`${r.archivos} guiones exportados${r.carpeta ? ' a ' + r.carpeta : ''}`);
  } catch (e) { toast(e.message, true); }
}

// ---------- filtros / búsqueda ----------
let searchTimer = null;
function onFilterChange() {
  lsSet('gg.filters', JSON.stringify({
    estado: $('f-estado').value, categoria: $('f-categoria').value, pilar: $('f-pilar').value,
    prioridad: $('f-prioridad').value, orden: $('f-orden').value,
  }));
  renderMeta();
  loadList();
}

function limpiarFiltros() {
  $('q').value = '';
  for (const id of ['f-estado', 'f-categoria', 'f-pilar', 'f-prioridad']) $(id).value = '';
  $('f-orden').value = 'numero';
  onFilterChange();
}

function moveSelection(delta) {
  if (!state.items.length) return;
  const i = state.items.findIndex((x) => x.id === state.selId);
  const n = i < 0 ? (delta > 0 ? 0 : state.items.length - 1) : Math.max(0, Math.min(state.items.length - 1, i + delta));
  selectId(state.items[n].id);
}

function onKey(ev) {
  const mod = ev.ctrlKey || ev.metaKey;
  if (mod && ev.key.toLowerCase() === 'n') { ev.preventDefault(); nuevo(); return; }
  if (mod && ev.key.toLowerCase() === 'k') { ev.preventDefault(); $('q').focus(); $('q').select(); return; }
  if (ev.key === 'Escape') {
    if (!$('del-confirm').hidden) { cancelDelete(); return; }
    if (document.activeElement === $('q') || $('q').value) {
      $('q').value = '';
      $('q').blur();
      loadList();
    }
    return;
  }
  if (inField()) return;
  if (ev.key === '/') { ev.preventDefault(); $('q').focus(); return; }
  if (ev.key === 'ArrowDown') { ev.preventDefault(); moveSelection(1); }
  else if (ev.key === 'ArrowUp') { ev.preventDefault(); moveSelection(-1); }
}

// ---------- init ----------
async function init() {
  const ed = $('editor');
  ed.addEventListener('input', onEditorInput);
  ed.addEventListener('change', onEditorInput);
  ed.addEventListener('focusout', () => { if (dirty.size) flush(); });
  $('btn-dup').addEventListener('click', duplicar);
  $('btn-del').addEventListener('click', askDelete);
  $('btn-del-no').addEventListener('click', cancelDelete);
  $('btn-del-yes').addEventListener('click', eliminar);
  $('btn-nuevo').addEventListener('click', nuevo);
  $('btn-exportar-todos').addEventListener('click', exportarTodos);
  $('btn-lista').addEventListener('click', () => setView('lista'));
  $('btn-tablero').addEventListener('click', () => setView('tablero'));
  $('btn-limpiar').addEventListener('click', limpiarFiltros);
  $('btn-md').addEventListener('click', async (ev) => {
    if (dirty.size) { ev.preventDefault(); await flush(); $('btn-md').click(); }
  });
  $('q').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(loadList, 250); });
  for (const id of ['f-estado', 'f-categoria', 'f-pilar', 'f-prioridad', 'f-orden']) $(id).addEventListener('change', onFilterChange);
  document.addEventListener('keydown', onKey);
  window.addEventListener('beforeunload', () => {
    if (state.cur && dirty.size) {
      const body = {};
      for (const f of dirty) body[f] = readField(f);
      api('PUT', `/api/guiones/${state.cur.id}`, body, { keepalive: true }).catch(() => {});
    }
  });

  await loadMeta();
  const savedFilters = lsGet('gg.filters');
  if (savedFilters) {
    try {
      const f = JSON.parse(savedFilters);
      $('f-estado').value = f.estado || '';
      $('f-categoria').value = f.categoria || '';
      $('f-pilar').value = f.pilar || '';
      $('f-prioridad').value = f.prioridad || '';
      $('f-orden').value = f.orden || 'numero';
      renderMeta();
    } catch { /* filtros corruptos */ }
  }
  setView(lsGet('gg.view') === 'tablero' ? 'tablero' : 'lista');
  await loadList();
  const sel = Number(lsGet('gg.sel'));
  if (sel) selectId(sel);
}

init();
