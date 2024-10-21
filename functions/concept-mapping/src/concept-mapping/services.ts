import pg, { Client } from "pg";
import { DatabaseOptions } from "../types";

export const getSourceToConceptMappings = async (
  databaseOptions: DatabaseOptions
) => {
  try {
    const pgclient: typeof Client = new pg.Client(databaseOptions);
    await pgclient.connect();
  } catch (error) {
    throw new Error(
      `Failed to retrieve source to concept mappings for ${databaseOptions.database}: ${Error}`
    );
  }
};

export const saveSourceToConceptMappings = async (
  databaseOptions: DatabaseOptions
) => {
  try {
    const pgclient: typeof Client = new pg.Client(databaseOptions);
    await pgclient.connect();
  } catch (error) {
    throw new Error(
      `Failed to save source to concept mappings for ${databaseOptions.database}: ${Error}`
    );
  }
};
