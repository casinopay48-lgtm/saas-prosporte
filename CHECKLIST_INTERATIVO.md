# ✅ CHECKLIST INTERATIVO: Implementação acontecendo_gol

**Use este arquivo para acompanhar seu progresso passo-a-passo**

---

## 🎯 FASE 1: Validação Técnica (5 minutos)

Confirmando que o backend está funcionando corretamente.

### Step 1.1: Iniciar Backend
- [ ] Abra terminal
- [ ] Execute: `cd c:\Dev\saasportesMobile\backend`
- [ ] Execute: `npm install`
- [ ] Execute: `npm start`
- [ ] Espere por: `✅ Servidor rodando em http://localhost:3000`

**Status esperado:** 🟢 Servidor ativo

### Step 1.2: Validar Campo Novo
- [ ] Abra OUTRO terminal
- [ ] Execute: `node test-acontecendo-gol.js`
- [ ] Procure por: `✅ Backend respondendo!`
- [ ] Procure por: `🟢 acontecendo_gol: true`
- [ ] Procure por: `✅ Campo "acontecendo_gol" presente`

**Status esperado:** 🟢 Campo validado

### Step 1.3: Verificar JSON
- [ ] Em OUTRO terminal execute: `curl http://localhost:3000/api/v1/sync | findstr acontecendo_gol`
- [ ] Procure por: `"acontecendo_gol": true`

**Status esperado:** 🟢 JSON contém novo campo

---

## 🎯 FASE 2: Visualização (3 minutos)

Confirmar que a animação está correta.

### Step 2.1: Iniciar Preview Server
- [ ] Abra OUTRO terminal
- [ ] Execute: `node serve-preview.js`
- [ ] Espere por: `Servidor rodando em: http://localhost:8888`

**Status esperado:** 🟢 Preview server ativo

### Step 2.2: Visualizar Animação
- [ ] Abra navegador
- [ ] Acesse: `http://localhost:8888`
- [ ] Procure por: **Bolinha verde 🟢 ao lado de Flamengo**
- [ ] Confirme: Está **piscando** (scale 1.0 → 1.3 → 1.0)

**Status esperado:** 🟢 Animação funcionando

### Step 2.3: Confirmar Preview
- [ ] Veja 3 partidas de exemplo
- [ ] Flamengo tem bolinha **verde piscando**
- [ ] São Paulo tem bolinha **opaca/invisível**
- [ ] Botafogo tem bolinha **verde piscando**

**Status esperado:** 🟢 Preview validado

---

## 🎯 FASE 3: Comunicação com IA (2 minutos)

Preparando para instruir a IA do Android.

### Step 3.1: Preparar Instrução
- [ ] Leia: `ANDROID_IA_INSTRUCTION.md` (60 segundos)
- [ ] Copie a instrução (está no início do arquivo)

**Instrução a usar:**
```
O JSON da API agora envia um campo booleano chamado acontecendo_gol. 
Se for true, mostre uma View circular verde com uma animação de Alpha 
ou Scale (piscar) ao lado do placar no item da lista.

Referências:
- Arquivo: ANDROID_IA_INSTRUCTION.md
- Preview: http://localhost:8888
- API: https://api.prosporte.com.br/api/v1/sync
```

### Step 3.2: Arquivos para Compartilhar
- [ ] Identifique: `ANDROID_IA_INSTRUCTION.md`
- [ ] Identifique: `prosporte-preview.html`
- [ ] Identifique: `VISUAL_RESUMO.txt` (para context)

**Status esperado:** 🟢 Arquivos prontos para enviar

---

## 🎯 FASE 4: Instruir IA do Android

### Step 4.1: Primeiro Contato
- [ ] Compartilhe a instrução (veja Step 3.1)
- [ ] Compartilhe `ANDROID_IA_INSTRUCTION.md`
- [ ] Compartilhe `prosporte-preview.html`
- [ ] Peça para IA **visualizar** http://localhost:8888

**Mensagem exemplo:**
```
Implemente um novo indicador de gol no MatchCard.

Detalhes:
O backend agora envia campo "acontecendo_gol" (boolean).
Quando true, renderize uma bolinha verde (#4CAF50) com 
animação Scale ao lado do placar.

Código pronto em: ANDROID_IA_INSTRUCTION.md
Preview visual: http://localhost:8888

Quer começar?
```

### Step 4.2: Revisar Implementação
- [ ] IA implementa MatchCard.jsx
- [ ] IA adiciona condição: `if (match.acontecendo_gol)`
- [ ] IA adiciona Animated.View com estilo golIndicator
- [ ] IA adiciona animação Scale (1.0 → 1.3 → 1.0)

**Status esperado:** 🟢 Código implementado

