# Docker Volume Backup & Restore
- https://hub.docker.com/extensions/docker/volumes-backup-extension
- https://github.com/BretFisher/docker-vackup

## install
```bash
sudo curl -sSL https://raw.githubusercontent.com/BretFisher/docker-vackup/main/vackup -o /usr/local/bin/vackup && sudo chmod +x /usr/local/bin/vackup
```

## restore single volume
```bash
COMPOSE_VERSION=$(docker compose version | awk '{print $NF}' | awk -F- '{print $1}' | sed -e 's/^v//'); echo COMPOSE_VERSION=$COMPOSE_VERSION
cd /alp-backup
docker volume rm alp_pg-minerva-data-1
docker volume create --label com.docker.compose.project=alp --label=com.docker.compose.version=$COMPOSE_VERSION --label com.docker.compose.volume= alp_pg-minerva-data-1
vackup import 20240225T0300Z.alp-dev-sg-2.alp_pg-minerva-data-1.tar.zst alp_pg-minerva-data-1
```