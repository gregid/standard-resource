const deepAttributes = ['computedAttributes', 'attributes', 'meta'];

// Determines if `object` is a subset of `test`
// Similar to _.filter when an object is passed
export default function objectMatchesObject(object, test) {
  if (!(test instanceof Object) || !(object instanceof Object)) {
    return false;
  }

  for (let key in test) {
    // Check "deep" attributes
    if (deepAttributes.includes(key)) {
      for (let deepKey in test[key]) {
        if (object[key][deepKey] !== test[key][deepKey]) {
          return false;
        }
      }
    }
    // Or shallow ones
    else {
      if (object[key] !== test[key]) {
        return false;
      }
    }
  }

  return true;
}
