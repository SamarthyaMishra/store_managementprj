# ----------------------
# Stage 1: Build the app
# ----------------------
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy Maven files
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests

# ----------------------
# Stage 2: Run the app
# ----------------------
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java","-jar","app.jar"]
