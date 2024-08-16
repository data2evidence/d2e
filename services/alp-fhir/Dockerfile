FROM medplum/medplum-server:3.2.2 as builder

COPY config.json .

COPY --chown=docker:docker --chmod=711 start.sh start.sh

FROM node:18.14.0-slim

RUN apt update && apt install -y gettext jq wget

RUN groupadd alp \
    && useradd docker -u 1001 \
    && adduser docker alp

USER docker

WORKDIR /home/docker/app

COPY --from=builder --chown=docker:docker --chmod=711 /usr/src/medplum ./medplum
COPY ./src/duckdb /home/docker/app/duckdb
# RUN mkdir ./duckdb
# RUN chown docker:alp ./duckdb

COPY package-server.json ./package.json

RUN yarn install

#ARG
#GIT COMMIT Passed during docker build time
ARG GIT_COMMIT_ARG

# ENV
ENV GIT_COMMIT=$GIT_COMMIT_ARG

WORKDIR /home/docker/app/medplum
ENTRYPOINT [ "sh", "start.sh" ]