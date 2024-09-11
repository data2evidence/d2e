FROM node:18.20.4-alpine AS final-build

WORKDIR /usr/envConverter
COPY ./services/envConverter .
RUN yarn

FROM gethue/hue:4.11.0

RUN ./build/env/bin/pip install --no-cache-dir \
    hdbcli \
    sqlalchemy-hana==0.5.0 \
    mozilla-django-oidc

USER root
RUN npm install -g n yarn
RUN n 18.20.4

COPY --chown=hue:hue --chmod=711 --from=final-build /usr/envConverter ./envConverter/
COPY --chown=hue:hue --chmod=711 ./services/alp-sqleditor/sqleditor.ini .
COPY --chown=hue:hue --chmod=711 ./services/alp-sqleditor/init.sh .

USER hue
CMD [ "sh", "./init.sh" ]
