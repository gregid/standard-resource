import resolveResource from './resolve-resource';
import objectMatchesObject from './object-matches-object';
import warning from '../warning';

// Retrieve resource(s) from the store
export default function getResources({
  state,
  resourceType,
  filter,
  options = {},
}) {
  const { byId = false } = options;

  const resourceSection = state[resourceType];

  if (!resourceSection) {
    warning(
      `You called getResources with a resourceType thatxw does not exist: ` +
        `${resourceType}. Did you make a typo?`,
      'GET_RESOURCES_NONEXISTENT_TYPE'
    );

    return byId ? {} : [];
  }

  const resources = resourceSection.resources;
  let idsList;

  if (typeof filter === 'function' || !filter) {
    const appliedFilter = filter ? filter : () => true;
    const resourceList = Object.values(resources)
      .map(resource => resolveResource(state, resource, options))
      .filter(resource => appliedFilter(resource, resourceSection));

    const res = !byId
      ? resourceList
      : resourceList.reduce((result, resource) => {
          result[resource.id] = resource;
          return result;
        }, {});

    return res;
  } else if (typeof filter === 'object' && !(filter instanceof Array)) {
    const resourceList = Object.values(resources)
      .map(resource => resolveResource(state, resource, options))
      .filter(resource => objectMatchesObject(resource, filter));

    return !byId
      ? resourceList
      : resourceList.reduce((result, resource) => {
          result[resource.id] = resource;
          return result;
        }, {});
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
    return !byId ? [] : {};
  }

  if (!byId) {
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
