#!/usr/bin/env bash
# get internal wildcard certificate "*.alp.local" from Caddy
set -o nounset
set -o errexit

# inputs
ENV_TYPE=${ENV_TYPE:-local}
TLS_REGENERATE=${TLS_REGENERATE:-false}

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
CACHE_DIR=$GIT_BASE_DIR/cache/tls
CONTAINER_NAME=alp-caddy
DOMAIN_NAME=alp.local
DOTENV_FILE=.env.$ENV_TYPE
TLS_CA_NAME=alp-internal
VOLUME_NAME=alp_caddy
touch ${DOTENV_FILE}

CONTAINER_CRT_DIR=/data/caddy/certificates/$TLS_CA_NAME/wildcard_.$DOMAIN_NAME
CONTAINER_CA_DIR=/data/caddy/pki/authorities/$TLS_CA_NAME

cd $GIT_BASE_DIR

# action
if [ ${TLS_REGENERATE} = true ]; then
	echo ". TLS_REGENERATE remove existing"
	docker volume inspect $VOLUME_NAME > /dev/null && docker run --rm -v $VOLUME_NAME:/volume -w /volume busybox rm -rf /volume/caddy/certificates/$TLS_CA_NAME/wildcard_.$DOMAIN_NAME
fi

# start if not already started
if ! docker ps --format '{{.Names}}' | grep -q "^alp-caddy"; then
	yarn base:minerva --env-file $DOTENV_FILE up $CONTAINER_NAME --wait 2>&1 | grep -vE 'WARN[0000]|is not set'
	if [ "$( docker container inspect -f '{{.State.Status}}' $CONTAINER_NAME 2> /dev/null )" != "running" ]; then
		echo FATAL: $CONTAINER_NAME failed to start
		docker container inspect --format json -f '{{.State}}' $CONTAINER_NAME
		docker container inspect -o json 
		exit 1
	fi
# restart if TLS_REGENERATE
elif [ ${TLS_REGENERATE} = true ]; then
	yarn base:minerva --env-file $DOTENV_FILE restart $CONTAINER_NAME 2>&1 | grep -vE 'WARN[0000]|is not set'
fi

# remove existing certs from dotenv
for VAR_NAME in TLS__INTERNAL__CA_CRT TLS__INTERNAL__CRT TLS__INTERNAL__KEY; do sed -i.bak "/$VAR_NAME=/,/END CERTIFICATE-----'/d" $DOTENV_FILE; done

# add certs from caddy to dotenv
TLS__INTERNAL__CA_CRT_FILE=tls__internal__ca.crt
TLS__INTERNAL__CA_CRT_PATH=$CACHE_DIR/$TLS__INTERNAL__CA_CRT_FILE
TLS__INTERNAL__CRT_FILE=tls__internal.crt
TLS__INTERNAL__CRT_PATH=$CACHE_DIR/$TLS__INTERNAL__CRT_FILE
TLS__INTERNAL__KEY_FILE=tls__internal.key
TLS__INTERNAL__KEY_PATH=$CACHE_DIR/$TLS__INTERNAL__KEY_FILE

docker exec $CONTAINER_NAME cat $CONTAINER_CA_DIR/root.crt > $TLS__INTERNAL__CA_CRT_PATH
echo TLS__INTERNAL__CA_CRT=\'"$(cat $TLS__INTERNAL__CA_CRT_PATH)"\' >> $DOTENV_FILE

# wildcard_.${DOMAIN_NAME}.crt contains 2 certs - crt & ca_crt => openssl extracts 1st crt
docker exec $CONTAINER_NAME cat $CONTAINER_CRT_DIR/wildcard_.${DOMAIN_NAME}.crt | openssl x509 -in /dev/stdin > $TLS__INTERNAL__CRT_PATH
echo TLS__INTERNAL__CRT=\'"$(cat $TLS__INTERNAL__CRT_PATH)"\' >> $DOTENV_FILE

docker exec $CONTAINER_NAME cat $CONTAINER_CRT_DIR/wildcard_.${DOMAIN_NAME}.key > $TLS__INTERNAL__KEY_PATH
echo TLS__INTERNAL__KEY=\'"$(cat $TLS__INTERNAL__KEY_PATH)"\' >> $DOTENV_FILE

[ $(grep TLS__INTERNAL $DOTENV_FILE | grep -c -- '---') = 3 ] || { echo "FATAL 3xTLS__INTERNAL not populated"; exit 1; }

echo added $(grep TLS__INTERNAL $DOTENV_FILE | grep -c -- '---')xTLS__INTERNAL to $DOTENV_FILE