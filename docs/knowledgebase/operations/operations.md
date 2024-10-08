# Docker Containers

## clean start

- remove all container & volumes
- generate new passwords

```bash
alias clean="yarn clean:minerva && yarn gen:dotenv"
```

## build

- build with progress and logging

```bash
alias build="yarn build:minerva --progress=plain | tee ~/Downloads/build-$(date '+%Y%m%dT%H%M').log"
```

## start

- start ui & start minerva with logging

```bash
alias start="yarn start:ui --remove-orphans --wait && yarn start:minerva --remove-orphans --force-recreate | tee ~/Downloads/start-$(date '+%Y%m%dT%H%M').log"
```

## stop

- stop ui & minerva

```bash
alias stop="yarn stop:ui && yarn stop:minerva"
```
