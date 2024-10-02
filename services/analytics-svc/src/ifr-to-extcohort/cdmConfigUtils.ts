import _ from "lodash";
import {
    CdmAttributeType,
    CdmConfig,
    Criteria,
    IFRContentForSimpleFilter,
    IFRDefinition,
    IFRFilterCard,
    IFRFilterCardContent,
    IFRExcludedFilterCard,
    ExtCohortConcept,
    ExtCohortConceptSet,
} from "./types";
import { terminologyRequest } from "../utils/TerminologySvcProxy";
import { IMRIRequest } from "../types";

export const getConceptByName = async ({
    conceptName,
    req,
    datasetId,
}: {
    conceptName: string;
    req: IMRIRequest;
    datasetId: string;
}): Promise<ExtCohortConcept | null> => {
    const concept = await terminologyRequest(
        req,
        "POST",
        `concept/searchByName`,
        { conceptName, datasetId }
    );

    function upperCaseKeys(obj: ExtCohortConcept): ExtCohortConcept {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const upperKey = key.toUpperCase() as keyof ExtCohortConcept; // Convert the key to uppercase
                result[upperKey as keyof ExtCohortConcept] =
                    obj[key as keyof ExtCohortConcept];
            }
        }

        return result as ExtCohortConcept;
    }

    return concept[0] ? upperCaseKeys(concept[0]) : null;
};

export const getExtCohortKeyForEvent = (
    cdmConfig: CdmConfig,
    path?: string
) => {
    if (!path) {
        return null;
    }
    const cohortDefinitionKey = `${path}.cohortDefinitionKey`;
    const key: string | null = _.get(cdmConfig, cohortDefinitionKey) || null;
    return key;
};

export const getExtCohortInfoForAttribute = (
    cdmConfig: CdmConfig,
    path?: string
) => {
    if (!path) {
        return null;
    }
    const keyPath = `${path}.cohortDefinitionKey`;
    const typePath = `${path}.type`;
    const type: CdmAttributeType | null = _.get(cdmConfig, typePath) || null;
    const key: string | null = _.get(cdmConfig, keyPath) || null;
    if (!key) {
        return null;
    }
    return { key, type };
};

export const convertEventAttributesToConceptSets = async (
    cdmConfig: CdmConfig,
    filterCards: (IFRFilterCard | IFRExcludedFilterCard)[],
    req: IMRIRequest,
    datasetId: string
) => {
    const nonBasicInfoFilterCards = filterCards;
    const conceptSets: ExtCohortConceptSet[] = [];
    for (let i = 0; i < nonBasicInfoFilterCards.length; i += 1) {
        const filterCard = nonBasicInfoFilterCards[i];

        for (let i = 0; i < filterCard.content.length; i += 1) {
            const conceptsForSet: { concept: ExtCohortConcept }[] = [];
            const filterContent = filterCard.content[i];
            let conceptSetName: string;
            if (
                filterContent.hasOwnProperty("op") &&
                filterContent["op"] === "NOT"
            ) {
                for (const c of filterContent["content"]) {
                    const concepts = await extractConceptSets(
                        c,
                        cdmConfig,
                        req,
                        datasetId
                    );
                    concepts.forEach((data) => {
                        data.concept.STANDARD_CONCEPT_CAPTION =
                            data.concept.STANDARD_CONCEPT === "S"
                                ? "Standard"
                                : "Non-standard";
                    });
                    conceptsForSet.push(...concepts);
                }
                conceptSetName =
                    filterContent["content"][0].attributes?.content?.[0]
                        ?.instanceID;
            } else {
                const filter = filterContent as IFRFilterCardContent;
                const concepts = await extractConceptSets(
                    filterContent as IFRFilterCardContent,
                    cdmConfig,
                    req,
                    datasetId
                );
                concepts.forEach((data) => {
                    data.concept.STANDARD_CONCEPT_CAPTION =
                        data.concept.STANDARD_CONCEPT === "S"
                            ? "Standard"
                            : "Non-standard";
                });
                conceptsForSet.push(...concepts);
                conceptSetName = filter.attributes?.content?.[0]?.instanceID;
            }

            if (conceptsForSet.length) {
                conceptSets.push({
                    id: conceptSets.length,
                    name: conceptSetName,
                    expression: {
                        items: conceptsForSet,
                    },
                });
            }
        }
    }
    return conceptSets;
};

