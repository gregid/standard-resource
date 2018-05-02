import resolveResource from './utils/resolve-resource';
import defaultSchema from './utils/default-schema';
import { exists, isString, isObject } from './utils/identification';
import { warning } from './utils/warning';

export default function getList({ listName, options = {}, state, schemas }) {
  const { byId = false } = options;

  const defaultResponse = byId ? {} : [];

  if (!isString(listName)) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `An invalid listName was passed to getList.` +
          ` listName must be a string.`,
        'GET_LIST_INVALID_LIST_NAME',
        'error'
      );
    }

    return defaultResponse;
  }

  if (!isObject(options)) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `Invalid options were passed to getList.` +
          ` options must be an object. The value that you` +
          ` passed will be ignored.`,
        'GET_LIST_INVALID_OPTIONS',
        'error'
      );
    }
  }

  const list = state.lists[listName];

  if (!exists(list)) {
    return defaultResponse;
  }

  if (list.length === 0) {
    return defaultResponse;
  }

  if (!byId) {
    return list
      .map(resourcePointer => {
        const resources = state.resources[resourcePointer.resourceType] || {};
        const schema = schemas[resourcePointer.resourceType] || defaultSchema;

        return resolveResource({
          state,
          resource: resources[resourcePointer.id],
          options,
          schema,
          schemas,
        });
      })
      .filter(Boolean);
  } else {
    return list.reduce((result, resourcePointer) => {
      const resources = state.resources[resourcePointer.resourceType] || {};
      const schema = schemas[resourcePointer.resourceType] || defaultSchema;

      result[resourcePointer.id] = resolveResource({
        state,
        resource: resources[resourcePointer.id],
        schema,
        schemas,
        options,
      });
      return result;
    }, {});
  }
}
