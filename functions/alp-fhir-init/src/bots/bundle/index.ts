import { BotEvent, MedplumClient } from '@medplum/core';
import { Bundle } from '@medplum/fhirtypes';
import { FhirSvcAPI } from '../../api/FhirSvcAPI';

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
  try{
    const bundle = event.input as Bundle;
    if (bundle.entry === undefined){
      console.log('No entries in the bundle')
      return;
    }
    let fhirAPI = new FhirSvcAPI();
    for (const entry of bundle.entry) {
      console.log('Create resource for each of the entry in the bundle')
      await fhirAPI.insertIntoFhirDataModel(entry.resource.resourceType, entry.resource)
    }
  }catch(err){
    console.log(err)
    console.log(JSON.stringify(err))
  }
}