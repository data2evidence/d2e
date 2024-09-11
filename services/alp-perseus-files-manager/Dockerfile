FROM perseushub/files-manager:latest

RUN apk add --no-cache postgresql-client
RUN mkdir ./config

COPY ./config ./config
COPY --chown=docker:docker --chmod=711 init.sh .

ENTRYPOINT ["sh","./init.sh"]
