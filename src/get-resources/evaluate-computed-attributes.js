export default function({ resource, schema }) {
  const { computedAttributes } = schema;

  if (!computedAttributes) {
    return {};
  }

  const computed = {};
  for (let attributeName in computedAttributes) {
    computed[attributeName] = computedAttributes[attributeName](resource);
  }

  return computed;
}
