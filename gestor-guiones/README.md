# Gestor de guiones

App local para terminar, clasificar y planificar los guiones de video. Sin instalaciones: solo Python 3.

## Uso

1. Doble clic en **`Gestor de guiones.bat`**.
2. Se abre el navegador en `http://127.0.0.1:8765/`.
3. La primera vez se importan automáticamente las 200 ideas de `../contenido/ideas-contenido-redes.md`.

Los datos viven en `data/guiones.db` (SQLite). Para hacer un backup, copiá ese archivo.

## Para cerrarlo

El servidor corre en segundo plano. Para detenerlo: Administrador de tareas → `pythonw.exe` → Finalizar tarea. Si lo dejás corriendo no pasa nada: volver a hacer doble clic solo abre el navegador.

## Exportar para edición

El botón **Exportar todos** escribe los guiones listos en `../contenido/guiones/NNN-slug.md`, que es la carpeta desde donde se toman para editar los videos.

## Reimportar ideas

```
python importar_ideas.py
```

Solo agrega las ideas que faltan (por número). No pisa lo que ya editaste.
