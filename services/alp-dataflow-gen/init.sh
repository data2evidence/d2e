# initialise prefect flow deployments
python ./init.py
prefect deployment apply ./pysrc/flows/dataflow/exec_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/alp_dqd/execute_dqd-deployment.yaml
prefect deployment apply ./pysrc/flows/alp_data_characterization/execute_data-characterization-deployment.yaml
prefect deployment apply ./pysrc/flows/cohort_generator/execute_cohort_generator_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/omop_cdm/create_omop_cdm_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/alp_db_svc/execute_alp_db_svc_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/alp_db_svc/execute_seed_postgres_data_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/portal_server/update_dataset_attributes_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/portal_server/fetch_version_info_flow-deployment.yaml
prefect deployment apply ./pysrc/flows/strategus/execute_strategus-deployment.yaml