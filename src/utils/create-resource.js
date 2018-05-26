import merge from './merge';
import { isObject } from './identification';

export default function createResource({
  id,
  input,
  existing,
  schema,
  resourceType,
  mergeResource,
}) {
  const inputObject = isObject(input)
    ? input
    : {
        [schema.idProperty]: input,
      };

  const existingObj = isObject(existing) ? existing : {};

  if (!mergeResource) {
    return {
      [schema.idProperty]: inputObject[schema.idProperty],
      resourceType,
      attributes: merge(inputObject.attributes),
      meta: merge(inputObject.meta),
    };
  }

  const idValue = isObject(existing)
    ? existing[schema.idProperty]
    : inputObject[schema.idProperty];

  return {
    [schema.idProperty]: idValue || id,
    resourceType,
    attributes: merge(existingObj.attributes, inputObject.attributes, true),
    meta: merge(existingObj.meta, inputObject.meta, true),
  };
}
