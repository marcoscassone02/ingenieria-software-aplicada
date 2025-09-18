#!/bin/bash

echo "🛑 Deteniendo stack ELK..."

# Detener aplicación
echo "🏗️ Deteniendo aplicación..."
docker-compose -f src/main/docker/postgresql.yml -f src/main/docker/app-with-logging.yml down

# Detener ELK stack
echo "📊 Deteniendo ELK stack..."
docker-compose -f src/main/docker/elk.yml down

echo "✅ Stack detenido completamente!"
