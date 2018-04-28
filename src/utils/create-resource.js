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

  if (!mergeResource) {
    return {
      [schema.idAttribute]: inputObject[schema.idAttribute],
      resourceType,
      attributes: merge(inputObject.attributes),
      meta: merge(inputObject.meta),
    };
  }

  return {
    [schema.idAttribute]: existing[schema.idAttribute],
    resourceType,
    attributes: merge(existing.attributes, inputObject.attributes),
    meta: merge(existing.meta, inputObject.meta),
  };
}
