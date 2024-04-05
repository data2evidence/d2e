# alp-db-svc

Manage Database Objects in an Automated way

### API's Supported

**POST**

#### HANA

- Create Schema With a Data Model: `POST <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/data-model/<data-model>/schema/<schema-name>` (data-models supported are `omop5-4`, `custom-omop-ms`, `custom-omop-ms-phi`, `pathology`, `bio-me`, `radiology`, `reporting-bi`)
  - Body:
    ```
    {cleansedSchemaOption: false}
    ```
    (cleansedSchemaOptions supported are `true` and `false`).
- Create Schema Snapshot: `POST <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/data-model/omop5-4/schemasnapshot/<schema-name>?sourceschema=<schema-name>`
  - Body:
    ```
    snapshotCopyConfig: {
        timestamp: string (Example: <YYYY-MM-DD HH:mm:ss>)
        tableConfig: SnapshotCopyTableConfig[] (Example: [{"tableName": "PERSON","columnsToBeCopied": ["PERSON_ID","ETHNICITY_CONCEPT_ID","GENDER_CONCEPT_ID"]},{"tableName": "DEATH","columnsToBeCopied": ["DEATH_DATE","DEATH_TYPE_CONCEPT_ID","PERSON_ID"]})
        patientsToBeCopied: string[] (Example: "1", "2", "3"])
      }
    ```
- Create Schema Parquet Snapshot: `POST <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/data-model/omop5-4/schemasnapshotparquet/<schema-name>?sourceschema=<schema-name>`
  - Body:
    ```
    snapshotCopyConfig: {
        timestamp: string (Example: <YYYY-MM-DD HH:mm:ss>)
        tableConfig: SnapshotCopyTableConfig[] (Example: [{"tableName": "PERSON","columnsToBeCopied": ["PERSON_ID","ETHNICITY_CONCEPT_ID","GENDER_CONCEPT_ID"]},{"tableName": "DEATH","columnsToBeCopied": ["DEATH_DATE","DEATH_TYPE_CONCEPT_ID","PERSON_ID"]})
        patientsToBeCopied: string[] (Example: "1", "2", "3"])
      }
    ```
- Create Schema Snapshot: `POST <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/data-model/omop5-4/schemasnapshot/<schema-name>?sourceschema=<schema-name>&timestamp=<YYYY-MM-DD HH:mm:ss>`
- Create Schema Parquet Snapshot: `POST <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/data-model/omop5-4/schemasnapshotparquet/<schema-name>?sourceschema=<schema-name>&timestamp=<YYYY-MM-DD HH:mm:ss>`
- Get version information for schemas: `POST <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/version-info`

#### Postgres

- Create Schema With a Data Model: `POST <process.env.DB_SVC__PATH>/postgres/database/<tenant-name>/data-model/<data-model>/schema/<schema-name>` (data-models supported are `omop5-4`, `custom-omop-ms`, `custom-omop-ms-phi`, `pathology`, `bio-me`, `radiology`).
  - Body:
  ```
  {cleansedSchemaOption: false}
  ```
  (cleansedSchemaOptions supported are `true` and `false`).
- Create Staging Area Schema: `POST <process.env.DB_SVC__PATH>/postgres/database/<tenant-name>/staging-area/<staging-area>/schema/<schema-name>` (staging-area supported are `fhir_data`).
- Get version information for schemas: `POST <process.env.DB_SVC__PATH>/postgres/database/<tenant-name>/version-info`

**PUT**

#### HANA

- Update multiple Schemas with new changesets: `PUT <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/data-model/<data-model>?schema=<schema1>&schema=<schema2>` (data-models supported are `omop5-4`, `pathology`, `bio-me`, `radiology`, `reporting-bi`, `custom-omop-ms` and `custom-omop-ms-phi`)
  - Using Client-credentials flow with `alp-data` as client id
- To update maintenance script for \*\*\_ADMIN_USER admin user schema: `PUT <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/maintenance/schema/<admin-user-schema>`
  - Using Client-credentials flow with `alp-data` as client id
- Load Sypuf1k data into Hana schema: `PUT <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/importdata?schema=<schema>`

#### Postgres

