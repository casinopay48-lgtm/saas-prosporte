Write-Host "`n===============================" -ForegroundColor Cyan
Write-Host "🔥 SCRIPT MASTER — FORÇA TOTAL 🔥" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

$ROOT = Get-Location
$ANDROID = Join-Path $ROOT "android"
$LOG = Join-Path $ROOT "build_forca_total.log"

"INÍCIO: $(Get-Date)" | Out-File $LOG

# ===============================
# 1️⃣ VALIDAR AMBIENTE
# ===============================
Write-Host "`n🔍 Verificando ambiente..." -ForegroundColor Yellow

if (-not $env:JAVA_HOME) {
  Write-Host "❌ JAVA_HOME não definido" -ForegroundColor Red
  exit 1
}

if (-not $env:ANDROID_HOME) {
  Write-Host "❌ ANDROID_HOME não definido" -ForegroundColor Red
  exit 1
}

Write-Host "✅ JAVA_HOME OK"
Write-Host "✅ ANDROID_HOME OK"

# ===============================
# 2️⃣ GARANTIR ANDROIDX + JETIFIER
# ===============================
Write-Host "`n🧩 Ajustando gradle.properties..." -ForegroundColor Yellow

$gp = Join-Path $ANDROID "gradle.properties"

if (!(Test-Path $gp)) {
  Write-Host "❌ gradle.properties não encontrado" -ForegroundColor Red
  exit 1
}

$content = Get-Content $gp -Raw

if ($content -notmatch "android.useAndroidX=true") {
  $content += "`nandroid.useAndroidX=true"
}

if ($content -notmatch "android.enableJetifier=true") {
  $content += "`nandroid.enableJetifier=true"
}

$content | Set-Content $gp -Encoding UTF8
Write-Host "✅ AndroidX e Jetifier garantidos"

# ===============================
# 3️⃣ REMOVER DEPENDÊNCIA ERRADA DO RN
# ===============================
Write-Host "`n🧹 Corrigindo build.gradle (:app)..." -ForegroundColor Yellow

$appGradle = Join-Path $ANDROID "app\build.gradle"

(Get-Content $appGradle) |
  Where-Object { $_ -notmatch "com.facebook.react:react-native" } |
  Set-Content $appGradle

Write-Host "✅ Dependência react-native REMOVIDA (correção RN 0.71+)"

# ===============================
# 4️⃣ LIMPEZA INTELIGENTE (SEM QUEBRAR)
# ===============================
Write-Host "`n🧼 Limpeza profunda..." -ForegroundColor Yellow

Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\kotlin" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$ANDROID\.gradle" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$ANDROID\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$ANDROID\app\build" -ErrorAction SilentlyContinue

Write-Host "✅ Cache limpo"

# ===============================
# 5️⃣ LIMPAR GRADLE
# ===============================
Write-Host "`n🧼 gradlew clean..." -ForegroundColor Yellow
Set-Location $ANDROID
.\gradlew.bat clean | Tee-Object -Append $LOG

# ===============================
# 6️⃣ BUILD APK DEBUG
# ===============================
Write-Host "`n📦 Gerando APK Debug..." -ForegroundColor Yellow
.\gradlew.bat assembleDebug | Tee-Object -Append $LOG

# ===============================
# 7️⃣ RESULTADO FINAL
# ===============================
Set-Location $ROOT

Write-Host "`n===============================" -ForegroundColor Green
Write-Host "✅ FORÇA TOTAL FINALIZADO" -ForegroundColor Green
Write-Host "📄 Log: build_forca_total.log" -ForegroundColor Green
Write-Host "📦 APK: android/app/build/outputs/apk/debug" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

"FIM: $(Get-Date)" | Out-File $LOG -Append
