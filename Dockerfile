# ==========================
# Etapa de build con Maven + Node.js 20
# ==========================
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Instalar Node.js 20 (LTS)
RUN apt-get update && apt-get install -y curl gnupg \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# Verificar versiones
RUN node -v && npm -v

# Directorio de trabajo
WORKDIR /app

# Copiar proyecto completo (incluye pom.xml y src/)
COPY . .

# Compilar la aplicación (skip tests para acelerar, y skip sonar)
RUN ./mvnw clean package -DskipTests -B -Dsonar.skip=true

# ==========================
# Etapa de runtime (producción)
# ==========================
FROM eclipse-temurin:17-jre-jammy

# Instalar dependencias mínimas
RUN apt-get update && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copiar el JAR construido en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Dar permisos al usuario no-root
RUN chown -R appuser:appuser /app
USER appuser

# Exponer el puerto
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/management/health || exit 1

# Ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
