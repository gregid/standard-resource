import { isNull, isUndefined } from '../utils/identification';

export default function write(internalStore, path, update) {
  let newState;

  // When null is passed, then this entire slice is being deleted.
  if (isNull(path) && isUndefined(update)) {
    newState = {
      resources: {},
    };
  }

  const didChange = !isUndefined(newState);

  if (didChange) {
    internalStore.state = {
      ...internalStore.state,
      ...newState,
    };
  }

  return {
    // The summary includes information that other features of Standard Resource might be
    // interested in using to update their sections of the state, such as resources that were
    // removed.
    summary: {},
    // If the `newState` was never defined, then nothing was updated. Such a
    // situation is a noop, so we return the old state.
    newState: didChange ? newState : internalStore.state,
  };
}
