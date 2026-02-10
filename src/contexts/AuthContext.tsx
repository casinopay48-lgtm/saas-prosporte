import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';
import { STORAGE_KEYS } from '../constants/storage';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (token, userData) => {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    setAuthToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    setAuthToken();
    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

        if (token) {
          setAuthToken(token);
          const { data } = await api.get('/me');
          setUser(data);
        }
      } catch (err) {
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
        setAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
