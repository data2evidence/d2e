# DNS lookup fails with Docker Compose multiple networks
## Symptoms
- impacts multiple versions of docker desktop including latest
- dataflowgen-agent is on a separate network named `data` for security
- sample error message
> alp-dataflow-gen-agent-1 | Failed to get databases: Error: getaddrinfo ENOTFOUND alp-minerva-gateway-1
- see: https://forums.docker.com/t/docker-compose-refuses-to-attach-multiple-networks/136776/9
## workaround#1
#### remove data network
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
## workaround#2 - revert to older Docker Desktop without issue
- uninstall dc-desktop & install docker 4.19.0 from 2023-04-27
- download installer from https://docs.docker.com/desktop/release-notes
