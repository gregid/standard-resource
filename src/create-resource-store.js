import createResource from './create-resource';
import createSchema from './utils/create-schema';
import {
  isNull,
  exists,
  isObject,
  isFunction,
  isBoolean,
} from './utils/identification';
import { warning } from './utils/warning';
import objectFromPath from './utils/object-from-path';

export default function createResourceStore(initialState = {}, options = {}) {
  const schemaInputs = options.schemas;
  let schemas = {};

  if (process.env.NODE_ENV !== 'production') {
    if (exists(schemaInputs) && !isObject(schemaInputs)) {
      warning(
        `You passed invalid schemas to createResourceStore. options.schema must be an` +
          ` object. The schemas configuration that you passed has been ignored.`,
        'CREATE_STORE_INVALID_SCHEMAS',
        'error'
      );
    }

    if (
      exists(initialState) &&
      !isObject(initialState) &&
      !isNull(initialState)
    ) {
      warning(
        `You passed an invalid initialState to createResourceStore. The initialState must be an` +
          ` object. The initialState that you passed has been ignored.`,
        'CREATE_STORE_INVALID_INITIAL_STATE',
        'error'
      );
    } else {
      for (let initialStateKey in initialState) {
        if (initialStateKey !== 'resources' && initialStateKey !== 'groups') {
          warning(
            `You passed an invalid initial state value to createResourceStore: ${initialStateKey}.` +
              ` Valid keys of initial state are "resources" and "groups". This value has been ignored.`,
            'CREATE_STORE_INVALID_INITIAL_STATE_KEY',
            'error'
          );
        }
      }
    }
  }

  for (let resourceType in schemaInputs) {
    const schema = schemaInputs[resourceType];

    schemas[resourceType] = createSchema(schema);
  }

  const resourceSections = {};
  function ensureResourceSectionsExist(resources, mapsToInitialState) {
    for (let resourceType in resources) {
      const resourceState = resources[resourceType];

      if (!resourceSections[resourceType]) {
        resourceSections[resourceType] = createResource(
          resourceState,
          mapsToInitialState ? resourceState : {},
          schemas[resourceType]
        );
      }
    }
  }

  if (initialState.resources) {
    ensureResourceSectionsExist(initialState.resources, true);
  }

  let listeners = [];
  function subscribe(listener) {
    if (!isFunction(listener)) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          `You passed an invalid listener to store.subscribe.` +
            ` Groupeners must be functions.`,
          'LISTENER_INVALID_TYPE',
          'error'
        );
      }
    } else {
      listeners.push(listener);
    }

    let subscribed = true;

    return function unsubscribe() {
      if (!subscribed) {
        return;
      }

      subscribed = false;

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function onUpdate() {
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  function updateState() {
    let state = {
      resources: {},
    };

    for (let resourceType in resourceSections) {
      const section = resourceSections[resourceType];
      state.resources[resourceType] = section.getState();
    }

    return state;
  }

  let currentState = updateState();

  return {
    subscribe,
    getState() {
      return currentState;
    },
    getResources(resourceType, filter, options = {}) {
      const resourceSection = resourceSections[resourceType];

      if (!resourceSection) {
        const byId = options.byId;
        if (byId) {
          return {};
        } else {
          return [];
        }
      } else {
        return resourceSection.read(filter, options);
      }
    },

    // TODO: go through and find the things that need to be deleted
    update(path, changes, options) {
      options = options || {};

      changes = objectFromPath(path, changes);

      const resourcesChanges = changes.resources;
      ensureResourceSectionsExist(resourcesChanges);

      let mergeOption;
      if (isBoolean(options.merge)) {
        mergeOption = options.merge;
      } else {
        mergeOption = true;
      }

      for (let resourceType in resourcesChanges) {
        const resourceSection = resourceSections[resourceType];
        const resourceList = resourcesChanges[resourceType];

        resourceSection.upsertResources(resourceList, mergeOption);
      }

      currentState = updateState();
      onUpdate();
      return currentState;
    },
  };
}
