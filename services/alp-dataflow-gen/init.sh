# initialise prefect flow deployments
python ./init.py
prefect deployment apply ./pysrc/flows/alp_db_svc/execute_alp_db_svc_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/alp_db_svc/execute_seed_postgres_data_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/strategus/execute_strategus-deployment.yaml