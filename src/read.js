import resolveResource from './utils/resolve-resource';
import defaultSchema from './utils/default-schema';
import objectMatchesObject from './utils/is-subset';
import {
  exists,
  isArray,
  isString,
  isObject,
  isFunction,
  isNumber,
} from './utils/identification';
import { warning } from './utils/warning';

// Retrieve resource(s) from the store
export default function read({
  state,
  resourceType,
  filter,
  schemas,
  options = {},
}) {
  const { byId = false } = options;

  const defaultResponse = byId ? {} : [];

  if (!isString(resourceType)) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `An invalid resourceType was passed to read.` +
          ` resourceType must be a string.`,
        'GET_RESOURCES_INVALID_RESOURCE_TYPE',
        'error'
      );
    }

    return defaultResponse;
  }

  const resourceSection = state[resourceType];

  if (!exists(resourceSection)) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `You called read with a resourceType that does not exist: ` +
          `${resourceType}. Did you make a typo?`,
        'GET_RESOURCES_NONEXISTENT_TYPE'
      );
    }

    return defaultResponse;
  }

  const hasFilter = exists(filter);

  if (hasFilter && process.env.NODE_ENV !== 'production') {
    const filterIsString = isString(filter);
    const filterIsArray = isArray(filter);
    const filterIsObject = isObject(filter);
    const filterIsFn = isFunction(filter);

    if (!filterIsFn && !filterIsArray && !filterIsObject && !filterIsString) {
      warning(
        `An invalid filter was passed to read. A filter must be a` +
          ` string, array, object, or function.`,
        'INVALID_GET_RESOURCES_FILTER',
        'error'
      );
    }

    if (filterIsArray) {
      filter.forEach(value => {
        if (!isString(value) && !isNumber(value)) {
          warning(
            `An invalid array filter was passed to read. Each item` +
              ` in the array needs to be either a string or a number.` +
              ` Remember, when a filter is an array, then each item in` +
              ` the array is a resource ID, and IDs must be strings or` +
              ` numbers.`,
            'INVALID_GET_RESOURCES_FILTER_ARRAY_ITEM',
            'error'
          );
        }
      });
    }
  }

  const schema = schemas[resourceType] || defaultSchema;

  const resources = resourceSection.resources;
  let idsList;

  if (isFunction(filter) || !hasFilter) {
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
  } else if (isObject(filter) && !isArray(filter)) {
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
  } else if (isString(filter)) {
    // This conditional handles the situation where `filter` is an list name
    const list = resourceSection.lists[filter];
    if (!exists(list)) {
      return defaultResponse;
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
