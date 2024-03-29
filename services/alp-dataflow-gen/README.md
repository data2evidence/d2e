# ALP Dataflow Gen

Prefect instance that has dataflow methods initialized.

## Description

To be ran locally only. For running flows and test flows.

- Run `yarn build:minerva` to build images. It may take longer due to `dask-sql` package.
- Run `yarn start:minerva`
- View Prefect UI from `http://localhost:41120`
- Prefect API: `http://localhost:41120/api`
- Get `DATAFLOW_MGMT__PREFECT__DEPLOYMENT_ID` & `DATAFLOW_MGMT__PREFECT__INFRASTRUCTURE_DOC_ID` env's for `alp-dataflow` from the UI under `Deployments` tab.

## Adding a new prefect deployment
1. Create a new function with the @flow decorator in main.py
2. Attach shell into `alp-dataflow-gen-1` container and run the following command in the directory `/app/pysrc`.
   ```
   prefect deployment build ./main.py:<flow_name_in_main.py> -n <deployment_name>
   ```
   - `flow_name_in_main.py`: Name of function with @flow decorator in `main.py`
   - `<deployment_name>`: Name of deployment
3. A `yaml` file should have been created at `/app/pysrc`. Move this file to the new flow's folder
4. Update `init.sh` to apply the deployment to prefect using the newly generated deployment yaml file.

## Running tests locally
Ensure that alp-dataflow-gen-agent container is running
Run command
```
docker exec -w /app/pysrc alp-dataflow-gen-agent-1 python -m pytest
```