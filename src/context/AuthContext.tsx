import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken, STORAGE_TOKEN_KEY } from '../services/api';
import { STORAGE_KEYS } from '../constants/storage';

type Role = 'admin' | 'banca' | 'cambista' | 'client' | null;

interface AuthState {
  token: string | null;
  role: Role;
  user?: any | null;
  authenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, role: Role, user?: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    user: null,
    authenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
        if (stored) {
          setAuthToken(stored);
          // Opcional: Validar token com o servidor
          const resp = await api.get('/api/v1/auth/me').catch(() => null);

          if (resp && resp.data) {
            const remoteRole = resp.data?.role ?? resp.data?.user?.role ?? null;
            const normalized = remoteRole ? String(remoteRole).toLowerCase() : null;
            const user = resp.data?.user ?? resp.data ?? null;
            setState({ token: stored, role: normalized as Role, user, authenticated: true, isLoading: false });
          } else {
            // Se falhar a validação, mas houver token, decide se mantém ou limpa
            // Aqui optamos por limpar para garantir segurança
            throw new Error('Token inválido');
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error('Auth load failed', err);
        await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
        setState({ token: null, role: null, user: null, authenticated: false, isLoading: false });
      }
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (token: string, role: Role, user?: any) => {
    try {
      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
      if (user) await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setAuthToken(token);
      setState({ token, role, user: user ?? null, authenticated: true, isLoading: false });
    } catch (e) {
      console.error('store token failed', e);
    }
  }, []);

  const logout = useCallback(() => {
    setState({ token: null, role: null, user: null, authenticated: false, isLoading: false });
    AsyncStorage.removeItem(STORAGE_TOKEN_KEY).catch(e => console.error('remove token failed', e));
    AsyncStorage.removeItem(STORAGE_KEYS.USER).catch(e => console.error('remove user failed', e));
    setAuthToken(undefined);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
