
cd /usr/src/app/d2e-plugins/flow_builder/flow_builder_plugin
python flow.py sourcePath=/usr/src/app/d2e-plugins/flow_builder/flow_builder_plugin entrypoint=flow.py:build_flow

/bin/bash /usr/local/bin/dockerd-entrypoint.sh
prefect worker start --pool $PREFECT__WORKER_POOL_NAME --install-policy always