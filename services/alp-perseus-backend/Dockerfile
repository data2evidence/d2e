FROM perseushub/backend:latest

RUN apt update && apt install -y postgresql-client

WORKDIR /app
RUN mkdir ./config

COPY ./config ./config
COPY --chown=docker:docker --chmod=711 init.sh .

ENTRYPOINT ["sh","./init.sh"]