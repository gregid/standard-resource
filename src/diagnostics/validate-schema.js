// Returns `true` if the schema is valid,
// `false` otherwise.
export default function validateSchema(schema = {}) {
  if (schema.idAttribute && typeof schema.idAttribute !== 'string') {
    return false;
  }

  return true;
}
