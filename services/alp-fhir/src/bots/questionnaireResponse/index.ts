import { BotEvent, MedplumClient } from '@medplum/core';
import { QuestionnaireResponse } from '@medplum/fhirtypes';

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
  const questionnaireResponse = event.input as QuestionnaireResponse;
  return true;
}