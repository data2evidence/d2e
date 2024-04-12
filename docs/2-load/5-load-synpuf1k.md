# Download & transform SynPUF-1k
- Initially, the D2E system does not contain any data
- Synthetic Public Use Files (SynPUFs) provide sample patient data

## Download Public SynPUF-1k
- Open a terminal in the root of `d2e` repo
- Run the following command to download synpuf1k54
```
wget https://caruscloud.uniklinikum-dresden.de/index.php/s/Qog8B5WCTHFHmjW/download -O ~/Downloads/synpuf1k54.tar.gz
```
- Source: [https://forums.ohdsi.org/t/1k-sample-of-simulated-cms-synpuf-data-in-cdmv5-format-available-for-download/728/39](https://forums.ohdsi.org/t/1k-sample-of-simulated-cms-synpuf-data-in-cdmv5-format-available-for-download/728/39) 

## Transform csv files to expected format
- Open a terminal in the root of `d2e` repo
- Run the following commands to define directories
```bash
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
SYNPUF1K_DIR=$GIT_BASE_DIR/cache/synpuf1k
```
- Create synpuf1k load dir
```bash
mkdir -p $SYNPUF1K_DIR
```
- Change directory to synpuf1k load dir
```bash
cd $SYNPUF1K_DIR
```
- Decompress to this dir
```bash
echo PWD=$PWD
tar xzf ~/Downloads/synpuf1k54.tar.gz --strip-components 1 
```
- Remove additional files
```bash
rm "drug_exposure (Kopie).csv"
rm README.md
```
- Copy headers files
```bash
cp $ALP_DN_REPO_DIR/docs/2-load/headers-synpuf1k/*.csv .
```
- Confirm with linecounts
```bash
wc -l * 
```
- Run the following commands to replace tab with comma and append data to header files
```bash
sed 's/\t/,/g' care_site.csv >> 003_CARE_SITE.csv
sed 's/\t/,/g' condition_era.csv >> 009_CONDITION_ERA.csv
sed 's/\t/,/g' condition_occurrence.csv >> 008_CONDITION_OCCURRENCE.csv
sed 's/\t/,/g' cost.csv >> 005_COST.csv
sed 's/\t/,/g' death.csv >> 007_DEATH.csv
sed 's/\t/,/g' device_exposure.csv >> 010_DEVICE_EXPOSURE.csv
sed 's/\t/,/g' drug_era.csv >> 012_DRUG_ERA.csv
sed 's/\t/,/g' drug_exposure.csv >> 011_DRUG_EXPOSURE.csv
sed 's/\t/,/g' location.csv >> 002_LOCATION.csv
sed 's/\t/,/g' measurement.csv >> 013_MEASUREMENT.csv
sed 's/\t/,/g' observation.csv >> 014_OBSERVATION.csv
sed 's/\t/,/g' observation_period.csv >> 015_OBSERVATION_PERIOD.csv
sed 's/\t/,/g' payer_plan_period.csv >> 016_PAYER_PLAN_PERIOD.csv
sed 's/\t/,/g' person.csv >> 006_PERSON.csv
sed 's/\t/,/g' procedure_occurrence.csv >> 017_PROCEDURE_OCCURRENCE.csv
sed 's/\t/,/g' provider.csv >> 004_PROVIDER.csv
sed 's/\t/,/g' visit_occurrence.csv >> 018_VISIT_OCCURRENCE.csv
```
- Remove blank line at end of each file
```bash
for i in 0*.csv; do perl -pi -e 'chomp if eof' $i; done
```
- Remove downloaded files
```bash
ls | grep -v ^0 | xargs -n 1 rm
```
- Confirm with linecounts
```bash
wc -l * 
```

# Create the database `alpdev_pg` and schema `cdmdefault`

**Reminder: Before running the next steps**
> - [Grant postgres_tenant_admin_user permissions](4-set-pg-permissions.md)
> - Ensure the D2E system is up

- Navigate back to root folder `d2e` and Run the following command to seed postgres cdm schemas with synpuf-1k
```bash
cd $ALP_DN_REPO_DIR
yarn seed-postgres-cdm-schemas alpdev_pg cdmdefault
```
- where `cdmdefault` is the default cdm schema name
- Wait ~2 minutes
- Confirm data loaded with 
```
docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "SELECT schemaname as table_schema,relname as table_name,n_live_tup as table_rows FROM pg_stat_user_tables where schemaname='cdmdefault' ORDER BY n_live_tup DESC limit 17;"
```
- Expect output to be:
```
 table_schema |      table_name      | table_rows 
--------------+----------------------+------------
 cdmdefault   | cost                 |     367378
 cdmdefault   | condition_occurrence |     147186
 cdmdefault   | procedure_occurrence |     137522
 cdmdefault   | condition_era        |      99855
 cdmdefault   | drug_exposure        |      57095
 cdmdefault   | drug_era             |      56257
 cdmdefault   | visit_occurrence     |      55261
 cdmdefault   | provider             |      38810
 cdmdefault   | measurement          |      34556
 cdmdefault   | care_site            |      23259
 cdmdefault   | observation          |      19339
 cdmdefault   | payer_plan_period    |       3470
 cdmdefault   | device_exposure      |       2262
 cdmdefault   | observation_period   |       1000
 cdmdefault   | person               |       1000
 cdmdefault   | location             |        570
 cdmdefault   | death                |         52
(17 rows)
```

# Troubleshooting

## Seed-postgres-cdm-schemas fails to start
- Seed-postgres-cdm-schemas requires the following containers: 
  - alp-minerva-postgres-1, alp-data-flow-gen-1, alp-data-flow-gen-agent-1
- If not running then check container logs

## data flows
- To check job logs, open https://localhost:41100/portal/systemadmin/jobs & select **View** in Logs column

## Repeat seed
- Before repeat seed suggest truncate existing tables with the following command:
```
docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "truncate cdmdefault.CARE_SITE, cdmdefault.CONDITION_ERA, cdmdefault.CONDITION_OCCURRENCE, cdmdefault.COST, cdmdefault.DEATH, cdmdefault.DEVICE_EXPOSURE, cdmdefault.DRUG_ERA, cdmdefault.DRUG_EXPOSURE, cdmdefault.LOCATION, cdmdefault.MEASUREMENT, cdmdefault.OBSERVATION, cdmdefault.OBSERVATION_PERIOD, cdmdefault.PAYER_PLAN_PERIOD, cdmdefault.PERSON, cdmdefault.PROCEDURE_OCCURRENCE, cdmdefault.PROVIDER, cdmdefault.VISIT_OCCURRENCE;"
```
- Expected output
> TRUNCATE TABLE

see: 
- [alp-dataflow-gen-agent-1 startup message "No database credential is configured during this deployment"](../knowledgebase/dbcreds/missing-db-creds.md)