ARG IMAGE=node:18.14.0-alpine

FROM ${IMAGE} AS development

WORKDIR /usr/src

COPY ./alp-libs/nodejs/alp-base-utils ./libs/alp-base-utils
COPY ./alp-libs/nodejs/package.json .
COPY ./services/alp-terminology-svc/package.json alp-data-node/app/package.json

RUN  --mount=type=cache,target=~/.cache/yarn \
	yarn install --network-timeout 1000000 --frozen-lockfile

COPY ./services/alp-terminology-svc alp-data-node/app
#RUN yarn workspace @alp/alp-base-utils run compile
WORKDIR /usr/src/alp-data-node/app

FROM development AS final-build

WORKDIR /usr/

FROM ${IMAGE}

RUN apk add --update --upgrade openssl zlib
RUN rm -rf /usr/local/lib/node_modules/npm
RUN addgroup -S alp -g 3000 && adduser --uid 3000 -S docker -G alp

USER docker
WORKDIR /home/docker/

COPY --chown=docker:alp --chmod=711 --from=final-build /usr/src ./

WORKDIR /home/docker/alp-data-node/app/

RUN yarn build
RUN yarn cache clean

#ARG
#GIT COMMIT Passed during docker build time
ARG GIT_COMMIT_ARG
# ENV
ENV GIT_COMMIT=$GIT_COMMIT_ARG

ENTRYPOINT ["yarn", "start:docker"]
#CMD ["tail", "-f", "/dev/null"]
EXPOSE 41108 41111