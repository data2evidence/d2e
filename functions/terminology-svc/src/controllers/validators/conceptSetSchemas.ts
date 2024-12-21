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
