import defaultSchema from '../utils/default-schema';
import idFromResource from '../utils/id-from-resource';
import { exists, isArray, isObject } from '../utils/identification';
import { warning } from '../utils/warning';
import createChanges from '../utils/create-changes';

// deleteResources({
//   authors: {
//     resources: [],
//     lists: {}
//   },
//   books: {
//     resources: [],
//     lists: {}
//   }
// });

export default function deleteResources({ path, schemas, state, changes }) {
  const newState = {
    ...state,
  };

  changes = createChanges(path, changes);

  if (!isObject(changes) && process.env.NODE_ENV !== 'production') {
    warning(
      `You called deleteResources with an invalid changes object. Changes must be an Object.`,
      'DELETE_RESOURCES_INVALID_CHANGES_OBJECT',
      'error'
    );
  }

  for (let resourceType in changes) {
    const resourceChange = changes[resourceType];
    const currentResourceSection = state[resourceType];

    if (!currentResourceSection) {
      continue;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (resourceChange && resourceChange.constructor !== Object) {
        warning(
          `You called deleteResources with an invalid update for the` +
            ` resource of type "${resourceType}". Updates must be an Object.`,
          'DELETE_RESOURCES_INVALID_TYPE',
          'error'
        );
      } else {
        if (exists(resourceChange.resources)) {
          if (
            !isObject(resourceChange.resources) &&
            !isArray(resourceChange.resources)
          ) {
            warning(
              `You called deleteResources with an invalid "resources" value for the` +
                ` resource of type "${resourceType}". The "resource" value of an update` +
                ` must be an Object or an array.`,
              'DELETE_RESOURCES_INVALID_RESOURCES',
              'error'
            );
          }
        }

        if (exists(resourceChange.lists)) {
          if (!isArray(resourceChange.lists)) {
            warning(
              `You called deleteResources with an invalid "lists" value for the` +
                ` resource of type "${resourceType}". The "lists" value when deleting` +
                ` must be an Array of list names to be deleted.`,
              'DELETE_RESOURCES_INVALID_LISTS',
              'error'
            );
          }
        }
      }
    }

    const hasList = resourceChange && isArray(resourceChange.lists);

    const naiveResources = resourceChange && resourceChange.resources;
    const naiveLists = hasList ? resourceChange.lists : [];
    const schema = schemas[resourceType] || defaultSchema;

    let idList = [];
    if (isArray(naiveResources)) {
      idList = naiveResources.map(resource =>
        idFromResource({ schema, resource })
      );
    }

    const hasIds = idList && idList.length;
    const newResources = Object.assign({}, currentResourceSection.resources);

    if (hasIds) {
      idList.map(id => {
        delete newResources[id];
      });
    }

    const newLists = {};
    const lists = currentResourceSection.lists;

    // We iterate every existing list
    for (let resourceList in lists) {
      // We only consider the lists that aren't slated to be deleted
      if (!naiveLists.includes(resourceList)) {
        const existingList = lists[resourceList];
        newLists[resourceList] = existingList.filter(r => !idList.includes(r));
      }
    }

    newState[resourceType] = {
      ...currentResourceSection,
      resources: newResources,
      lists: newLists,
    };
  }

  return newState;
}
