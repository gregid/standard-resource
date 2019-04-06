import { isNil, isString, isObject, isArray } from '../utils/identification';
import upsertResources from './upsert-resources';
import deleteResources from './delete-resources';
import { warning } from '../utils/warning';

export default function createResource(resourceType, initialState = {}) {
  if (process.env.NODE_ENV !== 'production') {
    if (!isString(resourceType)) {
      warning(
        `You must pass a string as the first argument to createResource.`,
        'CREATE_RESOURCE_INVALID_RESOURCE_NAME',
        'error'
      );
    }
  }

  const initialResources = isObject(initialState.resources)
    ? initialState.resources
    : {};

  const internalStore = {
    state: {
      resourceType,
      resources: initialResources,
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

    upsertResources(resourceList, mergeResources) {
      if (!isArray(resourceList) || resourceList.length === 0) {
        return internalStore.state.resources;
      } else {
        const newResources = upsertResources(
          internalStore.state.resources,
          resourceType,
          resourceList,
          mergeResources
        );

        if (newResources !== internalStore.state.resources) {
          internalStore.state = {
            ...internalStore.state,
            resources: newResources,
          };
        }

        return internalStore.state.resources;
      }
    },

    deleteResources(resourceList) {
      if (!isArray(resourceList) || resourceList.length === 0) {
        return internalStore.state.resources;
      } else {
        const newResources = deleteResources(
          internalStore.state.resources,
          resourceList
        );

        if (newResources !== internalStore.state.resources) {
          internalStore.state = {
            ...internalStore.state,
            resources: newResources,
          };
        }

        return internalStore.state.resources;
      }
    },

    resetState() {
      internalStore.state = {
        resourceType,
        resources: {},
      };

      return internalStore.state;
    },
  };
}
