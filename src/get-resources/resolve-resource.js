import { isObject } from '../utils/identification';

export default function resolveResource({ resource, schema, options = {} }) {
  const { flat } = options;

  if (!isObject(resource)) {
    return;
  }

  // TODO: warn if resource is malformed

  const computedAttributes = {};
  for (let attributeName in schema.computedAttributes) {
    computedAttributes[attributeName] = schema.computedAttributes[
      attributeName
    ](resource);
  }

  if (flat) {
    return {
      ...resource.meta,
      ...computedAttributes,
      ...resource.attributes,
      resourceType: resource.resourceType,
      [schema.idAttribute]: resource[schema.idAttribute],
    };
  } else {
    return {
      meta: resource.meta || {},
      computedAttributes,
      attributes: resource.attributes || {},
      resourceType: resource.resourceType,
      [schema.idAttribute]: resource[schema.idAttribute],
    };
  }
}
