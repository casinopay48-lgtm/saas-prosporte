@echo off
REM ===================================================
REM  ProSporte Hub - Script de Teste
REM ===================================================

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        🧪 HUB PROSPORTE - Teste Rápido                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo.
echo ⏳ Aguardando servidor iniciar por 5 segundos...
echo (Certifique-se que está rodando: npm run hub)
echo.
timeout /t 5

echo.
echo 📊 Testando endpoints:
echo.

echo 1️⃣  Health Check:
curl http://localhost:3000/health
echo.
echo.

echo 2️⃣  API Sync (com novo campo 'acontecendo_gol'):
curl http://localhost:3000/api/v1/sync
echo.
echo.

echo 3️⃣  Listar Bancas:
curl http://localhost:3000/api/admin/bancas
echo.
echo.

echo 4️⃣  Abrir no navegador:
echo Navegue para: http://localhost:3000
echo.
echo Esperado:
echo ✅ Logo do ProSporte
echo ✅ 3 partidas listadas
echo ✅ Flamengo com bolinha verde 🟢 piscando
echo ✅ Status atualiza a cada 5 segundos
echo.

pause
