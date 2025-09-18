# 🚀 Stack ELK para Logs de Docker

Este proyecto incluye un stack ELK (Elasticsearch, Logstash, Kibana) completo para centralizar y analizar los logs de los contenedores Docker.

## 📋 Componentes

- **Elasticsearch**: Base de datos para almacenar logs
- **Logstash**: Procesador de logs
- **Kibana**: Interfaz web para visualizar logs

## 🚀 Inicio Rápido

### 1. Iniciar todo el stack

```bash
./start-elk-stack.sh
```

### 2. Acceder a las interfaces

- **Aplicación**: http://localhost:8080
- **Kibana**: http://localhost:5601
- **Elasticsearch**: http://localhost:9200
- **Logstash**: http://localhost:9600

### 3. Detener el stack

```bash
./stop-elk-stack.sh
```

## 📊 Configuración de Kibana

### Primera configuración:

1. Ve a http://localhost:5601
2. Crea un índice con el patrón: `docker-logs-*`
3. Configura el campo de timestamp: `@timestamp`

### Dashboards recomendados:

- **Logs en tiempo real**: Para ver logs en vivo
- **Errores por servicio**: Para identificar problemas
- **Métricas de rendimiento**: Para análisis de performance

## 🔍 Comandos útiles

### Ver logs en tiempo real:

```bash
# Logs de Logstash
docker logs -f logstash

# Logs de Elasticsearch
docker logs -f elasticsearch

# Logs de Kibana
docker logs -f kibana
```

### Verificar estado de servicios:

```bash
# Estado de ELK
docker-compose -f src/main/docker/elk.yml ps

# Estado de aplicación
docker-compose -f src/main/docker/postgresql.yml -f src/main/docker/app-with-logging.yml ps
```

### Limpiar datos de Elasticsearch:

```bash
docker-compose -f src/main/docker/elk.yml down -v
```

## 📁 Estructura de archivos

```
src/main/docker/
├── elk.yml                    # Configuración principal de ELK
├── app-with-logging.yml       # App con logging configurado
├── logstash/
│   ├── config/
│   │   └── logstash.yml       # Configuración de Logstash
│   └── pipeline/
│       └── docker-logs.conf    # Pipeline para procesar logs
├── start-elk-stack.sh         # Script para iniciar todo
└── stop-elk-stack.sh          # Script para detener todo
```

## 🎯 Características

- ✅ **Logs centralizados**: Todos los logs en un solo lugar
- ✅ **Búsqueda avanzada**: Encuentra errores rápidamente
- ✅ **Visualizaciones**: Dashboards interactivos
- ✅ **Tiempo real**: Logs en vivo
- ✅ **Escalable**: Maneja millones de logs
- ✅ **Filtros inteligentes**: Por servicio, nivel, fecha, etc.

## 🚨 Solución de problemas

### Elasticsearch no inicia:

- Verificar que el puerto 9200 esté libre
- Aumentar memoria disponible (mínimo 2GB)

### Logstash no procesa logs:

- Verificar configuración del pipeline
- Revisar logs: `docker logs logstash`

### Kibana no se conecta:

- Verificar que Elasticsearch esté corriendo
- Esperar unos minutos para la inicialización

## 📈 Próximos pasos

1. **Configurar alertas**: Notificaciones automáticas de errores
2. **Dashboards personalizados**: Métricas específicas de tu aplicación
3. **Retención de logs**: Políticas de limpieza automática
4. **Integración con monitoreo**: Conectar con Prometheus/Grafana
