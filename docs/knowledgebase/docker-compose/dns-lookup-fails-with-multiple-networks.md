# DNS lookup fails with Docker Compose multiple networks

## Symptoms
- impacts multiple versions of docker desktop including latest
- dataflowgen-agent is on a separate network named `data` for security
- sample error message
> alp-dataflow-gen-agent-1 | Failed to get databases: Error: getaddrinfo ENOTFOUND alp-minerva-gateway-1
- see: https://forums.docker.com/t/docker-compose-refuses-to-attach-multiple-networks/136776/9

## workaround#1 - remove data network
- edit docker-compose.yml
- add the following to dataflow-gen-agent-1
```yaml
network:
  - alp
```
- remove all containers from data network by removing the string '- data'
```yaml
network:
  - data
```

## workaround#1 - remove data network
from: https://github.com/alp-os/d2e-dev-brian/blob/397_setup6/docs/knowledgebase/docker-compose/dns-lookup-fails-with-multiple-networks.md
- edit docker-compose.yml
- add the following to dataflow-gen-agent-1
```yaml
network:
  - alp
```
- remove all containers from data network by removing the string '- data'
```yaml
network:
  - data
``

## workaround#2 - replace docker-compose binary
- from: https://github.com/docker/compose/issues/11533#issuecomment-2026242708
- latest release version from https://github.com/docker/compose/releases
- while docker desktop is running
```bash
NEW_VERSION=v2.26.1
NEW_VERSION=v2.24.7
ARCH=aarch64
ARCH=x86_64
URL=https://github.com/docker/compose/releases/download/$NEW_VERSION/docker-compose-darwin-$ARCH
DC_PATH=~/.docker/cli-plugins/docker-compose
DC_TMP=/tmp/docker-compose

OLD_VERSION=$($DC_PATH --version | awk '{print $NF}'); echo OLD_VERSION=$OLD_VERSION
mv -vf $DC_PATH $DC_PATH.$OLD_VERSION
curl -L -o $DC_TMP $URL
chmod u+x $DC_TMP
$DC_TMP --version
cp -vf $DC_TMP $DC_PATH
cp -vf $DC_PATH $DC_PATH.$NEW_VERSION
docker compose version
```
- do not click after above "Re-apply configurations" it will revert to old version of ~/.docker/cli-plugins/docker-compose

this issue is temporary
from: https://github.com/docker/compose/issues/11533#issuecomment-2034656001
> Compose v2.26.1 (with fix) will be shipped in the next Docker Desktop release

