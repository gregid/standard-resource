import defaultSchema from './utils/default-schema';
import idFromResource from './utils/id-from-resource';
import merge from './utils/merge';
import { exists, isArray, isObject, isNull } from './utils/identification';
import { warning } from './utils/warning';
import createChanges from './utils/create-changes';

// remove({
//   authors: {
//     resources: [],
//     lists: {}
//   },
//   books: {
//     resources: [],
//     lists: {}
//   }
// });

export default function remove({ path, schemas, state, changes }) {
  const newState = merge(state);

  changes = createChanges(path, changes);

  if (!isObject(changes) && process.env.NODE_ENV !== 'production') {
    warning(
      `You called remove with an invalid changes object. Changes must be an Object.`,
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
      if (exists(resourceChange) && !isObject(resourceChange)) {
        warning(
          `You called remove with an invalid update for the` +
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
              `You called remove with an invalid "resources" value for the` +
                ` resource of type "${resourceType}". The "resource" value of an update` +
                ` must be an Object or an array.`,
              'DELETE_RESOURCES_INVALID_RESOURCES',
              'error'
            );
          }
        }

        if (exists(resourceChange.lists)) {
          if (
            !isArray(resourceChange.lists) &&
            !isObject(resourceChange.lists)
          ) {
            warning(
              `You called remove with an invalid "lists" value for the` +
                ` resource of type "${resourceType}". The "lists" value when deleting` +
                ` must be an array or an object.`,
              'DELETE_RESOURCES_INVALID_LISTS',
              'error'
            );
          }
        }
      }
    }

    const listIsArray = isArray(resourceChange.lists);
    const listIsObject = isObject(resourceChange.lists);

    let listsToUse;
    if (listIsArray || listIsObject) {
      listsToUse = resourceChange.lists;
    } else {
      listsToUse = [];
    }

    let listsToDelete = [];
    if (listIsArray) {
      listsToDelete = listsToUse;
    } else if (listIsObject) {
      for (let listName in listsToUse) {
        if (isNull(listsToUse[listName])) {
          listsToDelete.push(listName);
        }
      }
      listsToDelete;
    }

    const naiveResources = resourceChange && resourceChange.resources;
    const schema = schemas[resourceType] || defaultSchema;

    let idList = [];
    if (isArray(naiveResources)) {
      idList = naiveResources.map(resource =>
        idFromResource({ schema, resource })
      );
    }

    const hasIds = idList && idList.length;
    const newResources = merge(currentResourceSection.resources);

    if (hasIds) {
      idList.map(id => {
        delete newResources[id];
      });
    }

    let newLists = {};
    const lists = currentResourceSection.lists;

    // We iterate every existing list
    for (let resourceList in lists) {
      // We only consider the lists that aren't slated to be deleted
      if (!listsToDelete.includes(resourceList)) {
        const existingList = lists[resourceList];
        const thisListFromChange = listIsObject ? listsToUse[resourceList] : [];
        const thisListIsArray = isArray(thisListFromChange);
        newLists[resourceList] = existingList.filter(r => {
          const removedFromStore = idList.includes(r);
          const removeFromThisList =
            thisListIsArray && thisListFromChange.includes(r);
          return !removedFromStore && !removeFromThisList;
        });
      }
    }

    newState[resourceType] = merge(currentResourceSection, {
      resources: newResources,
      lists: newLists,
    });
  }

  return newState;
}
