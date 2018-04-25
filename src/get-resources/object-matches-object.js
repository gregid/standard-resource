// Determines if `object` is a subset of `test`
// Similar to _.filter when an object is passed
export default function objectMatchesObject(object, test) {
  if (!(test instanceof Object)) {
    return false;
  }

  for (let key in test) {
    if (object[key] !== test[key]) {
      return false;
    }
  }

  return true;
}
