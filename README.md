# Analytics Platform (ALP)

## Install pre-requisites
see: [1-install](docs/1-install)
- docker
- nodejs
- yarn

## Clone this git repository
- see: [cloning a GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

## Build
- standard build
```
yarn build:minerva
```

## Generate dotenv
- see: [README-vars.md](docs/README-vars.md)
- auto-generate secrets from [env.example](env.example) template to `.env.local`
```
yarn gen:dotenv
```

## Start UI
- login to private docker registry
```
docker login -u $ACR_USERNAME -p "$ACR_PASSWORD" $REGISTRY_URL
```
- start ui
```
yarn start:ui --wait
```
notes:
- invokes docker compose up
- defaults to develop branch image
- detects branch if ui repo directory is `../d2e-ui`

## (Re)Start App
- docker compose up - approx 5 minutes
```
yarn start:minerva --wait; sleep 60
```

## Data Load
- see: [2-load](docs/2-load)

## Configure
- see: [3-configure](docs/3-configure)

## Integration Tests
- see: [4-integration-tests](docs/4-integration-tests.md)
