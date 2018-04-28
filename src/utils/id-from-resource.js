import { warning } from '../utils/warning';

export default function idFromResource({ resource, schema }) {
  if (resource && resource.constructor === Object) {
    const idAttribute = schema.idAttribute;

    const missingAttribute =
      !resource[idAttribute] && resource[idAttribute] !== 0;
    const invalidAttribute =
      !missingAttribute &&
      typeof resource[idAttribute] !== 'string' &&
      typeof resource[idAttribute] !== 'number';

    if (process.env.NODE_ENV !== 'production') {
      if (missingAttribute) {
        warning(
          `An invalid resource object was passed in a list. It is missing an ID`,
          'ID_FROM_RESOURCE_MISSING_ID_IN_OBJECT',
          'error'
        );
      } else if (invalidAttribute) {
        warning(
          `An invalid resource was passed in a list in an object. Resources must have an ID that` +
            ` is either a string or a number`,
          'ID_FROM_RESOURCE_INVALID_ID_OBJECT',
          'error'
        );
      }
    }

    if (missingAttribute || invalidAttribute) {
      return;
    }

    return resource[idAttribute];
  } else {
    if (typeof resource !== 'string' && typeof resource !== 'number') {
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
