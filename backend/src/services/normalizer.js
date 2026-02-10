/**
 * Normalizador de Dados
 * Transforma dados brutos de qualquer API no padrão ProSporte
 * 
 * Padrão ProSporte:
 * {
 *   id_partida: string
 *   casa: string
 *   fora: string
 *   placar_casa: int
 *   placar_fora: int
 *   status: string (Ao Vivo|Finalizado|HH:MM)
 *   liga: string
 *   data_partida: ISO 8601
 *   timestamp_sync: ISO 8601
 * }
 */

class DataNormalizer {
  
  /**
   * Normaliza array de partidas
   */
  normalizeMatches(rawMatches, provider = 'apiFootball') {
    if (!Array.isArray(rawMatches)) {
      console.warn('⚠️  Input não é um array. Retornando array vazio.');
      return [];
    }

    return rawMatches
      .map(match => this.normalizeMatch(match, provider))
      .filter(match => match !== null);
  }

  /**
   * Normaliza uma partida individual
   */
  normalizeMatch(rawMatch, provider = 'apiFootball') {
    try {
      if (provider === 'apiFootball' || provider === 'mock') {
        return this.normalizeApiFootballMatch(rawMatch);
      }

      if (provider === 'theOddsApi') {
        return this.normalizeTheOddsApiMatch(rawMatch);
      }

      console.warn(`⚠️  Provedor ${provider} não mapeado. Usando fallback...`);
      return this.normalizeGenericMatch(rawMatch);

    } catch (error) {
      console.error('❌ Erro ao normalizar partida:', error.message);
      return null;
    }
  }

  /**
   * Normaliza partida do formato API-Football
   */
  normalizeApiFootballMatch(match) {
    const { fixture, teams, goals, league } = match;

    if (!fixture || !teams || !league) {
      console.warn('❌ Partida com dados incompletos:', match);
      return null;
    }

    const statusMap = {
      'NS': 'Agendada',
      'TBD': 'A definir',
      '1H': 'Primeiro tempo',
      'HT': 'Intervalo',
      '2H': 'Segundo tempo',
      'ET': 'Prorrogação',
      'BT': 'Intervalo prorrogação',
      'P': 'Pênaltis',
      'SUSP': 'Suspensa',
      'INT': 'Interrompida',
      'FT': 'Finalizada',
      'AET': 'Finalizada (AET)',
      'PEN': 'Finalizada (Pênaltis)',
      'CANC': 'Cancelada',
      'ABD': 'Abandonada',
      'AWD': 'Decidida nos papéis',
      'WO': 'Vitória de W.O',
      'LIVE': 'Ao Vivo'
    };

    const cleanTeamName = (name) => {
      return name
        .replace(/ (FC|CF|SC|AF|SFC|SAD)$/, '')
        .trim();
    };

    const status = statusMap[fixture.status] || fixture.status || 'Agendada';
    
    // Se está agendada e tem horário, mostra o horário
    let displayStatus = status;
    if (fixture.status === 'NS' && fixture.date) {
      const matchTime = new Date(fixture.date);
      displayStatus = `${String(matchTime.getHours()).padStart(2, '0')}:${String(matchTime.getMinutes()).padStart(2, '0')}`;
    }

    // Detecta se há um gol acontecendo (usar em tempo real com websockets futuramente)
    // Prioridade: usar campo meta se disponível, caso contrário simular
    let acontecendo_gol = match._prosporte_meta?.acontecendo_gol ?? 
                          (['1H', '2H', 'ET'].includes(fixture.status) && Math.random() < 0.15);

    return {
      id_partida: String(fixture.id),
      casa: cleanTeamName(teams.home.name),
      fora: cleanTeamName(teams.away.name),
      placar_casa: goals?.home ?? 0,
      placar_fora: goals?.away ?? 0,
      status: displayStatus,
      liga: league.name,
      data_partida: fixture.date || new Date().toISOString(),
      timestamp_sync: new Date().toISOString(),
      acontecendo_gol: acontecendo_gol,
      _raw: {
        provider: 'apiFootball',
        homeId: teams.home.id,
        awayId: teams.away.id,
        leagueId: league.id
      }
    };
  }

  /**
   * Normaliza partida do formato The-Odds-API
   */
  normalizeTheOddsApiMatch(match) {
    // The-Odds-API tem estrutura diferente
    // Implementar conforme necessário
    return {
      id_partida: String(match.id || Math.random()),
      casa: match.home_team || 'Time A',
      fora: match.away_team || 'Time B',
      placar_casa: match.scores?.home ?? 0,
      placar_fora: match.scores?.away ?? 0,
      status: match.status || 'Agendada',
      liga: match.league || 'Liga Desconhecida',
      data_partida: match.commence_time || new Date().toISOString(),
      timestamp_sync: new Date().toISOString(),
      _raw: {
        provider: 'theOddsApi'
      }
    };
  }

  /**
   * Normaliza partida genérica (fallback)
   */
  normalizeGenericMatch(match) {
    return {
      id_partida: String(match.id || match.fixture?.id || Math.random()),
      casa: match.teams?.home?.name || match.home_team || 'Time A',
      fora: match.teams?.away?.name || match.away_team || 'Time B',
      placar_casa: match.goals?.home ?? match.scores?.home ?? 0,
      placar_fora: match.goals?.away ?? match.scores?.away ?? 0,
      status: match.status || 'Agendada',
      liga: match.league?.name || match.league || 'Liga Desconhecida',
      data_partida: match.date || match.commence_time || new Date().toISOString(),
      timestamp_sync: new Date().toISOString(),
      _raw: {
        provider: 'desconhecido'
      }
    };
  }

  /**
   * Valida estrutura normalizada
   */
  validate(normalizedData) {
    const required = [
      'id_partida',
      'casa',
      'fora',
      'placar_casa',
      'placar_fora',
      'status',
      'liga',
      'data_partida',
      'timestamp_sync'
    ];

    const missing = required.filter(field => !normalizedData.hasOwnProperty(field));

    if (missing.length > 0) {
      console.warn(`⚠️  Campos faltantes:`, missing);
      return false;
    }

    return true;
  }
}

module.exports = new DataNormalizer();
