import resolveResource from './resolve-resource';
import defaultSchema from '../initialization/default-schema';
import objectMatchesObject from '../utils/is-subset';
import { warning } from '../utils/warning';

// Retrieve resource(s) from the store
export default function getResources({
  state,
  resourceType,
  filter,
  schemas,
  options = {},
}) {
  const { byId = false } = options;

  if (typeof resourceType !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `An invalid resourceType was passed to getResources.` +
          ` resourceType must be a string.`,
        'GET_RESOURCES_INVALID_RESOURCE_TYPE'
      );
    }
  }

  const resourceSection = state[resourceType];

  if (!resourceSection) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `You called getResources with a resourceType that does not exist: ` +
          `${resourceType}. Did you make a typo?`,
        'GET_RESOURCES_NONEXISTENT_TYPE'
      );
    }

    return byId ? {} : [];
  }

  const hasFilter = typeof filter !== 'undefined';

  if (hasFilter && process.env.NODE_ENV !== 'production') {
    const filterIsString = typeof filter !== 'string';
    const filterIsArray = Array.isArray(filter);
    const filterIsObject = filter.constructor !== Object;
    const filterIsFn = typeof filter !== 'function';

    if (!filterIsFn && !filterIsArray && !filterIsObject && !filterIsString) {
      warning(
        `An invalid filter was passed to getResources. A filter must be a` +
          ` string, array, object, or function.`,
        'INVALID_GET_RESOURCES_FILTER'
      );
    }

    if (filterIsArray) {
      filter.forEach(value => {
        const valueIsString = typeof value === 'string';
        const valueIsNumber = typeof value === 'number';

        if (!valueIsString && !valueIsNumber) {
          warning(
            `An invalid array filter was passed to getResources. Each item` +
              ` in the array needs to be either a string or a number.` +
              ` Remember, when a filter is an array, then each item in` +
              ` the array is a resource ID, and IDs must be strings or` +
              ` numbers.`,
            'INVALID_GET_RESOURCES_FILTER_ARRAY_ITEM'
          );
        }
      });
    }
  }

  const schema = schemas[resourceType] || defaultSchema;

  const resources = resourceSection.resources;
  let idsList;

  if (typeof filter === 'function' || !hasFilter) {
    const appliedFilter = filter ? filter : () => true;
    const resourceList = Object.values(resources)
      .map(resource =>
        resolveResource({ state, resource, schema, options, schemas })
      )
      .filter(resource => appliedFilter(resource, resourceSection));

    const res = !byId
      ? resourceList
      : resourceList.reduce((result, resource) => {
          result[resource[schema.idAttribute]] = resource;
          return result;
        }, {});

    return res;
  } else if (typeof filter === 'object' && !(filter instanceof Array)) {
    const resourceList = Object.values(resources)
      .map(resource =>
        resolveResource({ state, resource, schema, options, schemas })
      )
      .filter(resource => objectMatchesObject(resource, filter));

    return !byId
      ? resourceList
      : resourceList.reduce((result, resource) => {
          result[resource[schema.idAttribute]] = resource;
          return result;
        }, {});
  } else if (typeof filter === 'string') {
    // This conditional handles the situation where `filter` is an list name
    const list = resourceSection.lists[filter];
    if (!list) {
      return byId ? {} : [];
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
      .map(id =>
        resolveResource({
          state,
          resource: resources[id],
          options,
          schema,
          schemas,
        })
      )
      .filter(Boolean);
  } else {
    return idsList.reduce((result, id) => {
      result[id] = resolveResource({
        state,
        resource: resources[id],
        schema,
        schemas,
        options,
      });
      return result;
    }, {});
  }
}