- Update multiple Schemas with new changesets: `PUT <process.env.DB_SVC__PATH>/postgres/database/<tenant-name>/data-model/<data-model>?schema=<schema1>&schema=<schema2>` (data-models supported are `omop5-4`, `pathology`, `bio-me`, `radiology`, `custom-omop-ms` and `custom-omop-ms-phi`)
- Load Sypuf1k data into Postgres schema: `PUT <process.env.DB_SVC__PATH>/postgres/database/<tenant-name>/importdata?schema=<schema>`

**DELETE**

#### HANA

- Rollback Multiple Schemas: `DELETE <process.env.DB_SVC__PATH>/hana/database/<tenant-name>/data-model/omop5-4/count/<count-number>?schema=<schema1>&schema=<schema2>`

#### Postgres

- Rollback Multiple Schemas: `DELETE <process.env.DB_SVC__PATH>/postgres/database/<tenant-name>/data-model/omop5-4/count/<count-number>?schema=<schema1>&schema=<schema2>`

---

### Install CDM Script

**GET**

- Get Postgres schemas for all database tenants
  - Example command: `npm run cdm-install-script -- databases postgres`

**POST**

- Create Schema With OMOP v5.4 (Default) and GDM Tables:
  - Example command: `npm run cdm-install-script -- create postgres alp cdmtest omop5-4`
- Create Schema With MS Deidentified OMOP Tables:
  - Example command: `npm run cdm-install-script -- create postgres alp cdmtest custom-omop-ms`
- Create Schema With MS PHI OMOP  Tables:
  - Example command: `npm run cdm-install-script -- create postgres alp cdmtest custom-omop-ms-phi`
- Create Schema With Pathology Tables:
  - Example command: `npm run cdm-install-script -- create postgres alp cdmtest pathology`
- Create Schema With BIO.ME Tables:
  - Example command: `npm run cdm-install-script -- create postgres alp cdmtest bio-me`
- Create Schema With Reporting BI Tables:
  - Example command: `npm run cdm-install-script -- create postgres alp cdmtest reporting-bi`


**PUT**

- Update OMOP & GDM Schema With new changesets:
  - Example command: `npm run cdm-install-script -- update postgres alp cdmtest omop5-4`
- Update MS Deidentified OMOP Schema With new changesets:
  - Example command: `npm run cdm-install-script -- update postgres alp cdmtest custom-omop-ms`
- Update MS PHI OMOP Schema With new changesets:
  - Example command: `npm run cdm-install-script -- update postgres alp cdmtest custom-omop-ms-phi`
- Update Pathology Schema With new changesets:
  - Example command: `npm run cdm-install-script -- update postgres alp cdmtest pathology`
- Update BIO.ME Schema With new changesets:
  - Example command: `npm run cdm-install-script -- update postgres alp cdmtest bio-me`
- Update Reporting BI Schema With new changesets:
  - Example command: `npm run cdm-install-script -- update postgres alp cdmtest reporting-bi`

**PUT**

- Load Sypuf1k data into Postgres schema:
  - Example command: `npm run cdm-install-script -- load_data postgres alp cdmtest`

---

### Microservice Integration

- GET & POST APIs are used in Alp-Portal to create new schema and get informations about schema
- PUT APIs are used in alp-dataflow-gen to perform schema update

---

### Local

- Look at `.env.example` for environment variables used and replicate them in your local with `.env` file to start local development.
- To build and develop `alp-db-svc` locally, follow the steps

```bash
yarn install
yarn compile
// builds the changes on the fly for development
yarn dev

// for build and start
yarn buildstart
```

- `docker-compose up --build` will build the docker image and start

### Current State

- Node Current LTS version `v18.14.0`
- JDK 11
- Environment for K8s is `NODE_ENV=production` which differentiates if the environment variables are loaded from `.env` file from local / docker-compose or from K8s secrets inside K8s cluster
- Use Liquibase Javascript to manage Hana Database Objects
- JDBC driver is placed in `db/drivers` folder
- SQL Migration scripts are under `db/migrations/<database>/<schema-type>`
- Supported Schema Type: OMOP (& GDM)
- Add new express routes in `src/routes/index.ts` & `src/routes/<route-name>.ts`
- For Hana: `tenant admin` and `tenant read` users are used.
- Using `express-validator` for validating the REST parameters

