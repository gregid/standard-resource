import merge from './merge';
import { isObject } from './identification';

export default function createResource({
  input,
  existing,
  schema,
  resourceType,
  mergeResource,
}) {
  const inputObject = isObject(input)
    ? input
    : {
        [schema.idAttribute]: input,
      };

  const existingObj = isObject(existing) ? existing : {};

  if (!mergeResource) {
    return {
      [schema.idAttribute]: inputObject[schema.idAttribute],
      resourceType,
      attributes: merge(inputObject.attributes),
      meta: merge(inputObject.meta),
    };
  }

  const idValue = isObject(existing)
    ? existing[schema.idAttribute]
    : inputObject[schema.idAttribute];

  return {
    [schema.idAttribute]: idValue,
    resourceType,
    attributes: merge(existingObj.attributes, inputObject.attributes),
    meta: merge(existingObj.meta, inputObject.meta),
  };
}
