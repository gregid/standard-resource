import getResources from './';

// relationshipDefinition => this is what is on the resource in the state tree
// retrievalOptions => this determines how this particular relationship should be resolved
export default function lookupRelationship(
  state,
  relationshipDefinition = {}
  // retrievalOptions = {}
) {
  const { resourceType, data } = relationshipDefinition;

  const dataIsArray = Array.isArray(data);

  // TODO: preserve array or not-array stuff
  const result = getResources({
    state,
    resourceType,
    filter: dataIsArray ? data : [data],
    // TODO: convert the retrievalOptions into getResources options
  });

  return dataIsArray ? result : result[0];
}
