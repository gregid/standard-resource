import { exists, isFunction, isString, isObject } from './identification';
import { warning } from './warning';
import defaultSchema from './default-schema';

export default function createSchema(schema) {
  const newSchema = {
    idType: schema.idType,
    idProperty: schema.idProperty,
    attributes: {},
    meta: {},
    computedAttributes: {},
  };

  const hasIdType = exists(newSchema.idType);
  const invalidIdType = hasIdType && !isFunction(newSchema.idType);

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

  const hasidProperty = exists(newSchema.idProperty);
  const invalididProperty = hasidProperty && !isString(newSchema.idProperty);

  if (invalididProperty && process.env.NODE_ENV !== 'production') {
    warning(
      `A schema with an invalid idProperty was passed to createResourceStore.` +
        ` idProperty must be specified as a string. Falling back to "${
          defaultSchema.idProperty
        }" instead.`,
      'TYPE_MISMATCH_ID_ATTRIBUTE',
      'error'
    );
  }

  if (!hasidProperty || invalididProperty) {
    newSchema.idProperty = defaultSchema.idProperty;
  }

  newSchema.computedAttributes = {};

  const hasComputedAttributes = exists(schema.computedAttributes);

  if (
    hasComputedAttributes &&
    !isObject(schema.computedAttributes) &&
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
      if (!isFunction(schema.computedAttributes[attributeName])) {
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

  const hasAttributes = exists(schema.attributes);

  if (
    hasAttributes &&
    !isObject(schema.attributes) &&
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
      if (!isFunction(schema.attributes[attributeName])) {
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

  const hasMeta = exists(schema.meta);

  if (
    hasMeta &&
    !isObject(schema.meta) &&
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
      if (!isFunction(schema.meta[attributeName])) {
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
