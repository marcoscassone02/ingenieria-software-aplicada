#!/bin/bash

echo "🔧 Configurando Kibana para visualizar logs..."

# Esperar a que Kibana esté completamente listo
echo "⏳ Esperando a que Kibana esté listo..."
sleep 10

# Crear el index pattern para los logs de Docker
echo "📊 Creando index pattern para logs de Docker..."
curl -X POST "http://localhost:5601/api/saved_objects/index-pattern/docker-logs-*" \
  -H "Content-Type: application/json" \
  -H "kbn-xsrf: true" \
  -d '{
    "attributes": {
      "title": "docker-logs-*",
      "timeFieldName": "@timestamp"
    }
  }' 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Index pattern creado exitosamente"
else
    echo "⚠️  El index pattern ya existe o hubo un error"
fi

# Crear un dashboard básico para los logs
echo "📈 Creando dashboard básico para logs..."
curl -X POST "http://localhost:5601/api/saved_objects/dashboard/docker-logs-dashboard" \
  -H "Content-Type: application/json" \
  -H "kbn-xsrf: true" \
  -d '{
    "attributes": {
      "title": "Docker Logs Dashboard",
      "panelsJSON": "[{\"version\":\"8.11.0\",\"type\":\"lens\",\"gridData\":{\"x\":0,\"y\":0,\"w\":24,\"h\":15,\"i\":\"1\"},\"panelIndex\":\"1\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsDatatable\",\"type\":\"lens\",\"references\":[],\"state\":{\"datasourceStates\":{\"formBased\":{\"layers\":{\"layer1\":{\"columnOrder\":[\"col1\"],\"columns\":{\"col1\":{\"label\":\"Count\",\"dataType\":\"number\",\"operationType\":\"count\",\"isBucketed\":false,\"scale\":\"ratio\",\"sourceField\":\"Records\"}},\"incompleteColumns\":{}}}},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[],\"visualization\":{\"columns\":[{\"columnId\":\"col1\",\"isTransposed\":false,\"alignment\":\"left\"}],\"layerId\":\"layer1\",\"layerType\":\"data\"},\"datasourceId\":\"formBased\",\"preferredSeriesType\":\"bar_stacked\"}}},\"panelRefName\":\"panel_1\"}}]",
      "optionsJSON": "{\"useMargins\":true,\"syncColors\":false,\"hidePanelTitles\":false}",
      "version": 1,
      "timeRestore": false,
      "kibanaSavedObjectMeta": {
        "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
      }
    }
  }' 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Dashboard creado exitosamente"
else
    echo "⚠️  El dashboard ya existe o hubo un error"
fi

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "🌐 Accede a Kibana en: http://localhost:5601"
echo "📊 Para ver los logs:"
echo "   1. Ve a 'Discover' en el menú lateral"
echo "   2. Selecciona el index pattern 'docker-logs-*'"
echo "   3. Configura el rango de tiempo (últimas horas/días)"
echo ""
echo "📈 Para ver el dashboard:"
echo "   1. Ve a 'Dashboard' en el menú lateral"
echo "   2. Abre 'Docker Logs Dashboard'"
echo ""
echo "🔍 Para buscar logs específicos:"
echo "   - Usa la barra de búsqueda con queries como:"
echo "     * container.name:logstash"
echo "     * message:*error*"
echo "     * service:ingenieria-software-aplicada"
