#!/usr/bin/env node

/**
 * Servidor simples para visualizar o preview do ProSporte
 * Execute: node serve-preview.js
 * Acesse: http://localhost:8888
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8888;
const FILE = path.join(__dirname, 'prosporte-preview.html');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/prosporte-preview.html') {
    fs.readFile(FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao carregar arquivo: ' + err.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Arquivo não encontrado');
  }
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║          🎬 ProSporte Preview Server                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  ✅ Servidor rodando em: http://localhost:${PORT}           ║
║                                                                ║
║  Abra no seu navegador para ver:                              ║
║  • 3 partidas de exemplo                                      ║
║  • Bolinha verde piscando (acontecendo_gol = true)           ║
║  • Exemplo de JSON da API                                     ║
║                                                                ║
║  📝 Pressione Ctrl+C para parar                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Porta ${PORT} já está em uso!`);
    console.log(`\nTente: netstat -ano | findstr :${PORT}`);
  } else {
    console.error('Erro no servidor:', err);
  }
  process.exit(1);
});
