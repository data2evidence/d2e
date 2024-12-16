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

## git
### ubuntu
```
sudo apt-get update
sudo apt-get install git-all
```

### macos 
```
brew install git
```

For more information, refer to: https://github.com/git-guides/install-git

## Github PAT token
Set up a Github PAT (classic) token with scope `read:packages` to retrieve packages to run d2e.
- Setting up Github PAT: [link](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
- Select scope: ```read:packages```

Example:
![Github PAT token](./../images/setup/github-pat-token.png)
For more information, refer to: https://github.com/git-guides/install-git