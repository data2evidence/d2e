# Get Athena Vocab from D4L Singapore Google Drive
see:
- [OSS Procedure](https://github.com/alp-os/alp/blob/develop/docs/2-data/3-load-vocab.md)
- [alp-data-node-override/scripts/load-vocab.sh](../../../alp-data-node-override/scripts/load-vocab.sh)
- invoke script
```bash
yarn load:vocab
```
- expected output
```bash
. get latest Athena_OMOP_Vocabulary zip
Archive:  ~/Downloads/Vocabulary_Athena_Modified_v5_2024-Jan-19.zip
  inflating: ./CONCEPT_ANCESTOR.csv  
  inflating: ./CONCEPT_CLASS.csv     
  inflating: ./CONCEPT_RELATIONSHIP.csv  
  inflating: ./CONCEPT_SYNONYM.csv   
  inflating: ./CONCEPT.csv           
  inflating: ./DOMAIN.csv            
  inflating: ./DRUG_STRENGTH.csv     
  inflating: ./RELATIONSHIP.csv      
  inflating: ./VOCABULARY.csv        
. wc -l
 130981848 total
  72754470 CONCEPT_ANCESTOR.csv
  47212425 CONCEPT_RELATIONSHIP.csv
   5975393 CONCEPT.csv
   2980116 DRUG_STRENGTH.csv
   2058224 CONCEPT_SYNONYM.csv
       691 RELATIONSHIP.csv
       418 CONCEPT_CLASS.csv
        60 VOCABULARY.csv
        51 DOMAIN.csv
. Load CSVs to cdmvocab
CONCEPT.csv ...
Successfully copied 913MB to alp-minerva-postgres-1:/
CONCEPT_ANCESTOR.csv ...
Successfully copied 2.16GB to alp-minerva-postgres-1:/
CONCEPT_CLASS.csv ...
Successfully copied 22kB to alp-minerva-postgres-1:/
CONCEPT_RELATIONSHIP.csv ...
Successfully copied 2.93GB to alp-minerva-postgres-1:/
CONCEPT_SYNONYM.csv ...
Successfully copied 194MB to alp-minerva-postgres-1:/
DOMAIN.csv ...
Successfully copied 4.1kB to alp-minerva-postgres-1:/
DRUG_STRENGTH.csv ...
Successfully copied 230MB to alp-minerva-postgres-1:/
RELATIONSHIP.csv ...
Successfully copied 62kB to alp-minerva-postgres-1:/
VOCABULARY.csv ...
Successfully copied 8.7kB to alp-minerva-postgres-1:/
. Truncate
TRUNCATE TABLE
. Load tables
. load CONCEPT.csv ...
COPY 5975392
load CONCEPT_ANCESTOR.csv ...
COPY 72754469
load CONCEPT_CLASS.csv ...
COPY 417
load CONCEPT_RELATIONSHIP.csv ...
COPY 47212424
load CONCEPT_SYNONYM.csv ...
COPY 2058223
load DOMAIN.csv ...
COPY 50
load DRUG_STRENGTH.csv ...
COPY 2980115
load RELATIONSHIP.csv ...
COPY 690
load VOCABULARY.csv ...
COPY 59
. Validation
      table_name      | row_count 
----------------------+-----------
 concept_ancestor     |  72754469
 concept_relationship |  47212424
 concept_relationship |   5975392
 drug_strength        |   2980115
 concept_synonym      |   2058223
 relationship         |       690
 concept_class        |       417
 vocabulary           |        59
 domain               |        50
(9 rows)
```