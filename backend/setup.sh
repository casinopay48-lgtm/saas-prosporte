#!/bin/bash

echo "================================"
echo "ProSporte Backend - Setup"
echo "================================"
echo ""

echo "1️⃣ Verificando Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node -v) encontrado"
else
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 14+ em https://nodejs.org"
    exit 1
fi

echo ""
echo "2️⃣ Instalando dependências..."
npm install

echo ""
echo "3️⃣ Criando arquivo .env..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Arquivo .env criado (edite com suas chaves de API)"
else
    echo "✅ Arquivo .env já existe"
fi

echo ""
echo "4️⃣ Criando pasta de dados..."
mkdir -p data

echo ""
echo "================================"
echo "✅ Setup concluído!"
echo "================================"
echo ""
echo "Para iniciar o servidor, execute:"
echo "   npm start"
echo ""
echo "Para desenvolvimento (hot-reload):"
echo "   npm run dev"
echo ""
