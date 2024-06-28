# Installation pre-requisites

Tested platforms: 
- Ubuntu
- macos

Untested platforms: 
- Other linux
- [Windows Services for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)

## Homebrew 
- macos package manager

### macos
- https://brew.sh
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Docker Compose
- see: https://docs.docker.com/engine/install/

### ubuntu
- https://snapcraft.io/install/docker/ubuntu
```
sudo snap install docker
```

#### macos
knowledgebase articles:
- [dns fails multiple networks](../knowledgebase/docker-compose/dns-fails-multiple-networks.md)
- [disable virtualization framework on x86](../knowledgebase/docker-compose/virtualization-framework-x86.md)

## nodejs 
- https://nodejs.org/en/download/package-manager
- version 18 is required

### ubuntu
- https://snapcraft.io/node
```
sudo snap install node --channel=18/stable --classic 
```

### macos 
```
brew install node@18
```

## yarn
- https://classic.yarnpkg.com/lang/en/docs/install
```
npm install --global yarn
```

## openssl
- openssl version 3 is required
### macos
- https://formulae.brew.sh/formula/openssl@3
```
brew install openssl@3
```