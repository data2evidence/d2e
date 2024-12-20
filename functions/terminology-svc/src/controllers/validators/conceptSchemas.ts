import { z } from "zod";

const ParsedFiltersSchema = z.object({
  conceptClassId: z.array(z.string()).optional(),
  domainId: z.array(z.string()).optional(),
  standardConcept: z.array(z.string()).optional(),
  vocabularyId: z.array(z.string()).optional(),
  validity: z.array(z.enum(["Valid", "Invalid"])).optional(),
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
      if (!value) return {} as z.infer<typeof ParsedFiltersSchema>;
      try {
        const parsed = JSON.parse(value);
        return ParsedFiltersSchema.parse(parsed);
      } catch {
        return {} as z.infer<typeof ParsedFiltersSchema>;
      }
    }),
});
export const getConcepts = z.object({
  query: getConceptsQuery,
});
