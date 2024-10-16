FROM perseushub/backend:latest

WORKDIR /app
RUN mkdir ./config

COPY ./config ./config
COPY --chown=docker:docker --chmod=711 init.sh .

ENTRYPOINT ["sh","./init.sh"]