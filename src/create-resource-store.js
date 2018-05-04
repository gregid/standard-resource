import createSchema from './utils/create-schema';
import getList from './get-list';
import getResources from './get-resources';
import update from './update';
import remove from './remove';
import { isFunction } from './utils/identification';
import { warning } from './utils/warning';

export default function createResourceStore(initialState = {}, options = {}) {
  const schemaInputs = options.schemas;
  let schemas = {};

  for (let resourceType in schemaInputs) {
    const schema = schemaInputs[resourceType];

    schemas[resourceType] = createSchema(schema);
  }

  // TEST: make sure that invalid initial states are warn'd
  let currentState = {
    resources: initialState ? initialState.resources : {},
    lists: initialState ? initialState.lists : {},
  };

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
      currentState = update({
        state: currentState,
        schemas,
        path,
        changes,
        options,
      });

      onUpdate();
    },
    remove(path, changes) {
      currentState = remove({
        state: currentState,
        schemas,
        path,
        changes,
      });

      onUpdate();
    },
  };
}
