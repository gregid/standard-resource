import createInitialState from './initialization/create-initial-state';
import getResources from './get-resources';
import updateResources from './write/update-resources';
import deleteResources from './write/delete-resources';
import warning from './utils/warning';

export default function createResourceStore(
  schemas = {},
  initialState = {},
  options = {}
) {
  let currentState = createInitialState(schemas, initialState, options);
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
        state: currentState,
        resourceType,
        filter,
        options,
        schemas,
      });
    },
    updateResources(changes) {
      const newState = updateResources({
        state: currentState,
        changes,
        options,
      });

      currentState = {
        ...currentState,
        ...newState,
      };

      onUpdate();
    },
    deleteResources(changes) {
      const newState = deleteResources({
        state: currentState,
        changes,
        options,
      });

      currentState = {
        ...currentState,
        ...newState,
      };

      onUpdate();
    },
  };
}
