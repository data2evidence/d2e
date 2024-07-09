import { Connection } from '@alp/alp-base-utils'
import ConnectionInterface = Connection.ConnectionInterface
export interface MedplumBotConfig {
    readonly name: string;
    readonly id: string;
    readonly description: string;
    readonly source: string;
    readonly dist?: string;
    readonly subscriptionCriteria?: string;
}

export interface IMRIRequest extends Request {
    dbConnections: {
      duckDbConnection: ConnectionInterface
    }
  }