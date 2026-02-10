/**
 * Rotas de Sincronização
 * GET  /api/v1/sync           - Retorna dados normalizados
 * POST /api/v1/sync           - Força sincronização
 * GET  /api/v1/sync/status    - Status da sincronização
 * GET  /api/v1/sync/matches   - Lista de partidas com filtros
 */

const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

// GET - Retorna dados
router.get('/', syncController.getSync);

// POST - Força sincronização
router.post('/', syncController.triggerSync);

// GET - Status da sincronização
router.get('/status', syncController.getStatus);

// GET - Partidas com filtros
router.get('/matches', syncController.getMatches);

module.exports = router;
