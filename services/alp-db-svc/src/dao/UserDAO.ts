import async from "async";
import * as utils from "../utils/baseUtils";
import * as config from "../utils/config";

class UserDAO {
  private logger = config.getLogger();

  checkIfUserExist = (db: any, user: string) => {
    return new Promise((resolve, reject) => {
      db.executeQuery(
        `Select * from "SYS"."USERS" where user_name = ?`,
        [{ value: user }],
        (err: any, result: any) => {
          if (err) return reject(err);
          if (result && result.length == 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  };

  checkIfRoleExist = (db: any, roleName: string) => {
    return new Promise((resolve, reject) => {
      db.executeQuery(
        `Select * from "SYS"."ROLES" where role_name = ?`,
        [{ value: roleName }],
        (err: any, result: any) => {
          if (err) return reject(err);
          if (result && result.length == 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  };

  createSchemaReadRole = (db: any, schema: string, roleName: string) => {
    return new Promise((resolve, reject) => {
      async.series(
        [
          // function (callback) {
          //   db.setAutoCommitToFalse(callback);
          // },
          function (callback) {
            db.execute(
              `CREATE ROLE "${roleName}" NO GRANT TO CREATOR`,
              [],
              (err: any, result: any) => {
                if (err) return callback(err);
                const response = utils.createMultiLogs(
                  `${roleName} role Created Successfully`,
                  { role: roleName }
                );
                callback(null, response);
              }
            );
          },
          function (callback) {
            db.execute(
              `GRANT SELECT, EXECUTE, CREATE TEMPORARY TABLE ON SCHEMA ${schema} TO ${roleName}`,
              [],
              (err: any, result: any) => {
                if (err) return reject(err);
                const response = utils.createMultiLogs(
                  `Granted Read privileges Successfully`,
                  {
                    role: roleName,
                    schema,
                    privileges: "SELECT, EXECUTE, CREATE TEMPORARY TABLE",
                  }
                );
                callback(null, response);
              }
            );
          },
          // function (callback) {
          //   db.commit(callback);
          // },
        ],
        // optional callback
        (err, results: any) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          } else {
            resolve(results); //success
          }
          // results is now equal to ['one', 'two']
        }
      );
    });
  };

  createUser(db: any, user: string, password: string) {
    return new Promise((resolve, reject) => {
      async.series(
        [
          function (callback) {
            db.execute(
              `CREATE USER ${user} PASSWORD ${password} NO FORCE_FIRST_PASSWORD_CHANGE`,
              [],
              (err: any, result: any) => {
                if (err) return callback(err);
                const response = utils.createMultiLogs(
                  `${user} User Created Successfully`,
                  { user }
                );
                callback(null, response);
              }
            );
          },
        ],
        // optional callback
        (err, results: any) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          } else {
            resolve(results); //success
          }
          // results is now equal to ['one', 'two']
        }
      );
    });
  }

  createRole(db: any, roleName: string) {
    return new Promise((resolve, reject) => {
      async.series(
        [
          function (callback) {
            db.executeQuery(
              `CREATE ROLE "${roleName}"`,
              [],
              (err: any, result: any) => {
                if (err) return callback(err);
                const response = utils.createMultiLogs(
                  `${roleName} role created successfully`,
                  { role: roleName }
                );
                callback(null, response);
              }
            );
          },
          // function (callback) {
          //   db.commit(callback);
          // },
        ],
        // optional callback
        (err, results: any) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          } else {
            resolve(results); //success
          }
          // results is now equal to ['one', 'two']
        }
      );
    });
  }

  assignRole(db: any, user: string, roleName: string) {
    return new Promise((resolve, reject) => {
      async.series(
        [
          function (callback) {
            db.execute(
              `GRANT "${roleName}" TO ${user}`,
              [],
              (err: any, result: any) => {
                if (err) return callback(err);
                const response = utils.createMultiLogs(
                  `${roleName} role granted to ${user} user successfully`,
                  { user, role: roleName }
                );
                callback(null, response);
              }
            );
          },
          // function (callback) {
          //   db.commit(callback);
          // },
        ],
        // optional callback
        (err, results: any) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          } else {
            resolve(results); //success
          }
          // results is now equal to ['one', 'two']
        }
      );
    });
  }

  createAndAssignRole(db: any, user: string, roleName: string) {
    return new Promise((resolve, reject) => {
      async.series(
        [
          // function (callback) {
          //   db.setAutoCommitToFalse(callback);
          // },
          function (callback) {
            db.execute(
              `CREATE ROLE "${roleName}"`,
              [],
              (err: any, result: any) => {
                if (err) return callback(err);
                const response = utils.createMultiLogs(
                  `${roleName} role Created Successfully`,
                  { role: roleName }
                );
                callback(null, response);
              }
            );
          },
          function (callback) {
            db.execute(
              `GRANT "${roleName}" TO ${user} `,
              [],
              (err: any, result: any) => {
                if (err) return callback(err);
                const response = utils.createMultiLogs(
                  `${roleName} Role Granted to ${user} User Successfully`,
                  { user, role: roleName }
                );
                callback(null, response);
              }
            );
          },
          // function (callback) {
          //   db.commit(callback);
          // },
        ],
        // optional callback
        (err, results: any) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          } else {
            resolve(results); //success
          }
          // results is now equal to ['one', 'two']
        }
      );
    });
  }

