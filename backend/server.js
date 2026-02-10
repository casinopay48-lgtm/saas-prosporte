/**
 * Servidor Principal - ProSporte Backend Hub
 * 
 * Endpoints:
 * - GET  /api/v1/sync          Retorna dados normalizados
 * - POST /api/v1/sync          Força sincronização
 * - GET  /api/v1/sync/status   Status da sincronização
 * - GET  /api/v1/sync/matches  Lista com filtros
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const syncRoutes = require('./src/routes/sync');
const syncManager = require('./src/services/syncManager');

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'localhost';

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Permite requisições do Android e Web
app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// Log de requisições
app.use(morgan('combined'));

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ProSporte Backend Hub',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ROTAS PRINCIPAIS
// ============================================

app.use('/api/v1/sync', syncRoutes);

// ============================================
// SINCRONIZAÇÃO AUTOMÁTICA
// ============================================

// Sincroniza com Mock Data a cada 30 minutos
const SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutos

async function startAutoSync() {
  console.log('\n⏰ Configurando sincronização automática...');
  console.log(`   Intervalo: ${SYNC_INTERVAL / 60000} minutos\n`);

  // Sincronização inicial ao iniciar servidor
  await syncManager.sync('mock');

  // Sincronização periódica
  setInterval(async () => {
    console.log('\n🔄 Sincronização automática iniciada...');
    await syncManager.sync('mock');
  }, SYNC_INTERVAL);
}

// ============================================
// INICIO DO SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 ProSporte Backend Hub - ONLINE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📡 Servidor: http://${DOMAIN}:${PORT}`);
  console.log(`🔗 Endereço da API: http://${DOMAIN}:${PORT}/api/v1`);
  console.log(`\n📋 Endpoints disponíveis:`);
  console.log(`   GET  http://${DOMAIN}:${PORT}/api/v1/sync`);
  console.log(`   POST http://${DOMAIN}:${PORT}/api/v1/sync`);
  console.log(`   GET  http://${DOMAIN}:${PORT}/api/v1/sync/status`);
  console.log(`   GET  http://${DOMAIN}:${PORT}/api/v1/sync/matches`);
  console.log(`\n❤️  Health Check: http://${DOMAIN}:${PORT}/health`);
  console.log(`${'='.repeat(60)}\n`);

  // Inicia sincronização automática
  startAutoSync().catch(error => {
    console.error('❌ Erro ao iniciar sincronização automática:', error.message);
  });
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promessa rejeitada não tratada:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exceção não capturada:', error);
  process.exit(1);
});
