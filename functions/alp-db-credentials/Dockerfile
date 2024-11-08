ARG IMAGE=node:18.20.4-alpine

FROM $IMAGE AS development

WORKDIR /usr/src/app

COPY --chown=node:node --chmod=711 package.json ./
COPY --chown=node:node --chmod=711 yarn.lock ./

RUN yarn install --network-timeout 1000000 --frozen-lockfile

RUN apk update && \
    apk add --upgrade openssl

COPY --chown=node:node --chmod=711 . .

USER node

FROM $IMAGE AS build

WORKDIR /usr/src/app

COPY --chown=node:node --chmod=711 package.json ./
COPY --chown=node:node --chmod=711 yarn.lock ./

COPY --chown=node:node --chmod=711 --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node --chmod=711 . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --production &&\
    yarn autoclean --force &&\
    yarn cache clean

FROM $IMAGE AS production

RUN apk update && \
    apk add --upgrade openssl

RUN rm -rf /usr/local/lib/node_modules/npm

RUN addgroup -S alp -g 3000 && adduser --uid 3000 -S docker -G alp
USER docker

WORKDIR /usr/src/app

COPY --chown=docker:alp --chmod=711 --from=build /usr/src/app/dist ./dist
COPY --chown=docker:alp --chmod=711 --from=build /usr/src/app/node_modules ./node_modules

ENTRYPOINT ["node", "dist/main.js"]
EXPOSE ${PORT}