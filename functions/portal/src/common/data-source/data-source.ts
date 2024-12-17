import { DataSource, DataSourceOptions } from 'npm:typeorm'
import { SeederOptions } from 'typeorm-extension'
import { env } from '../../env.ts'

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: env.PG_HOST,
  port: env.PG_PORT,
  username: env.PG_USER,
  password: env.PG_PASSWORD,
  database: env.PG_DATABASE,
  schema: env.PG_SCHEMA,
  poolSize: env.PG_MAX_POOL,
  entities: ['dist/**/*.entity.{ts,js}'],
  seeds: ['dist/**/data-source/seeds/*.seeder.{ts,js}']
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
