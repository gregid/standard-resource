import { warning } from './warning';
import defaultSchema from './default-schema';

export default function createSchema(schema) {
  const newSchema = {
    idType: schema.idType,
    idAttribute: schema.idAttribute,
    relationships: Object.assign({}, schema.relationships),
    attributes: {},
    meta: {},
    computedAttributes: {},
  };

  const hasIdType = typeof newSchema.idType !== 'undefined';
  const invalidIdType = hasIdType && typeof newSchema.idType !== 'function';

  if (invalidIdType && process.env.NODE_ENV !== 'production') {
    warning(
      `A schema with an invalid idType was passed to createResourceStore.` +
        ` idType must be a function. You should be using the PropTypes library` +
        ` to create the value of your schema's idType. Your input has been ignored` +
        ` and replaced with the default idType.`,
      'TYPE_MISMATCH_ID_TYPE',
      'error'
    );
  }

  if (!hasIdType || invalidIdType) {
    newSchema.idType = defaultSchema.idType;
  }

  const hasIdAttribute = typeof newSchema.idAttribute !== 'undefined';
  const invalidIdAttribute =
    hasIdAttribute && typeof newSchema.idAttribute !== 'string';

  if (invalidIdAttribute && process.env.NODE_ENV !== 'production') {
    warning(
      `A schema with an invalid idAttribute was passed to createResourceStore.` +
        ` idAttribute must be specified as a string. Falling back to "${
          defaultSchema.idAttribute
        }" instead.`,
      'TYPE_MISMATCH_ID_ATTRIBUTE',
      'error'
    );
  }

  if (!hasIdAttribute || invalidIdAttribute) {
    newSchema.idAttribute = defaultSchema.idAttribute;
  }

  newSchema.computedAttributes = {};

  const hasComputedAttributes =
    typeof schema.computedAttributes !== 'undefined';

  if (
    hasComputedAttributes &&
    schema.computedAttributes.constructor !== Object &&
    process.env.NODE_ENV !== 'production'
  ) {
    warning(
      `A schema with an invalid computedAttributes was passed to createResourceStore.` +
        ` computedAttributes must be an Object. The computedAttributes have been ignored.`,
      'TYPE_MISMATCH_COMPUTED_ATTRIBUTES',
      'error'
    );
  }

  if (hasComputedAttributes) {
    for (let attributeName in schema.computedAttributes) {
      if (typeof schema.computedAttributes[attributeName] !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
          warning(
            `A schema with an invalid computed attribute was passed to createResourceStore.` +
              ` computedAttributes must be functions. Ignoring the "${attributeName}" computedAttribute.`,
            'TYPE_MISMATCH_COMPUTED_ATTR',
            'error'
          );
        }
      } else {
        newSchema.computedAttributes[attributeName] =
          schema.computedAttributes[attributeName];
      }
    }
  }

  const hasAttributes = typeof schema.attributes !== 'undefined';

  if (
    hasAttributes &&
    schema.attributes.constructor !== Object &&
    process.env.NODE_ENV !== 'production'
  ) {
    warning(
      `A schema with an invalid attributes was passed to createResourceStore.` +
        ` attributes must be an Object. The attributes have been ignored.`,
      'TYPE_MISMATCH_ATTRIBUTES',
      'error'
    );
  }

  if (hasAttributes) {
    for (let attributeName in schema.attributes) {
      if (typeof schema.attributes[attributeName] !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
          warning(
            `A schema with an invalid attribute was passed to createResourceStore.` +
              ` Each attribute must be functions. Ignoring the "${attributeName}" computedAttribute.`,
            'TYPE_MISMATCH_ATTR',
            'error'
          );
        }
      } else {
        newSchema.attributes[attributeName] = schema.attributes[attributeName];
      }
    }
  }

  const hasMeta = typeof schema.meta !== 'undefined';

  if (
    hasMeta &&
    schema.meta.constructor !== Object &&
    process.env.NODE_ENV !== 'production'
  ) {
    warning(
      `A schema with an invalid meta was passed to createResourceStore.` +
        ` meta must be an Object. The meta have been ignored.`,
      'TYPE_MISMATCH_META',
      'error'
    );
  }

  if (hasMeta) {
    for (let attributeName in schema.meta) {
      if (typeof schema.meta[attributeName] !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
          warning(
            `A schema with an invalid meta was passed to createResourceStore.` +
              ` Each meta must be a function. Ignoring the "${attributeName}" computedAttribute.`,
            'TYPE_MISMATCH_META_ATTRIBUTE',
            'error'
          );
        }
      } else {
        newSchema.meta[attributeName] = schema.meta[attributeName];
      }
    }
  }

  return newSchema;
}
