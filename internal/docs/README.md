# OSS Developer

## Install pre-requisites

- Install pre-requisite software for running D2E. See: installation guide [here](../../1-setup/README.md)

## Clone this repo

- See: [Cloning a GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
- Clone `d2e` GitHub repository

```bash
git clone --branch develop https://github.com/alp-os/d2e.git
```

- Clone `d2e-plugins` GitHub repository

```bash
git clone --branch trex https://github.com/alp-os/d2e-plugins.git
```

- Change directory

```bash
cd d2e
```

## Authenticate to GitHub private docker registry

- Request credentials from D2E support

```bash
docker login -u $GH_USERNAME -p $GH_TOKEN ghcr.io
```

## Inputs

### ENV_TYPE

- export avoids specifying `ENV_TYPE` in each of the following commands
- `local` (default) - local development macos/linux with build
- `remote` - Virtual Machine Server with Fully Qualified Domain Name with pull all containers

  ```bash
  export ENV_TYPE=remote
  ```

### `.env.${ENV_TYPE}` file

- Populate with environment variables:

```bash
GH_USERNAME=<GH_USERNAME>
GH_TOKEN=<GH_TOKEN>
```

## Generate dotenv

```bash
source .env
GH_USERNAME=$GH_USERNAME GH_TOKEN=$GH_TOKEN yarn gen:dotenv
```

```bash
[ $ENV_TYPE = remote ] && echo TLS__CADDY_DIRECTIVE=\'tls internal\' | tee -a .env.${ENV_TYPE}
```

## Virtual Machine Server scenario

Notes:

- Default is local workstation i.e. localhost with self-signed certificates
- Server requires a Fully Qualified Domain Name (FQDN) due to https communication
  - For a minimal setup, add to `/etc/hosts`

`CADDY__ALP__PUBLIC_FQDN`

- The Fully Qualified Domain Name (FQDN)

`TLS__CADDY_DIRECTIVE`

- `tls internal` (default) - caddy will generate a self-signed certificate with Internal Certificate Authority
- (blank) - caddy will generate with a publicly trusted certificate using Let's Encrypt

## Fully Qualified Domain Name (FQDN) - internal

```bash
CADDY__ALP__PUBLIC_FQDN=<CADDY__ALP__PUBLIC_FQDN>
```

## Fully Qualified Domain Name (FQDN) - public

```bash
CADDY__ALP__PUBLIC_FQDN=<CADDY__ALP__PUBLIC_FQDN>
TLS__CADDY_DIRECTIVE=''
```

```bash
echo CADDY__ALP__PUBLIC_FQDN=${CADDY__ALP__PUBLIC_FQDN} | tee -a .env.$ENV_TYPE
echo TLS__CADDY_DIRECTIVE=${TLS__CADDY_DIRECTIVE} | tee -a .env.$ENV_TYPE
```

#### `TLS__CADDY_DIRECTIVE`

- see: main README for explanation of the above variables

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
