#!/usr/bin/env node

/**
 * Teste Rápido: Campo acontecendo_gol
 * Execute: node test-acontecendo-gol.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  🧪 TESTE: acontecendo_gol                     ║
╚════════════════════════════════════════════════════════════════╝
`);

// 1. Verificar se backend está rodando
console.log('📡 Testando backend em http://localhost:3000...');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/sync',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      console.log('\n✅ Backend respondendo!\n');
      console.log('📊 Resposta da API:');
      console.log('─'.repeat(60));

      if (json.matches && Array.isArray(json.matches)) {
        json.matches.forEach((match, idx) => {
          console.log(`\n🎮 Partida ${idx + 1}:`);
          console.log(`   Casa: ${match.casa}`);
          console.log(`   Fora: ${match.fora}`);
          console.log(`   Placar: ${match.placar_casa} × ${match.placar_fora}`);
          console.log(`   Status: ${match.status}`);
          console.log(`   Liga: ${match.liga}`);
          
          // VERIFICAR O NOVO CAMPO
          if ('acontecendo_gol' in match) {
            const valor = match.acontecendo_gol;
            const emoji = valor ? '🟢' : '⚪';
            const status = valor ? 'ATIVO (bolinha piscando)' : 'INATIVO (oculto)';
            console.log(`   ${emoji} acontecendo_gol: ${valor} → ${status}`);
          } else {
            console.log(`   ⚠️  Campo 'acontecendo_gol' NÃO ENCONTRADO!`);
          }
        });

        // Validação
        console.log('\n' + '─'.repeat(60));
        console.log('✅ VALIDAÇÃO:');
        
        const temCampo = json.matches.some(m => 'acontecendo_gol' in m);
        if (temCampo) {
          console.log('   ✅ Campo "acontecendo_gol" presente');
          
          const temTrue = json.matches.some(m => m.acontecendo_gol === true);
          const temFalse = json.matches.some(m => m.acontecendo_gol === false);
          
          if (temTrue) {
            console.log('   ✅ Pelo menos uma partida com acontecendo_gol = true');
          }
          if (temFalse) {
            console.log('   ✅ Pelo menos uma partida com acontecendo_gol = false');
          }
        } else {
          console.log('   ❌ Campo "acontecendo_gol" AUSENTE');
        }

        // Próximos passos
        console.log('\n' + '─'.repeat(60));
        console.log('📋 PRÓXIMOS PASSOS:');
        console.log(`
1. Visualizar com node serve-preview.js
   Acesse: http://localhost:8888
   
2. Passar instrução para IA do Android:
   - Arquivo: ANDROID_IA_INSTRUCTION.md
   - Um-liner: "Implementar bolinha verde com animação"
   
3. IA do Android implementa em MatchCard.jsx
   
4. Deploy em produção:
   - URL: https://api.prosporte.com.br/api/v1/sync
        `);

      } else {
        console.log('❌ Formato de resposta inesperado');
        console.log(JSON.stringify(json, null, 2));
      }

    } catch (e) {
      console.log('❌ Erro ao parsear JSON:');
      console.log(e.message);
      console.log('\nResposta bruta:');
      console.log(data);
    }
  });
});

req.on('error', (err) => {
  console.log('\n❌ Backend NÃO está respondendo!');
  console.log(`\nErro: ${err.message}`);
  console.log(`\nInicie o backend com:`);
  console.log(`  cd backend/`);
  console.log(`  npm install`);
  console.log(`  npm start`);
});

req.on('timeout', () => {
  console.log('\n❌ Timeout! Backend não respondeu em 5 segundos');
  req.destroy();
});

// Enviar request
console.log('Aguardando...\n');
req.end();
