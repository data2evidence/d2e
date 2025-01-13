# Internal developer README.md

## Authenticate to GitHub private docker registry

- Request credentials from D2E support

```bash
docker login -u $GH_USERNAME -p "$GH_TOKEN" $REGISTRY_URL
```

## set ENV_TYPE

- set ENV_TYPE
  - `local` - local development macos/linux
    - build this repo containers with local tag
  - `remote` - Virtual Machine with Fully Qualified Domain Name
    - pull all containers from registry with develop tag (by default)

```bash
ENV_TYPE=local
ENV_TYPE=remote
export ENV_TYPE
```

## Generate dotenv

- see: [environment variables](docs/1-setup/environment-variables.md)
- auto-generate secrets from [env.example](env.example) template to `.env.${ENV_TYPE}`

```bash
yarn gen:dotenv
```

## set `CADDY__ALP__PUBLIC_FQDN` if VM

- defaults to localhost

```bash
CADDY__ALP__PUBLIC_FQDN=<FQDN>
echo CADDY__ALP__PUBLIC_FQDN=$CADDY__ALP__PUBLIC_FQDN | tee -a `.env.${ENV_TYPE}`
```

## set `TLS__CADDY_DIRECTIVE` if VM is not public

- if Virtual Machine with Fully Qualified Domain Name is
  - **private** then invoke the following command to append directive to generate a self-signed certificate with `alp-caddy` Internal Certificate Authority
  - **public** then `alp-caddy` default is to generate publicly trusted certificate using LetsEncrypt

```bash
[ $ENV_TYPE = remote ] && echo TLS__CADDY_DIRECTIVE=\'tls internal\' | tee -a .env.${ENV_TYPE}
```

## set `GH_TOKEN`

- required to pull plugins

```bash
GH_TOKEN=<GH_TOKEN>
echo GH_TOKEN=$GH_TOKEN | tee -a .env.${ENV_TYPE}
```

#### Initalize Logto Apps

```bash
yarn init:logto
```

## Build - if ENV_TYPE=local

- Standard build

```bash
yarn build:minerva
```

## (Re)Start App

- Docker compose up - approx 5 minutes

### ENV_TYPE=remote

```bash
yarn remote:minerva pull
yarn remote:minerva up --wait
```

### ENV_TYPE=local

```bash
yarn start:minerva
```

## Wait 1 minute

```bash
sleep 60
```

## View Logs

```bash
yarn logs:minerva
```

## Data Load

- see: [2-load](docs/2-load)

## Configure

- see: [3-configure](docs/3-configure)

## Stop

- Stop all containers

```bash
yarn stop:minerva
```

## Clean-up

- **extreme caution**: removes all containers & volumes

```bash
yarn clean:minerva
```

## Extra information

### Setting resource limits

- see: [Resource limits](docs/1-setup/resource-limits.md)
