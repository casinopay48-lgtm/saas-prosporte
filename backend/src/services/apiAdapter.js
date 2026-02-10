/**
 * Adaptador de APIs
 * Conecta com múltiplas APIs de desenvolvedores
 * Retorna dados brutos no formato padrão da API
 */

const axios = require('axios');
const providers = require('../config/providers');

class ApiAdapter {
  constructor() {
    this.providers = providers;
  }

  /**
   * Busca dados de partidas de uma API real
   * @param {string} provider - Nome do provedor (apiFootball, theOddsApi, sportmonks)
   * @returns {Promise<Array>} Array de partidas no formato bruto da API
   */
  async fetchFromProvider(provider = 'apiFootball') {
    try {
      const config = this.providers[provider];
      
      if (!config) {
        throw new Error(`Provedor ${provider} não encontrado`);
      }

      if (!config.enabled && provider !== 'mock') {
        console.warn(`Provedor ${provider} não configurado. Usando Mock Data...`);
        return this.getMockData();
      }

      if (provider === 'mock') {
        return this.getMockData();
      }

      // Implementação para API-Football (via RapidAPI)
      if (provider === 'apiFootball' && config.enabled) {
        return await this.fetchFromApiFootball();
      }

      // Implementação para The-Odds-API
      if (provider === 'theOddsApi' && config.enabled) {
        return await this.fetchFromTheOddsApi();
      }

      // Se nenhuma API está ativa, retorna Mock
      console.log('⚠️  Nenhuma API real configurada. Usando dados de simulação...');
      return this.getMockData();

    } catch (error) {
      console.error(`❌ Erro ao buscar dados de ${provider}:`, error.message);
      console.log('📊 Retornando dados Mock como fallback...');
      return this.getMockData();
    }
  }

  /**
   * Busca dados da API-Football (RapidAPI)
   */
  async fetchFromApiFootball() {
    const config = this.providers.apiFootball;
    
    const options = {
      method: 'GET',
      url: `${config.baseUrl}/fixtures`,
      params: {
        live: 'all',
        timezone: 'America/Sao_Paulo'
      },
      headers: {
        'x-rapidapi-key': config.apiKey,
        'x-rapidapi-host': config.host
      }
    };

    try {
      const response = await axios.request(options);
      console.log(`✅ Dados recebidos de API-Football`);
      return response.data.response || [];
    } catch (error) {
      console.error('❌ Erro em API-Football:', error.message);
      throw error;
    }
  }

  /**
   * Busca dados da The-Odds-API
   */
  async fetchFromTheOddsApi() {
    const config = this.providers.theOddsApi;
    
    try {
      const response = await axios.get(
        `${config.baseUrl}/sports/soccer/upcoming`,
        {
          params: {
            apiKey: config.apiKey,
            regions: 'br',
            markets: 'h2h,spreads'
          }
        }
      );
      console.log(`✅ Dados recebidos de The-Odds-API`);
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro em The-Odds-API:', error.message);
      throw error;
    }
  }

  /**
   * Dados Mock para Desenvolvimento
   * Simula o formato que as APIs reais retornam
   */
  getMockData() {
    return [
      {
        fixture: {
          id: 1001,
          date: new Date(Date.now() + 3600000).toISOString(),
          status: 'NS',
          timestamp: Math.floor(Date.now() / 1000) + 3600
        },
        teams: {
          home: {
            id: 101,
            name: 'Real Madrid CF',
            logo: 'https://media.api-sports.io/teams/541.png'
          },
          away: {
            id: 102,
            name: 'Barcelona FC',
            logo: 'https://media.api-sports.io/teams/529.png'
          }
        },
        goals: {
          home: null,
          away: null
        },
        score: {
          halftime: { home: null, away: null },
          fulltime: { home: null, away: null },
          extratime: { home: null, away: null },
          penalty: { home: null, away: null }
        },
        league: {
          id: 39,
          name: 'La Liga',
          country: 'Spain',
          logo: 'https://media.api-sports.io/leagues/39.png',
          flag: 'https://media.api-sports.io/flags/es.svg',
          season: 2023,
          round: 'Regular Season - 5'
        }
      },
      {
        fixture: {
          id: 1002,
          date: new Date(Date.now() + 7200000).toISOString(),
          status: 'NS',
          timestamp: Math.floor(Date.now() / 1000) + 7200
        },
        teams: {
          home: {
            id: 103,
            name: 'Manchester City FC',
            logo: 'https://media.api-sports.io/teams/50.png'
          },
          away: {
            id: 104,
            name: 'Liverpool FC',
            logo: 'https://media.api-sports.io/teams/40.png'
          }
        },
        goals: {
          home: null,
          away: null
        },
        score: {
          halftime: { home: null, away: null },
          fulltime: { home: null, away: null },
          extratime: { home: null, away: null },
          penalty: { home: null, away: null }
        },
        league: {
          id: 39,
          name: 'Premier League',
          country: 'England',
          logo: 'https://media.api-sports.io/leagues/39.png',
          flag: 'https://media.api-sports.io/flags/gb.svg',
          season: 2023,
          round: 'Regular Season - 10'
        }
      },
      {
        fixture: {
          id: 1003,
          date: new Date(Date.now() + 10800000).toISOString(),
          status: 'NS',
          timestamp: Math.floor(Date.now() / 1000) + 10800
        },
        teams: {
          home: {
            id: 105,
            name: 'Flamengo RJ',
            logo: 'https://media.api-sports.io/teams/111.png'
          },
          away: {
            id: 106,
            name: 'Corinthians SP',
            logo: 'https://media.api-sports.io/teams/122.png'
          }
        },
        goals: {
          home: 1,
          away: 1
        },
        score: {
          halftime: { home: 0, away: 1 },
          fulltime: { home: 1, away: 1 },
          extratime: { home: null, away: null },
          penalty: { home: null, away: null }
        },
        league: {
          id: 71,
          name: 'Campeonato Brasileiro',
          country: 'Brazil',
          logo: 'https://media.api-sports.io/leagues/71.png',
          flag: 'https://media.api-sports.io/flags/br.svg',
          season: 2023,
          round: 'Regular Season - 15'
        },
        // NOVO: Indicador de gol em tempo real
        _prosporte_meta: {
          acontecendo_gol: true
        }
      }
    ];
  }
}

module.exports = new ApiAdapter();
