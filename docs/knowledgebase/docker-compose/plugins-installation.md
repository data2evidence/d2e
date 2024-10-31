# Plugins Installation Fails

## Check logs

```bash
yarn logs:minerva alp-minerva-dataflow-mgmt | tee private.log | grep -B1 -E subdirectory
```

## Workaround

- start container if stopped
- load plugins from ZIP or URL
