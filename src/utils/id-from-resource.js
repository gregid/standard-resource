import { warning } from '../utils/warning';

export default function idFromResource({ resource, schema }) {
  if (typeof resource === 'object') {
    const idAttribute = schema.idAttribute;
    if (process.env.NODE_ENV !== 'production') {
      if (
        (!resource[idAttribute] && resource[idAttribute] !== 0) ||
        (typeof resource[idAttribute] !== 'string' &&
          typeof resource[idAttribute] !== 'number')
      ) {
        warning(
          `An invalid resource was passed to deleteResources.`,
          'NO_RESOURCE_ID'
        );
      }
    }
    return resource[idAttribute];
  } else {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof resource !== 'string' && typeof resource !== 'number') {
        warning(
          `An invalid resource was passed to deleteResources.`,
          'NO_RESOURCE_ID'
        );
      }
    }
    return resource;
  }
}
