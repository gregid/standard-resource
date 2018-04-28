import createSchema from './initialization/create-schema';
import defaultSchema from './initialization/default-schema';
import getResources from './get-resources';
import updateResources from './write/update-resources';
import deleteResources from './write/delete-resources';
import createChanges from './utils/create-changes';
import { warning } from './utils/warning';

export default function createResourceStore(
  schemaInputs = {},
  initialState = {},
  options = {}
) {
  let schemas;

  for (let resourceType in schemaInputs) {
    const schema = schemaInputs[resourceType];

    schemas[resourceType] = createSchema({
      input: schema,
      defaultSchema,
    });
  }

  let currentState = initialState;

  let listeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          `You passed an invalid listener to store.subscribe.` +
            ` Listeners must be functions.`,
          'LISTENER_INVALID_TYPE'
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

  return {
    getState,
    subscribe,
    getResources(resourceType, filter, options) {
      return getResources({
        schemas,
        state: currentState.resourceTypes,
        resourceType,
        filter,
        options,
      });
    },
    updateResources(path, changes) {
      const newState = updateResources({
        schemas,
        state: currentState.resourceTypes,
        changes: createChanges(path, changes),
        options,
      });

      currentState = {
        ...currentState,
        resourceTypes: {
          ...currentState.resourceTypes,
          ...newState,
        },
      };

      onUpdate();
    },
    deleteResources(path, changes) {
      const newState = deleteResources({
        schemas,
        state: currentState.resourceTypes,
        changes: createChanges(path, changes),
        options,
      });

      currentState = {
        ...currentState,
        resourceTypes: {
          ...currentState.resourceTypes,
          ...newState,
        },
      };

      onUpdate();
    },
  };
}
