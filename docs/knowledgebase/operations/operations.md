# Docker Containers
## build
- build with progress and logging
```
alias build="yarn build:minerva --progress=plain | tee ~/Downloads/build-$(date '+%Y%m%dT%H%M').log"
```
## start
- start ui & start minerva with logging
```
alias start="yarn start:ui --remove-orphans --wait && yarn start:minerva --remove-orphans --force-recreate | tee ~/Downloads/start-$(date '+%Y%m%dT%H%M').log"
```
## start & build
## stop all containers
```
docker ps -aq | xargs -n 1 docker rm -f
```