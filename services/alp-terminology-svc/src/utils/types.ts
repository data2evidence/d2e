export type ConceptSetConcept = {
  id: number;
  useDescendants: boolean;
  useMapped: boolean;
};
export interface IConcept {
  concept_id: number;
  concept_name: string;
  domain_id: string;
  vocabulary_id: string;
  concept_class_id: string;
  standard_concept: string;
  concept_code: string;
  invalid_reason: string;
  valid_start_date?: number;
  valid_end_date?: number;
}
export interface IMeilisearchConcept {
  hits: IConcept[];
  query: string;
  processingTimeMs: number;
  hitsPerPage: number;
  page: number;
  totalHits: number;
  facetDistribution: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export interface IDuckdbConcept {
  hits: IConcept[];
  totalHits: number;
}

export interface IRelationship {
  relationship_id: string;
  relationship_name: string;
  is_hierarchical: boolean;
  defines_ancestry: boolean;
  reverse_relationship_id: string;
  relationship_concept_id: number;
}

export interface IMeilisearchRelationship {
  hits: IRelationship[];
  query: string;
  processingTimeMs: number;
  hitsPerPage: number;
  page: number;
  totalHits: number;
  facetDistribution: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export interface IConceptAncestor {
  meilisearch_id?: number;
  ancestor_concept_id: number;
  descendant_concept_id: number;
  min_levels_of_separation: number;
  max_levels_of_separation: number;
}
export interface IMeilisearchGetDescendants {
  hits: IConceptAncestor[];
  query: string;
  processingTimeMs: number;
  hitsPerPage: number;
  page: number;
  totalHits: number;
  facetDistribution: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export interface IConceptRelationship {
  meilisearch_id: number;
  concept_id_1: number;
  concept_id_2: number;
  relationship_id: string;
  valid_start_date: number;
  valid_end_date: number;
  invalid_reason: string;
}
export interface IMeilisearchGetMapped {
  hits: IConceptRelationship[];
  query: string;
  processingTimeMs: number;
  hitsPerPage: number;
  page: number;
  totalHits: number;
  facetDistribution: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export interface IMeilisearchFacet {
  facetHits: { value: string; count: number };
}
export interface IConceptRecommended {
  meilisearch_id?: number;
  concept_id_1: number;
  concept_id_2: number;
  relationship_id: string;
}
export interface IMeilisearchGetConceptRecommended {
  hits: IConceptRecommended[];
  query: string;
  processingTimeMs: number;
  hitsPerPage: number;
  page: number;
  totalHits: number;
  facetDistribution: {
    [key: string]: {
      [key: string]: number;
    };
  };
}
export class FhirValueSet {
  resourceType: string;
  url?: string;
  version?: string;
  name?: string;
  title?: string;
  status?: string;
  experimental?: string;
  date?: string;
  publisher?: string;
  contact?: string;
  description?: string;
  useContext?: string;
  jurisdiction?: string;
  immutable?: string;
  purpose?: string;
  copyright?: string;
  copyrightLabel?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: string;
  topic?: string;
  author?: string;
  editor?: string;
  reviewer?: string;
  endorser?: string;
  relatedArtifact?: string;
  compose?: string;
  expansion: FhirValueSetExpansion;
  scope?: string;
}

export type FhirValueSetExpansion = {
  id?: string;
  extension?: string;
  timestamp: Date;
  total: number;
  offset: number;
  parameter?: string;
  property?: string;
  contains?: FhirValueSetExpansionContainsWithExt[];
};

export type FhirValueSetExpansionContainsWithExt = {
  id?: string;
  extension?: string;
  abstract?: string;
  inactive?: string;
  version?: string;
  designation?: string;
  contains?: FhirValueSetExpansionContainsWithExt[];
  code: string;
  display: string;
  system: string;
  conceptId: number;
  domainId: string;
  conceptClassId: string;
  standardConcept: string;
  concept: string;
  validStartDate: string;
  validEndDate: string;
  validity: string;
};

export const SupportedFhirVersion = '4_0_0';

export const FhirResourceType = {
  valueset: 'ValueSet',
  conceptmap: 'ConceptMap',
};

export type FhirConceptMapElementTarget = {
  code: number;
  display: string;
  equivalence: string;
  vocabularyId: string;
};
export type FhirConceptMapElementWithExt = {
  code: string;
  display: string;
  valueSet: FhirValueSet;
  target: FhirConceptMapElementTarget[];
};

export type FhirConceptMapGroup = {
  source: string;
  target: string;
  element: FhirConceptMapElementWithExt[];
};

export type FhirConceptMap = {
  resourceType: string;
  group: FhirConceptMapGroup[];
};

export type Filters = {
  conceptClassId: string[];
  domainId: string[];
  standardConcept: string[];
  vocabularyId: string[];
  validity: ('Valid' | 'Invalid')[];
};

export type HybridSearchConfig = {
  id: number;
  isEnabled: boolean;
  semanticRatio: number;
  source: string;
  model: string;
};

export type ConceptHierarchyEdge = {
  source: number;
  target: number;
};

export type ConceptHierarchyNodeLevel = {
  conceptId: number;
  level: number;
};

export type ConceptHierarchyNode = ConceptHierarchyNodeLevel & {
  display: string;
};
