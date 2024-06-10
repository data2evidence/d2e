import json
from uuid import uuid4
from typing import List
from datetime import datetime
from prefect import task, get_run_logger

from flows.alp_db_svc.const import hana_to_postgres
from flows.alp_db_svc.types import (
    QuestionnaireDefinitionType, IQuestionnaireType,
    IQuestionnaireColumnsType, IItemType, IItemColumnsType
)
from alpconnection.dbutils import DatabaseDialects
from utils.types import HANA_TENANT_USERS, PG_TENANT_USERS
from dao.DBDao import DBDao


@task(log_prints=True)
def create_questionnaire_definition_task(database_code: str,
                                         schema_name: str,
                                         dialect: str,
                                         questionnaire_definition: QuestionnaireDefinitionType):

    logger = get_run_logger()
    try:
        hana_questionnaire_table = "GDM.QUESTIONNAIRE"
        hana_questionnaire_item_table = "GDM.ITEM_QUESTIONNAIRE"

        match dialect:
            case DatabaseDialects.HANA:
                admin_user = HANA_TENANT_USERS.ADMIN_USER
                questionnaire_table = hana_questionnaire_table
                questionnaire_item_table = hana_questionnaire_item_table
            case DatabaseDialects.POSTGRES:
                admin_user = PG_TENANT_USERS.ADMIN_USER
                questionnaire_table = hana_to_postgres(
                    hana_questionnaire_table)
                questionnaire_item_table = hana_to_postgres(
                    hana_questionnaire_item_table)

        schema_dao = DBDao(database_code, schema_name, admin_user)

        # create column value mappings json
        questionnaire_values_to_insert = _parse_questionnaire_definition(
            questionnaire_definition).dict()

        logger.info(f"Inserting into {questionnaire_table} table..")
        schema_dao.insert_values_into_table(
            questionnaire_table,
            questionnaire_values_to_insert
        )

        questionnaire_id = questionnaire_definition.id
        items = questionnaire_definition.item

        logger.info(
            f"Processing questionnaire items..")
        create_questionnaire_item(items,
                                  questionnaire_id,
                                  schema_dao,
                                  questionnaire_item_table,
                                  dialect)
    except Exception as e:
        logger.error(e)
        raise e


def create_questionnaire_item(items: List[IItemType],
                              questionnaire_id: str,
                              schema_dao: DBDao,
                              questionnaire_item_table: str,
                              dialect: str,
                              parent_item_id: str = ""):
    print(f"{len(items)} items found in questionnaire_id {questionnaire_id} | parent_item_id: {parent_item_id}")

    questionnaire_questions = []
    for i in range(0, len(items)):
        item_obj = items[i]
        if item_obj.type != "group":
            questionnaire_questions.append(item_obj.text)

        item_id = uuid4()

        questionnaire_item_values_to_insert = _parse_questionnaire_definition_item(
            item_obj, item_id, questionnaire_id, parent_item_id).dict()

        if dialect == DatabaseDialects.HANA:
            # handle different column names for databases
            convert_columns_to_hana(
                questionnaire_item_values_to_insert, "gdm_questionnaire_id", "GDM.QUESTIONNAIRE_ID")
            convert_columns_to_hana(questionnaire_item_values_to_insert,
                                    "gdm_item_quesionnaire_parent_id", "GDM.ITEM_QUESIONNAIRE_PARENT_ID")

        schema_dao.insert_values_into_table(
            questionnaire_item_table,
            questionnaire_item_values_to_insert
        )

        print(
            f"Inserted questionnaire item with linkId {item_obj.linkId} successfully")

        sub_items = item_obj.item
        if len(sub_items) > 0:
            create_questionnaire_item(
                items=sub_items,
                questionnaire_id=questionnaire_id,
                schema_dao=schema_dao,
                questionnaire_item_table=questionnaire_item_table,
                dialect=dialect,
                parent_item_id=str(item_id)
            )


def _parse_questionnaire_definition(questionnaire_definition: IQuestionnaireType) -> IQuestionnaireColumnsType:
    return IQuestionnaireColumnsType(
        id=questionnaire_definition.id,
        identifier=json.dumps(questionnaire_definition.identifier),
        uri=questionnaire_definition.url,
        version=json.dumps(questionnaire_definition.version),
        name=questionnaire_definition.name,
        title=questionnaire_definition.title,
        derivedfrom=questionnaire_definition.derivedFrom,
        status=json.dumps(questionnaire_definition.status),
        experimental=str(questionnaire_definition.experimental),
        subjecttype=questionnaire_definition.subjectType,
        contact=questionnaire_definition.contact,
        date=questionnaire_definition.date,
        publisher=questionnaire_definition.publisher,
        description=questionnaire_definition.description,
        use_context=json.dumps(questionnaire_definition.useContext),
        jurisdiction=json.dumps(
            questionnaire_definition.jurisdiction),
        purpose=questionnaire_definition.purpose,
        copyright=questionnaire_definition.copyright,
        copyright_label=questionnaire_definition.copyright_label,
        approval_date=questionnaire_definition.approvalDate,
        last_review_date=questionnaire_definition.lastReviewDate,
        effective_period=json.dumps(
            questionnaire_definition.effectivePeriod),
        code=json.dumps(
            questionnaire_definition.code),
        created_at=datetime.now())


def _parse_questionnaire_definition_item(item: IItemType,
                                         item_id: uuid4,
                                         questionnaire_id: str,
                                         parent_item_id: str) -> IItemColumnsType:
    return IItemColumnsType(
        id=item_id,
        gdm_questionnaire_id=questionnaire_id,
        gdm_item_quesionnaire_parent_id=parent_item_id,
        linkid=item.linkId,
        definition=item.definition,
        code=json.dumps(item.code),
        prefix=item.prefix,
        text=item.text,
        type=item.type,
        enable_when=json.dumps(item.enableWhen),
        enable_behavior=str(item.enableBehavior),
        disabled_display=str(item.disabledDisplay),
        required=item.required,
        repeats=item.repeats,
        readonly=item.readOnly,
        maxlength=int(item.maxLength),
        answer_constraint=item.answerConstraint,
        answer_option=json.dumps(item.answerOption),
        answer_valueset=json.dumps(item.answerValueSet),
        initial_value=json.dumps(item.initial),
        created_at=datetime.now()
    )


def convert_columns_to_hana(mapping: dict, old_key: str, new_key: str) -> dict:
    mapping[new_key] = mapping[old_key]
    mapping.pop(old_key)
    return mapping
