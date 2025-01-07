import dataSource from "../common/data-source/data-source.ts";
import { runMigrations } from "../common/data-source/db-migration.ts";
import { createLogger } from "../logger.ts";
// eslint-disable-next-line
import * as pg from 'npm:pg';

class Init {
  private readonly logger = createLogger("portal-init");

  private async initialiseDataSource() {
    this.logger.info("Initialising portal");

    try {
      await dataSource.initialize();
      this.logger.info("Datasource is initialised");
      await runMigrations();
      //TODO:  not working in deno
      // await runSeeders(dataSource);
    } catch (error) {
      this.logger.error(`Error while initialising datasource: ${error}`);
      console.log(`Error while initialising datasource: ${error}`);
      Deno.exit(1);
    }
  }

  async start() {
    await this.initialiseDataSource();
  }
}

new Init().start();
