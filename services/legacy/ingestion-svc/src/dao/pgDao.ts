import * as config from "../utils/config"

const { Client } = require('pg')
const pgp = require('pg-promise')({
	capSQL: true
 });
 
export default class PGDAO {
	private logger = config.getLogger()

	insertRecords = async (client: any, table: string, schema: string, cols: Array<String>, data: object) => {
		const cs = new pgp.helpers.ColumnSet(cols, {table: {table, schema}});
		const insertQuery = pgp.helpers.insert(data, cs);
		this.logger.debug(`Insert Query: ${insertQuery}`)
		await client.query(insertQuery);
	}

	closeConnection = async (client: any) => {
		if (client) {
			await <any>client.end()
			this.logger.debug("Connection disconnected.")
		}
	}

	openConnection = async (config: any) => {
		const client = new Client(config)
		await client.connect()
		this.logger.debug("Client Connected.")
		return client
	}
}