# Docker Desktop Settings

### GUI

- https://docs.docker.com/desktop/settings/#advanced

#### cli

e.g. increase virtual disk limit

- n.b.: requires yq version 4

```bash
JSON_FILE=~/Library/Group\ Containers/group.com.docker/settings-store.json
DiskSizeMiB
yq -i '.diskSizeMiB=289917' $JSON_FILE
yq '.diskSizeMiB' $JSON_FILE
```

- restart Docker Desktop - tested on apple silicon
  - caveat - kills running containers

```bash
curl -X POST -H 'Content-Type: application/json' -d '{ "openContainerView": true }' -kiv --unix-socket ~/Library/Containers/com.docker.docker/Data/backend.sock http://localhost/engine/restart
```
