ARG IMAGE=node:18.20.1-alpine
FROM $IMAGE AS builder

RUN apk add --update yarn

WORKDIR /home/builder

COPY --chown=docker:alp --chmod=711 ./app app/

RUN cd app && yarn install --network-timeout 1000000 && yarn postinstall


FROM $IMAGE as final

RUN apk update && apk add busybox=1.36.1-r19
RUN apk add --update --upgrade bash yarn zlib

RUN rm -rf /usr/local/lib/node_modules/npm

RUN addgroup -S alp -g 3000 && adduser --uid 3000 -S docker -G alp

USER docker

WORKDIR /home/docker

COPY --from=builder --chown=docker:alp --chmod=711 /home/builder/app/target/ target/
COPY --chown=docker:alp --chmod=711 ./app/package.json .

RUN yarn install --network-timeout 1000000 --prod --ignore-scripts
RUN yarn cache clean

#ARG
#GIT COMMIT Passed during docker build time
ARG GIT_COMMIT_ARG

# ENV
ENV GIT_COMMIT=$GIT_COMMIT_ARG

ENTRYPOINT ["yarn", "start"]