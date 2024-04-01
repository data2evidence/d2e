# Docker Start
## build with logging
```
yarn build:minerva docker build --progress=plain | tee ~/Downloads/start-$(date '+%Y%m%dT%H%M').log
echo 
```
## stop all containers
```
docker ps -aq | xargs -n 1 docker rm -f
```
## start with logging
```
yarn start:minerva --remove-orphans --force-recreate --progress=plain | tee ~/Downloads/start-$(date '+%Y%m%dT%H%M').log
```