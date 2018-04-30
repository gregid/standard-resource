import { isString, isNumber, isObject, exists } from './identification';
import { warning } from './warning';

export default function idFromResource({ resource, schema }) {
  if (resource && isObject(resource)) {
    const idProperty = schema.idProperty;

    const missingAttribute = !exists(resource[idProperty]);
    const invalidProperty =
      !missingAttribute &&
      !isString(resource[idProperty]) &&
      !isNumber(resource[idProperty]);

    if (process.env.NODE_ENV !== 'production') {
      if (missingAttribute) {
        warning(
          `An invalid resource object was passed in a list. It is missing an ID`,
          'ID_FROM_RESOURCE_MISSING_ID_IN_OBJECT',
          'error'
        );
      } else if (invalidProperty) {
        warning(
          `An invalid resource was passed in a list in an object. Resources must have an ID that` +
            ` is either a string or a number`,
          'ID_FROM_RESOURCE_INVALID_ID_OBJECT',
          'error'
        );
      }
    }

    if (missingAttribute || invalidProperty) {
      return;
    }

    return resource[idProperty];
  } else {
    if (!isString(resource) && !isNumber(resource)) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          `An invalid resource ID was passed in a list. IDs must be strings or numbers.`,
          'ID_FROM_RESOURCE_INVALID_ID',
          'error'
        );
      }

      return;
    }
    return resource;
  }
}
