import getResources from './get-resources';
import warning from './warning';

export default function createResourceStore(
  resourceDefinitions,
  initialState = {}
) {
  let currentState = initialState;

  // TODO: warn if resourceDefinitions is invalid

  const validResources = Object.keys(resourceDefinitions || {});

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
        resourceDefinitions,
      });
    },
    updateResources,
  };
}
