import { BotEvent, MedplumClient } from '@medplum/core';
import { QuestionnaireResponse } from '@medplum/fhirtypes';
import { getDuckdbDBConnection } from './DuckdbConnection';

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
  const questionnaireResponse = event.input as QuestionnaireResponse;
  return await connectToDb
}

async function connectToDb(){
  return await getDuckdbDBConnection()
}