import merge from '../../utils/merge';
import { isObject } from '../../utils/identification';

export default function upsertResource({
  id,
  input,
  existing,
  resourceType,
  mergeResource,
}) {
  const inputObject = isObject(input)
    ? input
    : {
        id: input,
      };

  const existingObj = isObject(existing) ? existing : {};

  if (!mergeResource) {
    return {
      id: inputObject.id,
      resourceType,
      attributes: merge(inputObject.attributes),
      meta: merge(inputObject.meta),
    };
  }

  const idValue = isObject(existing) ? existing.id : inputObject.id;

  return {
    id: idValue || id,
    resourceType,
    attributes: merge(existingObj.attributes, inputObject.attributes, true),
    meta: merge(existingObj.meta, inputObject.meta, true),
  };
}
