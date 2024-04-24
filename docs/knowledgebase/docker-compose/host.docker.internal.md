# Issue: Add host.docker.internal to /etc/hosts

## Symptoms
- DNS lookup of https://host.docker.internal fails during authentication to Identity Provider

## Background
- Identity Provider currently uses https://host.docker.internal
- Docker container can references docker host with host.docker.internal. See: https://docs.docker.com/desktop/networking/

## Workaround: 
- Add `host.docker.internal` to /etc/hosts
```bash
echo "127.0.0.1 host.docker.internal" | sudo tee -a /etc/hosts
cat /etc/hosts
```