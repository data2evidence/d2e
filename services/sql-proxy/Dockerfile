FROM python:3.11.1 AS base

ENV PYTHONUNBUFFERED=1
ENV TZ=UTC
ENV DEBIAN_FRONTEND=noninteractive
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV TINI_VERSION="v0.19.0"
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

RUN groupadd alp \
  && useradd docker \
  && adduser docker alp

USER docker

WORKDIR /home/docker
COPY ./services/sql-proxy/requirements.txt .
RUN pip install -r requirements.txt

COPY ./services/sql-proxy/src .

FROM base AS development

COPY ./services/sql-proxy/dev-requirements.txt .
RUN pip install -r dev-requirements.txt

ENTRYPOINT ["/tini", "--"]
CMD python -m watchdog.watchmedo auto-restart --recursive --pattern="*.py" --directory="/home/docker/src" python ./src/main.py

FROM base AS production

ENTRYPOINT ["/tini", "--"]
CMD python ./src/main.py


