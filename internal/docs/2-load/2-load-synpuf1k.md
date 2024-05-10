# Seed postgres cdm schemas with SynPUF-1k
see: 
- https://www.ohdsi.org/data-standardization/
- https://github.com/alp-os/alp/blob/develop/docs/2-load/2-load-synpuf1k.md
- [alp-data-node-override/scripts/load-synpuf1k.sh](../../../alp-data-node-override/scripts/load-synpuf1k.sh)
- invoke
```bash
yarn load:synpuf1k
```
- expected response
```bash
. get latest synpuf1k zip
. unzip with overwrite
Archive:  ~/Downloads/synpuf1k_v5-4_2024-Jan-19.zip
  inflating: ./002_LOCATION.csv      
  inflating: ./003_CARE_SITE.csv     
  inflating: ./004_PROVIDER.csv      
  inflating: ./005_COST.csv          
  inflating: ./006_PERSON.csv        
  inflating: ./007_DEATH.csv         
  inflating: ./008_CONDITION_OCCURRENCE.csv  
  inflating: ./009_CONDITION_ERA.csv  
  inflating: ./010_DEVICE_EXPOSURE.csv  
  inflating: ./011_DRUG_EXPOSURE.csv  
  inflating: ./012_DRUG_ERA.csv      
  inflating: ./013_MEASUREMENT.csv   
  inflating: ./014_OBSERVATION.csv   
  inflating: ./015_OBSERVATION_PERIOD.csv  
  inflating: ./016_PAYER_PLAN_PERIOD.csv  
  inflating: ./017_PROCEDURE_OCCURRENCE.csv  
  inflating: ./018_VISIT_OCCURRENCE.csv  
  inflating: ./019_GDM.RESEARCH_SUBJECT.csv  
  inflating: ./020_PERSON.csv        
  inflating: ./021_GDM.QUESTIONNAIRE_RESPONSE.csv  
  inflating: ./022_GDM.ITEM.csv      
  inflating: ./023_GDM.ANSWER.csv    
. seed-postgres-cdm-schemas
$ sh -c 'docker exec -it alp-dataflow-gen-agent-1 prefect deployment run execute-seed-postgres-data-flow/alp-db-svc-seed --param database=alpdev_pg --param vocab_schema_name=cdmvocab --param cdm_schema_name=${0:-cdmdefault}'
06:51:03.456 | DEBUG   | prefect.profiles - Using profile 'default'
06:51:04.446 | DEBUG   | prefect.client - Connecting to API at http://alp-dataflow-gen-1:41120/api/
Creating flow run for deployment 'execute-seed-postgres-data-flow/alp-db-svc-seed'...
Created flow run 'diligent-finch'.
└── UUID: a257ee5b-365c-4b28-935f-0d9b89ce2029
└── Parameters: {'database': 'alpdev_pg', 'cdm_schema_name': 'sh', 'vocab_schema_name': 'cdmvocab'}
└── Scheduled start time: 2024-02-16 06:51:04 UTC (now)
└── URL: http://alp-dataflow-gen-1:41120/flow-runs/flow-run/a257ee5b-365c-4b28-935f-0d9b89ce2029
```