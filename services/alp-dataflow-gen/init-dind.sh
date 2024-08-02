
cd /usr/src/app/flow_builder/flow_builder_plugin
python flow.py

/bin/bash ./dockerd-entrypoint.sh
prefect worker start --pool $PREFECT__WORKER_POOL_NAME --install-policy always