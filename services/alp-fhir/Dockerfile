FROM medplum/medplum-server:3.2.18 AS builder

COPY config.json .

COPY --chown=docker:docker --chmod=711 start.sh start.sh

FROM node:18.20.4-slim

WORKDIR /home/docker/app

COPY --from=builder /usr/src/medplum ./medplum
COPY ./src/duckdb .
COPY package-server.json ./package.json

RUN yarn install
RUN apt update && apt install -y gettext jq wget

#ARG
#GIT COMMIT Passed during docker build time
ARG GIT_COMMIT_ARG

# ENV
ENV GIT_COMMIT=$GIT_COMMIT_ARG

WORKDIR /home/docker/app/medplum
ENTRYPOINT [ "sh", "start.sh" ]
# CMD ["tail", "-f", "/dev/null"]
