### Setup alp-nifi-mgmt-svc 
- Run `npm install` in `./services/alp-nifi-mgmt-svc/` folder

### Try out alp-nifi-mgmt-svc 
- Run your local nifi and nifi registry using the Keystore and Truststore in `./alp-data-node/alp-nifi-mgmt-svc/py_nifi_modules/keys`
- Setup .env by referencing .env.example and run `npm run buildstart`

Notes: Keystore and Truststore is similar as DEV TLS password for Nifi
