import {seed} from "./src/seed.ts"
import {createSubscription} from "./src/loadBots.ts"
import { replaceEnvVariablesInBot } from "./src/parseEnv.ts" 

await seed()
await createSubscription()
//await replaceEnvVariablesInBot()
//readAndCreateBotFromConfig()