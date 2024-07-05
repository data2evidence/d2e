import { MedplumBotConfig } from "./types";
import { Bot, OperationOutcome } from '@medplum/fhirtypes'
import * as botConfig from '../bots.config.json'
import { FhirAPI } from "../api/FhirAPI";
import { basename, resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { ContentType } from "@medplum/core";

//Reads bots.config.json file and creates bot for each and deploys it
export async function readAndCreateBotFromConfig(){
    const botConfigs = botConfig.bots;
    try{
        if (!botConfigs) {
            console.log('0 bots configured in bot config.')
            return [];
        }
        console.log(botConfig.bots.length + ' bots configured in bot config.')
        let saved = 0;
        for (const botConfig of botConfigs) {
            let fhirApi = new FhirAPI()
            await fhirApi.clientCredentialslogin()
            await createBot(fhirApi, 'Project Id', botConfig, 'vmcontext');
            saved++;
            console.log(`Bot ${botConfig.name} saved and deployed successfully!`)
        }
        console.log('All bots are saved and deployed successfully!')
    } catch (err: unknown) {
        console.log(JSON.stringify(err))
        console.log(`Failed to save bots`)
    }
}

async function saveBot(fhirApi: FhirAPI, botConfig: MedplumBotConfig, bot: Bot): Promise<void> {
    try{
        const codePath = botConfig.source;
        const code = readFileContents(codePath);
        if (!code) {
          return;
        }
        console.log('Saving source code...');
        const sourceCode = await fhirApi.createAttachment_bot(basename(codePath), code, ContentType.TYPESCRIPT);
      
        console.log('Updating bot...');
        const updateResult = await fhirApi.updateResource_bot(bot, sourceCode);
        console.log('Success! New bot version: ' + updateResult.meta?.versionId);
    }catch(err){
        console.log('Failed to save bot: ' + botConfig.name);
        throw err;
    }
}

async function createBot(
    fhirApi: FhirAPI,
    projectId: string,
    botConfig: MedplumBotConfig,
    runtimeVersion: string,
  ): Promise<void> {
    const body = {
      name: botConfig.name,
      description: botConfig.description,
      runtimeVersion:runtimeVersion
    };
    try{
        //Check if the bot exists
        console.log(`Check if bot ${botConfig.id} already exists in DB`)
        let bot:Bot
        let searchResult = await fhirApi.searchResource_bot('name='+botConfig.name);
        console.log(JSON.stringify(searchResult))
        if(searchResult){
            bot = searchResult; 
        }else{
            console.log(`Create new bot ${botConfig.name}`)     
            let newBot = await fhirApi.create_bot('admin/projects/' + projectId + '/bot', body)
            bot = await fhirApi.readResource_bot(newBot.id);
        }
        await saveBot(fhirApi, botConfig as MedplumBotConfig, bot);
        await deployBot(fhirApi, botConfig as MedplumBotConfig, bot);
        console.log(`Success! Bot created: ${bot.id}`);
    }catch(err){
        console.log('Failed to create bot: ' + botConfig.name);
        throw err;
    }
  }

async function deployBot(fhirApi: FhirAPI, botConfig: MedplumBotConfig, bot: Bot): Promise<void> {
    const codePath = botConfig.dist ?? botConfig.source;
    try{
        const code = readFileContents(codePath);
        if (!code) {
        return;
        }
        console.log('Deploying bot...');
        console.log(fhirApi.fhirUrl_bot(bot.id).toString())
        const deployResult = (await fhirApi.create_bot(fhirApi.fhirUrl_bot(bot.id).toString(), {
        code,
        filename: basename(codePath),
        })) as OperationOutcome;
        console.log('Deploy result: ' + deployResult.issue?.[0]?.details?.text);
    }catch(err){
        console.log(JSON.stringify(err))
        console.log('Failed to deploy bot: ' + botConfig.name);
        throw err;
    }
}

function readFileContents(fileName: string): string {
    const path = resolve(fileName);
    if (!existsSync(path)) {
      return '';
    }
    return readFileSync(path, 'utf8');
}