### Step 4.3: Testar no Device
- [ ] IA testa localmente com dados mock
- [ ] Bolinha aparece quando `acontecendo_gol: true` ✅
- [ ] Bolinha desaparece quando `acontecendo_gol: false` ✅
- [ ] Animação é suave e contínua ✅

**Status esperado:** 🟢 Teste passou

---

## 🎯 FASE 5: Validação Final

### Step 5.1: Comparar com Preview
- [ ] Abra http://localhost:8888
- [ ] Veja bolinha verde piscando em Flamengo
- [ ] Compare com implementação Android
- [ ] Elas devem ser IDÊNTICAS

**Checklist:**
- [ ] Cor verde? (#4CAF50)
- [ ] Tamanho? (12dp ≈ 48px)
- [ ] Animação? (Scale 1.0 → 1.3)
- [ ] Posição? (Ao lado do placar)
- [ ] Piscando? (Contínuo/loop)

### Step 5.2: Documentar Conclusão
- [ ] IA confirma: "Implementação completa"
- [ ] IA reporta: "Testado em device"
- [ ] IA envia: Screenshot ou video da bolinha piscando

**Status esperado:** 🟢 Conclusão validada

---

## 🎯 FASE 6: Produção (quando pronto)

### Step 6.1: Preparar Deploy
- [ ] Backend pronto em `c:\Dev\saasportesMobile\backend`
- [ ] Credenciais VPS disponíveis
- [ ] Domínio `api.prosporte.com.br` configurado
- [ ] SSL/HTTPS pronto

**Status:** ⏳ Aguarda recursos

### Step 6.2: Deploy Backend
- [ ] SSH em VPS: `ssh user@api.prosporte.com.br`
- [ ] Clone: `git clone https://github.com/... backend`
- [ ] Install: `npm install`
- [ ] Configure: `.env` com API keys
- [ ] Start: `npm start` (ou PM2)

**Teste:** `curl https://api.prosporte.com.br/api/v1/sync`

### Step 6.3: Integrar Android
- [ ] Atualizar BASE_URL para `https://api.prosporte.com.br`
- [ ] Build APK com nova URL
- [ ] Deploy em Play Store / TestFlight

**Status:** 🟢 Live!

---

## 📋 RESUMO DE PROGRESSO

```
Fase 1 (Validação):        [ ______ ] 0%
Fase 2 (Visualização):     [ ______ ] 0%
Fase 3 (Comunicação):      [ ______ ] 0%
Fase 4 (IA Android):       [ ______ ] 0%
Fase 5 (Validação Final):  [ ______ ] 0%
Fase 6 (Produção):         [ ______ ] 0%

TOTAL:                      [ ______ ] 0%
```

---

## 🚨 TROUBLESHOOTING

### Problema: Backend não responde
```
Solução:
1. npm install (em backend/)
2. npm start
3. Aguarde: "✅ Servidor rodando"
4. Teste novamente
```

### Problema: Campo "acontecendo_gol" não aparece
```
Solução:
1. Verifique: normalizer.js foi modificado?
2. Execute: npm start (reinicie backend)
3. Teste: curl http://localhost:3000/api/v1/sync
4. Procure por: "acontecendo_gol" no JSON
```

### Problema: Preview não carrega
```
Solução:
1. Verifique: Node.js instalado?
2. Execute: node serve-preview.js
3. Abra: http://localhost:8888
4. Verifique console do navegador por erros
```

### Problema: IA não entende instrução
```
Solução:
1. Compartilhe VISUAL_RESUMO.txt (mais visual)
2. Mostre o http://localhost:8888 (imagem vale 1000 palavras)
3. Compartilhe código de exemplo em ANDROID_IA_INSTRUCTION.md
4. Peça: "Copie MatchCard.jsx desse arquivo"
```

---

## 📞 PERGUNTAS FREQUENTES

**P: Preciso reiniciar o backend a cada mudança?**  
R: Sim, se você modificar código. Ou use `npm run dev` para hot-reload.

**P: E se a IA não conseguir?**  
R: Forneça o código pronto de ANDROID_IA_INSTRUCTION.md.

**P: O preview funciona em dispositivo real?**  
R: Preview é web (http://localhost:8888). Android vê através da API.

**P: Quanto tempo leva?**  
R: Backend: 5 min | IA Android: 2-4 horas | Produção: 1-2 dias

---

## ✨ CONCLUSÃO

Quando TODOS os passos estiverem com ☑️, você terá:

✅ Backend enviando `acontecendo_gol: true/false`  
✅ API retornando novo campo  
✅ Android renderizando bolinha verde piscante  
✅ Preview visual confirmando comportamento  
✅ Tudo pronto para produção  

---

**Data de Início:** _____________  
**Data de Conclusão Esperada:** 2026-02-01  
**Data de Conclusão Real:** _____________  

**Assinado por:** _____________  
**Versão:** 1.0

