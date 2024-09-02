from prefect import get_run_logger, task
from functools import partial
from datetime import datetime

from utils.types import DBCredentialsType, DatabaseDialects, UserType
from utils.DBUtils import DBUtils

from dao.DBDao import DBDao
from dao.UserDao import UserDao

from flows.alp_db_svc.liquibase.main import Liquibase
from flows.alp_db_svc.types import LiquibaseAction, UpdateFlowActionType
from flows.alp_db_svc.const import DATAMODEL_CDM_VERSION, OMOP_DATA_MODELS, _check_table_case
from flows.alp_db_svc.hooks import *


def create_datamodel(database_code: str,
                     data_model: str,
                     schema_name: str,
                     vocab_schema: str,
                     changelog_file: str,
                     plugin_classpath: str,
                     dialect: str,
                     count: int = 0,
                     cleansed_schema_option: bool = False):

    dbutils = DBUtils(database_code)
    tenant_configs = dbutils.extract_database_credentials()

    task_status = create_schema_tasks(
        dialect=dialect,
        database_code=database_code,
        data_model=data_model,
        changelog_file=changelog_file,
        schema_name=schema_name,
        vocab_schema=vocab_schema,
        tenant_configs=tenant_configs,
        plugin_classpath=plugin_classpath,
        count=count
    )

    if task_status and cleansed_schema_option:
        cleansed_schema_name = schema_name + "_cleansed"
        cleansed_task_status = create_schema_tasks(
            dialect=dialect,
            database_code=database_code,
            data_model=data_model,
            changelog_file=changelog_file,
            schema_name=cleansed_schema_name,
            vocab_schema=vocab_schema,
            tenant_configs=tenant_configs,
            plugin_classpath=plugin_classpath,
            count=count
        )


def create_schema_tasks(dialect: str,
                        database_code: str,
                        data_model: str,
                        changelog_file: str,
                        schema_name: str,
                        vocab_schema: str,
                        tenant_configs: DBCredentialsType,
                        plugin_classpath: str,
                        count: int) -> bool:
    try:
        schema_dao = DBDao(database_code, schema_name, UserType.ADMIN_USER)


        create_db_schema_wo = create_db_schema.with_options(
            on_completion=[partial(create_dataset_schema_hook,
                                   **dict(schema_dao=schema_dao))],
            on_failure=[partial(create_dataset_schema_hook,
                                **dict(schema_dao=schema_dao))])

        # create schema if not exists
        create_db_schema_wo(schema_dao)

        if count == 0 or count is None:
            action = LiquibaseAction.UPDATE
        elif count > 0:
            action = LiquibaseAction.UPDATECOUNT

        create_tables_wo = run_liquibase_update_task.with_options(
            on_failure=[partial(drop_schema_hook,
                                **dict(schema_dao=schema_dao))])
        create_tables_wo(action=action,
                         dialect=dialect,
                         data_model=data_model,
                         changelog_file=changelog_file,
                         schema_name=schema_name,
                         vocab_schema=vocab_schema,
                         tenant_configs=tenant_configs,
                         plugin_classpath=plugin_classpath,
                         count=count
                         )

        enable_audit_policies = tenant_configs.get("enableAuditPolicies")

        # enable auditing
        if enable_audit_policies:

            enable_and_create_audit_policies_wo = enable_and_create_audit_policies.with_options(
                on_failure=[partial(drop_schema_hook,
                                    **dict(schema_dao=schema_dao))])
            enable_and_create_audit_policies_wo(schema_dao)
        else:
            print("Skipping Alteration of system configuration")
            print("Skipping creation of Audit policy for system configuration")
            print(f"Skipping creation of new audit policy for {schema_name}")

        user_dao = UserDao(database_code, schema_name, UserType.ADMIN_USER)
        create_and_assign_roles_wo = create_and_assign_roles.with_options(
            on_failure=[partial(drop_schema_hook,
                                **dict(schema_dao=schema_dao))])
        create_and_assign_roles_wo(
            user_dao, tenant_configs, data_model, dialect, count)

        if data_model in OMOP_DATA_MODELS:
            cdm_version = DATAMODEL_CDM_VERSION.get(data_model)
            insert_cdm_version_wo = insert_cdm_version.with_options(
                on_completion=[partial(update_cdm_version_hook,
                                       **dict(db=database_code, schema=schema_name))],
                on_failure=[partial(update_cdm_version_hook,
                                    **dict(db=database_code, schema=schema_name))])

            insert_cdm_version_wo(schema_dao, cdm_version)
        print("Dataset schema successfully created and privileges assigned!")
        return True
    except Exception as e:
        print(f"Dataset schema creation failed! Error: {e}")
        raise e


