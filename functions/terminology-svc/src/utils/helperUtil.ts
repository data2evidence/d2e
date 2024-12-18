import { FhirConceptMapElementTarget } from "./types";

export function groupBy(
  objectArray: FhirConceptMapElementTarget[],
  property: string,
) {
  return objectArray.reduce(function (
    acc: {
      [key: string]: FhirConceptMapElementTarget[];
    },
    obj,
  ) {
    if (
      property !== 'code' &&
      property !== 'display' &&
      property !== 'equivalence' &&
      property !== 'vocabularyId'
    ) {
      return acc;
    }
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [] as FhirConceptMapElementTarget[];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}
