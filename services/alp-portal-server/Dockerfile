ARG IMAGE=node:18.20.1-alpine

FROM $IMAGE AS development

WORKDIR /usr/src/app

COPY --chown=node:node --chmod=711 package.json ./
COPY --chown=node:node --chmod=711 yarn.lock ./

RUN --mount=type=cache,target=~/.cache/yarn \
    yarn install --network-timeout 1000000 --frozen-lockfile

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

RUN --mount=type=cache,target=~/.cache/yarn \
    yarn install --production --network-timeout 1000000 &&\
    yarn autoclean --force &&\
    yarn cache clean

USER node

FROM $IMAGE AS production

RUN apk update && apk add busybox=1.36.1-r19 \
    openssl>3

RUN rm -rf /usr/local/lib/node_modules/npm

RUN addgroup -S alp -g 3000 && adduser --uid 3000 -S docker -G alp
USER docker

WORKDIR /usr/src/app

COPY --chown=docker:alp --chmod=711 --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=docker:alp --chmod=711 --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]