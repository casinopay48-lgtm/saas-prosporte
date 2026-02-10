#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const LOG_PATH = path.join(ROOT, 'auth_test_output.log');
const SERVER_FILE = path.join(ROOT, 'hub-server.js');
const TEST_FILE = path.join(ROOT, 'run_auth_test.js');

function now() { return new Date().toISOString(); }
function writeLog(prefix, data) {
  const text = `[${now()}] ${prefix} ${String(data).trim()}\n`;
  fs.appendFileSync(LOG_PATH, text);
  process.stdout.write(text);
}

async function waitForHealth(url = 'http://localhost:3000/api/v1/health', timeoutMs = 10000, retryMs = 500) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 1000);
      const res = await fetch(url, { signal: ac.signal });
      clearTimeout(t);
      if (res.ok) return true;
    } catch (err) {
      // swallow and retry
    }
    await new Promise(r => setTimeout(r, retryMs));
  }
  return false;
}

async function main() {
  // fresh log
  try { fs.writeFileSync(LOG_PATH, `--- E2E AUTH RUN ${now()} ---\n`); } catch (e) {}

  writeLog('INFO', 'Starting hub-server.js');
  const server = spawn(process.execPath, [SERVER_FILE], { cwd: ROOT, env: process.env });

  server.stdout.on('data', d => writeLog('SERVER_OUT', d.toString()));
  server.stderr.on('data', d => writeLog('SERVER_ERR', d.toString()));

  server.on('exit', (code, sig) => writeLog('SERVER_EXIT', `code=${code} sig=${sig}`));

  const ready = await waitForHealth();
  if (!ready) {
    writeLog('ERROR', 'health check failed (timeout)');
    // ensure server killed
    try { server.kill(); } catch(e){}
    process.exit(1);
  }

  writeLog('INFO', 'SERVER_READY');

  // run the test script
  writeLog('INFO', `Running test: ${TEST_FILE}`);
  const test = spawn(process.execPath, [TEST_FILE], { cwd: ROOT, env: process.env });

  test.stdout.on('data', d => writeLog('TEST_OUT', d.toString()));
  test.stderr.on('data', d => writeLog('TEST_ERR', d.toString()));

  const code = await new Promise(resolve => test.on('exit', resolve));

  writeLog('INFO', `Test finished with code ${code}`);

  // shutdown server
  try {
    server.kill();
    writeLog('INFO', 'Sent kill to server process');
  } catch (e) {
    writeLog('WARN', 'Failed to kill server process');
  }

  // give server a moment
  await new Promise(r => setTimeout(r, 500));

  process.exit(code === 0 ? 0 : 1);
}

main().catch(err => {
  writeLog('FATAL', err && err.stack ? err.stack : String(err));
  process.exit(1);
});
