import { BotEvent, MedplumClient } from '@medplum/core';
import { Bot, QuestionnaireResponse } from '@medplum/fhirtypes';
import { createAuditEvent } from './helper';

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
  const questionnaireResponse = event.input as QuestionnaireResponse;
  return true
}