const extractConceptSets = async (
    filter: IFRFilterCardContent,
    cdmConfig: CdmConfig,
    req: IMRIRequest,
    datasetId: string
) => {
    const conceptsForSet: { concept: ExtCohortConcept }[] = [];
    for (
        let attributesContentIndex = 0;
        attributesContentIndex < filter.attributes?.content.length;
        attributesContentIndex += 1
    ) {
        for (
            let constraintContentIndex = 0;
            constraintContentIndex <
            filter.attributes?.content[attributesContentIndex].constraints
                ?.content.length;
            constraintContentIndex += 1
        ) {
            const constraintContent =
                filter.attributes?.content?.[attributesContentIndex]
                    ?.constraints?.content?.[constraintContentIndex];
            const conceptName =
                constraintContent && "value" in constraintContent
                    ? constraintContent.value
                    : undefined;
            if (!conceptName || typeof conceptName !== "string") {
                continue;
            }

            const conceptIdentifierType: "name" | "code" | "id" | null =
                _.get(
                    cdmConfig,
                    `${filter.attributes?.content?.[0].configPath}.conceptIdentifierType`
                ) || null;
            const type:
                | "text"
                | "time"
                | "datetime"
                | "conceptSet"
                | "num"
                | null =
                _.get(
                    cdmConfig,
                    `${filter.attributes?.content?.[0].configPath}.type`
                ) || null;

            if (type === "conceptSet") {
                // TODO: get all the concepts and use them
            }
            // TODO: Handle getting concept values for different types of conceptIdentifierTypes
            // Only interactions with conceptIdentifierType use concept sets in ATLAS.
            // Other string type attributes may use concepts, but do not use concept sets.
            // conceptIdentifierTypes include "name", "code", "id", to specify which column of concept to select from.
            // Sole example found in cdm-config-with-extCohort-mapping.ts:804
            if (!conceptIdentifierType) {
                continue;
            }
            if (conceptIdentifierType === "name") {
            }
            if (conceptIdentifierType === "code") {
            }
            if (conceptIdentifierType === "id") {
            }
            const concept = await getConceptByName({
                conceptName,
                req,
                datasetId,
            });
            if (!concept) {
                continue;
            }
            conceptsForSet.push({ concept });
        }
    }
    return conceptsForSet;
};

type Params =
    | {
          attrType: "time";
          content: IFRContentForSimpleFilter[];
      }
    | {
          attrType: Exclude<CdmAttributeType, "time">;
          content: IFRContentForSimpleFilter;
      };
export const convertAttributeContentToCriteria = ({
    attrType,
    content,
}: Params) => {
    const OPERATORS = {
        ">=": "gte",
        ">": "gt",
        "<=": "lte",
        "<": "lt",
    };
    // TODO: implement logic
    switch (attrType) {
        case "datetime":
            return;
        case "time":
            if (!Array.isArray(content)) {
                return;
            }
            if (content.length === 1) {
                const timeContent = content[0];
                if (typeof timeContent.value !== "string") {
                    return null;
                }
                return {
                    Op: OPERATORS[timeContent.operator],
                    // 2023-05-17T00:00:00.000Z to 2023-05-17
                    Value: timeContent.value.slice(0, 10),
                };
            } else {
                const timeContent = content[0];
                const timeContent1 = content[1];
                if (
                    typeof timeContent.value !== "string" ||
                    typeof timeContent1.value !== "string"
                ) {
                    return null;
                }
                return {
                    Op: "bt",
                    // 2023-05-17T00:00:00.000Z to 2023-05-17
                    Value: timeContent.value.slice(0, 10),
                    Extent: timeContent1.value.slice(0, 10),
                };
            }
        case "text":
            if (Array.isArray(content) || typeof content.value !== "string") {
                return null;
            }
            return;
        case "num":
            if (Array.isArray(content) || typeof content.value !== "number") {
                return null;
            }
            return {
                Op: OPERATORS[content.operator],
                // 2023-05-17T00:00:00.000Z to 2023-05-17
                Value: content.value,
            };
    }
};