  grantReadPrivileges = (db: any, schema: string, roleName: string) => {
    return new Promise((resolve, reject) => {
      db.execute(
        `GRANT SELECT, EXECUTE, CREATE TEMPORARY TABLE ON SCHEMA ${schema} TO ${roleName}`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          const response = utils.createMultiLogs(
            `Granted Read privileges Successfully`,
            {
              role: roleName,
              schema,
              privileges: "SELECT, EXECUTE, CREATE TEMPORARY TABLE",
            }
          );
          resolve(response);
        }
      );
    });
  };

  grantWritePrivileges = (db: any, schema: string, roleName: string) => {
    return new Promise((resolve, reject) => {
      db.execute(
        `GRANT DELETE, EXECUTE, INSERT, SELECT, UPDATE, CREATE TEMPORARY TABLE ON SCHEMA ${schema} TO ${roleName}`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          const response = utils.createMultiLogs(
            `Granted Write privileges Successfully`,
            {
              role: roleName,
              schema,
              privileges:
                "DELETE, EXECUTE, INSERT, SELECT, UPDATE, CREATE TEMPORARY TABLE",
            }
          );
          resolve(response);
        }
      );
    });
  };

  grantCohortWritePrivileges = (db: any, schema: string, roleName: string) => {
    return new Promise((resolve, reject) => {
      async.series(
        [
          function (callback) {
            db.execute(
              `GRANT DELETE, INSERT, UPDATE ON ${schema}.cohort TO ${roleName}`,
              [],
              (err: any, result: any) => {
                if (err) {
                  // If cohort table does not exist, dont throw error
                  if (
                    err.code === "42P01" || // PG cohort relation does not exist
                    err.code === 397 // HANA cohort invalid object name
                  ) {
                    // pass
                  } else {
                    return callback(err);
                  }
                }
                const response = utils.createMultiLogs(
                  `Granted COHORT Table Write privileges Successfully`,
                  {
                    role: roleName,
                    schema,
                    table: "COHORT",
                    privileges: "DELETE, INSERT, UPDATE",
                  }
                );
                callback(null, response);
              }
            );
          },
          function (callback) {
            db.execute(
              `GRANT DELETE, INSERT, UPDATE ON ${schema}.cohort_definition TO ${roleName}`,
              [],
              (err: any, result: any) => {
                if (err) {
                  // If cohort_definition table does not exist, dont throw error
                  if (
                    err.code === "42P01" || // PG cohort_definition relation does not exist
                    err.code === 397 // HANA cohort_definition invalid object name
                  ) {
                    // pass
                  } else {
                    return callback(err);
                  }
                }
                const response = utils.createMultiLogs(
                  `Granted COHORT_DEFINITION Table Write privileges Successfully`,
                  {
                    role: roleName,
                    schema,
                    table: "COHORT_DEFINITION",
                    privileges: "DELETE, INSERT, UPDATE",
                  }
                );
                callback(null, response);
              }
            );
          },
        ],
        (err, results: any) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  };

  // For now this is only a postgres function
  grantAdminPrivileges = (db: any, schema: string, roleName: string) => {
    return new Promise((resolve, reject) => {
      //Access to schema and create objects within schema
      db.execute(
        `GRANT CREATE, USAGE ON SCHEMA "${schema}" to "${roleName}"`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          else resolve(result);
        }
      );

      //Create/Write Access to current Objects
      db.execute(
        `GRANT ALL ON ALL TABLES IN SCHEMA "${schema}" to "${roleName}" WITH GRANT OPTION`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          else resolve(result);
        }
      );
      db.execute(
        `GRANT ALL ON ALL FUNCTIONS IN SCHEMA "${schema}" to "${roleName}" WITH GRANT OPTION`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          else resolve(result);
        }
      );
      db.execute(
        `GRANT ALL ON ALL SEQUENCES IN SCHEMA "${schema}" to "${roleName}" WITH GRANT OPTION`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          else resolve(result);
        }
      );

      //Create/Write Access to Future Objects
      db.execute(
        `ALTER DEFAULT PRIVILEGES IN SCHEMA "${schema}" GRANT ALL ON TABLES TO "${roleName}" WITH GRANT OPTION`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          else resolve(result);
        }
      );
      db.execute(
        `ALTER DEFAULT PRIVILEGES IN SCHEMA "${schema}" GRANT ALL ON SEQUENCES TO "${roleName}" WITH GRANT OPTION`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          else resolve(result);
        }
      );
      db.execute(
        `ALTER DEFAULT PRIVILEGES IN SCHEMA "${schema}" GRANT ALL ON FUNCTIONS TO "${roleName}" WITH GRANT OPTION`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          else resolve(result);
        }
      );

      const response = utils.createMultiLogs(
        `Granted admin privileges successfully`,
        {
          role: roleName,
          schema,
        }
      );
      resolve(response);
    });
  };

  grantAllPrivileges = (db: any, schema: string, roleName: string) => {
    return new Promise((resolve, reject) => {
      db.execute(
        `GRANT CREATE ANY, CREATE OBJECT STRUCTURED PRIVILEGE, DELETE, DROP, EXECUTE, INDEX, INSERT, SELECT, SELECT CDS METADATA, SELECT METADATA, UPDATE ON SCHEMA ${schema} TO ${roleName}`,
        [],
        (err: any, result: any) => {
          if (err) return reject(err);
          const response = utils.createMultiLogs(
            `Granted All privileges Successfully`,
            {
              role: roleName,
              schema,
              privileges:
                "CREATE ANY, CREATE OBJECT STRUCTURED PRIVILEGE, DELETE, DROP, EXECUTE, INDEX, INSERT, SELECT, SELECT CDS METADATA, SELECT METADATA, UPDATE",
            }
          );
          resolve(response);
        }
      );
    });
  };
}

export default UserDAO;
