import resolveResource from './utils/resolve-resource';
import defaultSchema from './utils/default-schema';
import { exists, isString, isObject } from './utils/identification';
import { warning } from './utils/warning';

export default function getGroup({ groupName, options = {}, state, schemas }) {
  const { byId = false } = options;

  const defaultResponse = byId ? {} : [];

  if (!isString(groupName)) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `An invalid groupName was passed to getGroup.` +
          ` groupName must be a string.`,
        'GET_LIST_INVALID_LIST_NAME',
        'error'
      );
    }

    return defaultResponse;
  }

  if (!isObject(options)) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `Invalid options were passed to getGroup.` +
          ` options must be an object. The value that you` +
          ` passed will be ignored.`,
        'GET_LIST_INVALID_OPTIONS',
        'error'
      );
    }
  }

  const group = state.groups[groupName];

  if (!exists(group)) {
    return defaultResponse;
  }

  if (group.length === 0) {
    return defaultResponse;
  }

  if (!byId) {
    return group
      .map(resourcePointer => {
        const resources = state.resources[resourcePointer.resourceType] || {};
        const schema = schemas[resourcePointer.resourceType] || defaultSchema;

        return resolveResource({
          state,
          resource: resources[resourcePointer[schema.idProperty]],
          options,
          schema,
          schemas,
        });
      })
      .filter(Boolean);
  } else {
    return group.reduce((result, resourcePointer) => {
      const resources = state.resources[resourcePointer.resourceType] || {};
      const schema = schemas[resourcePointer.resourceType] || defaultSchema;

      result[resourcePointer[schema.idProperty]] = resolveResource({
        state,
        resource: resources[resourcePointer[schema.idProperty]],
        schema,
        schemas,
        options,
      });
      return result;
    }, {});
  }
}
