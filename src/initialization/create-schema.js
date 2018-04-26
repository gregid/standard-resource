import warning from '../diagnostics/warning';

export default function createSchema({ input, defaultSchema }) {
  const newSchema = {
    idType: input.idType,
    idAttribute: input.idAttribute,
    relationships: Object.assign({}, input.relationships),
    attributes: Object.assign({}, input.relationships),
    meta: Object.assign({}, input.relationships),
    computedAttributes: {},
  };

  const hasIdType = typeof newSchema.idType !== 'undefined';
  if (hasIdType && typeof newSchema.idType !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `A schema with an invalid idType was passed to createResourceStore.` +
          ` idType must be a function. You should be using the PropTypes library` +
          ` to create the value of your schema's idType. Your input has been ignored` +
          ` and replaced with the default idType.`,
        'TYPE_MISMATCH_ID_TYPE'
      );
    }
  } else if (!hasIdType) {
    newSchema.idType = defaultSchema.idType;
  }

  const hasIdAttribute = typeof newSchema.idAttribute !== 'undefined';
  if (hasIdAttribute && typeof newSchema.idAttribute !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `A schema with an invalid idAttribute was passed to createResourceStore.` +
          ` idAttribute must be specified as a string. Falling back to "${
            defaultSchema.idAttribute
          }" instead.`,
        'TYPE_MISMATCH_ID_ATTRIBUTE'
      );
    }

    newSchema.idAttribute = defaultSchema.idAttribute;
  } else if (!hasIdAttribute) {
    newSchema.idAttribute = defaultSchema.idAttribute;
  }

  newSchema.computedAttributes = {};
  if (input.computedAttributes) {
    for (let attributeName in input.computedAttributes) {
      if (typeof input.computedAttributes[attributeName] !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
          warning(
            `A schema with an invalid computedAttribute was passed to createResourceStore.` +
              ` computedAttributes must be functions. Ignoring the "${attributeName}" computedAttribute.`,
            'TYPE_MISMATCH_ID_ATTRIBUTE'
          );
        }
      } else {
        newSchema.computedAttributes[attributeName] =
          input.computedAttributes[attributeName];
      }
    }
  }
}
