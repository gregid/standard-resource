import createSchema from './utils/create-schema';
import getList from './get-list';
import getResources from './get-resources';
import read from './read';
import update from './update';
import remove from './remove';
import merge from './utils/merge';
import { isFunction } from './utils/identification';
import { warning } from './utils/warning';

export default function createResourceStore(initialState = {}, options = {}) {
  const schemaInputs = options.schemas;
  let schemas = {};

  for (let resourceType in schemaInputs) {
    const schema = schemaInputs[resourceType];

    schemas[resourceType] = createSchema(schema);
  }

  let currentState = initialState || {};

  let listeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    if (!isFunction(listener)) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          `You passed an invalid listener to store.subscribe.` +
            ` Listeners must be functions.`,
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

  return {
    getState,
    subscribe,
    read(resourceType, filter, options) {
      return read({
        schemas,
        state: currentState.resourceTypes || {},
        resourceType,
        filter,
        options,
      });
    },
    getList(listName, options) {
      return getList({
        listName,
        options,
        state: currentState,
        schemas,
      });
    },
    getResources(resourceType, filter, options) {
      return getResources({
        resourceType,
        filter,
        options,
        state: currentState,
        schemas,
      });
    },
    update(path, changes) {
      const newState = update({
        state: currentState.resourceTypes || {},
        schemas,
        path,
        changes,
        options,
      });

      currentState = merge(currentState, {
        resourceTypes: merge(currentState.resourceTypes, newState),
      });

      onUpdate();
    },
    remove(path, changes) {
      const newState = remove({
        state: currentState.resourceTypes || {},
        schemas,
        path,
        changes,
        options,
      });

      currentState = merge(currentState, {
        resourceTypes: merge(currentState.resourceTypes, newState),
      });

      onUpdate();
    },
  };
}
