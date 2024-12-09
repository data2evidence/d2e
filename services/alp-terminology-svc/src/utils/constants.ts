export const INDEX_ATTRIBUTES = {
  concept: {
    conceptId: 'concept_id',
    conceptName: 'concept_name',
    domainId: 'domain_id',
    vocabularyId: 'vocabulary_id',
    conceptClassId: 'concept_class_id',
    standardConcept: 'standard_concept',
    conceptCode: 'concept_code',
    validStartDate: 'valid_start_date',
    validEndDate: 'valid_end_date',
    invalidReason: 'invalid_reason',
  },
  concept_relationship: {
    meilisearchId: 'meilisearch_id',
    conceptId1: 'concept_id_1',
    conceptId2: 'concept_id_2',
    relationshipId: 'relationship_id',
    validStartDate: 'valid_start_date',
    validEndDate: 'valid_end_date',
    invalidReason: 'invalid_reason',
  },
  relationship: {
    meilisearchId: 'meilisearch_id',
    relationshipId: 'relationship_id',
    relationshipName: 'relationship_name',
    isHierarchical: 'is_hierarchical',
    definesAncestry: 'defines_ancestry',
    reverseRelationshipId: 'reverse_relationship_id',
    relationshipConceptId: 'relationship_concept_id',
  },
  vocabulary: {
    meilisearchId: 'meilisearch_id',
    vocabularyId: 'vocabulary_id',
    vocabularyName: 'vocabulary_name',
    vocabularyReference: 'vocabulary_reference',
    vocabularyVersion: 'vocabulary_version',
    vocabularyConceptId: 'vocabulary_concept_id',
  },
  concept_synonym: {
    meilisearchId: 'meilisearch_id',
    conceptId: 'concept_id',
    conceptSynonymName: 'concept_synonym_name',
    languageConceptId: 'language_concept_id',
  },
  concept_class: {
    meilisearchId: 'meilisearch_id',
    conceptClassId: 'concept_class_id',
    conceptClassName: 'concept_class_name',
    conceptClassConceptId: 'concept_class_concept_id',
  },
  domain: {
    meilisearchId: 'meilisearch_id',
    domainId: 'domain_id',
    domainName: 'domain_name',
    domainConceptId: 'domain_concept_id',
  },
  concept_ancestor: {
    meilisearchId: 'meilisearch_id',
    ancestorConceptId: 'ancestor_concept_id',
    descendantConceptId: 'descendant_concept_id',
    minLevelsOfSeparation: 'min_levels_of_separation',
    maxLevelsOfSeparation: 'max_levels_of_separation',
  },
  concept_recommended: {
    conceptId1: 'concept_id_1',
    conceptId2: 'concept_id_2',
    relationshipId: 'relationship_id',
  },
} as const;