def update_datamodel(flow_action_type: str,
                     database_code: str,
                     data_model: str,
                     schema_name: str,
                     vocab_schema: str,
                     changelog_file: str,
                     plugin_classpath: str,
                     dialect: str):

    logger = get_run_logger()
    
    dbutils = DBUtils(database_code)
    tenant_configs = dbutils.extract_database_credentials()


    schema_dao = DBDao(database_code, schema_name, UserType.ADMIN_USER)
    
    match flow_action_type:
        case UpdateFlowActionType.UPDATE:
            action = LiquibaseAction.UPDATE
        case UpdateFlowActionType.CHANGELOG_SYNC:
            action = LiquibaseAction.CHANGELOG_SYNC

    try:
        update_schema_wo = run_liquibase_update_task.with_options(
            on_completion=[partial(update_schema_hook,
                                   **dict(db=database_code, schema=schema_name))],
            on_failure=[partial(update_schema_hook,
                                **dict(db=database_code, schema=schema_name))])

        update_schema_wo(action=action,
                         dialect=dialect,
                         data_model=data_model,
                         changelog_file=changelog_file,
                         schema_name=schema_name,
                         vocab_schema=vocab_schema,
                         tenant_configs=tenant_configs,
                         plugin_classpath=plugin_classpath
                         )

        if data_model in OMOP_DATA_MODELS:
            cdm_version = DATAMODEL_CDM_VERSION.get(data_model)
            
            # check if cdm source table is empty
            cdm_source_row_count = schema_dao.get_table_row_count("cdm_source")
            if cdm_source_row_count == 0:
                # insert cdm version
                insert_cdm_version(schema_dao, cdm_version) 
            else:
                # update cdm version
                update_cdm_version_wo = update_cdm_version.with_options(
                    on_completion=[partial(update_cdm_version_hook,
                                        **dict(db=database_code, schema=schema_name))],
                    on_failure=[partial(update_cdm_version_hook,
                                        **dict(db=database_code, schema=schema_name))])
                update_cdm_version_wo(schema_dao, cdm_version)
        logger.info(
            "Dataset schema successfully updated!")
    except Exception as e:
        logger.error(f"Dataset schema update failed! Error: {e}")
        raise e


def rollback_count_task(database_code: str,
                        data_model: str,
                        schema_name: str,
                        vocab_schema: str,
                        changelog_file: str,
                        plugin_classpath: str,
                        dialect: str,
                        rollback_count: int):

    dbutils = DBUtils(database_code)
    tenant_configs = dbutils.extract_database_credentials()

    try:
        rollback_count_wo = run_liquibase_update_task.with_options(
            on_completion=[partial(rollback_count_hook,
                                   **dict(db=database_code, schema=schema_name))],
            on_failure=[partial(rollback_count_hook,
                                **dict(db=database_code, schema=schema_name))])
        rollback_count_wo(action=LiquibaseAction.ROLLBACK_COUNT,
                          dialect=dialect,
                          data_model=data_model,
                          changelog_file=changelog_file,
                          schema_name=schema_name,
                          vocab_schema=vocab_schema,
                          tenant_configs=tenant_configs,
                          plugin_classpath=plugin_classpath,
                          rollback_count=rollback_count
                          )

    except Exception as e:
        print(e)
        raise e


