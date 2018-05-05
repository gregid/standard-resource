import defaultSchema from './utils/default-schema';
import idFromResource from './utils/id-from-resource';
import merge from './utils/merge';
import { isArray, isObject, isNull } from './utils/identification';
import objectFromPath from './utils/object-from-path';
import { warning } from './utils/warning';

// remove({
//   lists: {} / [],
//   resources: {
//     authors: {} / [],
//     books: {} / []
//   }
// });

export default function remove({ path, schemas, state, changes }) {
  changes = objectFromPath(path, changes);

  const resourcesChanges = changes.resources;
  const listsChanges = changes.lists;
  const newResources = merge(state.resources);

  if (process.env.NODE_ENV !== 'production') {
    if (isNull(listsChanges)) {
      warning(
        `You passed 'null' as the value to lists when calling` +
          ` store.remove(). This is not a valid input. It is not possible to` +
          ` remove every list. No lists have been changed as a result of this action.`,
        'REMOVE_LISTS_IS_NULL',
        'error'
      );
    }

    if (isNull(resourcesChanges)) {
      warning(
        `You passed 'null' as the value to resources when calling` +
          ` store.remove(). This is not a valid input. It is not possible to` +
          ` remove every resource of every type. The resources have not been` +
          ` changed as a result of this action.`,
        'REMOVE_RESOURCES_IS_NULL',
        'error'
      );
    }
  }

  const resourcesDeletedByType = {};

  for (let resourceType in resourcesChanges) {
    const currentResourceSection = newResources[resourceType];

    if (!currentResourceSection) {
      continue;
    }

    let newResourceSection;

    resourcesDeletedByType[resourceType] = {};

    const resourceChange = resourcesChanges[resourceType];
    const schema = schemas[resourceType] || defaultSchema;

    const deletingEntireSection = isNull(resourceChange);

    let idList = [];

    if (isArray(resourceChange)) {
      idList = resourceChange.map(resource => {
        const id = idFromResource({ schema, resource });

        resourcesDeletedByType[resourceType][id] = true;

        return id;
      });
    } else if (deletingEntireSection) {
      newResourceSection = {};
      // This represents that every resource of this type has been deleted
      resourcesDeletedByType[resourceType] = true;
    }

    const hasIds = idList && idList.length;

    if (hasIds) {
      newResourceSection = merge(currentResourceSection);

      idList.map(id => {
        delete newResourceSection[id];
      });
    }

    newResources[resourceType] = newResourceSection;
  }

  const listIsArray = isArray(listsChanges);
  const listIsObject = isObject(listsChanges);

  let listsToUse;
  if (listIsArray || listIsObject) {
    listsToUse = listsChanges;
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

  const newLists = {};

  // We iterate every existing list
  for (let resourceList in state.lists) {
    // We only consider the lists that aren't slated to be deleted
    if (!listsToDelete.includes(resourceList)) {
      const existingList = state.lists[resourceList];
      const thisListFromChange = listIsObject ? listsToUse[resourceList] : [];
      const thisListIsArray = isArray(thisListFromChange);

      newLists[resourceList] = existingList.filter(resourcePointer => {
        const schema = schemas[resourcePointer.resourceType] || defaultSchema;
        const deletedType =
          resourcesDeletedByType[resourcePointer.resourceType] || {};
        const removedFromStore =
          // This represents that this entire resource section was deleted
          deletedType === true ||
          // This represents that just this one resource within the type was deleted
          deletedType[resourcePointer[schema.idProperty]];

        const removeFromThisList =
          thisListIsArray &&
          thisListFromChange.find(resource => {
            return (
              resource[schema.idProperty] ===
                resourcePointer[schema.idProperty] &&
              resource.resourceType === resourcePointer.resourceType
            );
          });

        return !removedFromStore && !removeFromThisList;
      });
    }
  }

  return merge(state, {
    resources: newResources,
    lists: newLists,
  });
}
