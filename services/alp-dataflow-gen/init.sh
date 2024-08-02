# create a docker worker pool; cmd will fail if work-pool already exists
prefect work-pool create $PREFECT__DOCKER_WORKER_POOL_NAME --type docker
prefect work-pool create $PREFECT__PROCESS_WORKER_POOL_NAME --type process

# initialise prefect flow deployments
python ./init.py
prefect deployment apply ./pysrc/flows/strategus/execute_strategus-deployment.yaml