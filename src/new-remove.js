import defaultSchema from './utils/default-schema';
import idFromResource from './utils/id-from-resource';
import merge from './utils/merge';
import { isArray, isObject, isNull } from './utils/identification';
import { warning } from './utils/warning';
import createChanges from './utils/create-changes';

// remove({
//   lists: {} / [],
//   resources: {
//     authors: {} / [],
//     books: {} / []
//   }
// });

export default function remove({ path, schemas, state, changes }) {
  changes = createChanges(path, changes);

  if (!isObject(changes) && process.env.NODE_ENV !== 'production') {
    warning(
      `You called remove with an invalid changes object. Changes must be an Object.`,
      'DELETE_RESOURCES_INVALID_CHANGES_OBJECT',
      'error'
    );
  }

  const resourcesChanges = changes.resources;
  const listsChanges = changes.lists;
  const newResources = merge(state.resources);

  const resourcesDeletedByType = {};

  for (let resourceType in resourcesChanges) {
    const currentResourceSection = newResources[resourceType];

    if (!currentResourceSection) {
      continue;
    }

    resourcesDeletedByType[resourceType] = {};

    const resourceChange = resourcesChanges[resourceType];
    const schema = schemas[resourceType] || defaultSchema;

    let idList = [];

    if (isArray(resourceChange)) {
      idList = resourceChange.map(resource => {
        const id = idFromResource({ schema, resource });

        resourcesDeletedByType[resourceType][id] = true;

        return id;
      });
    }

    const hasIds = idList && idList.length;
    const newResourceSection = merge(currentResourceSection);

    if (hasIds) {
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
