# Docker Containers
## clean start
- remove all container & volumes
- generate new passwords
```
alias clean="yarn clean:minerva && yarn gen:dotenv"
```
## build
- build with progress and logging
```
alias build="yarn build:minerva --progress=plain | tee ~/Downloads/build-$(date '+%Y%m%dT%H%M').log"
```
## start
- start minerva
```
alias start="yarn start:minerva --remove-orphans --force-recreate | tee ~/Downloads/start-$(date '+%Y%m%dT%H%M').log"
```
## stop
- stop ui & minerva
```
alias stop="yarn stop:minerva"
```