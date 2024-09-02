FROM perseushub/white-rabbit:latest as build

FROM amazoncorretto:17-alpine-jdk as final
RUN apk add --no-cache postgresql-client
RUN mkdir ./config

COPY --from=build app.jar app.jar
COPY ./config ./config
COPY --chown=docker:docker --chmod=711 init.sh .

EXPOSE 8000

ENTRYPOINT [ "sh", "init.sh" ]