export const createDemographicCriteriaList = async (
    demography: IFRFilterCard | undefined,
    cdmConfig: CdmConfig,
    req: IMRIRequest,
    vocabSchemaName: string,
    datasetId: string
): Promise<{ [key: string]: Criteria }[]> => {
    // For bookmarks, we only have a fixed section for basic data
    const content = demography?.content[0].attributes.content;
    if (!content?.length) {
        return [];
    }
    const demographicCriteriaList: { [key: string]: Criteria } = {};
    for (let i = 0; i <= content.length; i += 1) {
        const filterCard = content[i];
        if (!filterCard) {
            continue;
        }
        const attributeInfo = getExtCohortInfoForAttribute(
            cdmConfig,
            filterCard.configPath
        );
        if (!(attributeInfo?.key && attributeInfo?.type)) {
            continue;
        }
        const constraintContent = filterCard.constraints.content[0];
        if (constraintContent && "operator" in constraintContent) {
            const valueOrConceptName =
                constraintContent && "value" in constraintContent
                    ? constraintContent.value
                    : undefined;
            if (typeof valueOrConceptName === "string") {
                const concept = await getConceptByName({
                    conceptName: valueOrConceptName,
                    req,
                    datasetId,
                });
                if (!concept) {
                    continue;
                }
                demographicCriteriaList[attributeInfo.key] = [
                    {
                        CONCEPT_CODE: concept.CONCEPT_CODE,
                        CONCEPT_ID: concept.CONCEPT_ID,
                        CONCEPT_NAME: concept.CONCEPT_NAME,
                        DOMAIN_ID: concept.DOMAIN_ID,
                        VOCABULARY_ID: concept.VOCABULARY_ID,
                    },
                ];
            } else if (
                typeof valueOrConceptName === "number" &&
                attributeInfo.type !== "time"
            ) {
                const criteria = convertAttributeContentToCriteria({
                    attrType: attributeInfo.type,
                    content: constraintContent,
                });
                if (criteria) {
                    demographicCriteriaList[attributeInfo.key] = criteria;
                }
            }
        }
    }

    return [demographicCriteriaList];
};

export const getCodesetId = (
    conceptSets: ExtCohortConceptSet[],
    instanceId: string
) => {
    const conceptSetId = conceptSets.findIndex((conceptSet) => {
        return conceptSet?.name?.startsWith(instanceId);
    });
    return conceptSetId;
};

export const createCriteriaList = async (
    cdmConfig: CdmConfig,
    ifrDefinition: IFRDefinition,
    conceptSets: ExtCohortConceptSet[],
    req: IMRIRequest,
    vocabSchemaName: string,
    datasetId: string
) => {
    const nonBasicFilterCards = ifrDefinition.filter.cards.content;
    const criteriaList: any[] = [];

    // Each group represents a top level AND relationship
    for (
        let groupIndex = 0;
        groupIndex < nonBasicFilterCards.length;
        groupIndex += 1
    ) {
        const singleOrGroup = nonBasicFilterCards[groupIndex];
        const eventsForFilter: { [key: string]: any[] } = {};
        for (
            let withinGroupIndex = 0;
            withinGroupIndex < singleOrGroup.content.length;
            withinGroupIndex += 1
        ) {
            if (singleOrGroup.content[withinGroupIndex]["op"] === "NOT") {
                let excludedEventObj: Object = {
                    isExcluded: true,
                };
                const excludedCard = singleOrGroup.content[
                    withinGroupIndex
                ] as IFRFilterCard;
                for (const c of excludedCard.content) {
                    const instanceId = c.instanceID;
                    const codesetId = getCodesetId(conceptSets, instanceId);
                    if (codesetId > -1) {
                        excludedEventObj = {
                            ...excludedEventObj,
                            CodesetId: codesetId,
                        };
                    }

                    const eventKey = getExtCohortKeyForEvent(
                        cdmConfig,
                        c.configPath
                    );
                    if (!eventKey) {
                        continue;
                    }

                    eventsForFilter[eventKey] = [
                        {
                            ...excludedEventObj,
                        },
                    ];
                }
                continue;
            }

            let eventObject = {};
            const content = singleOrGroup.content[
                withinGroupIndex
            ] as IFRFilterCardContent;

            const instanceId = content.instanceID;
            const codesetId = getCodesetId(conceptSets, instanceId);
            if (codesetId > -1) {
                eventObject = { ...eventObject, CodesetId: codesetId };
            }
            /**
             * ATTRIBUTES
             */
            const attributesForFilter = eventObject;
            for (
                let attrIndex = 0;
                attrIndex < content.attributes.content.length;
                attrIndex += 1
            ) {
                const attribute = content.attributes.content[attrIndex];
                const attributeInfo = getExtCohortInfoForAttribute(
                    cdmConfig,
                    attribute.configPath
                );

                if (attributeInfo?.key && attributeInfo?.type) {
                    // Attributes without constraints indicate any value can be used for that attribute.
                    // This is equivalent to not making a constraint on such an attribute.
                    if (!attribute.constraints.content.length) {
                        continue;
                    }
                    for (const constraintContent of attribute.constraints
                        .content) {
                        if ("op" in constraintContent) {
                            for (
                                let i = 0;
                                i < constraintContent.content.length;
                                i += 1
                            ) {
                                let criteria: ReturnType<
                                    typeof convertAttributeContentToCriteria
                                >;
                                if (attributeInfo.type === "time") {
                                    criteria =
                                        convertAttributeContentToCriteria({
                                            attrType: attributeInfo.type,
                                            content: constraintContent.content,
                                        });
                                } else {
                                    criteria =
                                        convertAttributeContentToCriteria({
                                            attrType: attributeInfo.type,
                                            content:
                                                constraintContent.content[0],
                                        });
                                }
                                if (criteria) {
                                    if (attributeInfo.type === "text") {
                                        attributesForFilter[attributeInfo.key] =
                                            attributesForFilter[
                                                attributeInfo.key
                                            ] || [];
                                        attributesForFilter[
                                            attributeInfo.key
                                        ].push(criteria);
                                    }
                                    attributesForFilter[attributeInfo.key] = {
                                        ...criteria,
                                    };
                                }
                            }
                        } else {
                            // Some filters in cohort definition are directly set in the item's root
                            // e.g. Condition Occurrence has Condition set in the root, and that uses CodesetId
                            if (attributeInfo.key === "CodesetId") {
                                const conceptSet = conceptSets.find(
                                    (cset) => cset.name === attribute.configPath
                                );
                                if (!conceptSet) {
                                    continue;
                                }
                                attributesForFilter[attributeInfo.key] =
                                    conceptSet.id;
                            } else if (
                                attributeInfo.type === "text" &&
                                typeof constraintContent.value === "string"
                            ) {
                                const concept = await getConceptByName({
                                    conceptName: constraintContent.value,
                                    req,
                                    datasetId,
                                });
                                attributesForFilter[attributeInfo.key] =
                                    attributesForFilter[attributeInfo.key] ||
                                    [];
                                attributesForFilter[attributeInfo.key].push({
                                    CONCEPT_CODE: concept.CONCEPT_CODE,
                                    CONCEPT_ID: concept.CONCEPT_ID,
                                    CONCEPT_NAME: concept.CONCEPT_NAME,
                                    DOMAIN_ID: concept.DOMAIN_ID,
                                    VOCABULARY_ID: concept.VOCABULARY_ID,
                                });
                            }
                        }
                    }
                }
            }

            /**
             * END ATTRIBUTES
             */
            const eventKey = getExtCohortKeyForEvent(
                cdmConfig,
                content.configPath
            );
            if (!eventKey) {
                continue;
            }

            if (eventsForFilter[eventKey]) {
                eventsForFilter[eventKey].push(attributesForFilter);
            } else {
                eventsForFilter[eventKey] = [attributesForFilter];
            }
        }
        criteriaList.push(eventsForFilter);
    }
    return criteriaList;
};

