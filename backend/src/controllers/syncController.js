/**
 * Controller de Sincronização
 * Lógica de negócio para a rota /api/v1/sync
 */

const syncManager = require('../services/syncManager');

class SyncController {
  
  /**
   * GET /api/v1/sync
   * Retorna dados normalizados de jogos
   */
  async getSync(req, res) {
    try {
      const data = syncManager.loadData();

      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        metadata: data.metadata || {},
        matches: data.matches || [],
        totalMatches: (data.matches || []).length
      });

    } catch (error) {
      console.error('❌ Erro no getSync:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erro ao carregar dados',
        message: error.message
      });
    }
  }

  /**
   * POST /api/v1/sync
   * Força uma sincronização com a API configurada
   */
  async triggerSync(req, res) {
    try {
      const provider = req.body?.provider || 'mock';
      
      console.log(`🔄 Sincronização manual solicitada pelo cliente`);
      console.log(`📡 Provider: ${provider}`);

      const result = await syncManager.sync(provider);

      if (result.success) {
        res.json({
          success: true,
          timestamp: new Date().toISOString(),
          message: `Sincronização concluída com ${result.matchesCount} partidas`,
          matchesCount: result.matchesCount,
          metadata: result.data.metadata,
          matches: result.data.matches
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      console.error('❌ Erro no triggerSync:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erro ao sincronizar dados',
        message: error.message
      });
    }
  }

  /**
   * GET /api/v1/sync/status
   * Retorna status da sincronização e histórico
   */
  async getStatus(req, res) {
    try {
      const data = syncManager.loadData();
      const history = syncManager.getSyncHistory(10);

      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        status: {
          lastSync: data.metadata?.lastSync || 'Nunca',
          provider: data.metadata?.provider || 'N/A',
          totalMatches: data.metadata?.totalMatches || 0,
          dataStatus: data.metadata?.status || 'unknown'
        },
        history: history
      });

    } catch (error) {
      console.error('❌ Erro no getStatus:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter status',
        message: error.message
      });
    }
  }

  /**
   * GET /api/v1/sync/matches
   * Retorna apenas as partidas normalizadas
   */
  async getMatches(req, res) {
    try {
      const data = syncManager.loadData();
      const matches = data.matches || [];

      // Filtro por status se fornecido
      const statusFilter = req.query.status;
      let filtered = matches;

      if (statusFilter) {
        filtered = matches.filter(m => m.status.includes(statusFilter));
      }

      // Filtro por liga se fornecido
      const leagueFilter = req.query.liga;
      if (leagueFilter) {
        filtered = filtered.filter(m => m.liga.toLowerCase().includes(leagueFilter.toLowerCase()));
      }

      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        filters: {
          status: statusFilter || 'nenhum',
          liga: leagueFilter || 'nenhum'
        },
        totalMatches: filtered.length,
        matches: filtered
      });

    } catch (error) {
      console.error('❌ Erro no getMatches:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter partidas',
        message: error.message
      });
    }
  }
}

module.exports = new SyncController();
