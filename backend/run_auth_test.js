(async () => {
  try {
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@saasportes.com', password: 'Admin@123' })
    });
    console.log('LOGIN_STATUS', loginRes.status);
    const loginJson = await loginRes.json();
    console.log('LOGIN_PAYLOAD', JSON.stringify(loginJson, null, 2));

    if (!loginJson.token) {
      console.error('No token returned');
      process.exit(2);
    }

    const token = loginJson.token;
    const meRes = await fetch('http://localhost:3000/api/v1/auth/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('ME_STATUS', meRes.status);
    const meJson = await meRes.json();
    console.log('ME_PAYLOAD', JSON.stringify(meJson, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('ERROR', err && err.message || err);
    process.exit(1);
  }
})();
