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

#### ubuntu
- https://snapcraft.io/install/docker/ubuntu
```
sudo snap install docker
```

#### macos
- For background on issues see: [Docker Desktop troubleshooting](../knowledgebase/docker-compose/docker-desktop.md)

#### Install Docker Desktop 4.19.0 (2023-04)
- This is a workaround for Docker Compose with multiple networks DNS looks issue in latest version 
- Download AMD/ARM installer from https://docs.docker.com/desktop/release-notes/

#### Disable Virtualization framework
- This is a workaround for Segmentation fault on x86_64 with MacOS Virtualization Framework enabled
- Open Docker>Settings>General
- Uncheck **Use Virtualization framework** & select **gRPC FUSE**
> ![Docker-Desktop-disable-Virtualization-framework](../images/docker/disable-Virtualization-framework.png)

##### Add host.docker.internal to /etc/hosts
- This is a temporary workaround for Identity Provider on https://localhost fails
- Run the following commands to add `host.docker.internal` to /etc/hosts
```bash
echo "127.0.0.1 host.docker.internal" | sudo tee -a /etc/hosts
cat /etc/hosts
```

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