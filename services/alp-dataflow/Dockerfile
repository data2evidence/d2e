ARG IMAGE=node:18.14.0-alpine

FROM $IMAGE AS node_python
RUN apk add --no-cache python3 py3-pip
# To support pip install from git repo
RUN apk add --no-cache git
# To fix pendulum timezone bug with prefect in node alpine image
RUN echo UTC > /etc/timezone

FROM node_python AS development

WORKDIR /usr/src/app

RUN python -m venv /usr/src/app/venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

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

ENV NODE_ENV=production

RUN --mount=type=cache,target=~/.cache/yarn \
    yarn install --production --network-timeout 1000000 &&\
    yarn autoclean --force &&\
    yarn cache clean

USER node

FROM node_python AS production

RUN rm -rf /usr/local/lib/node_modules/npm

RUN addgroup -S alp -g 3000 && adduser --uid 3000 -S docker -G alp
USER docker


WORKDIR /usr/src/app

COPY --chown=docker:alp --chmod=711 --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=docker:alp --chmod=711 --from=build /usr/src/app/dist ./dist

COPY --chown=docker:alp --chmod=711 --from=development /usr/src/app/venv ./venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

CMD [ "node", "dist/main.js" ]