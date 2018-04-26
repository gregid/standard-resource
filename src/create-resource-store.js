import getResources from './get-resources';
import updateResources from './write/update-resources';
import deleteResources from './write/delete-resources';
import createInitialState from './create-initial-state';

export default function createResourceStore(
  schemas = {},
  initialState = {},
  options = {}
) {
  let currentState = createInitialState(schemas, initialState, options);

  const validResourceTypes = Object.keys(schemas || {});

  function getState() {
    return currentState;
  }

  return {
    getState,
    getResources(resourceType, filter, options) {
      return getResources({
        state: currentState,
        resourceType,
        filter,
        options,
        validResourceTypes,
        schemas,
      });
    },
    updateResources(changes) {
      return updateResources({
        state: currentState,
        changes,
        options,
        validResourceTypes,
      });
    },
    deleteResources(changes) {
      return deleteResources({
        state: currentState,
        changes,
        options,
        validResourceTypes,
      });
    },
  };
}
