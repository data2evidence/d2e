import { MedplumBotConfig } from "./types";
import { Bot, OperationOutcome } from '@medplum/fhirtypes'
import * as botConfig from '../bots.config.json'
import { FhirAPI } from "../api/FhirAPI";
import { basename, resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { ContentType } from "@medplum/core";

export async function readBotConfigs(botName: string){
    const botConfigs = botConfig.bots?.filter((b) => b.name = botName);
    if (!botConfigs) {
        return [];
    }
    let saved = 0;
    for (const botConfig of botConfigs) {
        try
        {
            let fhirApi = new FhirAPI()
            await createBot(fhirApi, 'Project Id', botConfig, 'vmcontext');
            saved++;
            console.log(`Bot ${botConfig.name} saved and deployed successfully!`)
        } catch (err: unknown) {
            console.log(`Failed to save bot: ${botConfig.name}`)
        }
    }
    console.log('All bots are saved and deployed successfully!')
}

export async function saveBot(fhirApi: FhirAPI, botConfig: MedplumBotConfig, bot: Bot): Promise<void> {
    try{
        const codePath = botConfig.source;
        const code = readFileContents(codePath);
        if (!code) {
          return;
        }
      
        console.log('Saving source code...');
        const sourceCode = await fhirApi.createAttachment_Bot(basename(codePath), code, ContentType.TYPESCRIPT);
      
        console.log('Updating bot...');
        const updateResult = await fhirApi.updateResource_Bot(bot, sourceCode);
        console.log('Success! New bot version: ' + updateResult.meta?.versionId);
    }catch(err){
        console.log('Failed to save bot: ' + botConfig.name);
    }
}

export async function createBot(
    fhirApi: FhirAPI,
    projectId: string,
    botConfig: MedplumBotConfig,
    runtimeVersion?: string,
  ): Promise<void> {
    const body = {
      name: botConfig.name,
      description: '',
      runtimeVersion,
    };
    try{
        //Check if the bot exists
        let bot: Bot = await fhirApi.readResource_Bot(botConfig.id);
        if(!bot.id){        
            const newBot = await fhirApi.create_Bot('admin/projects/' + projectId + '/bot', body)
            bot = await fhirApi.readResource_Bot(newBot.id);
        }
        await saveBot(fhirApi, botConfig as MedplumBotConfig, bot);
        await deployBot(fhirApi, botConfig as MedplumBotConfig, bot);
        console.log(`Success! Bot created: ${bot.id}`);
    }catch(err){
        console.log('Failed to create bot: ' + botConfig.name);
    }
  }

function readFileContents(fileName: string): string {
    const path = resolve(fileName);
    if (!existsSync(path)) {
      return '';
    }
    return readFileSync(path, 'utf8');
}

export async function deployBot(fhirApi: FhirAPI, botConfig: MedplumBotConfig, bot: Bot): Promise<void> {
    const codePath = botConfig.dist ?? botConfig.source;
    try{
        const code = readFileContents(codePath);
        if (!code) {
        return;
        }
    
        console.log('Deploying bot...');
        const deployResult = (await fhirApi.create_Bot(fhirApi.fhirUrl_Bot(bot.id).toString(), {
        code,
        filename: basename(codePath),
        })) as OperationOutcome;
        console.log('Deploy result: ' + deployResult.issue?.[0]?.details?.text);
    }catch(err){
        console.log('Failed to deploy bot: ' + botConfig.name);
    }
}
