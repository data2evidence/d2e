FROM perseushub/white-rabbit:latest as build

RUN microdnf update
RUN microdnf module enable postgresql:13
RUN microdnf install postgresql.x86_64
RUN mkdir ./config

COPY ./config ./config
COPY --chown=docker:docker --chmod=711 init.sh .

EXPOSE 8000

ENTRYPOINT [ "sh", "init.sh" ]