FROM gradle:jdk17 AS build
WORKDIR /builder/
COPY src ./src
COPY build.gradle ./build.gradle
RUN gradle bootJar

FROM openjdk:17-slim
COPY --from=build /builder/build/libs/*.jar ./app.jar
ENTRYPOINT java -jar ./app.jar
EXPOSE 8080