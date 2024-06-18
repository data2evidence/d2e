# initialise prefect flow deployments
python ./init.py
prefect deployment apply ./pysrc/flows/strategus/execute_strategus-deployment.yaml