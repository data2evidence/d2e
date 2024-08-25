import * as config from "../utils/config.ts"
import * as pg from "pg"

export default class PGDBRouter {

	private logger = config.getLogger()

	verifyIfDatabaseExists = async(client: any, databaseNameLowercase: string) => {
		const result = await client.query(`select exists(
				SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = '${databaseNameLowercase}'
		   )`);
		   return result.rows[0].exists
	}

	createDatabase = async (client: any, databaseName: string) => {
		await client.query(`CREATE DATABASE ${databaseName}`)
		this.logger.info(`Database ${databaseName} successfully created.`)
	}
	createSchema = async (client: any, databaseName:string, schemaName: string) => {
		await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
		this.logger.info(`${schemaName} schema created successfully in ${databaseName} database`)
	}

	closeConnection = async (client: any) => {
		if (client) {
			await ((<any>client).end())
			this.logger.debug("Connection disconnected.")
		}
	}

	openConnection = async (config: any) => {
		const client = new pg.Client(config)
		await client.connect()
		this.logger.debug("Client Connected.")
		return client
	}
}