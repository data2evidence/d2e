import { Knex } from "knex";
import {env} from "../../env"

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex
    .withSchema(env.PG_SCHEMA)
    .into("ConfigDbModels_AssignmentDetail")
    .insert([
      {
        HeaderId: "3D00794D4078407C9B6F67675E62A26D",
        ConfigId: "92d7c6f8-3118-4256-ab22-f2f7fd19d4e7",
        ConfigVersion: "A",
        ConfigType: "HC/MRI/PA",
      },
      {
        HeaderId: "ddf8d1ec-30e0-4dab-94cb-490f5900fd98",
        ConfigId: "92d7c6f8-3118-4256-ab22-f2f7fd19d4e7",
        ConfigVersion: "A",
        ConfigType: "HC/MRI/PA",
      },
      {
        HeaderId: "3D00794D4078407C9B6F67675E62A26D",
        ConfigId: "4fce3cb7-32bf-4b46-8cba-32e4f77a14dd",
        ConfigVersion: "A",
        ConfigType: "HC/MRI/PA",
      },
      {
        HeaderId: "ddf8d1ec-30e0-4dab-94cb-490f5900fd98",
        ConfigId: "4fce3cb7-32bf-4b46-8cba-32e4f77a14dd",
        ConfigVersion: "A",
        ConfigType: "HC/MRI/PA",
      },
    ])
    .onConflict(["HeaderId", "ConfigId"])
    .ignore();
}
