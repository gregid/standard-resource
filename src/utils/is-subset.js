import { isObject, isArray } from './identification';

export default function isSubset(object, test) {
  // Handles primitives and exact object matches
  if (object === test) {
    return true;
  }

  // We can only handle comparing "regular" objects and
  // arrays; everything else is considered not equal.
  else if (
    (isObject(object) || isArray(object)) &&
    (isObject(test) || isArray(test))
  ) {
    for (var prop in test) {
      if (object.hasOwnProperty(prop)) {
        if (!isSubset(object[prop], test[prop])) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}
