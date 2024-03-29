(function (exports) {
	"use strict";

	let hdbext = require("@sap/hdbext");

	class Connection {
		constructor(client) {
			this.client = client;
			this.volatile = false;
		}

		close() {
			//this.client.disconnect();
		}

		execute(sql, parameters) {
			return new Promise(
				(resolve, reject) => this.client.prepare(
					sql,
					(prepareError, statement) => {
						if (prepareError) {
							reject(prepareError);
						}
						else {
							statement.exec(parameters, (execError, result) => {
								if (execError) {
									reject(execError);
								}
								else if (this.volatile) {
									this.client.exec('SELECT "LAST_COMMIT_ID" FROM "M_TRANSACTIONS" WHERE "CONNECTION_ID" = CURRENT_CONNECTION',
										(commitCheckError, commitCheckResult ) => {
											if (commitCheckError) {
												reject(commitCheckError);
											}
											else if (commitCheckResult[0].LAST_COMMIT_ID >= 0) {
												reject(`Statement ${sql} implicitly committed in a volatile connection`);
											}
											else {
												resolve(result);
											}
										}
									);
								}
								else {
									resolve(result);
								}
							});
						}
					}
				)
			);
		}

		executeQuery(sql, ...parameters) {
			return this.execute(sql, parameters);
		}

		executeUpdate(sql, ...parameters) {
			return this.execute(sql, parameters);
		}

		executeBulkUpdate(sql, rows) {
			return this.execute(sql, rows);
		}

		async loadProcedure(schema, procedure) {
			if ((!schema) || (!procedure)) {
				procedure = procedure || schema;
				schema = (await this.executeQuery("SELECT CURRENT_SCHEMA FROM DUMMY"))[0].CURRENT_SCHEMA;
			}
			return new Promise(
				(resolveProcedure, rejectProcedure) => {
					this.executeQuery("SELECT \"PARAMETER_TYPE\", \"DATA_TYPE_ID\", \"PARAMETER_NAME\" FROM \"SYS\".\"PROCEDURE_PARAMETERS\" WHERE \"SCHEMA_NAME\" = ? AND \"PROCEDURE_NAME\" = ? ORDER BY \"POSITION\"", schema, procedure)
						.then(queryResult => {
							let scalarInputParameters = [];
							let tableInputParameters = [];
							let scalarOutputParameters = [];
							let tableOutputParameters = [];
							for (let parameterRow of queryResult) {
								if (parameterRow.PARAMETER_TYPE === "IN") {
									if (parameterRow.DATA_TYPE_ID === null) {
										tableInputParameters.push(parameterRow.PARAMETER_NAME);
									}
									else {
										scalarInputParameters.push(parameterRow.PARAMETER_NAME);
									}
								}
								else if (parameterRow.PARAMETER_TYPE === "OUT") {
									if (parameterRow.DATA_TYPE_ID === null) {
										tableOutputParameters.push(parameterRow.PARAMETER_NAME);
									}
									else {
										scalarOutputParameters.push(parameterRow.PARAMETER_NAME);
									}
								}
							}
							hdbext.loadProcedure(
								this.client,
								schema,
								procedure,
								(prepareError, statement) => {
									if (prepareError) {
										rejectProcedure(prepareError);
									}
									else {
										resolveProcedure(
											function (...parameters) {
												return new Promise(
													(resolveResult, rejectResult) =>
														statement(
															...parameters,
															function (executionError, results, ...additionalResults) {
																if (executionError) {
																	rejectResult(executionError);
																}
																else {
																	// add named table results
																	results = additionalResults.slice(0, tableOutputParameters.length).reduce(
																		(aggregatedResults, result, index) => {
																			aggregatedResults[tableOutputParameters[index]] = result;
																			return aggregatedResults;
																		},
																		results
																	);

																	// add unnamed table results (EXECUTE IMMEDIATE)
																	results.$resultSets = additionalResults.slice(tableOutputParameters.length);

																	resolveResult(results);
																}
															}
														)
												);
											}
										);
									}
								}
							)
						}
						)
						.catch(queryError => rejectProcedure(queryError));
				}
			);
		}

		async setVolatile(volatile) {
			if (volatile) {
				await this.setAutoCommit(false);
				this.volatile = true;
			}
			else {
				this.volatile = false;
			}
			return this;
		}

		async setAutoCommit(state) {
			if (this.proteccted) {
				return false;
			}
			else {
				this.client.setAutoCommit(state);
				if (!state) {
					await this.executeUpdate('SET TRANSACTION AUTOCOMMIT DDL OFF');
				}
				return state;
			}
		}

		commit() {
			if (this.volatile) {
				console.error('Ignored commit on volatile connection');
				return Promise.resolve(false);
			}
			else {
				return new Promise((resolve, reject) => this.client.commit(commitError => { if (commitError) { reject(commitError); } else { resolve(true); } }));
			}
		}

		rollback() {
			return new Promise((resolve, reject) => this.client.rollback(rollbackError => { if (rollbackError) { reject(rollbackError); } else { resolve(true); } }));
		}
	}

	function connect(credentials) {
		return new Promise(
			(resolve, reject) => {
				hdbext.createConnection(
					credentials,
					(error, client) => {
						if (error) {
							reject(error);
						}
						else {
							resolve(new Connection(client));
						}
					}
				);
			}
		);
	}

	exports.Connection = Connection;
	exports.connect = connect;
	exports.constants = hdbext.constants;
})(module.exports);