export function getInitialRouteForRole(role?: string) {
  const r = (role || 'cambista').toLowerCase();
  if (r === 'admin') return 'Admin';
  if (r === 'banca') return 'Banca';
  if (r === 'client') return 'AppClient';
  return 'Cambista';
}

export default getInitialRouteForRole;
