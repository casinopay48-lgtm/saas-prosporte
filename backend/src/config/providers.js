/**
 * Configuração de Provedores de APIs
 * Define as APIs disponíveis e suas credenciais
 */

module.exports = {
  apiFootball: {
    name: 'API-Football',
    baseUrl: 'https://api-football-v3.p.rapidapi.com',
    apiKey: process.env.API_FOOTBALL_KEY,
    host: process.env.API_FOOTBALL_HOST || 'api-football-v3.p.rapidapi.com',
    enabled: !!process.env.API_FOOTBALL_KEY,
    type: 'rapidapi'
  },

  theOddsApi: {
    name: 'The-Odds-API',
    baseUrl: 'https://api.the-odds-api.com/v4',
    apiKey: process.env.THE_ODDS_API_KEY,
    enabled: !!process.env.THE_ODDS_API_KEY,
    type: 'direct'
  },

  sportmonks: {
    name: 'Sportmonks',
    baseUrl: 'https://api.sportmonks.com/v3',
    apiKey: process.env.SPORTMONKS_KEY,
    enabled: !!process.env.SPORTMONKS_KEY,
    type: 'direct'
  },

  mock: {
    name: 'Mock Data',
    enabled: true,
    type: 'mock',
    description: 'Dados de simulação para desenvolvimento'
  }
};
