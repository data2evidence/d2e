import dataSource from "./datasource.ts";

export const runMigrations = async () => {
  const logger = console;

  try {
    logger.info("Running jobplugins migrations...");
    await dataSource.initialize();
    await dataSource.runMigrations();
    logger.info("~~~ Migrations jobplugins completed! ~~~");
  } catch (err) {
    logger.error("jobplugins migrations has failed!", err);
    process.exit(0);
  }
};
