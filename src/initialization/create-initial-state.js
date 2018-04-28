import createSchema from './create-schema';
import defaultSchema from './default-schema';
import warning from '../utils/warning';

export default function createInitialState(schemas, initialState, options) {
  const { strict } = options;

  const state = {
    resourceTypes: {},
  };

  for (let resourceType in schemas) {
    const schema = schemas[resourceType];

    state.resourceTypes[resourceType] = initialState[resourceType] || {
      resourceType,
    };
    state.resourceTypes[resourceType].schema = createSchema({
      input: schema,
      defaultSchema,
    });
  }

  for (let resourceType in initialState) {
    state.resourceTypes[resourceType] = initialState[resourceType] || {};

    if (!state.resourceTypes[resourceType].schema) {
      state.resourceTypes[resourceType].schema = defaultSchema;
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

  return state;
}
