import createSchema from './create-schema';
import defaultSchema from './default-schema';
import warning from '../utils/warning';

export default function createInitialState(schemas, initialState, options) {
  const { strict } = options;

  for (let resourceType in schemas) {
    const schema = schemas[resourceType];

    initialState[resourceType] = initialState[resourceType] || {};
    initialState[resourceType].schema = createSchema({
      input: schema,
      defaultSchema,
    });
  }

  for (let resourceType in initialState) {
    if (!initialState[resourceType].schema) {
      initialState[resourceType].schema = defaultSchema;
    }
  }

  if (strict && process.env.NODE_ENV !== 'production') {
    for (let resourceType in initialState) {
      if (!schemas[resourceType]) {
        warning(
          `Strict mode: a resource type was included in the` +
            ` initial state that was missing a schema.`,
          'INVALID_SCHEMA'
        );
      }
    }
  }

  return initialState;
}