export const createInclusionRules = (
    demographicCriteriaList: { [key: string]: Criteria }[],
    criteriaList: any[]
) => {
    const inclusionRules: any[] = [];

    let ruleIndex = 1;
    if (demographicCriteriaList.length) {
        inclusionRules.push({
            name: `Inclusion Criteria ${ruleIndex}`,
            expression: {
                Type: "ALL",
                CriteriaList: [],
                DemographicCriteriaList: demographicCriteriaList,
                Groups: [],
            },
        });
        ruleIndex = ruleIndex + 1;
    }

    for (const inclusionCriterias of criteriaList) {
        const criteriaArray: any[] = [];
        for (const criteriaName in inclusionCriterias) {
            for (const criteriaInfo of inclusionCriterias[criteriaName]) {
                const { isExcluded, ...criteria } = criteriaInfo;
                criteriaArray.push({
                    Criteria: {
                        [criteriaName]: criteria,
                    },
                    StartWindow: {
                        Start: {
                            Coeff: -1,
                        },
                        End: {
                            Coeff: 1,
                        },
                        UseEventEnd: false,
                    },
                    Occurrence: getOccurrence(isExcluded),
                });
            }
        }
        inclusionRules.push({
            name: `Inclusion Criteria ${ruleIndex}`,
            expression: {
                Type: "ANY",
                CriteriaList: criteriaArray,
                DemographicCriteriaList: [],
                Groups: [],
            },
        });
        ruleIndex = ruleIndex + 1;
    }
    return inclusionRules;
};

const getOccurrence = (isExcluded: boolean) => {
    if (isExcluded) {
        return {
            Type: 0, // for excluded criteria: 0 exact count
            Count: 0,
        };
    }
    return {
        Type: 2, // The criteria container always allows any (Type 2) criteria
        Count: 1,
    };
};
