@echo off
cd /d "C:\Dev\saasportesMobile\android"
echo Compilando APK...
call gradlew.bat clean assembleDebug
if %ERRORLEVEL% EQU 0 (
    echo Compilacao concluida com sucesso!
    dir app\build\outputs\apk
) else (
    echo Erro na compilacao!
)
pause
