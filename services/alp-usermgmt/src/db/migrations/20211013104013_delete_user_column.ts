import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('usermgmt').alterTable('user', (table: Knex.TableBuilder) => {
    table.dropColumn('tou_version')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('usermgmt').alterTable('user', (table: Knex.TableBuilder) => {
    table.string('tou_version')
  })
}
