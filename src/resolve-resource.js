import lookupRelationship from './lookup-relationship';
import evaluateComputedAttributes from './evaluate-computed-attributes';

// This function handles pulling in relationships and/or flattening
// the resource
export function resolveResource(state, resource, options = {}) {
  const { flat = true, includeRelationships = true } = options;

  if (!resource) {
    return;
  }

  // TODO: warn if resource is malformed

  let relationships;
  if (!includeRelationships) {
    relationships = resource.relationships;
  } else {
    // TODO: loop thru dis shit and resolve each one
    relationships = lookupRelationship();
  }

  let computedAttributes = evaluateComputedAttributes(state, resource, options);

  if (flat) {
    return {
      ...resource.meta,
      ...relationships,
      ...computedAttributes,
      ...resource.attributes,
      id: resource.id,
    };
  } else {
    return {
      meta: resource.meta,
      relationships,
      computedAttributes,
      attributes: resource.attributes,
      id: resource.id,
    };
  }
}
