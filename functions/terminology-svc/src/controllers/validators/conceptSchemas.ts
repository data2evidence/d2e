import { z } from "zod";

const filtersSchema = z
  .object({
    conceptClassId: z.array(z.string()).default([]),
    domainId: z.array(z.string()).default([]),
    standardConcept: z.array(z.string()).default([]),
    vocabularyId: z.array(z.string()).default([]),
    validity: z.array(z.enum(["Valid", "Invalid"])).default([]),
  })
  .default({
    conceptClassId: [],
    domainId: [],
    standardConcept: [],
    vocabularyId: [],
    validity: [],
  });

export const getConceptsQuery = z.object({
  offset: z
    .string()
    .refine((val) => !isNaN(parseInt(val)))
    .transform(Number),
  count: z
    .string()
    .refine((val) => !isNaN(parseInt(val)))
    .transform(Number),
  datasetId: z.string(),
  code: z.string(),
  filter: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return filtersSchema.parse({});
      try {
        const parsed = JSON.parse(value);
        return filtersSchema.parse(parsed);
      } catch {
        return filtersSchema.parse({});
      }
    }),
});
export const getConcepts = z.object({
  query: getConceptsQuery,
});

export const getConceptFilterOptionsQuery = z.object({
  datasetId: z.string(),
  searchText: z.string(),
  filter: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return filtersSchema.parse({});
      try {
        const parsed = JSON.parse(value);
        return filtersSchema.parse(parsed);
      } catch {
        return filtersSchema.parse({});
      }
    }),
});
export const getConceptFilterOptions = z.object({
  query: getConceptFilterOptionsQuery,
});

export const getTerminologyDetailsWithRelationshipsQuery = z.object({
  datasetId: z.string(),
  conceptId: z.string().transform(Number),
});
export const getTerminologyDetailsWithRelationships = z.object({
  query: getTerminologyDetailsWithRelationshipsQuery,
});

export const searchConceptByNameBody = z.object({
  datasetId: z.string(),
  conceptName: z.string(),
});
export const searchConceptByName = z.object({
  body: searchConceptByNameBody,
});

export const searchConceptByIdBody = z.object({
  datasetId: z.string(),
  conceptId: z.number(),
});
export const searchConceptById = z.object({
  body: searchConceptByIdBody,
});

export const searchConceptByCodeBody = z.object({
  datasetId: z.string(),
  conceptCode: z.string(),
});
export const searchConceptByCode = z.object({
  body: searchConceptByCodeBody,
});
