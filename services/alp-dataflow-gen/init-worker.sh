
# create a deployment on the process-worker container alone
if [[ "$PREFECT__WORKER_POOL_NAME" == "process-pool" ]]; then
    . /usr/src/app/venv/bin/activate
    cd /usr/src/app/d2e-plugins/flow_builder/flow_builder_plugin
    python flow.py cmd=deploy
fi

prefect worker start --pool $PREFECT__WORKER_POOL_NAME --install-policy always 