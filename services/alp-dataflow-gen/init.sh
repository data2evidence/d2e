# create a docker worker pool; cmd will fail if work-pool already exists
prefect work-pool create $PREFECT__DOCKER_WORKER_POOL_NAME --type docker
prefect work-pool create $PREFECT__PROCESS_WORKER_POOL_NAME --type process
prefect work-pool create default-agent-pool --type None

# initialise prefect flow deployments
python ./init.py