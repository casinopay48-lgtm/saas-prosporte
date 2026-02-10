/**
 * Tarefa de Sincronização
 * Pode ser executada manualmente via: npm run sync
 */

require('dotenv').config();
const syncManager = require('./src/services/syncManager');

async function runSync() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     ProSporte - Tarefa de Sincronização Manual        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  try {
    // Pega provider da variável de ambiente ou usa 'mock'
    const provider = process.env.SYNC_PROVIDER || 'mock';
    
    console.log(`Provider configurado: ${provider}\n`);

    const result = await syncManager.sync(provider);

    if (result.success) {
      console.log('\n✅ Sincronização bem-sucedida!');
      console.log(`📊 Partidas sincronizadas: ${result.matchesCount}`);
    } else {
      console.log('\n❌ Sincronização falhou!');
      console.log(`Erro: ${result.error}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Erro durante execução:', error.message);
    process.exit(1);
  }
}

runSync();
