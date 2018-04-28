import getResources from './';

// relationshipDefinition => this is what is on the resource in the state tree
// retrievalOptions => this determines how this particular relationship should be resolved
export default function lookupRelationship(
  state,
  relationshipDefinition = {},
  getOptions,
  schemas
) {
  const { resourceType, data } = relationshipDefinition;

  const dataIsArray = Array.isArray(data);

  const result = getResources({
    schemas,
    state,
    resourceType,
    filter: dataIsArray ? data : [data],
    options: getOptions,
  });

  return dataIsArray ? result : result[0];
}
