from prefect import get_run_logger, task
from functools import partial
from datetime import datetime
from alpconnection.dbutils import extract_db_credentials
from utils.types import DBCredentialsType, DatabaseDialects, HANA_TENANT_USERS, PG_TENANT_USERS

from dao.DBDao import DBDao
from dao.UserDao import UserDao

from flows.alp_db_svc.liquibase.main import Liquibase
from flows.alp_db_svc.types import LiquibaseAction
from flows.alp_db_svc.const import DATAMODEL_CDM_VERSION, OMOP_DATA_MODELS
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

    tenant_configs = extract_db_credentials(database_code)

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

    match dialect:
        case DatabaseDialects.HANA:
            admin_user = HANA_TENANT_USERS.ADMIN_USER
        case DatabaseDialects.POSTGRES:
            admin_user = PG_TENANT_USERS.ADMIN_USER

    schema_dao = DBDao(database_code, schema_name, admin_user)

    create_db_schema_wo = create_db_schema.with_options(
        on_completion=[partial(create_dataset_schema_hook,
                               **dict(schema_dao=schema_dao))],
        on_failure=[partial(create_dataset_schema_hook,
                            **dict(schema_dao=schema_dao))])

    create_db_schema_wo(schema_dao)

    if count == 0 or count == None:
        action = LiquibaseAction.UPDATE
    elif count > 0:
        action = LiquibaseAction.UPDATECOUNT

    create_tables_wo = run_liquibase_update_task.with_options(
        on_completion=[partial(create_tables_hook,
                               **dict(schema_dao=schema_dao))],
        on_failure=[partial(create_tables_hook,
                            **dict(schema_dao=schema_dao))])

    return_code = create_tables_wo(action=action,
                                   dialect=dialect,
                                   data_model=data_model,
                                   changelog_file=changelog_file,
                                   schema_name=schema_name,
                                   vocab_schema=vocab_schema,
                                   tenant_configs=tenant_configs,
                                   plugin_classpath=plugin_classpath,
                                   count=count
                                   )
    if return_code == 0:
        enable_audit_policies = tenant_configs.get("enableAuditPolicies")

        # enable auditing
        if enable_audit_policies:

            enable_and_create_audit_policies_wo = enable_and_create_audit_policies.with_options(
                on_completion=[partial(create_audit_policies_hook,
                                       **dict(schema_dao=schema_dao))],
                on_failure=[partial(create_audit_policies_hook,
                                    **dict(schema_dao=schema_dao))])
            enable_and_create_audit_policies_wo(schema_dao)
        else:
            print("Skipping Alteration of system configuration")
            print("Skipping creation of Audit policy for system configuration")
            print(f"Skipping creation of new audit policy for {schema_name}")

        user_dao = UserDao(database_code, schema_name, admin_user)
        create_and_assign_roles_wo = create_and_assign_roles.with_options(
            on_completion=[partial(create_assign_roles_hook,
                                   **dict(schema_dao=schema_dao))],
            on_failure=[partial(create_assign_roles_hook,
                                **dict(schema_dao=schema_dao))])
        create_and_assign_roles_wo(user_dao, tenant_configs, data_model)

        if data_model in OMOP_DATA_MODELS:
            cdm_version = DATAMODEL_CDM_VERSION.get(data_model)
            insert_cdm_version_wo = insert_cdm_version.with_options(
                on_completion=[partial(update_cdm_version_hook,
                                       **dict(db=database_code, schema=schema_name))],
                on_failure=[partial(update_cdm_version_hook,
                                    **dict(db=database_code, schema=schema_name))])

            insert_cdm_version_wo(schema_dao, cdm_version)
        return True


def update_datamodel(database_code: str,
                     data_model: str,
                     schema_name: str,
                     vocab_schema: str,
                     changelog_file: str,
                     plugin_classpath: str,
                     dialect: str):

    logger = get_run_logger()

    tenant_configs = extract_db_credentials(database_code)

    match dialect:
        case DatabaseDialects.HANA:
            admin_user = HANA_TENANT_USERS.ADMIN_USER
        case DatabaseDialects.POSTGRES:
            admin_user = PG_TENANT_USERS.ADMIN_USER

    schema_dao = DBDao(database_code, schema_name, admin_user)

    try:
        update_schema_wo = run_liquibase_update_task.with_options(
            on_completion=[partial(update_schema_hook,
                                   **dict(db=database_code, schema=schema_name))],
            on_failure=[partial(update_schema_hook,
                                **dict(db=database_code, schema=schema_name))])

        return_code = update_schema_wo(action=LiquibaseAction.UPDATE,
                                       dialect=dialect,
                                       data_model=data_model,
                                       changelog_file=changelog_file,
                                       schema_name=schema_name,
                                       vocab_schema=vocab_schema,
                                       tenant_configs=tenant_configs,
                                       plugin_classpath=plugin_classpath
                                       )

        if return_code == 0:
            if data_model in OMOP_DATA_MODELS:
                cdm_version = DATAMODEL_CDM_VERSION.get(data_model)
                update_cdm_version_wo = update_cdm_version.with_options(
                    on_completion=[partial(update_cdm_version_hook,
                                           **dict(db=database_code, schema=schema_name))],
                    on_failure=[partial(update_cdm_version_hook,
                                        **dict(db=database_code, schema=schema_name))])
                update_cdm_version_wo(schema_dao, cdm_version)

    except Exception as e:
        logger.error(e)
        raise e


