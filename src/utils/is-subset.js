export default function isSubset(object, test) {
  // Handles primitives and exact object matches
  if (object === test) {
    return true;
  }

  // We can only handle comparing "regular" objects and
  // arrays; everything else is considered not equal.
  else if (
    (object.constructor === Object || Array.isArray(object)) &&
    (test.constructor === Object || Array.isArray(test))
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
