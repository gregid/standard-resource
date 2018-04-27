// Ensures that
export default function objectHasKeys(test, keys) {
  const allKeys = keys && keys.length;

  if (!allKeys || !test) {
    return true;
  }

  let match = 0;
  let mismatch = 0;

  for (let attribute in test) {
    if (keys.indexOf(attribute) !== -1) {
      match++;
    } else {
      mismatch++;
    }
  }

  return match === allKeys && !mismatch;
}
