const child_process = require("child_process");
import * as config from "./config";
import { passwordReplacementRegex } from "./baseUtils";

const logger = config.getLogger();

export class Liquibase {
  params: any;

  constructor(params: any) {
    this.params = params;
  }

  run(action: any, params?: any[]) {
    let commandTokens: string[] = this.liquibasePathAndGlobalAttributes(
      this.params
    );
    commandTokens.push(action);
    if (params) commandTokens = commandTokens.concat(params);
    if (action === "status") {
      return this.checkForUndeployedChangesets(commandTokens);
    } else {
      return this.spawnChildProcess(commandTokens);
    }
  }

  checkForUndeployedChangesets(commandTokens: string[]) {
    logger.info("Checking for undeployed changesets with Liquibase..");
    let updateStatusMsg: String;

    return new Promise((resolve, reject) => {
      const command = child_process.spawn(commandTokens.shift(), commandTokens);

      command.stdout.on("data", (data: any) => {
        updateStatusMsg = String(data);
        // Log info and mask passwords
        logger.info(data.toString().replace(passwordReplacementRegex, "***"));
      });

      command.stderr.on("data", (data: any) => {
        // Log info and mask passwords
        logger.info(data.toString().replace(passwordReplacementRegex, "***")); //Weird info has to be used. Because the logs from Liquibase executable is only appearing over here
      });

      command.on("error", (error: any) => {
        logger.error(error);
        reject(error);
      });

      command.on("close", (code: any) => {
        if (code != 0) {
          logger.error(`Liquibase exited with error. code ${code}`);
          reject(code);
        } else {
          logger.info(`Liquibase operation completed successfully`);
          resolve(updateStatusMsg);
        }
      });
    });
  }

  spawnChildProcess(commandTokens: string[]) {
    logger.info("Running Liquibase..");

    return new Promise((resolve, reject) => {
      const command = child_process.spawn(commandTokens.shift(), commandTokens);

      command.stdout.on("data", (data: any) => {
        // Log info and mask passwords
        logger.info(data.toString().replace(passwordReplacementRegex, "***"));
      });

      command.stderr.on("data", (data: any) => {
        // Log info and mask passwords
        logger.info(data.toString().replace(passwordReplacementRegex, "***")); //Weird info has to be used. Because the logs from Liquibase executable is only appearing over here
      });

      command.on("error", (error: any) => {
        logger.error(error);
        reject(error);
      });

      command.on("close", (code: any) => {
        if (code != 0) {
          logger.error(`Liquibase exited with error. code ${code}`);
          reject(code);
        } else {
          logger.info(`Liquibase operation completed successfully`);
          resolve(code);
        }
      });
    });
  }

  liquibasePathAndGlobalAttributes(params: any) {
    const liquibasePathAndGlobalAttributes = [params.liquibase];
    Object.keys(params).forEach(function (key) {
      if (key === "liquibase" || key == "liquibasePropertiesFile") {
        return;
      }

      let value = params[key];
      liquibasePathAndGlobalAttributes.push("--" + key + "=" + value);
    });
    return liquibasePathAndGlobalAttributes;
  }
}
