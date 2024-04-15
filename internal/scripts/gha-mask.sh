#!/usr/bin/env bash
# generate GitHubActions mask text
set -o nounset
set -o errexit

GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
DC_YMLS=($(ls $GIT_BASE_DIR/docker-compose*.yml))

# allow level-1 FQDN yml keys as non-sensitive
export KEYS_ALLOW="CADDY__ALP__PUBLIC_FQDN|CADDY__CFUAA_IDP__PUBLIC_FQDN|IDP__BASE_URL"
# mask secrets as sensitive
STRINGS_MASK="password|host|secret|http|PRIVATE"
# allow container names as non-sensitive
STRINGS_ALLOW=$(echo $(yq eval-all -N '.services | to_entries | .[] | .key' ${DC_YMLS[@]} | sort -u) $(yq eval-all -N '.services[].container_name' ${DC_YMLS[@]} | grep -vE 'null' | sed -e 's/${BASE_PORT}/1/') | sed -e 's/ /|/g')
echo STRINGS_ALLOW=${STRINGS_ALLOW}

# mask level-1 sensitive values
yq -o props -N eval-all 'with_entries(select(.value|@json|test("^\"\{|^\"\[")|not) | select(.key|test(env(KEYS_ALLOW))|not))' $(ls .env.*.yml|grep -Ev "generated|private") | grep -Ev "${STRINGS_ALLOW}" | grep -iE "${STRINGS_MASK}" | awk -F' = ' '{if (length($2) > 0) { print "::add-mask::"$2}}' | sort -u
# mask level-2 sensitive values in nested json strings
yq -o props -N eval-all 'to_entries | .[] | select(.value|@json|test("^\"\{|^\"\["))|.value|@jsond' $(ls .env.*.yml|grep -Ev "generated|private") | grep -Ev "${STRINGS_ALLOW}" | grep -iE "${STRINGS_MASK}" | awk -F' = ' '{if (length($2) > 0) { print "::add-mask::"$2}}' | sort -u