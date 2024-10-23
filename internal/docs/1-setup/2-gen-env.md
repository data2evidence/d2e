# Generate DotEnv file

- generate DotEnv filename `.env.${ENV_TYPE}` where ENV_TYPE:

  - local - local macos
  - remote - with FQDN

- convert env yaml to dotenv
- generate wildcard certificate `*.alp.local` with Caddy for TLS inter-service communications
- generate docker resource limits based on available system resources

```bash
yarn internal gen:env
wc -l .env.local
```