def rollback_tag_task(database_code: str,
                      data_model: str,
                      schema_name: str,
                      vocab_schema: str,
                      changelog_file: str,
                      plugin_classpath: str,
                      dialect: str,
                      rollback_tag: str):

    dbutils = DBUtils(database_code)
    tenant_configs = dbutils.extract_database_credentials()

    try:
        rollback_tag_wo = run_liquibase_update_task.with_options(
            on_completion=[partial(rollback_tag_hook,
                                   **dict(db=database_code, schema=schema_name))],
            on_failure=[partial(rollback_tag_hook,
                                **dict(db=database_code, schema=schema_name))])
        rollback_tag_wo(action=LiquibaseAction.ROLLBACK_TAG,
                        dialect=dialect,
                        data_model=data_model,
                        changelog_file=changelog_file,
                        schema_name=schema_name,
                        vocab_schema=vocab_schema,
                        tenant_configs=tenant_configs,
                        plugin_classpath=plugin_classpath,
                        rollback_tag=rollback_tag
                        )

    except Exception as e:
        print(e)
        raise e


@task(log_prints=True)
def create_db_schema(schema_dao: DBDao):
    schema_exists = schema_dao.check_schema_exists()
    if schema_exists == True:
        raise ValueError(
            f"Schema '{schema_dao.schema_name}' already exists in database '{schema_dao.database_code}'")
    else:
        get_run_logger().info(f"Creating schema '{schema_dao.schema_name}'")
        schema_dao.create_schema()


@task(log_prints=True)
def enable_and_create_audit_policies(schema_dao: DBDao):
    schema_dao.enable_auditing()
    schema_dao.create_system_audit_policy()
    schema_dao.create_schema_audit_policy()


@task(log_prints=True)
def create_and_assign_roles(userdao: UserDao, tenant_configs: DBCredentialsType,
                            data_model: str, dialect: str, count: int = 0):
    logger = get_run_logger()
    # Check if schema read role exists

    match dialect:
        case DatabaseDialects.HANA:
            schema_read_role = f"{userdao.schema_name}_READ_ROLE"
        case DatabaseDialects.POSTGRES:
            schema_read_role = f"{userdao.schema_name}_read_role"

    schema_read_role_exists = userdao.check_role_exists(schema_read_role)
    if schema_read_role_exists:
        logger.info(f"'{schema_read_role}' role already exists")
    else:
        logger.info(f"{schema_read_role} does not exist")
        userdao.create_read_role(schema_read_role)
    # grant schema read role read privileges to schema
    logger.info(f"Granting read privileges to '{schema_read_role}'")
    userdao.grant_read_privileges(schema_read_role)

    # Check if read user exists
    read_user = tenant_configs.get("readUser")

    read_user_exists = userdao.check_user_exists(read_user)
    if read_user_exists:
        logger.info(f"{read_user} user already exists")
    else:
        logger.info(f"{read_user} user does not exist")
        read_password = tenant_configs.get("readPassword")
        logger.info(f"Creating user '{read_user}'")
        userdao.create_user(read_user, read_password)

    # Check if read role exists
    read_role = tenant_configs.get("readRole")

    read_role_exists = userdao.check_role_exists(read_role)
    if read_role_exists:
        logger.info(f"'{read_role}' role already exists")
    else:
        logger.info(f"'{read_role}' role does not exist")
        logger.info(
            f"'Creating '{read_role}' role and assigning to '{read_user}' user")
        userdao.create_and_assign_role(read_user, read_role)

    # Grant read role read privileges
    logger.info(f"'Granting read privileges to '{read_role}' role")
    userdao.grant_read_privileges(read_role)

    if data_model in OMOP_DATA_MODELS and count == 0:
        # Grant write cohort and cohort_definition table privileges to read role
        logger.info(f"'Granting cohort write privileges to '{read_role}' role")
        userdao.grant_cohort_write_privileges(read_role)


