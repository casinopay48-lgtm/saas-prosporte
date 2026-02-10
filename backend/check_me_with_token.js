#!/usr/bin/env node
// Simple helper to call /api/v1/auth/me and print status + body
// Usage:
//   TOKEN=... node backend/check_me_with_token.js
//   or: node backend/check_me_with_token.js <token>

const axios = require('axios');

const API = process.env.API || 'https://api.prosporte.com.br';
const TOKEN = process.argv[2] || process.env.TOKEN;

if (!TOKEN) {
  console.error('Missing token. Usage: TOKEN=... node backend/check_me_with_token.js OR node backend/check_me_with_token.js <token>');
  process.exit(2);
}

(async () => {
  try {
    const res = await axios.get(`${API}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      timeout: 10000,
    });

    console.log('HTTP', res.status);
    console.log(JSON.stringify(res.data, null, 2));
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.error('HTTP', err.response.status);
      try {
        console.error(JSON.stringify(err.response.data, null, 2));
      } catch (e) {
        console.error(err.response.data);
      }
      process.exit(1);
    } else {
      console.error('Error', err.message);
      process.exit(2);
    }
  }
})();
// Simple script to call /api/v1/auth/me using TOKEN from env
(async () => {
  try {
    const token = process.env.TOKEN || process.argv[2];
    if (!token) {
      console.error('ERROR: TOKEN env var not set');
      process.exit(2);
    }
    const res = await fetch('http://localhost:3000/api/v1/auth/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('STATUS', res.status);
    const json = await res.json();
    console.log('BODY', JSON.stringify(json, null, 2));
    process.exit(res.ok ? 0 : 1);
  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
