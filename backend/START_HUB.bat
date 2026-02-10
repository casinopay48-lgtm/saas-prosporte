@echo off
REM ===================================================
REM  ProSporte Hub - Script de Inicialização (Windows)
REM ===================================================

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         🚀 HUB PROSPORTE - Inicialização                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js não está instalado ou não está no PATH
    echo.
    echo Baixe em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detectado:
node --version
echo.

REM Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ ERRO: package.json não encontrado!
    echo.
    echo Execute este script no diretório backend:
    echo cd c:\Dev\saasportesMobile\backend
    echo.
    pause
    exit /b 1
)

echo ✅ Diretório correto: %cd%
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    call npm install
    if errorlevel 1 (
        echo ❌ ERRO ao instalar dependências!
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas
    echo.
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Escolha uma opção:                                       ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║  1) Servidor Principal (server.js)                       ║
echo ║  2) Hub Multi-Banca NOVO (hub-server.js)                 ║
echo ║  3) Ambos em paralelo (experimental)                      ║
echo ║  4) Cancelar                                              ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

set /p opcao=Escolha (1-4): 

if "%opcao%"=="1" (
    echo.
    echo 🚀 Iniciando Servidor Principal (port 3000)...
    echo.
    call npm start
) else if "%opcao%"=="2" (
    echo.
    echo 🚀 Iniciando Hub Multi-Banca (port 3000)...
    echo.
    echo 🌍 Abra no navegador: http://localhost:3000
    echo 📱 API: http://localhost:3000/api/v1/sync
    echo.
    call npm run hub
) else if "%opcao%"=="3" (
    echo.
    echo ⚠️  Modo experimental: Ambos em paralelo
    echo (Pode causar conflito na porta 3000)
    echo.
    REM Abrir dois terminais
    start "Servidor Principal" cmd /k npm start
    timeout /t 2
    start "Hub Multi-Banca" cmd /k npm run hub
) else (
    echo.
    echo ❌ Cancelado
    echo.
)

pause
