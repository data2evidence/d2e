export interface DatasetSchemaMappingType {
  study_id: string;
  db_name: string;
  schema_names: string;
}

export interface DataModelSchemaMappingType {
  schemaName: string;
  dataModel: string;
  vocabSchemaName: string;
}

export interface VersionInfoType {
  message: string;
  function: string;
  errorOccurred: boolean;
  failedSchemas: Array<SchemaVersionInfo>;
  successfulSchemas: Array<SchemaVersionInfo>;
}

export interface QueryObjectResultType<T> {
  data: T;
  sql: string;
  sqlParameters: any[];
}

export interface IDBCredentialsType {
  schema?: string;
  dialect: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface IDBHanaCredentialsType extends IDBCredentialsType {
  databaseName: string;
  autoCommit: boolean;
  hostname_in_certificate: string;
  validate_certificate: boolean;
  pooling: boolean;
  encrypt: boolean;
  sslTrustStore: string;
  sslCryptoProvider: string;
  useTLS: boolean;
  rejectUnauthorized: boolean;
}

export interface IDBPgCredentialsType extends IDBCredentialsType {
  database: string;
  ssl: IPgTenantConfigSSL;
  connectionTimeoutMillis: number;
  idle_in_transaction_session_timeout: number;
  query_timeout: number;
  statement_timeout: number;
}

export interface IHanaTenantConfig {
  host: string;
  port: number;
  databaseName: string;
  hanaAdminUser: string;
  hanaReadUser: string;
  hanaWriteUser: string;
  hanaAdminPassword: string;
  hanaReadPassword: string;
  hanaWritePassword: string;
  autoCommit: boolean;
  validate_certificate: boolean;
  pooling: boolean;
  encrypt: boolean;
  sslTrustStore: string;
  enableAuditPolicies: boolean;
  dialect: string;
}

interface IPgTenantConfigSSL {
  ca: string;
  rejectUnauthorized: boolean;
}

export interface IPgTenantConfig {
  host: string;
  port: number;
  databaseName: string;
  postgresAdminUser: string;
  postgresAdminPassword: string;
  ssl: IPgTenantConfigSSL;
  connectionTimeoutMillis: number;
  idle_in_transaction_session_timeout: number;
  query_timeout: number;
  statement_timeout: number;
  dialect: string;
}

export interface SnapshotCopyConfig {
  timestamp?: string;
  tableConfig?: SnapshotCopyTableConfig[];
  patientsToBeCopied?: string[];
}

export interface SnapshotCopyTableConfig {
  tableName: string;
  columnsToBeCopied: string[];
}

export interface SnapshotQueryObject {
  name: string; // Table name
  query: string;
}

export interface SnapshotFilterColumns {
  timestampColumn?: string;
  personIdColumn?: string;
}

export interface IItem {
  id: string;
  linkId: string;
  definition?: string;
  code?: string;
  prefix?: string;
  text?: string;
  type: string;
  enableWhen?: string;
  enableBehavior?: string;
  disbledDisplay?: string;
  required?: string;
  repeats?: string;
  readOnly?: string;
  maxLength?: bigint;
  answerConstraint?: string;
  answerValueSet?: string;
  answerOption?: string;
  initial?: string;
  item: IItem[];
}
export interface IQuestionnaire {
  resourceType: string;
  id: string;
  text?: string;
  url?: string;
  identifier?: string;
  version?: string;
  name?: string;
  title?: string;
  derivedFrom?: string;
  status: string;
  experimental?: boolean;
  subjectType?: string;
  date?: string;
  publisher?: string;
  contact?: string;
  description?: string;
  useContext?: string;
  jurisdiction?: string;
  purpose?: string;
  copyright?: string;
  copyright_label?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: string;
  code?: string;
  item: IItem[];
}

export interface ITokenUser {
  userId: string;
  idpUserId: string;
  email?: string;
}

export interface SchemaVersionInfo {
  schemaName: string;
  vocabSchemaName: string;
  dataModel?: string;
  currentVersionID?: string;
  latestVersionID?: string;
  updatesAvailable?: boolean;
}
