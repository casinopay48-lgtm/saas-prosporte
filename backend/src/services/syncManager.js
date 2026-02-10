/**
 * Gerenciador de Sincronização
 * Orquestra o fluxo: API → Normalização → Armazenamento
 */

const fs = require('fs');
const path = require('path');
const apiAdapter = require('./apiAdapter');
const normalizer = require('./normalizer');

class SyncManager {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/jogos.json');
    this.syncLogPath = path.join(__dirname, '../../data/sync.log');
    this.lastSyncTime = null;
  }

  /**
   * Executa sincronização completa
   */
  async sync(provider = 'mock') {
    const syncStartTime = new Date();
    console.log(`\n🔄 Iniciando sincronização com provedor: ${provider}`);
    console.log(`⏰ Hora: ${syncStartTime.toISOString()}\n`);

    try {
      // Passo 1: Buscar dados brutos da API
      console.log(`1️⃣  Buscando dados de ${provider}...`);
      const rawMatches = await apiAdapter.fetchFromProvider(provider);
      console.log(`   ✅ ${rawMatches.length} partidas recebidas\n`);

      // Passo 2: Normalizar dados
      console.log(`2️⃣  Normalizando dados para padrão ProSporte...`);
      const normalizedMatches = normalizer.normalizeMatches(rawMatches, provider);
      console.log(`   ✅ ${normalizedMatches.length} partidas normalizadas\n`);

      // Passo 3: Validar dados
      console.log(`3️⃣  Validando dados normalizados...`);
      const validMatches = normalizedMatches.filter(match => {
        const isValid = normalizer.validate(match);
        if (!isValid) {
          console.warn(`   ⚠️  Partida inválida removida: ${match.id_partida}`);
        }
        return isValid;
      });
      console.log(`   ✅ ${validMatches.length} partidas validadas\n`);

      // Passo 4: Armazenar dados
      console.log(`4️⃣  Armazenando dados em jogos.json...`);
      const storedData = {
        metadata: {
          version: '1.0.0',
          provider: provider,
          lastSync: syncStartTime.toISOString(),
          totalMatches: validMatches.length,
          status: 'success'
        },
        matches: validMatches
      };

      this.saveData(storedData);
      console.log(`   ✅ Dados armazenados com sucesso\n`);

      // Passo 5: Registrar log de sincronização
      this.logSync({
        provider,
        timestamp: syncStartTime.toISOString(),
        status: 'success',
        matchesCount: validMatches.length,
        duration: new Date() - syncStartTime
      });

      console.log(`✅ Sincronização concluída com sucesso!`);
      console.log(`   Duração: ${new Date() - syncStartTime}ms\n`);

      return {
        success: true,
        matchesCount: validMatches.length,
        data: storedData
      };

    } catch (error) {
      console.error(`❌ Erro durante sincronização: ${error.message}\n`);

      this.logSync({
        provider,
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Salva dados em jogos.json
   */
  saveData(data) {
    try {
      const dir = path.dirname(this.dataPath);
      
      // Criar diretório se não existir
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(
        this.dataPath,
        JSON.stringify(data, null, 2),
        'utf-8'
      );

      console.log(`   📁 Arquivo: ${this.dataPath}`);
    } catch (error) {
      console.error(`❌ Erro ao salvar arquivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Carrega dados de jogos.json
   */
  loadData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        console.warn(`⚠️  Arquivo de dados não encontrado: ${this.dataPath}`);
        return { matches: [] };
      }

      const data = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`❌ Erro ao carregar dados: ${error.message}`);
      return { matches: [] };
    }
  }

  /**
   * Registra log de sincronização
   */
  logSync(logEntry) {
    try {
      const dir = path.dirname(this.syncLogPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let logs = [];
      if (fs.existsSync(this.syncLogPath)) {
        const content = fs.readFileSync(this.syncLogPath, 'utf-8');
        logs = JSON.parse(content);
      }

      logs.push(logEntry);

      // Manter apenas últimos 100 logs
      if (logs.length > 100) {
        logs = logs.slice(-100);
      }

      fs.writeFileSync(
        this.syncLogPath,
        JSON.stringify(logs, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error(`❌ Erro ao registrar log: ${error.message}`);
    }
  }

  /**
   * Retorna histórico de sincronizações
   */
  getSyncHistory(limit = 10) {
    try {
      if (!fs.existsSync(this.syncLogPath)) {
        return [];
      }

      const content = fs.readFileSync(this.syncLogPath, 'utf-8');
      const logs = JSON.parse(content);
      return logs.slice(-limit).reverse();
    } catch (error) {
      console.error(`❌ Erro ao carregar histórico: ${error.message}`);
      return [];
    }
  }
}

module.exports = new SyncManager();
