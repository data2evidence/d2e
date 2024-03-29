FROM ghcr.io/logto-io/logto:1.14

COPY ./connector-alp-azuread /etc/logto/packages/connectors/connector-alp-azuread

WORKDIR /etc/logto/packages/connectors/connector-alp-azuread

RUN yarn
RUN yarn build

WORKDIR /etc/logto/

RUN npx @logto/cli connector link

RUN ls -l /etc/logto/packages/core/connectors/