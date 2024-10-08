# Issue: DNS lookup fails with Docker Compose multiple networks

## Symptoms
- impacts versions of docker desktop before v2.26.1
- dataflowgen-agent is on a separate network named `data` for security
- sample error message
> alp-dataflow-gen-agent-1 | Failed to get databases: Error: getaddrinfo ENOTFOUND alp-minerva-gateway-1
- see: https://forums.docker.com/t/docker-compose-refuses-to-attach-multiple-networks/136776/9

## Resolution
- Upgrade to Docker Compose v2.26.1 or later
  - from: https://github.com/docker/compose/issues/11533#issuecomment-2034656001
- To check version
```bash
% docker compose version
Docker Compose version v2.29.2-desktop.2
```

