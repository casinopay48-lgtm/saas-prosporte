jest.mock('@react-native-async-storage/async-storage');

const AsyncStorage = require('@react-native-async-storage/async-storage');
const axios = require('axios');

// Criamos uma instância local equivalente ao que o app registra
const api = axios.create({ baseURL: 'https://api.prosporte.com.br', timeout: 15000 });
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@saasportes:token');
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
}, (err) => Promise.reject(err));

describe('API Auth Interceptor', () => {
  it('injeta o header Authorization com Bearer token', async () => {
    // arrange
    AsyncStorage.getItem.mockResolvedValue('TOKEN_DE_TESTE_123');

    // axios chama o adapter após os interceptors — usamos um adapter fake
    const res = await api.get('/test', {
      adapter: (config) => Promise.resolve({ status: 200, data: config, headers: {}, config }),
    });

    // assert: o adapter recebeu o config já modificado pelo interceptor
    expect(res.data.headers.Authorization).toBe('Bearer TOKEN_DE_TESTE_123');
  });
});
