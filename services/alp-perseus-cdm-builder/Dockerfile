FROM perseushub/cdm-builder:latest

RUN apt-get update && apt-get install -y postgresql-client
RUN mkdir ./config

COPY ./config ./config
COPY --chown=docker:docker --chmod=711 init.sh .
WORKDIR /app
ENTRYPOINT ["sh","./init.sh"]
