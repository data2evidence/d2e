#!/usr/bin/env bash
# get internal wildcard certificate "*.alp.local" from Caddy
set -o nounset
set -o errexit
ENV_TYPE=${env_type:-local}
TLS_REGENERATE=${TLS_REGENERATE:-false}

CONTAINER_NAME=alp-caddy
DOMAIN_NAME=alp.local
DOTENV_FILE=.env.$ENV_TYPE
TLS_CA_NAME=alp-internal
VOLUME_NAME=alp_caddy

CONTAINER_CRT_DIR=/data/caddy/certificates/$TLS_CA_NAME/wildcard_.$DOMAIN_NAME
CONTAINER_CA_DIR=/data/caddy/pki/authorities/$TLS_CA_NAME

# remove existing certificates
[ ${TLS_REGENERATE} = true ] && docker volume inspect $VOLUME_NAME > /dev/null && docker run --rm -v $VOLUME_NAME:/volume -w /volume busybox rm -rf /volume/caddy/certificates/$TLS_CA_NAME/wildcard_.$DOMAIN_NAME
# start caddy container, if not started
# docker container inspect -f '{{.State.Status}}' $CONTAINER_NAME 
if [ "$( docker container inspect -f '{{.State.Status}}' $CONTAINER_NAME 2> /dev/null )" != "running" ]; then
	yarn base:minerva --env-file $DOTENV_FILE up $CONTAINER_NAME --wait 2>&1 | grep -vE "WARN\[0000\]|is not set"
	if [ "$( docker container inspect -f '{{.State.Status}}' $CONTAINER_NAME 2> /dev/null )" != "running" ]; then
		echo FATAL: $CONTAINER_NAME failed to start
		docker container inspect --format json -f '{{.State}}' $CONTAINER_NAME
		docker container inspect -o json 
		exit 1
	fi
	sleep 3
fi
# restart to re-generate certificate
[ ${TLS_REGENERATE} = true ] && yarn base:minerva --env-file $DOTENV_FILE restart $CONTAINER_NAME 2> /dev/null

# remove existing certs from dotenv
for VAR_NAME in TLS__INTERNAL__CA_CRT TLS__INTERNAL__CRT TLS__INTERNAL__KEY; do sed -i.bak "/$VAR_NAME=/,/END CERTIFICATE-----'/d" $DOTENV_FILE; done

# add existing certs to dotenv
TLS__INTERNAL__CRT="$(docker exec $CONTAINER_NAME cat $CONTAINER_CRT_DIR/wildcard_.${DOMAIN_NAME}.crt | head -n 12 | awk '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/')"
[ -z "${TLS__INTERNAL__CRT}" ] && { echo "FATAL TLS__INTERNAL__CRT not populated"; exit 1; }
echo TLS__INTERNAL__CRT=\'"${TLS__INTERNAL__CRT}"\' >> $DOTENV_FILE

TLS__INTERNAL__KEY="$(docker exec $CONTAINER_NAME cat $CONTAINER_CRT_DIR/wildcard_.${DOMAIN_NAME}.key)"
[ -z "${TLS__INTERNAL__KEY}" ] && { echo "FATAL TLS__INTERNAL__KEY not populated"; exit 1; }
echo TLS__INTERNAL__KEY=\'"${TLS__INTERNAL__KEY}"\' >> $DOTENV_FILE

TLS__INTERNAL__CA_CRT="$(docker exec $CONTAINER_NAME cat $CONTAINER_CA_DIR/root.crt)"
[ -z "${TLS__INTERNAL__CA_CRT}" ] && { echo "FATAL TLS__INTERNAL__CA_CRT not populated"; exit 1; }
echo TLS__INTERNAL__CA_CRT=\'"${TLS__INTERNAL__CA_CRT}"\' >> $DOTENV_FILE

[ $(grep TLS__INTERNAL $DOTENV_FILE | grep -c -- '---') = 3 ] || { echo "FATAL 3xTLS__INTERNAL not populated"; exit 1; }

echo added $(grep TLS__INTERNAL $DOTENV_FILE | grep -c -- '---')xTLS__INTERNAL to $DOTENV_FILE