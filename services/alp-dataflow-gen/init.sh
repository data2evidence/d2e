prefect work-pool create default-agent-pool --type prefect-agent --set-as-default

# create a docker worker pool; cmd will fail if work-pool already exists
prefect work-pool create $PREFECT__DOCKER_WORKER_POOL_NAME --type docker
prefect work-pool create $PREFECT__PROCESS_WORKER_POOL_NAME --type process

 #TODO: Remove paused later
prefect work-pool pause $PREFECT__DOCKER_WORKER_POOL_NAME
prefect work-pool pause $PREFECT__PROCESS_WORKER_POOL_NAME


# initialise prefect flow deployments
python ./init.py