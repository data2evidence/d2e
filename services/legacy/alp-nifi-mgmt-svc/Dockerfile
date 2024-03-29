FROM python:3.7-alpine


RUN apk add --no-cache --update-cache --repository http://nl.alpinelinux.org/alpine/v3.14/main nodejs~=14
RUN apk add --update --no-cache g++ gcc libxslt-dev yarn

WORKDIR /usr/app

# Node Setup
COPY ./services/alp-nifi-mgmt-svc/src src/
COPY ./services/alp-nifi-mgmt-svc/package.json .
COPY ./services/alp-nifi-mgmt-svc/tsconfig.json .
RUN yarn install --network-timeout 1000000 && yarn build
RUN yarn cache clean

# Python Library Setup
COPY ./services/alp-nifi-mgmt-svc/py_nifi_modules/libs py_nifi_modules/libs/
COPY ./services/alp-nifi-mgmt-svc/py_nifi_modules/utils py_nifi_modules/utils/
COPY ./services/alp-nifi-mgmt-svc/py_nifi_modules/app.py py_nifi_modules/
COPY ./services/alp-nifi-mgmt-svc/py_nifi_modules/requirements.txt py_nifi_modules/
RUN pip install -r ./py_nifi_modules/requirements.txt

ARG GIT_COMMIT_ARG
ENV GIT_COMMIT=$GIT_COMMIT_ARG

USER docker
EXPOSE 4444

ENTRYPOINT ["yarn", "start"]

