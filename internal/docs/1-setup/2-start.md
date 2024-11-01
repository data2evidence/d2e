# Start App

## Clean - optional

- e.g. if PostgreSQL credentials changed

```bash
yarn clean:minerva
```

## Initalize Logto Apps

```bash
yarn init:logto
```

## Start UI

```bash
yarn start:ui --wait
```

## Start App

```bash
yarn start:minerva --wait
```

## All-In-One

```bash
yarn clean:minerva && yarn init:logto && yarn start:ui --wait && yarn start:minerva --wait
```
