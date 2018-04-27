import validateChange from '../validators/validate-change';
import warning from '../diagnostics/warning';

// updateResources({
//   authors: {
//     resources: [],
//     lists: {}
//   },
//   books: {
//     resources: [],
//     lists: {}
//   }
// });

export default function updateResources({
  state,
  changes,
  options,
  validResourceTypes,
}) {
  for (let resourceType in changes) {
    if (
      !validResourceTypes.includes(resourceType) &&
      process.env.NODE_ENV !== 'production'
    ) {
      warning(
        'A resource type was updated without a schema.',
        'UPDATE_MISSING_SCHEMA'
      );
    }

    const change = changes[resourceType];
    const isValidChange = validateChange(change);

    if (isValidChange) {
      // Apply the change...
    }
  }
}
