import { getInitialRouteForRole } from '../routeUtils';

describe('getInitialRouteForRole', () => {
  test('maps admin to Admin', () => {
    expect(getInitialRouteForRole('admin')).toBe('Admin');
  });

  test('maps banca to Banca', () => {
    expect(getInitialRouteForRole('banca')).toBe('Banca');
  });

  test('maps client to AppClient', () => {
    expect(getInitialRouteForRole('client')).toBe('AppClient');
  });

  test('unknown or supervisor maps to Cambista', () => {
    expect(getInitialRouteForRole('supervisor')).toBe('Cambista');
    expect(getInitialRouteForRole(undefined)).toBe('Cambista');
  });
});
