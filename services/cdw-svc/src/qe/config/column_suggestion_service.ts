import {
  Connection as connLib,
  Logger,
  QueryObject as queryObjectLib,
} from "@alp/alp-base-utils";
import * as Utils from "../settings/Utils";
import ConnectionInterface = connLib.ConnectionInterface;
import CallBackInterface = connLib.CallBackInterface;
import { getDefaultSchemaName } from "../../utils/DuckdbConnection";
import { env } from "../../configs";
const log = Logger.CreateLogger();

export function processRequest(
  request,
  connection: ConnectionInterface,
  placeholderTableMap,
  callback: CallBackInterface
) {
  getColumnsForTable(connection, request, placeholderTableMap, callback);
}

function getColumnsForTable(
  connection,
  request,
  placeholderTableMap,
  callback
) {
  try {
    const table = request.table;
    const mappedtable = placeholderTableMap[table];
    let tableName = mappedtable.replace(/"/g, "");
    const parsedName = Utils.parseDbObjectName(mappedtable);
    tableName = parsedName.tableName;
    let schema = parsedName.schema
      ? parsedName.schema
      : connection.schemaName;
    let query = ""
    if (env.USE_DUCKDB === "true") {
      schema = getDefaultSchemaName()
      query = `SELECT column_name as "value" 
      from information_schema.columns 
      WHERE table_schema = %s and table_name = %s
      UNION 
      SELECT attname as "value" 
      from pg_attribute
      WHERE  attrelid = concat(%s::text, '."', %s::text, '"')`
    } else{
      query = `SELECT COLUMN_NAME as "value"
      FROM  VIEW_COLUMNS WHERE SCHEMA_NAME = %s AND VIEW_NAME = %s
      UNION
      SELECT COLUMN_NAME as "value"
      FROM  TABLE_COLUMNS WHERE SCHEMA_NAME = %s AND TABLE_NAME = %s`
    }
    const sQuery = queryObjectLib.QueryObject.format(
      query,
      schema,
      tableName,
      schema,
      tableName
    );
    log.debug(sQuery.queryString);
    sQuery.executeQuery(connection, (err, result) => {
      if (err) {
        log.error(err);
        return callback(null, { data: [] });
      }
      callback(null, result);
    });
  } catch (err) {
    log.error(err);
    callback(null, { data: [] });
  }
}
