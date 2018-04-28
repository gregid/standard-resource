import { isObject } from './identification';

export default function createResource({
  input,
  existing,
  schema,
  resourceType,
  merge,
}) {
  const inputObject = isObject(input)
    ? input
    : {
        [schema.idAttribute]: input,
      };

  if (!merge) {
    return {
      [schema.idAttribute]: inputObject[schema.idAttribute],
      resourceType,
      attributes: {
        ...inputObject.attributes,
      },
      meta: {
        ...inputObject.meta,
      },
    };
  }

  return {
    [schema.idAttribute]: existing[schema.idAttribute],
    resourceType,
    attributes: Object.assign({}, existing.attributes, inputObject.attributes),
    meta: Object.assign({}, existing.meta, inputObject.meta),
  };
}
