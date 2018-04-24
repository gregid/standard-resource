import getResources from './get-resources';
import warning from './warning';

export default function createResourceStore(resources, initialState = {}) {
  let currentState = initialState;

  function getState() {
    return currentState;
  }

  function updateResources() {
    warning('updateResources is coming soon.', 'UPDATE_RESOURCES_COMING_SOON');
  }

  return {
    getState,
    getResources(resourceType, filter, options) {
      return getResources(currentState, resourceType, filter, options);
    },
    updateResources,
  };
}
