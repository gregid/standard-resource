import idFromResource from './utils/id-from-resource';
import defaultSchema from './utils/default-schema';
import validateResource from './utils/validate-resource';
import objectFromPath from './utils/object-from-path';
import createResource from './utils/create-resource';
import getGlobalId from './utils/get-global-id';
import { exists, isObject, isArray, isBoolean } from './utils/identification';
import merge from './utils/merge';
import { warning } from './utils/warning';

// update({
//   lists: {},
//   resources: {
//     authors: {},
//     books: {}
//   }
// });

export default function update({ path, schemas, state, changes, options }) {
  options = options || {};
  const { concatLists } = options;

  changes = objectFromPath(path, changes);

  const resourcesChanges = changes.resources;
  const listsChanges = changes.lists;
  const newResources = merge(state.resources);

  let mergeOption;
  if (isBoolean(options.merge)) {
    mergeOption = options.merge;
  } else {
    mergeOption = true;
  }

  for (let resourceType in resourcesChanges) {
    const resourceChange = resourcesChanges[resourceType];

    if (!newResources[resourceType]) {
      newResources[resourceType] = {};
    }

    const currentResourceSection = newResources[resourceType];

    const schema = schemas[resourceType] || defaultSchema;
    const idProperty = schema.idProperty;

    if (isArray(resourceChange)) {
      resourceChange.forEach(resource => {
        const resourceIsObject = isObject(resource);
        const id = resourceIsObject ? resource[idProperty] : resource;

        // If a resource doesn't have an ID, then it cannot be tracked
        if (!id && id !== 0) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              `You attempted to update or add a resource without an ID attribute. ` +
                `Standard Resource requires that all resources have an ID.`,
              'MISSING_ID_UPSERT',
              'error'
            );
          }

          return;
        }

        const resourceToInsert = createResource({
          input: resource,
          existing: currentResourceSection[id],
          resourceType,
          schema,
          mergeResource: mergeOption,
        });

        if (process.env.NODE_ENV !== 'production') {
          validateResource({ resource: resourceToInsert, schema });
        }

        currentResourceSection[id] = resourceToInsert;
      });
    } else {
      for (let id in resourceChange) {
        const resource = resourceChange[id];

        const resourceAlreadyExists = Boolean(
          currentResourceSection && currentResourceSection[id]
        );
        // If there is no existing resource, we just add it to the resources object
        if (!resourceAlreadyExists) {
          currentResourceSection[id] = merge(resource, {
            resourceType,
          });
          continue;
        }

        const resourceToInsert = createResource({
          input: resource,
          existing: currentResourceSection[id],
          resourceType,
          schema,
          mergeResource: mergeOption,
        });

        if (process.env.NODE_ENV !== 'production') {
          validateResource({ resource: resourceToInsert, schema });
        }

        currentResourceSection[id] = resourceToInsert;
      }
    }
  }

  const newLists = merge(state.lists);

  for (let listName in listsChanges) {
    const pointersInList = {};
    const resourcePointers = [];

    const listChanges = listsChanges[listName];

    listChanges.forEach(resource => {
      if (!exists(resource)) {
        return;
      }

      const resourceType = resource.resourceType;
      const schema = schemas[resourceType] || defaultSchema;
      const id = idFromResource({ resource: resource, schema });
      const hasId = exists(id);

      if (hasId) {
        const globalIdentifier = getGlobalId({
          id,
          resourceType,
        });

        if (!pointersInList[globalIdentifier]) {
          resourcePointers.push({
            [schema.idProperty]: id,
            resourceType,
          });

          if (!newResources[resourceType]) {
            newResources[resourceType] = {};
          }

          const resourceSection = newResources[resourceType];

          // This allows you to add a resource by specifying it in
          // a list.
          if (!resourceSection[id]) {
            resourceSection[id] = createResource({
              input: resource,
              resourceType,
              schema,
            });
          }

          pointersInList[globalIdentifier] = true;
        }
      }
    });

    if (concatLists) {
      const currentList = newLists[listName] || [];
      if (currentList.length === 0) {
        // These need to be deduped!
        newLists[listName] = resourcePointers;
      } else {
        // Only add IDs that don't already exist in the list
        resourcePointers.forEach(resourcePointer => {
          const schema = schemas[resourcePointer.resourceType] || defaultSchema;
          const idProperty = schema.idProperty;

          const pointerAlreadyInList = newLists[listName].find(pointer => {
            return (
              pointer.resourceType === resourcePointer.resourceType &&
              pointer[idProperty] === resourcePointer[idProperty]
            );
          });

          if (!pointerAlreadyInList) {
            newLists[listName].push(resourcePointer);
          }
        });
      }
    } else {
      newLists[listName] = resourcePointers;
    }
  }

  return merge(state, {
    resources: newResources,
    lists: newLists,
  });
}
