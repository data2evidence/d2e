# Installation pre-requisites

Tested platforms: 
- ubuntu
- macos

Untested platforms: 
- other linux
- [Windows Services for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)

## Homebrew - macos package manager
### macos 
- https://brew.sh
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Docker Compose
### Install
- For install instructions see: https://docs.docker.com/engine/install/
#### ubuntu
- https://snapcraft.io/install/docker/ubuntu
```
sudo snap install docker
```
#### macos
- Due to Docker Compose DNS lookup in latest version install Docker Desktop 4.19.0 from 2023-04-27
- download amd/arm installer from https://docs.docker.com/desktop/release-notes/
- For alternative workaround and background see: [Docker Desktop troubleshooting](docker-desktop/troubleshooting.md)

### Disable Virtualization framework
- Once installed Open Docker>Settings>General
- Uncheck **Use Virtualization framework** & select **gRPC FUSE**
> ![Docker-Desktop-disable-Virtualization-framework](../images/docker/disable-Virtualization-framework.png)
- For background see: [Docker Desktop troubleshooting](docker-desktop/troubleshooting.md)
### add host.docker.internal to /etc/hosts
- run the following commands to add `host.docker.internal` to /etc/hosts
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