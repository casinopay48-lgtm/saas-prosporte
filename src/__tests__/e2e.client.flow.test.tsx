import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TextInput, TouchableOpacity } from 'react-native';

// increase timeout for this integration-style test
jest.setTimeout(20000);

// Mocks
jest.mock('../services/api', () => ({
  api: { post: jest.fn(), get: jest.fn() },
  setAuthToken: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';
import RegisterScreen from '../screens/RegisterScreen';
import { AuthProvider } from '../context/AuthContext';
import { getInitialRouteForRole } from '../navigation/routeUtils';

describe('E2E CLIENT flow (Jest integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('register -> save token -> navigate to AppClient and disallow admin routes', async () => {
    // Mock API response for register
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {
        token: 'fake-jwt-token-client',
        user: { id: 10, email: 'cliente@teste.com', role: 'CLIENT' },
      },
    });

    const navigationMock: any = { replace: jest.fn(), navigate: jest.fn() };

    let tree: any;

    await act(async () => {
      tree = renderer.create(
        <AuthProvider>
          <RegisterScreen navigation={navigationMock} />
        </AuthProvider>
      );
    });

    const root = tree.root;
    const inputs = root.findAllByType(TextInput);
    // Expect three inputs: name, email, password
    expect(inputs.length).toBeGreaterThanOrEqual(3);

    // Fill inputs
    await act(async () => {
      inputs[0].props.onChangeText('Cliente Integracao');
      inputs[1].props.onChangeText('cliente@teste.com');
      inputs[2].props.onChangeText('Senha123');
    });

    const buttons = root.findAllByType(TouchableOpacity);
    // Find the register button (first TouchableOpacity with buttonText)
    const registerButton = buttons.find(b => b.props.accessibilityRole === undefined || true);

    // Press register
    await act(async () => {
      registerButton.props.onPress();
      // allow promises to resolve
      await Promise.resolve();
    });

    // AsyncStorage.setItem should have been called with stored token
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@saasportes:token', 'fake-jwt-token-client');

    // setAuthToken should be called to configure axios
    expect(setAuthToken).toHaveBeenCalledWith('fake-jwt-token-client');

    // Navigation should replace to AppClient
    expect(navigationMock.replace).toHaveBeenCalledWith('AppClient');

    // Role-to-route mapping: ensure client maps to AppClient and not admin/banca/supervisor
    expect(getInitialRouteForRole('client')).toBe('AppClient');
    expect(getInitialRouteForRole('client')).not.toBe('Admin');
    expect(getInitialRouteForRole('client')).not.toBe('Banca');
    expect(getInitialRouteForRole('client')).not.toBe('Cambista');
  });
});
