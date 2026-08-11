#!/usr/bin/env bash
set -e

echo "🚀 Iniciando Deploy Seguro — Site CDC (super.cdc.org.br)"
echo "--------------------------------------------------------"

# 1. Puxar alterações mais recentes do repositório Git
echo "📥 Atualizando código fonte do repositório Git..."
git pull origin main

# 2. Verificar permissões do arquivo .env
if [ -f .env ]; then
  chmod 600 .env
  echo "🔒 Permissões de segurança aplicadas no arquivo .env (chmod 600)"
else
  echo "⚠️ Arquivo .env não encontrado! Criando a partir de .env.example..."
  cp .env.example .env
  chmod 600 .env
fi

# 3. Garantir existência e permissões da pasta de uploads
mkdir -p uploads
chmod -R 777 uploads

# 4. Reconstrução e inicialização dos contêineres Docker
echo "🐳 Reconstruindo contêineres Docker em segundo plano..."
docker compose build
docker compose up -d postgres
docker compose run --rm backend npm run migrate
docker compose up -d

# 5. Status dos contêineres
echo "--------------------------------------------------------"
echo "📊 Status dos Serviços em Execução:"
docker compose ps

echo "--------------------------------------------------------"
echo "✅ Deploy concluído com sucesso!"
