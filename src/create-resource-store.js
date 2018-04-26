import getResources from './get-resources';
import createInitialState from './create-initial-state';
import warning from './diagnostics/warning';

export default function createResourceStore(
  schemas = {},
  initialState = {},
  options = {}
) {
  let currentState = createInitialState(schemas, initialState, options);

  const validResources = Object.keys(schemas || {});

  function getState() {
    return currentState;
  }

  function updateResources() {
    warning('updateResources is coming soon.', 'UPDATE_RESOURCES_COMING_SOON');
  }

  return {
    getState,
    getResources(resourceType, filter, options) {
      return getResources({
        state: currentState,
        resourceType,
        filter,
        options,
        validResources,
        schemas,
      });
    },
    updateResources,
  };
}
