import { BotEvent, MedplumClient } from '@medplum/core';
import { Bundle } from '@medplum/fhirtypes';
import { createResourceInFhir } from './insert';

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
  try{
    const bundle = event.input as Bundle;
    if (bundle.entry === undefined){
      console.log('No entries in the bundle')
      return;
    }
    for (const entry of bundle.entry) {
      console.log('Create resource for each of the entry in the bundle')
      await createResourceInFhir(entry.resource)
      await medplum.createResource(entry.resource)
    }
  }catch(err){
    console.log(err)
    console.log(JSON.stringify(err))
  }
}