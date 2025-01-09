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

- Recommend Increase Virtual disk limit to e.g. 300 Gb see: [docker-desktop-settings](../knowledgebase/docker-desktop/settings.md)

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

- n.b. openssl version 3 is required for troubleshooting

```bash
openssl version
```

### ubuntu

```bash
apt install openssl>3
```

### macOS

- https://formulae.brew.sh/formula/openssl@3

```bash
brew install openssl@3
```

## git
### ubuntu
```bash
sudo apt-get update
sudo apt-get install git-all
```

### macos 
```bash
brew install git
```

For more information, refer to: https://github.com/git-guides/install-git

## Github PAT token
Set up a Github PAT (classic) token with scope `read:packages` to retrieve packages to run d2e.
- Setting up Github PAT: [link](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
- Select scope: ```read:packages```

Example:
![Github PAT token](../images/setup/github-pat-token.png)
For more information, refer to: https://github.com/git-guides/install-git

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
