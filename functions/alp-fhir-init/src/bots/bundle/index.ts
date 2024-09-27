import { BotEvent, MedplumClient } from '@medplum/core';

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
  try{
    
  }catch(err){
    console.log(err)
    console.log(JSON.stringify(err))
  }
}