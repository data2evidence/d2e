const hdb = require("hdb");

const credentials = {
    host: process.env.HDI__HOST,
    port: process.env.HDI__PORT,
    user:  process.env.HDI___SYS_DI__USER,
    password: process.env.HDI___SYS_DI__PASSWORD,
}

let schema = process.env.SCHEMA

const client = hdb.createClient(credentials);

client.on("error", (err) => {
  console.log("client has error");
});

console.log("connecting to client");
client.connect(function (err) {
  if (err) {
    return console.error("Connect error", err);
  }
  console.log(client.readyState);

  client.exec(`SET SCHEMA ${schema}`, function (err) {
    if (err) {
      return console.error("Error executing statement:", err);
    }
    console.log(`schema is set to ${schema}`);
  });

  for (const [key, statement] of Object.entries(statements)) {
    client.exec(statement, (err) => {
      if (err) {
        console.error(`${key} creation failed!`);
        return console.error("Error executing statement:", err);
      }
      console.log(`${key} created`);
    });
  }
  client.end();
});

const statements = {
  ConfigDbModels_AssignmentDetail: `CREATE TABLE "ConfigDbModels_AssignmentDetail" (
        "HeaderId" VARCHAR(40) NOT NULL,
        "ConfigId" VARCHAR(40) NOT NULL,
        "ConfigVersion" VARCHAR(20) NOT NULL,
        "ConfigType" VARCHAR(20) NOT NULL )`,
  ConfigDbModels_AssignmentHeader: `CREATE TABLE "ConfigDbModels_AssignmentHeader" (
        "Id" VARCHAR(40) NOT NULL,
        "Name" VARCHAR(255) DEFAULT '',
        "EntityType" CHARACTER(1) NOT NULL,
        "EntityValue" VARCHAR(255) NOT NULL,
        "Creator" VARCHAR(255) NOT NULL,
        "Created" TIMESTAMP NOT NULL,
        "Modifier" VARCHAR(255) NOT NULL,
        "Modified" TIMESTAMP NOT NULL,
        PRIMARY KEY ("Id")
    )`,
  ConfigDbModels_Config: `CREATE TABLE "ConfigDbModels_Config" (
    "Id" VARCHAR(40) NOT NULL,
    "Version" VARCHAR(20) NOT NULL,
    "Status" VARCHAR(20) DEFAULT '',
    "Name" VARCHAR(255) DEFAULT '',
    "Type" VARCHAR(100) NOT NULL,
    "Data" NCLOB MEMORY THRESHOLD 1000 NOT NULL,
    "ParentId" VARCHAR(40),
    "ParentVersion" VARCHAR(20),
    "Creator" VARCHAR(255) NOT NULL,
    "Created" TIMESTAMP NOT NULL,
    "Modifier" VARCHAR(255) NOT NULL,
    "Modified" TIMESTAMP NOT NULL,
    PRIMARY KEY ("Id", "Version")
)`,
  ConfigDbModels_Template: `CREATE TABLE "ConfigDbModels_Template" (
    "Id" VARCHAR(40) NOT NULL,
    "System" VARCHAR(40) NOT NULL,
    "Data" text,
    "Creator" VARCHAR(256),
    "Created" TIMESTAMP,
    "Modifier" VARCHAR(256),
    "Modified" TIMESTAMP,
    PRIMARY KEY ("Id")
)`,
  ConfigDbModels_UserDefaultConfig: `CREATE TABLE "ConfigDbModels_UserDefaultConfig" (
    "User" VARCHAR(256) NOT NULL,
    "ConfigType" VARCHAR(20) NOT NULL,
    "ConfigId" VARCHAR(40) NOT NULL,
    "ConfigVersion" VARCHAR(20) NOT NULL,
    PRIMARY KEY ("User", "ConfigType")
)`,
  MRIEntities_CollectionItems: `CREATE TABLE "MRIEntities_CollectionItems" (
    "Id" VARCHAR(100),
    "ItemType" VARCHAR(1024),
    "CollectionId" VARCHAR(32),
    "CreatedBy" VARCHAR(256),
    "CreatedAt" TIMESTAMP,
    "ChangedBy" VARCHAR(256),
    "ChangedAt" TIMESTAMP,
    "StatusId" VARCHAR(32)
)`,
  MRIEntities_DynamicViewList: `CREATE TABLE "MRIEntities_DynamicViewList" (
    "ViewId" VARCHAR(1024) NOT NULL, 
    "CreatedBy" VARCHAR(256),
    "CreatedAt" TIMESTAMP,
    "Description" VARCHAR(1024),
    PRIMARY KEY ("ViewId")
)`,
  ConfigDbModels_Assignment: `CREATE VIEW "ConfigDbModels_Assignment" AS
    SELECT ah."Id" AS "Id",
      ah."Name" AS "Name",
      ah."EntityType" AS "EntityType",
      ah."EntityValue" AS "EntityValue",
      ah."Creator" AS "Creator",
      ah."Created" AS "Created",
      ah."Modifier" AS "Modifier",
      ah."Modified" AS "Modified",
      c."Id" AS "ConfigId",
      c."Version" AS "ConfigVersion",
      c."Type" AS "ConfigType"
        FROM "ConfigDbModels_AssignmentDetail" as ad
        INNER JOIN "ConfigDbModels_AssignmentHeader" AS ah
        ON ad."HeaderId" = ah."Id"
        INNER JOIN "ConfigDbModels_Config" AS c
        ON ad."ConfigId" = c."Id" AND ad."ConfigVersion" = c."Version" AND ad."ConfigType" = c."Type"`,
  ConfigDbModels_DefaultConfig: `CREATE VIEW "ConfigDbModels_DefaultConfig" AS
  SELECT udc."User",
      udc."ConfigType",
      c."Id",
      c."Version",
      c."Name",
      c."Data"
  FROM "ConfigDbModels_UserDefaultConfig" as udc
  INNER JOIN "ConfigDbModels_Config" AS c
  ON udc."ConfigId" = c."Id" AND udc."ConfigVersion" = c."Version"`,
  ConfigDbProcedures_DeleteAssignment: `CREATE PROCEDURE "ConfigDbProcedures_DeleteAssignment" (
        IN ASSIGNMENT_ID NVARCHAR(256)
    ) 
    LANGUAGE SQLSCRIPT
    SQL SECURITY DEFINER 
    AS

    BEGIN 

    DELETE FROM "ConfigDbModels_AssignmentHeader"
    WHERE "Id" = :ASSIGNMENT_ID;
    DELETE FROM "ConfigDbModels_AssignmentDetail"
    WHERE "HeaderId" = :ASSIGNMENT_ID;

END;`,
  ConfigDbProcedures_DeleteConfiguration: `CREATE PROCEDURE "ConfigDbProcedures_DeleteConfiguration" (
    IN CONFIG_ID NVARCHAR(40),
    IN CONFIG_VERSION NVARCHAR(20),
    IN CONFIG_STATUS NVARCHAR(20)
    ) 
    LANGUAGE SQLSCRIPT
    SQL SECURITY DEFINER 
    AS

    BEGIN

    DECLARE CONFIGS_TO_DELETE TABLE(CONFIG_ID NVARCHAR(40), CONFIG_VERSION NVARCHAR(20));
    DECLARE ASSIGNMENTS_TO_DELETE TABLE(ASSIGNMENT_ID NVARCHAR(40));
    DECLARE PREV_ROWCOUNT INTEGER := 0;
    DECLARE CUR_ROWCOUNT INTEGER := 1;

    CONFIGS_TO_DELETE = 
        SELECT "Id" as CONFIG_ID, "Version" as CONFIG_VERSION 
        FROM "ConfigDbModels_Config"
        WHERE 
            "Id" = :CONFIG_ID AND (
                "Version" = :CONFIG_VERSION
                OR :CONFIG_VERSION is null
            ) AND (
                "Status" = :CONFIG_STATUS
                OR :CONFIG_STATUS is null
            );

    WHILE CUR_ROWCOUNT > PREV_ROWCOUNT DO
        PREV_ROWCOUNT := CUR_ROWCOUNT;
        CONFIGS_TO_DELETE = 
                SELECT "Id" as CONFIG_ID, "Version" as CONFIG_VERSION
                FROM "ConfigDbModels_Config" configs
                    JOIN :CONFIGS_TO_DELETE as toDelete 
                        ON configs."ParentId" = toDelete.CONFIG_ID
                        AND configs."ParentVersion" = toDelete.CONFIG_VERSION
            UNION
                SELECT CONFIG_ID, CONFIG_VERSION
                FROM :CONFIGS_TO_DELETE;
        SELECT count(*) INTO CUR_ROWCOUNT FROM :CONFIGS_TO_DELETE;
    END WHILE;

    DELETE FROM "ConfigDbModels_Config"
    WHERE "Id" || '-' || "Version" in (
        SELECT CONFIG_ID || '-' || CONFIG_VERSION
        FROM :CONFIGS_TO_DELETE
    );

    DELETE FROM "ConfigDbModels_UserDefaultConfig"
    WHERE "ConfigId" || '-' || "ConfigVersion" in (
        SELECT CONFIG_ID || '-' || CONFIG_VERSION
        FROM :CONFIGS_TO_DELETE
    );

    ASSIGNMENTS_TO_DELETE = 
        SELECT DISTINCT header."Id" as ASSIGNMENT_ID
        FROM "ConfigDbModels_AssignmentHeader" header
        JOIN "ConfigDbModels_AssignmentDetail" detail
            ON header."Id" = detail."HeaderId"
        JOIN :CONFIGS_TO_DELETE as toDelete
            ON detail."ConfigId" = toDelete.CONFIG_ID
            AND detail."ConfigVersion" = toDelete.CONFIG_VERSION;

    BEGIN
        DECLARE CURSOR assignment_cursor FOR
            SELECT ASSIGNMENT_ID FROM :ASSIGNMENTS_TO_DELETE;
        FOR cur_row as assignment_cursor DO
            CALL "ConfigDbProcedures_DeleteAssignment"(cur_row.ASSIGNMENT_ID);
        END FOR;

    END;
            
    END;`,
    ConfigDbProcedures_GetAssignedConfigurations: `CREATE FUNCTION "ConfigDbProcedures_GetAssignedConfigurations" (
        CONFIG_TYPE VARCHAR(20), 
        USERNAME VARCHAR(256))  
        RETURNS TABLE(
            "ASSIGNMENT_ID" VARCHAR(40),
            "ASSIGNMENT_NAME" VARCHAR(256),
            "CONFIG_ID" VARCHAR(40),
            "CONFIG_VERSION" VARCHAR(20),
            "CONFIG_STATUS" VARCHAR(20),
            "CONFIG_NAME" VARCHAR(256),
            "DEPENDENT_CONFIG_ID" VARCHAR(40),
            "DEPENDENT_CONFIG_VERSION" VARCHAR(20),
            "DATA" VARCHAR(5000)
        )   
        LANGUAGE SQLSCRIPT
        SQL SECURITY DEFINER 
        AS
    BEGIN 
         return SELECT  
                assignment."Id" as ASSIGNMENT_ID,
                assignment."Name" as ASSIGNMENT_NAME,
                config."Id" as CONFIG_ID,
                config."Version" as CONFIG_VERSION,
                config."Status" as CONFIG_STATUS,
                config."Name" as CONFIG_NAME,
                config."ParentId" as DEPENDENT_CONFIG_ID, 
                config."ParentVersion" as DEPENDENT_CONFIG_VERSION,
                config."Data" as "DATA"
            FROM "ConfigDbModels_Assignment" as assignment
                JOIN "ConfigDbModels_Config" as config
                    ON assignment."ConfigId" = config."Id"
                    AND assignment."ConfigVersion" = config."Version"
                    and assignment."EntityType" = 'U'
                    AND assignment."EntityValue" = USERNAME
            WHERE config."Type" = CONFIG_TYPE
                AND config."Id" is not null
        ;
    END`,
    ConfigDbProcedures_HasUserConfigurationAssigned: `CREATE FUNCTION "ConfigDbProcedures_HasUserConfigurationAssigned" (
        USERNAME VARCHAR(128),
        CONFIG_ID VARCHAR(40),
        CONFIG_VERSION VARCHAR(20))
        RETURNS TABLE(ALLOWED INTEGER)
        LANGUAGE SQLSCRIPT
        SQL SECURITY DEFINER 
        AS
    BEGIN 
        
        return SELECT
                CASE WHEN
                    count(*)>0
                THEN 
                    1
                ELSE
                    0
                END as ALLOWED
            FROM "ConfigDbModels_Assignment" as assignment
            WHERE assignment."ConfigId" = CONFIG_ID
                AND assignment."ConfigVersion" = CONFIG_VERSION
                and assignment."EntityType" = 'U'
                    AND assignment."EntityValue" = USERNAME;
    END;`,
    bookmark: `CREATE TABLE "bookmark" (
      id VARCHAR(40), 
      bookmark_name VARCHAR(40),
      bookmark text,
      type VARCHAR(10),
      view_name VARCHAR(100),
      modified TIMESTAMP,
      study_id VARCHAR(40) DEFAULT 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      version INTEGER,
      pa_config_id VARCHAR(40),
      cdm_config_id VARCHAR(40),
      cdm_config_version VARCHAR(40),
      user_id VARCHAR(40),
      shared BOOLEAN,
      PRIMARY KEY (id)
  )`
};
