import { Database } from "duckdb-async";
import { getDBConfigByTenant, DB } from "../utils/DBSvcConfig";
import { DUCKDB_DATA_FOLDER } from "../config";
import { duckdbViewCreationSql } from "./duckdbViewSql";

async function createDuckdbDatabaseFromPostgres() {
    // Get schema name from shell input
    var databaseName = process.argv[2];
    var schemaName = process.argv[3];
    var vocabSchemaName = process.argv[4];
    const duckdbDatabaseName = `${databaseName}_${schemaName}`;
    const duckdbVocabDatabaseName = `${databaseName}_${vocabSchemaName}`;

    const dbConfig = getDBConfigByTenant(DB.POSTGRES, databaseName);

    const db = await Database.create(
        `${DUCKDB_DATA_FOLDER}/${duckdbDatabaseName}`
    );
    const tables = [
        "attribute_definition",
        "bi_event",
        "bi_event_data",
        "care_site",
        "cdm_source",
        "cohort",
        "cohort_attribute",
        "cohort_definition",
        "concept",
        "concept_ancestor",
        "concept_class",
        "concept_hierarchy",
        "concept_recommended",
        "concept_relationship",
        "concept_synonym",
        "condition_era",
        "condition_occurrence",
        "cost",
        "databasechangelog",
        "databasechangeloglock",
        "death",
        "device_exposure",
        "domain",
        "dose_era",
        "drug_era",
        "drug_exposure",
        "drug_strength",
        "episode",
        "episode_event",
        "fact_relationship",
        "gdm_answer",
        "gdm_consent",
        "gdm_consent_detail",
        "gdm_consent_value",
        "gdm_item",
        "gdm_item_questionnaire",
        "gdm_participant_token",
        "gdm_questionnaire",
        "gdm_questionnaire_response",
        "gdm_research_subject",
        "location",
        "measurement",
        "metadata",
        "note",
        "note_nlp",
        "observation",
        "observation_period",
        "payer_plan_period",
        "person",
        "procedure_occurrence",
        "provider",
        "relationship",
        "schema_metadata",
        "source_to_concept_map",
        "specimen",
        "visit_detail",
        "visit_occurrence",
        "vocabulary",
    ];

    let result;
    // Copy tables from postgres into duckdb
    for (const table of tables) {
        try {
            console.log(`Copying table: ${table} from postgres into duckdb...`);
            result = await db.all(
                `CREATE TABLE ${duckdbDatabaseName}.${table} AS FROM (SELECT * FROM postgres_scan('host=${dbConfig.host} port=${dbConfig.port} dbname=${databaseName} user=${dbConfig.user} password=${dbConfig.password}', '${schemaName}', '${table}'))`
            );
            console.log(`${result[0]["Count"]} rows copied`);
        } catch (err) {
            console.log(`Table:${table} loading failed with error: ${err}`);
            throw err;
        }
    }
    console.log("Postgres tables succesfully copied into duckdb database file");

    // Attach vocab schema to duckdb db object
    try {
        await db.all(
            `ATTACH '${DUCKDB_DATA_FOLDER}/${duckdbVocabDatabaseName}' (READ_ONLY);`
        );
    } catch (err) {
        // Dont throw error,
        // if error occurred, will be cause of vocab schema creation, where its trying to attach an already attached vocab duckdb database file which is expected
        // continue
    }

    try {
        // Create views in duckdb
        console.log("Creating views in duckdb");
        result = await db.all(duckdbViewCreationSql(duckdbVocabDatabaseName));
        console.log("Views have been successfully created in duckdb");
    } catch (err) {
        console.log(`Error occurred when creating views: ${err}`);
        throw err;
    }

    db.close();
    console.log(
        `Duckdb database file: ${duckdbDatabaseName} has been successfully created.`
    );
}

createDuckdbDatabaseFromPostgres();
