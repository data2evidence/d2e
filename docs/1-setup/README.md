# Installation pre-requisites

Tested platforms:

- Ubuntu
- macOS

Untested platforms:

- Other linux
- [Windows Services for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)

## Homebrew

- macOS package manager

### macOS

- https://brew.sh

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Docker Compose

- see: https://docs.docker.com/engine/install/

### ubuntu

- https://snapcraft.io/install/docker/ubuntu

```bash
sudo snap install docker
```

### macOS

```bash
brew install --cask docker
```

### Configure

- Virtual disk limit

### GUI

- https://docs.docker.com/desktop/settings/#advanced

#### cli

- expected yq version 4

```bash
JSON_FILE="$HOME/Library/Group Containers/group.com.docker/settings.json"
yq -i '.diskSizeMiB=289917' $JSON_FILE
yq '.diskSizeMiB' $JSON_FILE
```

- restart Docker Desktop - tested on apple silicon
  - caveat - kills running containers

```bash
curl -X POST -H 'Content-Type: application/json' -d '{ "openContainerView": true }' -kiv --unix-socket ~/Library/Containers/com.docker.docker/Data/backend.sock http://localhost/engine/restart
```

## nodejs

- https://nodejs.org/en/download/package-manager
- version 18 is required

### ubuntu

- https://snapcraft.io/node

```bash
sudo snap install node --channel=18/stable --classic
```

### macOS

```bash
brew install node@18
```

## yarn

- https://classic.yarnpkg.com/lang/en/docs/install

```bash
npm install --global yarn
```

## openssl

- openssl version 3 is expected for troubleshooting

```bash
openssl version
```

### ubuntu

```bash
apt list -a openssl
sudo apt install openssl=3.0.13-0ubuntu3
```

### macOS

- https://formulae.brew.sh/formula/openssl@3

```bash
brew install openssl@3
```

## DBeaver

- Universal database tool and SQL client
- https://dbeaver.io/

### macOS

- https://formulae.brew.sh/cask/dbeaver-community

```
brew install --cask dbeaver-community
```

### Connection settings

- password is ${PG_SUPER_PASSWORD} from `.env.local`

![connection-settings](../images/dbeaver/connection-settings.png)
