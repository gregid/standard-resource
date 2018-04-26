// Returns `true` if the schema is valid,
// `false` otherwise.
export default function validateSchema(schema = {}) {
  if (schema.idAttribute && typeof schema.idAttribute !== 'string') {
    return false;
  }

  if (schema.computedAttributes) {
    for (let attributeName in schema.computedAttributes) {
      if (typeof schema.computedAttributes[attributeName] !== 'function') {
        return false;
      }
    }
  }

  return true;
}
