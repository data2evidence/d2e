# Analytics Platform (D2E)

## Install pre-requisites
see: [1-setup](docs/1-setup/README.md)

## Clone repository
- see: [Cloning a GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

## Authenticate to private docker registry
- Request credentials from D2E support
```
docker login -u $ACR_USERNAME -p "$ACR_PASSWORD" $REGISTRY_URL
```

## Knowledgebase
- see: [knowledgebase](docs/knowledgebase)

## Generate dotenv
- see: [environment variables](docs/1-setup/environment-variables.md)
- auto-generate secrets from [env.example](env.example) template to `.env.local`
```
yarn gen:dotenv
```

## Build
- standard build
```
yarn build:minerva
```

## Start UI
- start ui
```
yarn start:ui --wait
```
notes:
- invokes docker compose up
- detects `../d2e-ui` branch or defaults to develop branch

## (Re)Start App
- ensure ui is started
- docker compose up - approx 5 minutes
```
yarn start:minerva --wait; sleep 60
```

## Data Load
- see: [2-load](docs/2-load)

## Configure
- see: [3-configure](docs/3-configure)

## Stop
- when completed stop all containers
```
yarn stop:minerva
```

## Clean-up
- when completed remove all containers volume
```
yarn clean:minerva
```