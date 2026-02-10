@echo off
setlocal enabledelayedexpansion

echo ================================
echo ProSporte Backend - Setup
echo ================================
echo.

echo 1 Verificando Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo X Node.js nao encontrado. Por favor, instale Node.js 14+ em https://nodejs.org
    pause
    exit /b 1
) else (
    echo + Node.js encontrado
)

echo.
echo 2 Instalando dependencias...
call npm install

echo.
echo 3 Criando arquivo .env...
if not exist .env (
    copy .env.example .env
    echo + Arquivo .env criado (edite com suas chaves de API)
) else (
    echo + Arquivo .env ja existe
)

echo.
echo 4 Criando pasta de dados...
if not exist data mkdir data

echo.
echo ================================
echo + Setup concluido!
echo ================================
echo.
echo Para iniciar o servidor, execute:
echo    npm start
echo.
echo Para desenvolvimento (hot-reload):
echo    npm run dev
echo.
pause
