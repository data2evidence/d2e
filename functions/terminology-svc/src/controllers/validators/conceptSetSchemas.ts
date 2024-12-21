import { z } from "zod";

export const createConceptSetBody = z.object({
  concepts: z.array(
    z.object({
      id: z.number(),
      useDescendants: z.boolean(),
      useMapped: z.boolean(),
    })
  ),
  name: z.string(),
  shared: z.boolean(),
  userName: z.string(),
});
export const createConceptSet = z.object({
  body: createConceptSetBody,
});

export const getConceptSetQuery = z.object({ datasetId: z.string() });
export const getConceptSetParams = z.object({
  conceptSetId: z.string(),
});
export const getConceptSet = z.object({
  query: getConceptSetQuery,
  params: getConceptSetParams,
});

export const updateConceptSetBody = z
  .object({
    concepts: z.array(
      z.object({
        id: z.number(),
        useDescendants: z.boolean(),
        useMapped: z.boolean(),
      })
    ),
    name: z.string(),
    shared: z.boolean(),
    userName: z.string(),
  })
  .partial();
export const updateConceptSetParams = z.object({
  conceptSetId: z.string(),
});
export const updateConceptSet = z.object({
  body: updateConceptSetBody,
  params: updateConceptSetParams,
});

export const removeConceptSetParams = z.object({
  conceptSetId: z.string(),
});
export const removeConceptSet = z.object({
  params: removeConceptSetParams,
});

export const getIncludedConceptsBody = z.object({
  datasetId: z.string(),
  conceptSetIds: z.array(z.string()),
});
export const getIncludedConcepts = z.object({
  body: getIncludedConceptsBody,
});
