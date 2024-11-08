# Rosetta error: could not find free space for allocation size

## Symptoms

- `alp-minerva-meilisearch-svc-1` container fails to start with error

> rosetta error: could not find free space for allocation size 500000000000

## Background

- Rosetta cache /var/db/oah is cleared on reboot
- There does not seem to be any other secure way to clear the rosetta cache as /var/db is protected

## Workaround

- restart macos
