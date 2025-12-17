# 1. Usamos una imagen base de Java 17 (o la versión que uses) ligera
FROM openjdk:17-jdk-slim

# 2. Definimos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos todos los archivos de tu proyecto al contenedor
COPY . .

# 4. SOLUCIÓN PARA WINDOWS:
# Le damos permisos de ejecución al mvnw y arreglamos posibles errores de formato de Windows
RUN chmod +x mvnw

# 5. Construimos la aplicación (saltando los tests para ir más rápido)
RUN ./mvnw clean package -DskipTests

# 6. Le decimos al contenedor que escuche en el puerto que Render asigne
# (Render usa la variable PORT automáticamente)
ENV PORT=8082
EXPOSE 8082

# 7. Comando para iniciar la app
# Usamos un comodín (*.jar) para no preocuparnos por la versión del nombre del archivo
CMD ["java", "-jar", "target/carrito-0.0.1-SNAPSHOT.jar"]
