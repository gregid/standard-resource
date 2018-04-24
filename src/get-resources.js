import resolveResource from './resolve-resource';
import warning from './warning';

// Retrieve resource(s) from the store
export default function getResources(
  state,
  resourceType,
  filter,
  options = {}
) {
  const { byId = false } = options;

  const resourceSection = state[resourceType];

  if (resourceSection) {
    warning(
      `You called getResources with a resourceType that does not exist: ` +
        `${resourceType}. Did you make a typo?`,
      'GET_RESOURCES_NONEXISTENT_TYPE'
    );

    return byId ? [] : {};
  }

  const resources = resourceSection.resources;
  let idsList;

  if (typeof filter === 'function' || !filter) {
    const appliedFilter = filter ? filter : () => true;
    // TODO: Return an object here if they specify that!
    // ALSO: resolve dat shit
    return Object.values(resources).filter(resource =>
      appliedFilter(
        resource,
        resourceSection.meta[resource.id],
        resourceSection
      )
    );
  } else if (typeof filter === 'string') {
    // This conditional handles the situation where `filter` is an list name
    const list = resourceSection.lists[filter];
    if (!list) {
      return byId ? [] : {};
    }

    idsList = list;
  } else {
    idsList = filter;
  }

  if (!(idsList && idsList.length)) {
    return byId ? [] : {};
  }

  if (byId) {
    return idsList
      .map(id => resolveResource(state, resources[id], options))
      .filter(Boolean);
  } else {
    return idsList.reduce((result, id) => {
      result[id] = resolveResource(state, resources[id], options);
      return result;
    }, {});
  }
}
