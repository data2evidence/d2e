# Initialize the default plugins

Install the default plugins will require the PAT in order to access the private repositories.

Run below shell command once the system is up

```
pat=$(op item get "pmdwdnpwrtgmvlh5ojt53p6wki" --field password)

docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alp -c "UPDATE dataflow.default_plugins SET url = regexp_replace(url, '^(https://)', 'https://${pat}@') WHERE url LIKE 'https://%' AND url NOT LIKE 'https://github_pat%' ;"

```

After running the shell commands, you should switch to the `setup` page to manually trigger the plugin upload.

Click the `initialize` button under `Plugin` 
> ![](../../../docs/images/dataflow/PluginSetUp.png)


Confirm the upload by clicking `Yes, install` at the dialog.
> ![](../../../docs/images/dataflow/PluginSetUpDialog.png)

