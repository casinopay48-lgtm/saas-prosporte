# fix-build.ps1 - Script para corrigir build do React Native

# Caminhos
$androidDir = "C:\Dev\saasportesMobile\android"
$appBuildGradle = "$androidDir\app\build.gradle"
$settingsGradle = "$androidDir\settings.gradle"

Write-Host "🚀 Iniciando script de correção..."

# 1️⃣ Para todos os daemons do Gradle
Write-Host "🛑 Parando Gradle Daemon..."
& "$androidDir\gradlew" --stop

# 2️⃣ Limpa caches do Gradle
Write-Host "🧹 Limpando cache do Gradle..."
& "$androidDir\gradlew" cleanBuildCache

# 3️⃣ Limpa cache do npm e reinstala node_modules
Write-Host "📦 Limpando node_modules e cache do npm..."
Remove-Item -Recurse -Force "C:\Dev\saasportesMobile\node_modules"
npm cache clean --force
npm install

# 4️⃣ Corrige settings.gradle
Write-Host "⚙️ Corrigindo settings.gradle..."
$settingsContent = @"
pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}

rootProject.name = 'saasportesMobile'
include(':app')
"@
Set-Content -Path $settingsGradle -Value $settingsContent

# 5️⃣ Corrige android/app/build.gradle
Write-Host "⚙️ Corrigindo build.gradle do app..."
$buildGradleContent = @"
plugins {
    id 'com.android.application'
    id 'com.facebook.react' apply false
    id 'kotlin-android' apply false
}

android {
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.saasportes"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
}
"@
Set-Content -Path $appBuildGradle -Value $buildGradleContent

# 6️⃣ Limpa build antigo
Write-Host "🧹 Limpando build antigo..."
& "$androidDir\gradlew" clean

# 7️⃣ Monta APK debug
Write-Host "🏗️ Montando APK debug..."
& "$androidDir\gradlew" assembleDebug

Write-Host "✅ Script concluído. Se não houver erros, seu projeto deve compilar!"
