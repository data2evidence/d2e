import { Knex } from "knex";
import "../../env";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .withSchema(process.env.SCHEMA_NAME)
    .createTable("UserModels_UserInfo", (table: Knex.TableBuilder) => {
      table.uuid("UserID").primary();
      table.string("FirstName");
      table.string("LastName");
      table.string("EmailID");
      table.timestamp("LastLogin", { useTz: false });
      table.string("Status");
      table.string("ChangedBy");
      table.timestamp("ChangedAt", { useTz: false });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .withSchema(process.env.SCHEMA_NAME)
    .dropTable("UserModels_UserInfo");
}