def rollback_count_task(database_code: str,
                        data_model: str,
                        schema_name: str,
                        vocab_schema: str,
                        changelog_file: str,
                        plugin_classpath: str,
                        dialect: str,
                        rollback_count: int):

    tenant_configs = extract_db_credentials(database_code)

    try:
        rollback_count_wo = run_liquibase_update_task.with_options(
            on_completion=[partial(rollback_count_hook,
                                   **dict(db=database_code, schema=schema_name))],
            on_failure=[partial(rollback_count_hook,
                                **dict(db=database_code, schema=schema_name))])
        return_code = rollback_count_wo(action=LiquibaseAction.ROLLBACK_COUNT,
                                        dialect=dialect,
                                        data_model=data_model,
                                        changelog_file=changelog_file,
                                        schema_name=schema_name,
                                        vocab_schema=vocab_schema,
                                        tenant_configs=tenant_configs,
                                        plugin_classpath=plugin_classpath,
                                        rollback_count=rollback_count
                                        )

        if return_code == 0:
            pass
    except Exception as e:
        raise e
    else:
        return return_code


def rollback_tag_task(database_code: str,
                      data_model: str,
                      schema_name: str,
                      vocab_schema: str,
                      changelog_file: str,
                      plugin_classpath: str,
                      dialect: str,
                      rollback_tag: str):

    tenant_configs = extract_db_credentials(database_code)

    try:
        rollback_tag_wo = run_liquibase_update_task.with_options(
            on_completion=[partial(rollback_tag_hook,
                                   **dict(db=database_code, schema=schema_name))],
            on_failure=[partial(rollback_tag_hook,
                                **dict(db=database_code, schema=schema_name))])
        return_code = rollback_tag_wo(action=LiquibaseAction.ROLLBACK_TAG,
                                      dialect=dialect,
                                      data_model=data_model,
                                      changelog_file=changelog_file,
                                      schema_name=schema_name,
                                      vocab_schema=vocab_schema,
                                      tenant_configs=tenant_configs,
                                      plugin_classpath=plugin_classpath,
                                      rollback_tag=rollback_tag
                                      )

        if return_code == 0:
            pass
    except Exception as e:
        raise e
    else:
        return return_code


@task(log_prints=True)
def create_db_schema(schema_dao: DBDao):
    schema_dao.create_schema()


@task(log_prints=True)
def enable_and_create_audit_policies(schema_dao: DBDao):
    schema_dao.enable_auditing()
    schema_dao.create_system_audit_policy()
    schema_dao.create_schema_audit_policy()


@task(log_prints=True)
def create_and_assign_roles(userdao: UserDao, tenant_configs: DBCredentialsType, data_model: str):

    # Check if schema read role exists
    schema_read_role = f"{userdao.schema_name}_read_role"
    schema_read_role_exists = userdao.check_role_exists(schema_read_role)
    if schema_read_role_exists:
        print(f"{schema_read_role} role already exists")
    else:
        userdao.create_read_role(schema_read_role)
    # grant schema read role read privileges to schema
    userdao.grant_read_privileges(schema_read_role)

    # Check if read user exists
    read_user = tenant_configs.get("readUser")

    read_user_exists = userdao.check_user_exists(read_user)
    if read_user_exists:
        print(f"{read_user} user already exists")
    else:
        read_password = tenant_configs.get("readPassword")
        userdao.create_user(read_user, read_password)

    # Check if read role exists
    read_role = tenant_configs.get("readRole")

    read_role_exists = userdao.check_role_exists(read_role)
    if read_role_exists:
        print(f"{read_role} role already exists")
    else:
        # userdao.create_read_role(schema_read_role)
        userdao.create_and_assign_role(read_role)

    # Grant read role read privileges
    userdao.grant_read_privileges(read_role)

    if data_model in OMOP_DATA_MODELS:
        # Grant write cohort and cohort_definition table privileges to read role
        userdao.grant_cohort_write_privileges(read_role)


@task(log_prints=True)
def run_liquibase_update_task(**kwargs) -> str:
    try:
        liquibase = Liquibase(**kwargs)
        return_code = liquibase.update_schema()
        if return_code != 0:
            raise Exception(f"Liquibase returned non-0 code: {return_code}")
    except Exception as e:
        get_run_logger().error(e)
        raise e
    else:
        return return_code


@task(log_prints=True)
def insert_cdm_version(schema_dao: DBDao, cdm_version: str):

    values_to_insert = {
        "cdm_source_name": schema_dao.schema_name,
        "cdm_source_abbreviation": schema_dao.schema_name[0:25],
        "cdm_holder": "D4L",
        "source_release_date": datetime.now(),
        "cdm_release_date": datetime.now(),
        "cdm_version": cdm_version
    }

    schema_dao.insert_values_into_table("cdm_source", values_to_insert)


@task(log_prints=True)
def update_cdm_version(schema_dao: DBDao, cdm_version: str):
    schema_dao.update_cdm_version(cdm_version)


def run_seed_postgres_tasks(database_code: str,
                            data_model: str,
                            schema_name: str,
                            vocab_schema: str,
                            changelog_file: str,
                            plugin_classpath: str,
                            dialect: str):
    logger = get_run_logger()
    # Begin by checking if the vocab schema exists or not
    vocab_schema_dao = DBDao(database_code, vocab_schema,
                             PG_TENANT_USERS.ADMIN_USER)
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
        cdm_schema_dao = DBDao(database_code, schema_name,
                               PG_TENANT_USERS.ADMIN_USER)
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
