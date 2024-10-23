#!/usr/bin/env bash
set -o nounset
set -o errexit
echo ${0} ...
echo . 'INFO generate wildcard certificate `*.alp.local` with Caddy for TLS inter-service communications'

# inputs
ENV_TYPE=${ENV_TYPE:-local}
TLS_REGENERATE=${TLS_REGENERATE:-false}

echo ENV_NAME=$ENV_NAME
echo TLS_REGENERATE=$TLS_REGENERATE

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
CACHE_DIR=$GIT_BASE_DIR/cache/tls
CONTAINER_NAME=alp-caddy-certs-mgmt
DOMAIN_NAME=alp.local
DOTENV_FILE_OUT=.env.$ENV_TYPE
TLS_CA_NAME=alp-internal
VOLUME_NAME=alp_caddy
touch ${DOTENV_FILE_OUT}

CONTAINER_CRT_DIR=/data/caddy/certificates/$TLS_CA_NAME/wildcard_.$DOMAIN_NAME
CONTAINER_CA_DIR=/data/caddy/pki/authorities/$TLS_CA_NAME

cd $GIT_BASE_DIR

# action
if [ ${TLS_REGENERATE} = true ]; then
	echo ". TLS_REGENERATE remove existing"
	docker volume inspect $VOLUME_NAME > /dev/null && docker run --rm -v $VOLUME_NAME:/volume -w /volume busybox rm -rf /volume/caddy/certificates/$TLS_CA_NAME/wildcard_.$DOMAIN_NAME
fi

docker run -d -v $VOLUME_NAME:/data -v ./deploy/caddy-config:/srv/caddy-config --name $CONTAINER_NAME caddy:2.8-alpine caddy run --config /srv/caddy-config/Caddyfile --adapter caddyfile

# Allow time for caddy to generate certs
sleep 5

# remove existing certs from dotenv
for VAR_NAME in TLS__INTERNAL__CA_CRT TLS__INTERNAL__CRT TLS__INTERNAL__KEY; do sed -i.bak "/$VAR_NAME=/,/END CERTIFICATE-----'/d" $DOTENV_FILE_OUT; done

# add certs from caddy to dotenv
TLS__INTERNAL__CA_CRT_FILE=tls__internal__ca.crt
TLS__INTERNAL__CA_CRT_PATH=$CACHE_DIR/$TLS__INTERNAL__CA_CRT_FILE
TLS__INTERNAL__CRT_FILE=tls__internal.crt
TLS__INTERNAL__CRT_PATH=$CACHE_DIR/$TLS__INTERNAL__CRT_FILE
TLS__INTERNAL__KEY_FILE=tls__internal.key
TLS__INTERNAL__KEY_PATH=$CACHE_DIR/$TLS__INTERNAL__KEY_FILE

docker exec $CONTAINER_NAME cat $CONTAINER_CA_DIR/root.crt > $TLS__INTERNAL__CA_CRT_PATH
echo TLS__INTERNAL__CA_CRT=\'"$(cat $TLS__INTERNAL__CA_CRT_PATH)"\' >> $DOTENV_FILE_OUT

# wildcard_.${DOMAIN_NAME}.crt contains 2 certs - crt & ca_crt => openssl extracts 1st crt
docker exec $CONTAINER_NAME cat $CONTAINER_CRT_DIR/wildcard_.${DOMAIN_NAME}.crt | openssl x509 -in /dev/stdin > $TLS__INTERNAL__CRT_PATH
echo TLS__INTERNAL__CRT=\'"$(cat $TLS__INTERNAL__CRT_PATH)"\' >> $DOTENV_FILE_OUT

docker exec $CONTAINER_NAME cat $CONTAINER_CRT_DIR/wildcard_.${DOMAIN_NAME}.key > $TLS__INTERNAL__KEY_PATH
echo TLS__INTERNAL__KEY=\'"$(cat $TLS__INTERNAL__KEY_PATH)"\' >> $DOTENV_FILE_OUT

[ $(grep TLS__INTERNAL $DOTENV_FILE_OUT | grep -c -- '---') = 3 ] || { echo "FATAL 3xTLS__INTERNAL not populated"; exit 1; }

echo added $(grep TLS__INTERNAL $DOTENV_FILE_OUT | grep -c -- '---')xTLS__INTERNAL to $DOTENV_FILE_OUT

docker rm -f $CONTAINER_NAME
wc -l $DOTENV_FILE_OUT
echo