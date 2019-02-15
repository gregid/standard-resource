import { isNil, isNull, isUndefined } from './utils/identification';

export default function createResource(resourceName) {
  // This is an object in the event that we want to attach more
  // things here in the future.
  // For now, though, it's just the resources.
  const state = {
    resources: {}
  };

  return {
    read(filter) {
      if (isNil(filter)) {
        return state.resources;
      } else {
        // Complex filtering logic, or whatever
      }
    },

    // TODO: when, say, the entire slice is deleted, how do we communicate that
    // back out for other things to be updated? Perhaps an update summary is returned?
    write(path, update) {
      let newState;

      // When null is passed, then this entire slice is being deleted.
      if (isNull(path) && isUndefined(update)) {
        newState = {
          resources: {}
        };
      }

      return {
        // The summary includes information that other features of Standard Resource might be
        // interested in using to update their sections of the state, such as resources that were
        // removed.
        summary: {

        },
        // If the `newState` was never defined, then nothing was updated. Such a
      // situation is a noop, so we return the old state.
        newState: newState || state
      };
    }
  };
}