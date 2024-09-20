import { MedplumBotConfig } from "./types";
import { Bot, OperationOutcome, Project } from "@medplum/fhirtypes";
import { config as botConfig } from "../bots.config.ts";
import { FhirAPI } from "../api/FhirAPI";
import { basename, resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { ContentType } from "@medplum/core";

//Reads bots.config.json file and creates, deploys the bots and creates subcription for 'Super Admin' project
export async function readAndCreateBotFromConfig(): Promise<void> {
  const botConfigs = botConfig.bots;
  try {
    if (!botConfigs) {
      console.log("0 bots configured in bot config.");
      return;
    }
    console.log(botConfig.bots.length + " bots configured in bot config.");
    let fhirApi = new FhirAPI();
    await fhirApi.clientCredentialslogin();
    await enableBotForSuperAdminProject(fhirApi);
    for (const botConfig of botConfigs) {
      await createBot(fhirApi, "Project Id", botConfig, "vmcontext");
      console.log(`Bot ${botConfig.name} saved and deployed successfully!`);
    }
    console.log("All bots are saved and deployed successfully!");
  } catch (err: unknown) {
    console.log(JSON.stringify(err));
    console.log(`Failed to save bots`);
  }
}

async function createBot(
  fhirApi: FhirAPI,
  projectId: string,
  botConfig: MedplumBotConfig,
  runtimeVersion: string
): Promise<void> {
  const body = {
    name: botConfig.name,
    description: botConfig.description,
    runtimeVersion: runtimeVersion,
  };
  try {
    //Check if the bot exists
    console.log(`Check if bot ${botConfig.id} already exists in DB`);
    let bot: Bot;
    let searchResult = await fhirApi.searchResource_bot(
      "name=" + botConfig.name
    );
    if (searchResult) {
      bot = searchResult;
    } else {
      console.log(`Create new bot ${botConfig.name}`);
      let newBot = await fhirApi.post(
        "admin/projects/" + projectId + "/bot",
        body
      );
      bot = await fhirApi.readResource_bot(newBot.id);
    }
    await saveBot(fhirApi, botConfig as MedplumBotConfig, bot);
    await deployBot(fhirApi, botConfig as MedplumBotConfig, bot);
    await createSubscription(fhirApi, botConfig as MedplumBotConfig, bot);
    console.log(`Success! Bot created: ${bot.id}`);
  } catch (err) {
    console.log("Failed to create bot: " + botConfig.name);
    throw err;
  }
}

async function saveBot(
  fhirApi: FhirAPI,
  botConfig: MedplumBotConfig,
  bot: Bot
): Promise<void> {
  try {
    const codePath = botConfig.source;
    const code = readFileContents(codePath);
    if (!code) {
      return;
    }
    console.log("Saving source code...");
    const sourceCode = await fhirApi.createAttachment_bot(
      basename(codePath),
      code,
      ContentType.TYPESCRIPT
    );

    console.log("Updating bot...");
    const updateResult = await fhirApi.updateResource_bot(bot, sourceCode);
    console.log("Success! New bot version: " + updateResult.meta?.versionId);
  } catch (err) {
    console.log("Failed to save bot: " + botConfig.name);
    throw err;
  }
}

async function deployBot(
  fhirApi: FhirAPI,
  botConfig: MedplumBotConfig,
  bot: Bot
): Promise<void> {
  const codePath = botConfig.dist ?? botConfig.source;
  try {
    const code = readFileContents(codePath);
    if (!code) return;
    console.log("Deploying bot...");
    console.log(fhirApi.fhirUrl_bot("$deploy", bot.id).toString());
    const deployResult = (await fhirApi.post(
      fhirApi.fhirUrl_bot("$deploy", bot.id).toString(),
      {
        code,
        filename: basename(codePath),
      }
    )) as OperationOutcome;
    console.log("Deploy result: " + deployResult.issue?.[0]?.details?.text);
  } catch (err) {
    console.log(JSON.stringify(err));
    console.log("Failed to deploy bot: " + botConfig.name);
    throw err;
  }
}

async function createSubscription(
  fhirApi: FhirAPI,
  botConfig: MedplumBotConfig,
  bot: Bot
) {
  const result = await fhirApi.searchResource_subscription(
    `criteria=${botConfig.subscriptionCriteria}`
  );
  const botSubscription = result.entry?.filter(
    (x) => x.resource?.channel.endpoint == "Bot/" + bot.id
  );
  if (botSubscription?.length == 0) {
    // Create new subscription
    await fhirApi.createResource_subscription(
      `Bot/${bot.id}`,
      `Rest hook subscription for ${botConfig.subscriptionCriteria} resource`,
      botConfig.subscriptionCriteria
    );
    console.log(`Subscription for bot: ${bot.name} successfully created!`);
  }
}

function readFileContents(fileName: string): string {
  const path = resolve(fileName);
  if (!existsSync(path)) {
    return "";
  }
  return readFileSync(path, "utf8");
}

async function enableBotForSuperAdminProject(fhirApi: FhirAPI) {
  let searchResult = await fhirApi.getResource("name=Super Admin");
  let superAdminProject: Project;
  if (searchResult) {
    superAdminProject = searchResult;
  } else throw "Super Admin project not found!";
  superAdminProject.features = ["bots"];
  return await fhirApi.updateResource(superAdminProject);
}
