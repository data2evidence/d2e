import { BotEvent, MedplumClient } from '@medplum/core';

export async function handler(medplum: MedplumClient, event: BotEvent): Promise<any> {
    console.log('Entered bundle bot handler')
}