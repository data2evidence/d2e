# Cohort Definition Key Updater

This tool was created to make it easier to update cohort definition keys. This `cohortDefinitionKey` is the key that is used in OHDSI Atlas's cohort definitions, and needs to be mapped from our bookmark definition.

This tool uses the `seeds/03_Config` file as reference

## Steps

- `cd services/mri-pg-config/src/db/utils/cohortDefinitionKeyUpdater`
- run `ts-node getAttributesFromConfig.ts` which will generate `cdwConfigMapping.ts` and `cdwConfigDuckdbMapping.ts`
- make mapping changes to `cdwConfigMapping.ts` and `cdwConfigDuckdbMapping.ts`
- run `ts-node generateConfigWithCohortDefKey.ts` which will generate `cdwConfig.json` and `cdwConfigDuckdb.json`
- copy each file to it's place in `seeds/03_Config`
- remove cdw config from system
- build `alp-mri-pg-config`
- recreate container for `alp-mri-pg-config`. This will reseed the config
- test new config
