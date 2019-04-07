import resolveResource from './utils/resolve-resource';
import defaultSchema from '../utils/default-schema';
import objectMatchesObject from '../utils/is-subset';
import {
  isSet,
  isArray,
  isString,
  isObject,
  isFunction,
  isNumber,
} from '../utils/identification';
import { warning } from '../utils/warning';

export default function getResources({
  resources,
  filter,
  schema = defaultSchema,
  options = {},
}) {
  const { byId = false } = options;
  const defaultResponse = byId ? {} : [];
  const hasFilter = isSet(filter);

  if (hasFilter && process.env.NODE_ENV !== 'production') {
    const filterIsArray = isArray(filter);
    const filterIsObject = isObject(filter);
    const filterIsFn = isFunction(filter);

    if (!filterIsFn && !filterIsArray && !filterIsObject) {
      warning(
        `An invalid filter was passed to read. A filter must be an` +
          ` array, object, or function.`,
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
  let idsGroup;

  if (isFunction(filter) || !hasFilter) {
    const appliedFilter = filter ? filter : () => true;
    const resourceGroup = Object.values(resources)
      .map(resource => resolveResource({ resource, schema, options }))
      .filter(resource => appliedFilter(resource, resources));

    const res = !byId
      ? resourceGroup
      : resourceGroup.reduce((result, resource) => {
          result[resource[schema.idProperty]] = resource;
          return result;
        }, {});

    return res;
  } else if (isObject(filter) && !isArray(filter)) {
    const resourceGroup = Object.values(resources)
      .map(resource => resolveResource({ resource, schema, options }))
      .filter(resource => objectMatchesObject(resource, filter));

    return !byId
      ? resourceGroup
      : resourceGroup.reduce((result, resource) => {
          result[resource[schema.idProperty]] = resource;
          return result;
        }, {});
  } else {
    idsGroup = filter;
  }

  if (!(idsGroup && idsGroup.length)) {
    return defaultResponse;
  }

  if (!byId) {
    return idsGroup
      .map(id =>
        resolveResource({
          resource: resources[id],
          options,
          schema,
        })
      )
      .filter(Boolean);
  } else {
    return idsGroup.reduce((result, id) => {
      result[id] = resolveResource({
        resource: resources[id],
        schema,
        options,
      });
      return result;
    }, {});
  }
}
