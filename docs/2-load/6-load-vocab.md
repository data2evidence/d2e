# Load Athena Vocabularies Datasets

## Download Datasets
- Open [https://athena.ohdsi.org/search-terms/start](https://athena.ohdsi.org/search-terms/start)
- Register (free), if needed
- Login

> ![](../images/vocab/AthenaDownload.png)

- Select **DOWNLOAD** button at top right of page
- Default datasets are automatically selected
- Confirm CDM version 5.x at top right
- Enter a name
- Click **DOWNLOAD**
- Await email with download link (typically within ~1 hour)
- Download ~174Mb zipfile to `Downloads` folder
- Run the following commands
```bash
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
WK_DIR=$GIT_BASE_DIR/cache/vocab; mkdir -p $WK_DIR; cd $WK_DIR
ZIP_FILE="$(ls -tr ~/Downloads/vocabulary_download_v5*.zip | head -1)"
unzip -o -d . "${ZIP_FILE}"
```
- remove additional file
```bash
rm CONCEPT_CPT4.csv
```

## Confirm Line Count Before Transformation
- Run command to output line count for each CSV file 
```bash
wc -l *.csv | sort
```
- Linecounts are similar to:
```
        51 DOMAIN.csv
        60 VOCABULARY.csv
       424 CONCEPT_CLASS.csv
       697 RELATIONSHIP.csv
   1669979 CONCEPT_SYNONYM.csv
   2981808 DRUG_STRENGTH.csv
   6071643 CONCEPT.csv
  38570317 CONCEPT_RELATIONSHIP.csv
  72374968 CONCEPT_ANCESTOR.csv
 121669947 total
```
- Note that unzipped CSV file from Athena contains an extra new line that is empty.

## Transform csv files to expected format
- Escape existing double quotes
- Add double quotes around each value
- This transformation is done in case there is a literal string character e.g. `\t` or `\n` in the value.
- Enclosing the values in double quotes would prevent interpretation as a tab or newline.
- Move files to a folder named `transformed`
- copy transformed CSVs to container
```bash
mkdir -p transformed
for CSV_FILE in *.csv; do 
      echo . transform $CSV_FILE; 
      wc -l $CSV_FILE
      CSV_FILE2=./transformed/$CSV_FILE
      sed "s/\"/\"\"/g;s/\t/\"\t\"/g;s/\(.*\)/\"\1\"/" $CSV_FILE > $CSV_FILE2; 
      wc -l $CSV_FILE2
      docker cp $CSV_FILE2 alp-minerva-postgres-1:/
done
```

## Load data to cdmvocab
- Run the following commands to load tables
```bash
for CSV_FILE in ./transformed/*.csv; do
	TABLE_NAME=$(echo $CSV_FILE | sed -e 's/\.\/transformed\///'); 
	echo . load $TABLE_NAME ...; 
	if [ "$TABLE_NAME" = "DRUG_STRENGTH.csv" ]; then
		docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "\\copy cdmvocab.$(echo $TABLE_NAME | sed -e 's/.csv//') FROM '/${TABLE_NAME}' WITH (FORMAT CSV, HEADER, DELIMITER E'\t', FORCE_NULL (amount_value, amount_unit_concept_id, denominator_value, box_size, numerator_value, numerator_unit_concept_id, denominator_unit_concept_id), ENCODING 'UTF8', QUOTE '\"', ESCAPE E'\\\\');" 
	else
		docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "\\copy cdmvocab.$(echo $TABLE_NAME | sed -e 's/.csv//') FROM '/${TABLE_NAME}' WITH (FORMAT CSV, HEADER, DELIMITER E'\t', ENCODING 'UTF8', QUOTE '\"', ESCAPE E'\\\\');"
	fi
done
```
- note: expected output is 
> COPY ${LINE_COUNT}

## Validation
- Confirm data loaded with by select count(*) from tables
```
docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "SELECT table_name, row_count FROM (SELECT 'concept_relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_relationship UNION SELECT 'concept_ancestor' AS table_name, count(*) AS row_count FROM cdmvocab.concept_ancestor UNION SELECT 'concept_relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept UNION SELECT 'relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.relationship UNION SELECT 'concept_synonym' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_synonym UNION SELECT 'vocabulary' AS table_name, COUNT(*) AS row_count FROM cdmvocab.vocabulary UNION SELECT 'domain' AS table_name, COUNT(*) AS row_count FROM cdmvocab.domain UNION SELECT 'drug_strength' AS table_name, COUNT(*) AS row_count FROM cdmvocab.drug_strength UNION SELECT 'concept_class' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_class) temp ORDER BY row_count DESC;"
```
- Expect output row_count similar to:
```
      table_name      | row_count 
----------------------+-----------
 concept_ancestor     |  72754469
 concept_relationship |  47212424
 concept              |   5975392
 drug_strength        |   2980115
 concept_synonym      |   2058223
 relationship         |       690
 concept_class        |       417
 vocabulary           |        59
 domain               |        50
(9 rows)

```

# Troubleshooting
## Repeat load
- Before repeat load suggest truncate existing tables with the following command:
```
docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "truncate cdmvocab.concept, cdmvocab.concept_ancestor, cdmvocab.concept_class, cdmvocab.concept_relationship, cdmvocab.concept_synonym, cdmvocab.domain, cdmvocab.drug_strength, cdmvocab.relationship, cdmvocab.vocabulary;"
```
- Expected output
> TRUNCATE TABLE