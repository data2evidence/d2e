cd libs/envConverter
yarn generate:envs -s alp-minerva-db-mgmt-svc
cd ../
. generated-env.sh
cd ../
prefect agent start --pool default-agent-pool --work-queue default