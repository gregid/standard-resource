import { isNil, isString } from '../utils/identification';
import write from './write';
import { warning } from '../utils/warning';

export default function createResource(resourceType) {
  if (!isString(resourceType)) {
    warning(
      `You must pass a string as the first argument to createResource.`,
      'CREATE_RESOURCE_INVALID_RESOURCE_NAME',
      'error'
    );
  }

  const internalStore = {
    state: {
      resourceType,
      resources: {},
    },
  };

  return {
    getState() {
      return internalStore.state;
    },

    read(filter) {
      if (isNil(filter)) {
        return internalStore.state.resources;
      } else {
        // Complex filtering logic, or whatever
      }
    },

    // TODO: when, say, the entire slice is deleted, how do we communicate that
    // back out for other things to be updated? Perhaps an update summary is returned?
    write(path, update) {
      return write(internalStore, path, update);
    },
  };
}
