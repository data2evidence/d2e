FROM node:18.20.4-alpine as builder

RUN apk add --update yarn

WORKDIR /home/builder

COPY --chown=docker:alp --chmod=711 ./src src/
COPY --chown=docker:alp --chmod=711 package.json tsconfig.json ./

RUN yarn install && yarn compile

FROM node:18.20.4-alpine as final

RUN apk add --update bash yarn

RUN addgroup -S alp -g 3000 && adduser --uid 3000 -S docker -G alp

USER docker

WORKDIR /home/docker

COPY --from=builder --chown=docker:alp --chmod=711 /home/builder/target/ target/
COPY --chown=docker:alp --chmod=711 package.json ./

RUN yarn install --prod --ignore-scripts
RUN yarn cache clean

#ARG
#GIT COMMIT Passed during docker build time
ARG GIT_COMMIT_ARG

# ENV
ENV GIT_COMMIT=$GIT_COMMIT_ARG

ENTRYPOINT ["yarn", "start"]

EXPOSE ${ALP_INGESTION_HTTP_PORT}