@task(log_prints=True)
def run_liquibase_update_task(**kwargs):
    try:
        liquibase = Liquibase(**kwargs)
        liquibase.update_schema()
    except Exception as e:
        get_run_logger().error(e)
        raise e


@task(log_prints=True)
def insert_cdm_version(schema_dao: DBDao, cdm_version: str):
    #Todo: make cdm_holder value more generic
    get_run_logger().info(f"Inserting cdm version '{cdm_version}' into '{schema_dao.schema_name}.cdm_source' table..")
    is_lower_case = _check_table_case(schema_dao)
    if is_lower_case:
        values_to_insert = {
            "cdm_source_name": schema_dao.schema_name,
            "cdm_source_abbreviation": schema_dao.schema_name[0:25],
            "cdm_holder": "D4L",
            "source_release_date": datetime.now(),
            "cdm_release_date": datetime.now(),
            "cdm_version": cdm_version
        }
        schema_dao.insert_values_into_table("cdm_source", values_to_insert)
    else:
        # for hana & pg schemas before conversion to lower case
        values_to_insert = {
            "CDM_SOURCE_NAME": schema_dao.schema_name,
            "CDM_SOURCE_ABBREVIATION": schema_dao.schema_name[0:25],
            "CDM_HOLDER": "D4L",
            "SOURCE_RELEASE_DATE": datetime.now(),
            "CDM_RELEASE_DATE": datetime.now(),
            "CDM_VERSION": cdm_version
        }
        schema_dao.insert_values_into_table("CDM_SOURCE", values_to_insert)
    get_run_logger().info(f"Successfully inserted cdm version '{cdm_version}' into '{schema_dao.schema_name}.cdm_source' table..")

@task(log_prints=True)
def update_cdm_version(schema_dao: DBDao, cdm_version: str):
    get_run_logger().info(f"Updating cdm version '{cdm_version}' for '{schema_dao.schema_name}.cdm_source' table..")
    schema_dao.update_cdm_version(cdm_version)
    get_run_logger().info(f"Successfully updated cdm version '{cdm_version}' for '{schema_dao.schema_name}.cdm_source' table..")

def create_cdm_schema_tasks(database_code: str,
                            data_model: str,
                            schema_name: str,
                            vocab_schema: str,
                            changelog_file: str,
                            plugin_classpath: str,
                            dialect: str):
    logger = get_run_logger()
    # Begin by checking if the vocab schema exists or not
    vocab_schema_dao = DBDao(database_code, vocab_schema, UserType.ADMIN_USER)
    vocab_schema_exists = vocab_schema_dao.check_schema_exists()
    if (vocab_schema_exists == False):
        try:
            # create vocab schema
            create_datamodel(database_code=database_code,
                             data_model=data_model,
                             schema_name=vocab_schema,
                             vocab_schema=vocab_schema,
                             changelog_file=changelog_file,
                             plugin_classpath=plugin_classpath,
                             dialect=dialect)
        except Exception as e:
            logger.error(
                f"Failed to create schema {vocab_schema} in db with code:{database_code}: {e}")
            return False

    if (schema_name != vocab_schema):
        # Check if the incoming schema_name exists or not
        cdm_schema_dao = DBDao(database_code, schema_name, UserType.ADMIN_USER)
        cdm_schema_exists = cdm_schema_dao.check_schema_exists()
        if (cdm_schema_exists == False):
            try:
                # create cdm schema
                create_datamodel(database_code=database_code,
                                 data_model=data_model,
                                 schema_name=schema_name,
                                 vocab_schema=vocab_schema,
                                 changelog_file=changelog_file,
                                 plugin_classpath=plugin_classpath,
                                 dialect=dialect)
            except Exception as e:
                logger.error(
                    f"Failed to create schema {schema_name} in db with code:{database_code}: {e}")
                return False
