import lookupRelationship from './lookup-relationship';
import evaluateComputedAttributes from './evaluate-computed-attributes';

// This function handles pulling in relationships and/or flattening
// the resource
export default function resolveResource({
  state,
  resource,
  schema,
  options = {},
}) {
  const { flat, relationships } = options;

  if (!resource) {
    return;
  }

  // TODO: warn if resource is malformed

  let resolvedRelationships = resource.relationships || {};
  if (relationships) {
    const allRelationships = typeof relationships === 'boolean';

    // If the user passes `true`, then that means they want to resolve every relationship.
    // Otherwise, they will pass an object specifying the specific relationships that they
    // want to resolve.
    const objectToIterate = allRelationships
      ? resolvedRelationships
      : relationships;
    for (let relationshipKey in objectToIterate) {
      let relationshipDefinition = resource.relationships[relationshipKey];
      let getOptions = allRelationships ? {} : objectToIterate[relationshipKey];

      resolvedRelationships[relationshipKey] = lookupRelationship(
        state,
        relationshipDefinition,
        getOptions
      );
    }
  }

  let computedAttributes = evaluateComputedAttributes({
    state,
    resource,
    schema,
    options,
  });

  if (flat) {
    return {
      ...resource.meta,
      ...resolvedRelationships,
      ...computedAttributes,
      ...resource.attributes,
      resourceType: resource.resourceType,
      [schema.idAttribute]: resource[schema.idAttribute],
    };
  } else {
    return {
      meta: resource.meta || {},
      relationships: resolvedRelationships,
      computedAttributes,
      attributes: resource.attributes || {},
      resourceType: resource.resourceType,
      [schema.idAttribute]: resource[schema.idAttribute],
    };
  }
}
