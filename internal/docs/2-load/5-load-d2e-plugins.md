# Load Dataflow Plugins

The following plugins are currently available:

- [D2E-Plugins](https://github.com/alp-os/d2e-plugins)

## 1-Step Upload

### Add PAT to seeded plugin url

Install the default plugins will require the PAT in order to access the private repositories.

Run below shell command once the system is up

```bash
pat=$(op read "op://$OP_VAULT_NAME/pmdwdnpwrtgmvlh5ojt53p6wki/password")
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alp -c "UPDATE dataflow.default_plugins SET url = regexp_replace(url, '^(https://)', 'https://${pat}@') WHERE url LIKE 'https://%' AND url NOT LIKE 'https://github_pat%' ;"
```

### Initialize the default plugins

Switch to `setup` page.

Click the `initialize` button under `Plugin`

> ![](../../../docs/images/dataflow/PluginSetUp.png)

Confirm the upload by clicking `Yes, install` at the dialog.

> ![](../../../docs/images/dataflow/PluginSetUpDialog.png)

This will initialize all the plugins available.
