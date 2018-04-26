import warning from './warning';

export default function validateChange({ change = {} }) {
  if (change instanceof Array) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `A change was submitted that was an array. An object is required`,
        'ARRAY_CHANGE'
      );
    }

    return false;
  } else if (typeof change !== 'object') {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `A change was submitted that was not an object. An object is required`,
        'NON_OBJECT_CHANGE'
      );
    }
  }

  const hasResources = typeof change.resources !== 'undefined';
  const hasLists = typeof change.lists !== 'undefined';

  if (hasResources) {
    if (
      !Array.isArray(change.resources) ||
      change.resources.constructor !== Object
    ) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          `A change.resources was passed that was not an array or an object`,
          'NON_OBJECT_CHANGE'
        );
      }

      return false;
    }
  }

  if (hasLists) {
    if (change.lists.constructor !== Object) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          `A change.lists was passed that was not an object`,
          'NON_OBJECT_CHANGE'
        );
      }

      return false;
    }
  }

  return true;
}
