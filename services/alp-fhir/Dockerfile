FROM medplum/medplum-server:3.1.1

RUN apt-get update && \
	apt-get install -y --no-install-recommends \
		gettext-base \
        jq \
		wget

COPY config.json .
COPY --chown=docker:docker --chmod=711 start.sh start.sh