### Example for a Changeset sql file

Liquibase SQL [Documentation](https://www.liquibase.org/blog/plain-sql) is a good starting point.

A good changeset should have both the `change sql` and a `rollback sql` like below.

```sql
--liquibase formatted sql
--changeset alp:create-test-table
CREATE TABLE testTable(
  columnName1 VARCHAR (355)
);
--rollback DROP TABLE testTable
```

### Import Athena Vocabulary Concept Data Into HANA

The Athena Vocabulary files are placed in this location: https://drive.google.com/drive/folders/1bx_ozr80Ls2uI_7kSOYyov74nMFPaxbT

#### Steps to Import

In the terminal,

1. Unzip the vocab.zip to /tmp/ on the Hana Staging Instance OR In HANA prod, only files under path /hana/omop/ can be ingested. Hence for prod unzip vocab under /hana/omop (Please modify the <base-path> in IMPORT Statements accordingly below)

```bash
unzip Vocabulary_Athena_Modified_v5_2021-Dec-07.zip -d .
```

Regarding Steps 2 and 3 are ALREADY RAN in Vocabulary_Athena_Modified_v5_2021-Dec-07.zip, This step is ONLY for NEW versions of Athena vocabulary data

2. Add escape character \ before double quotes as the command below:
   sed -i 's/"/\\"/g' CONCEPT.csv
   sed -i 's/"/\\"/g' DRUG_STRENGTH.csv
   sed -i 's/"/\\"/g' CONCEPT_SYNONYM.csv

3. In CONCEPT.csv, the value for the concept id 4080894, 3426865 are null. Therefore surround it with \”null\” manually in the file. Otherwise error will be thrown with concept_name column shouldnt be null.

4. 3 records will fail in CONCEPT_SYNONYM table which belongs to chinese characters. I ignored it (we are currently not using CONCEPT_SYNONYM table with pyqe)

5. For staging, using SYSTEM user for the new tenant db, its fine to disable the path validation from which csv files can be imported from by running the below query. This is ONLY fine for NON-PROD instances

```
alter system alter configuration ( 'indexserver.ini','SYSTEM' ) set (           'import_export','enable_csv_import_path_filter' ) = 'false' with reconfigure;
```

#### Import scripts

##### HANA

```sql
--SET SCHEMA
SET SCHEMA CDMVOCAB;

truncate table concept;
CREATE column table "temp_table_concept" ("CONCEPT_ID" INTEGER,
"CONCEPT_NAME" NVARCHAR(1000) ,
"DOMAIN_ID" NVARCHAR(20),
"VOCABULARY_ID" NVARCHAR(20),
"CONCEPT_CLASS_ID" NVARCHAR(1000),
"STANDARD_CONCEPT" VARCHAR(1),
"CONCEPT_CODE" NVARCHAR(1000),
"VALID_START_DATE" 	BIGINT ,
"VALID_END_DATE" BIGINT,
"INVALID_REASON" VARCHAR(1))
IMPORT FROM CSV FILE '/<base-path>/vocab/CONCEPT.csv' INTO "temp_table_concept"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1
ERROR LOG '/<base-path>/vocab/concept-error.log'
FAIL ON INVALID DATA;
INSERT INTO CONCEPT
SELECT * FROM "temp_table_concept";
select count(1) from CONCEPT;
DROP TABLE "temp_table_concept";

truncate table DRUG_STRENGTH;
CREATE COLUMN TABLE "temp_table_drug_strength" ("DRUG_CONCEPT_ID" INTEGER,
"INGREDIENT_CONCEPT_ID" INTEGER,
"AMOUNT_VALUE" DECIMAL(30, 12),
"AMOUNT_UNIT_CONCEPT_ID" INTEGER,
"NUMERATOR_VALUE" DECIMAL(30, 12) ,
"NUMERATOR_UNIT_CONCEPT_ID" INTEGER,
"DENOMINATOR_VALUE" DECIMAL(30,12),
"DENOMINATOR_UNIT_CONCEPT_ID" INTEGER,
"BOX_SIZE" INTEGER,
"VALID_START_DATE" BIGINT,
"VALID_END_DATE" BIGINT,
"INVALID_REASON" NVARCHAR(1)
)
IMPORT FROM CSV FILE '/<base-path>/vocab/DRUG_STRENGTH.csv' INTO "temp_table_drug_strength"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1000
ERROR LOG '/<base-path>/vocab/DRUG_STRENGTH-error.log'
FAIL ON INVALID DATA;
INSERT INTO DRUG_STRENGTH
SELECT * FROM "temp_table_drug_strength";
select count(1) from DRUG_STRENGTH;
DROP TABLE "temp_table_drug_strength";


truncate table CONCEPT_SYNONYM;
CREATE COLUMN TABLE "temp_table_concept_synonym" ("CONCEPT_ID" INTEGER,
"CONCEPT_SYNONYM_NAME" NVARCHAR(2000),
"LANGUAGE_CONCEPT_ID" INTEGER)
IMPORT FROM CSV FILE '/<base-path>/vocab/CONCEPT_SYNONYM.csv' INTO "temp_table_concept_synonym"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1
ERROR LOG '/<base-path>/vocab/CONCEPT_SYNONYM-error.log'
FAIL ON INVALID DATA;
INSERT INTO CONCEPT_SYNONYM
SELECT * FROM "temp_table_concept_synonym";
select count(1) from CONCEPT_SYNONYM;
DROP TABLE "temp_table_concept_synonym";

truncate table CONCEPT_ANCESTOR;
CREATE COLUMN TABLE "temp_table_concept_ancestor" ("ANCESTOR_CONCEPT_ID" INTEGER,
"DESCENDANT_CONCEPT_ID" INTEGER,
"MIN_LEVELS_OF_SEPARATION" INTEGER,
"MAX_LEVELS_OF_SEPARATION" INTEGER)
IMPORT FROM CSV FILE '/<base-path>/vocab/CONCEPT_ANCESTOR.csv' INTO "temp_table_concept_ancestor"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
--ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1000
ERROR LOG '/<base-path>/vocab/CONCEPT_ANCESTOR-error.log'
FAIL ON INVALID DATA;
INSERT INTO CONCEPT_ANCESTOR
SELECT * FROM "temp_table_concept_ancestor";
select count(1) from CONCEPT_ANCESTOR;
DROP TABLE "temp_table_concept_ancestor";

truncate table CONCEPT_CLASS;
CREATE COLUMN TABLE "temp_table_concept_class" ("CONCEPT_CLASS_ID" VARCHAR(20),
"CONCEPT_CLASS_NAME" VARCHAR(255) ,
"CONCEPT_CLASS_CONCEPT_ID" INTEGER)
IMPORT FROM CSV FILE '/<base-path>/vocab/CONCEPT_CLASS.csv' INTO "temp_table_concept_class"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
--ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1000
ERROR LOG '/<base-path>/vocab/CONCEPT_CLASS-error.log'
FAIL ON INVALID DATA;
INSERT INTO CONCEPT_CLASS
SELECT * FROM "temp_table_concept_class";
select count(1) FROM CONCEPT_CLASS;
DROP TABLE "temp_table_concept_class";

truncate table CONCEPT_RELATIONSHIP;
CREATE COLUMN TABLE "temp_table_concept_relationship" ("CONCEPT_ID_1" INTEGER,
"CONCEPT_ID_2" INTEGER,
"RELATIONSHIP_ID" VARCHAR(20),
"VALID_START_DATE" DATE CS_DAYDATE,
"VALID_END_DATE" DATE CS_DAYDATE,
"INVALID_REASON" VARCHAR(1))
IMPORT FROM CSV FILE '/<base-path>/vocab/CONCEPT_RELATIONSHIP.csv' INTO "temp_table_concept_relationship"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
--ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1000
ERROR LOG '/<base-path>/vocab/CONCEPT_RELATIONSHIP-error.log'
FAIL ON INVALID DATA;
INSERT INTO CONCEPT_RELATIONSHIP
SELECT * FROM "temp_table_concept_relationship";
select count(1) FROM CONCEPT_RELATIONSHIP;
DROP TABLE "temp_table_concept_relationship";

truncate table "DOMAIN";
CREATE COLUMN TABLE "temp_table_domain" ("DOMAIN_ID" VARCHAR(20),
"DOMAIN_NAME" VARCHAR(255),
"DOMAIN_CONCEPT_ID" INTEGER)
IMPORT FROM CSV FILE '/<base-path>/vocab/DOMAIN.csv' INTO "temp_table_domain"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
--ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1000
ERROR LOG '/<base-path>/vocab/DOMAIN-error.log'
FAIL ON INVALID DATA;
INSERT INTO DOMAIN
SELECT * FROM "temp_table_domain";
select count(1) FROM DOMAIN;
DROP TABLE "temp_table_domain";

truncate table RELATIONSHIP;
CREATE COLUMN TABLE "temp_table_relationship" ("RELATIONSHIP_ID" VARCHAR(20),
"RELATIONSHIP_NAME" VARCHAR(255),
"IS_HIERARCHICAL" VARCHAR(1),
"DEFINES_ANCESTRY" VARCHAR(1),
"REVERSE_RELATIONSHIP_ID" VARCHAR(20),
"RELATIONSHIP_CONCEPT_ID" INTEGER)
IMPORT FROM CSV FILE '/<base-path>/vocab/RELATIONSHIP.csv' INTO "temp_table_relationship"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
--ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1000
ERROR LOG '/<base-path>/vocab/RELATIONSHIP-error.log'
FAIL ON INVALID DATA;
INSERT INTO RELATIONSHIP
SELECT * FROM "temp_table_relationship";
select count(1) FROM RELATIONSHIP;
DROP TABLE "temp_table_relationship";

truncate table VOCABULARY;
IMPORT FROM CSV FILE '/<base-path>/vocab/VOCABULARY.csv' INTO "VOCABULARY"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY '\t'
--ESCAPE '\'
SKIP FIRST 1 ROW
--optionally enclosed by '\\"'
THREADS 50
BATCH 1000
ERROR LOG '/<base-path>/vocab/VOCABULARY-error.log'
FAIL ON INVALID DATA;
select count(1) from "VOCABULARY";

truncate table CONCEPT_RECOMMENDED;
CREATE column table "temp_table_concept_recommended" (concept_id_1 bigint, concept_id_2 bigint, relationship_id character varying(2000));
IMPORT FROM CSV FILE '/<base-path>/vocab/CONCEPT_RECOMMENDED.csv' INTO "temp_table_concept_recommended"
WITH RECORD DELIMITED BY '\n'
FIELD DELIMITED BY ','
ESCAPE '\'
SKIP FIRST 1 ROW
NO TYPE CHECK
--optionally enclosed by '\\"'
THREADS 50
BATCH 1
ERROR LOG '/<base-path>/vocab/CONCEPT_RECOMMENDED-error.log'
FAIL ON INVALID DATA;
INSERT INTO CONCEPT_RECOMMENDED
SELECT * FROM "temp_table_concept_recommended";
select count(1) from CONCEPT_RECOMMENDED;
DROP TABLE "temp_table_concept_recommended";
```
##### CONCEPT RECOMMENDED TABLE DATA
The script to create the table and the data imported were from the following source.
 - https://ohdsiorg-my.sharepoint.com/personal/cknoll_ohdsi_org/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fcknoll%5Fohdsi%5Forg%2FDocuments%2FPHOEBE&ga=1

##### POSTGRES

Import data from the unzipped `vocab.zip`

- CONCEPT
- DRUG_STRENGTH
- CONCEPT_SYNONYM
- CONCEPT_ANCESTOR
- CONCEPT_CLASS
- CONCEPT_RELATIONSHIP
- DOMAIN
- RELATIONSHIP
- VOCABULARY

Steps

- Connect dbeaver to your local minerva
- On the Database Navigator, go to Local Minerva > Databases > alp > Schemas > cdmvocab > Tables
- right click on the table to be updated, select "Import Data"
- Set up the Data Transfer parameters
  - Import source: CSV
  - Input file: corresponding file from `vocab.zip`
    - also on the bottow section "Importer Settings", click on the Value column for "Column delimeter" and change it from `,` to `\t`
  - Go to "Confirm" and click "Proceed"
  
