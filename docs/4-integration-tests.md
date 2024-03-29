## integration tests - `analytics-svc`, `query-gen-svc` & `bookmark-svc`
- Navigate to the root of ALP repo (i.e. the `alp-data-node` folder)
```
cd alp-data-node
```
- Build the required services
```
yarn
yarn build --no-ui

```
- Create the test schema. Replace the placeholders with the correct HANA server details & the user credentials.
```
export HANASERVER=<HANA_SERVER>
export HDIUSER=TENANT_ADMIN_USER
export HDIPORT=<HANA_PORT>
export HDIPW=<TENANT_ADMIN_USER_PASSWORD>
export TESTSYSTEMPW=<TENANT_ADMIN_USER_PASSWORD>
export TESTPORT=<HANA_PORT>
export TESTSCHEMA=<TEST_SCHEMA_NAME>
export isTestEnv="true"
export VCAP_SERVICES='{"mridb":[{"name":"OMOP","credentials":{"host":"${HANASERVER}","port":"${HDIPORT}","databaseName":"ALPDEV","user":"${HDIUSER}","password":"${HDIPW}","validate_certificate":false,"probeSchema":"${TESTSCHEMA}","vocabSchema":"${TESTSCHEMA}","schema":"${TESTSCHEMA}","dialect":"hana","encrypt":false,"pooling":"true"},"tags":["httptest"]}]}'

yarn inittestdb
```
- Create the PG config schema
```
export PG_HOST="localhost"
export PG_PORT=41190
export PG_DATABASE="alp"
export PG_USER="postgres"
export PG_PASSWORD="Toor1234"
export PG_ADMIN_USER="postgres"
export PG_ADMIN_PASSWORD="Toor1234"
export PG_SCHEMA="cdw_test_schema"
export PG_MIN_POOL=2
export PG_MAX_POOL=10
export PG_DEBUG=1
export NODE_ENV="development"

yarn workspace mri-pg-config migrate
```
- Start the `query-gen-svc` 
```
PORT=41008 yarn workspace query-gen run start
```
- Trigger the `query-gen-svc` tests
```
yarn workspace query-gen run test
```
- Trigger the `analytics-svc` tests
```
yarn workspace analytics run testci
```

## Note
The integration tests use `alp-dbcli` npm package to create the HANA artefacts. The actual file (i.e. `alp-dbcli-v1.0.0.tgz`) can be downloaded from 1Password.

