# README: Assets por Flavor (Android)

## 📂 Estrutura de Pastas Criada

Para cada **productFlavor** (banca), foi criada uma estrutura de assets personalizada:

```
android/app/src/
├── banca_padrao/res/
│   ├── mipmap-hdpi/       (72x72 px)
│   ├── mipmap-mdpi/       (48x48 px)
│   ├── mipmap-xhdpi/      (96x96 px)
│   ├── mipmap-xxhdpi/     (144x144 px)
│   ├── mipmap-xxxhdpi/    (192x192 px)
│   └── values/
│       └── strings.xml    (Nome do app: "Pro Sporte")
│
└── banca_teste/res/
    ├── mipmap-hdpi/
    ├── mipmap-mdpi/
    ├── mipmap-xhdpi/
    ├── mipmap-xxhdpi/
    ├── mipmap-xxxhdpi/
    └── values/
        └── strings.xml    (Nome do app: "Banca Teste")
```

---

## 🎨 Como Adicionar Ícones Customizados

### **Passo 1: Criar ícones para cada banca**

Use ferramentas online como:
- [Icon Kitchen](https://icon.kitchen/)
- [App Icon Generator](https://www.appicon.co/)

Ou use o **Android Studio**:
1. Clique com botão direito em `res`
2. New → Image Asset
3. Configure o ícone e gere para todos os tamanhos

### **Passo 2: Substituir ícones padrão**

Copie os ícones gerados para as pastas correspondentes:

```bash
# Banca Padrão (Amarelo/Dourado)
android/app/src/banca_padrao/res/mipmap-hdpi/ic_launcher.png
android/app/src/banca_padrao/res/mipmap-mdpi/ic_launcher.png
# ... (outros tamanhos)

# Banca Teste (Laranja)
android/app/src/banca_teste/res/mipmap-hdpi/ic_launcher.png
android/app/src/banca_teste/res/mipmap-mdpi/ic_launcher.png
# ... (outros tamanhos)
```

---

## 🌅 Como Adicionar Splash Screen Customizada

### **Opção 1: Splash Screen Nativa (Android 12+)**

Crie `splash.xml` em cada flavor:

```xml
<!-- android/app/src/banca_padrao/res/values/splash.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">#0B0E11</color>
    <color name="splash_icon_color">#F0B90B</color>
</resources>
```

### **Opção 2: Biblioteca react-native-splash-screen**

```bash
npm install react-native-splash-screen
```

Adicione imagens em `drawable-nodpi`:

```
android/app/src/banca_padrao/res/drawable-nodpi/
└── splash_screen.png  (1080x1920 px recomendado)

android/app/src/banca_teste/res/drawable-nodpi/
└── splash_screen.png
```

---

## 🔧 Como o Gradle Seleciona os Assets

Quando você compila um flavor específico:

```bash
.\gradlew assembleBanca_padraoRelease
```

O Gradle automaticamente:
1. Carrega assets de `banca_padrao/res/`
2. Sobrescreve assets de `main/res/` se houver conflito
3. Gera APK com ícone e nome da Banca Padrão

**Resultado:**
- **Ícone na tela inicial:** Logo amarelo/dourado
- **Nome exibido:** "Pro Sporte"
- **Splash screen:** Fundo preto com logo amarelo

---

## 📝 Checklist de Assets

Para cada nova banca, adicione:

- [ ] `ic_launcher.png` (5 tamanhos: hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi)
- [ ] `strings.xml` (nome do app)
- [ ] `splash_screen.png` (opcional - para splash customizada)
- [ ] `colors.xml` (opcional - cores primárias)

---

## 🎯 Testando Assets por Flavor

### **Build e Instalação:**

```bash
# Banca Padrão
cd android
.\gradlew installBanca_padraoDebug

# Banca Teste
.\gradlew installBanca_testeDebug
```

Após instalar, você verá:
- **Ícones diferentes** na tela inicial do celular
- **Nomes diferentes** embaixo dos ícones
- **Splash screens diferentes** ao abrir o app

---

## ⚠️ Notas Importantes

1. **Formato dos ícones:** Use PNG com transparência
2. **Tamanhos exatos:** Siga os tamanhos padrão do Android
3. **Qualidade:** Use ícones em alta resolução (192x192 mínimo)
4. **Cores:** Certifique-se de que o ícone funciona em fundos claros e escuros
5. **Build limpo:** Sempre rode `.\gradlew clean` após alterar assets

---

**Status:** ✅ Estrutura criada e pronta para receber assets customizados!
