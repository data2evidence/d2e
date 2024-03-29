ARG libs_install_type_arg=submodule

FROM node:18.14.0-alpine AS libs-install-from-submodule
# Install python dependency for node-gyp
RUN apk add --no-cache python3 py3-pip make g++

WORKDIR /usr/src

COPY ./alp-libs/nodejs ./libs
COPY ./alp-libs/nodejs/package.json .

RUN mkdir -p alp-data-node/alp-db-svc/db/drivers
RUN mkdir -p alp-data-node/alp-db-svc/db/migrations/liquibase/

COPY ./services/alp-db-svc/db alp-data-node/alp-db-svc/db/
COPY ./services/alp-db-svc/package.json alp-data-node/alp-db-svc/
COPY ./services/alp-db-svc/tsconfig.json alp-data-node/alp-db-svc/
COPY ./services/alp-db-svc/src alp-data-node/alp-db-svc/src/

ADD https://github.com/liquibase/liquibase/releases/download/v4.5.0/liquibase-4.5.0.tar.gz alp-data-node/alp-db-svc/db/migrations/

RUN tar xvf alp-data-node/alp-db-svc/db/migrations/liquibase-4.5.0.tar.gz -C alp-data-node/alp-db-svc/db/migrations/liquibase/

RUN yarn install --network-timeout 1000000
RUN yarn workspace @alp/alp-base-utils run compile

FROM libs-install-from-${libs_install_type_arg} AS final-build

WORKDIR /usr/envConverter
COPY ./services/envConverter .
RUN yarn install

FROM node:18.14.0-alpine
RUN addgroup -S alp -g 3000 && adduser --uid 3000 -S docker -G alp
RUN apk add --update --upgrade bash yarn openjdk11 zlib

USER docker

WORKDIR /home/docker/

COPY --chown=docker:alp --chmod=711 --from=final-build /usr/src ./

WORKDIR /home/docker/alp-data-node/alp-db-svc/

RUN yarn compile
RUN yarn cache clean

#ARG
#GIT COMMIT Passed during docker build time
ARG GIT_COMMIT_ARG

# ENV
ENV GIT_COMMIT=$GIT_COMMIT_ARG

COPY --chown=docker:alp --chmod=711 ./services/alp-db-svc/start.sh .

COPY --chown=docker:alp --chmod=711 --from=final-build /usr/envConverter envConverter/

CMD ["sh", "start.sh"]

EXPOSE ${DB_SVC__PORT}