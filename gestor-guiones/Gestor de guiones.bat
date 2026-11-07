@echo off
rem Double-click launcher: starts the local server without a console window and opens the browser.
cd /d "%~dp0"
where pythonw >nul 2>nul
if %errorlevel%==0 (
  start "" pythonw "%~dp0server.py"
) else (
  start "Gestor de guiones" python "%~dp0server.py"
)
