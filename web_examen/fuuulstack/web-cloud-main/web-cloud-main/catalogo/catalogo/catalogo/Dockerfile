# 1. Usamos Eclipse Temurin (la versión estable y moderna de Java 17)
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# 2. Copiamos los archivos
COPY . .

# 3. FIX PARA WINDOWS (Vital para ti):
# Instalamos dos2unix para arreglar los saltos de línea del archivo mvnw
RUN apt-get update && apt-get install -y dos2unix
RUN dos2unix mvnw

# 4. Damos permisos y construimos
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# 5. Configuración de puertos
ENV PORT=8080
EXPOSE 8080

# 6. Comando de arranque
# Usamos 'sh -c' para que el comodín *.jar funcione correctamente
CMD ["sh", "-c", "java -jar target/*.jar"]
