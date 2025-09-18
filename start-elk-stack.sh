#!/bin/bash

echo "🚀 Iniciando stack ELK..."

# Iniciar ELK stack
echo "📊 Iniciando Elasticsearch, Logstash y Kibana..."
docker-compose -f src/main/docker/elk.yml up -d

# Esperar a que ELK esté listo
echo "⏳ Esperando a que ELK esté listo..."
sleep 30

# Verificar que ELK esté funcionando
echo "🔍 Verificando estado de ELK..."
docker-compose -f src/main/docker/elk.yml ps

# Iniciar aplicación con logging
echo "🏗️ Iniciando aplicación con logging..."
docker-compose -f src/main/docker/postgresql.yml -f src/main/docker/app-with-logging.yml up -d

echo "✅ Stack completo iniciado!"
echo ""
echo "🌐 URLs de acceso:"
echo "   - Aplicación: http://localhost:8080"
echo "   - Kibana: http://localhost:5601"
echo "   - Elasticsearch: http://localhost:9200"
echo "   - Logstash: http://localhost:9600"
echo ""
echo "📋 Para ver logs en tiempo real:"
echo "   docker logs -f logstash"
echo "   docker logs -f elasticsearch"
