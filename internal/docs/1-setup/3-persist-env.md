# Persist Environment Variables

## Initalize Logto Apps

- sets `LOGTO__ALP_*`

```bash
yarn init:logto
```

## Persist Environment Variables

- Run after `yarn init:logto` step
- Persists `LOGTO__ALP_*` written to `.env.${ENV_TYPE}`

```bash
npm run internal persist:env
```
