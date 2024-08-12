import { BotEvent, MedplumClient } from '@medplum/core';
import { Bundle } from '@medplum/fhirtypes';

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
  const bundle = event.input as Bundle;
  bundle.entry?.forEach((entry) =>{
    console.log('Create resource for each of the entry in the bundle')
    return medplum.createResource(entry.resource);
  })
  return true;
}