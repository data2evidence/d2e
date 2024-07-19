import { BotEvent, MedplumClient } from '@medplum/core';
import { QuestionnaireResponse } from '@medplum/fhirtypes';
import { Database } from "duckdb-async";

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
  const questionnaireResponse = event.input as QuestionnaireResponse;
  const duckdDB = await Database.create(
    `../duckdb/cdmdefault.duckdb`
  );
  const duckdDBconn = await duckdDB.connect();
  let result = await duckdDBconn.exec(`insert into gdm_questionnaire_response ("id", "person_id", "etl_source_table", "etl_source_table_record_id", "etl_source_table_record_created_at", "etl_session_id", "etl_started_at") values('${questionnaireResponse.id}', 0, 'abc', 1242, '2024-12-12', 'avsade', '2024-12-12')`)
  let result2 = await duckdDBconn.exec('select * from gdm_questionnaire_response')
  console.log('Insert record' + result)
  console.log('Select from' + result2)
  duckdDB.close()
  return true
}