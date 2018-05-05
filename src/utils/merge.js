import { isObject } from './identification';

export default function merge(x, y, deep = false) {
  if (!deep) {
    return Object.assign({}, x, y);
  }

  // Start off by making a clone of `y`.
  let output = Object.assign({}, y);

  // We can only deep merge when both x and y are objects
  if (isObject(y) && isObject(x)) {
    // Loop through every key of x, and merge it with the y key.
    Object.keys(x).forEach(key => {
      // If the value is an object, then we either deep merge it with the
      // existing value, or we simply set it if it does not previously exist
      if (isObject(x[key])) {
        output[key] = !(key in y) ? x[key] : merge(y[key], x[key], true);
      }

      // If it is not an object, then there is nothing to deep merge, so we just set it.
      else {
        output[key] = x[key];
      }
    });
  }

  return output;
}
