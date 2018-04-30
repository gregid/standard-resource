import idFromResource from './utils/id-from-resource';
import defaultSchema from './utils/default-schema';
import validateResource from './utils/validate-resource';
import createChanges from './utils/create-changes';
import createResource from './utils/create-resource';
import { exists, isObject, isArray, isBoolean } from './utils/identification';
import merge from './utils/merge';
import { warning } from './utils/warning';

// update({
//   authors: {
//     resources: [],
//     lists: {},
//     mergeResources: true,
//     concatLists: false
//   },
//   books: {
//     resources: [],
//     lists: {},
//     mergeResources: false
//   }
// });

export default function update({ path, schemas, state, changes }) {
  const newState = merge(state);

  changes = createChanges(path, changes);

  if (changes && !isObject(changes) && process.env.NODE_ENV !== 'production') {
    warning(
      `You called update with an invalid changes object. Changes must be an Object.`,
      'UPDATE_RESOURCES_INVALID_CHANGES_OBJECT',
      'error'
    );
  }

  for (let resourceType in changes) {
    const resourceChange = changes[resourceType];
    const currentResourceSection = state[resourceType] || { resourceType };

    if (process.env.NODE_ENV !== 'production') {
      if (exists(resourceChange) && !isObject(resourceChange)) {
        warning(
          `You called update with an invalid update for the` +
            ` resource of type "${resourceType}". Updates must be an Object.`,
          'UPDATE_RESOURCES_INVALID_TYPE',
          'error'
        );
      } else {
        if (exists(resourceChange.resources)) {
          const resourcesIsObject = isObject(resourceChange.resources);
          const resourcesIsArray = isArray(resourceChange.resources);

          if (!resourcesIsObject && !resourcesIsArray) {
            warning(
              `You called update with an invalid "resources" value for the` +
                ` resource of type "${resourceType}". The "resource" value of an update` +
                ` must be an Object or an array.`,
              'UPDATE_RESOURCES_INVALID_RESOURCES',
              'error'
            );
          }
        }

        if (exists(resourceChange.lists)) {
          const listIsObject = isObject(resourceChange.lists);

          if (!listIsObject) {
            warning(
              `You called update with an invalid "lists" value for the` +
                ` resource of type "${resourceType}". The "lists" value when updating` +
                ` must be an Object of new lists.`,
              'UPDATE_RESOURCES_INVALID_LISTS',
              'error'
            );
          }
        }
      }
    }

    const naiveResources = resourceChange && resourceChange.resources;
    const naiveLists = (resourceChange && resourceChange.lists) || [];
    const schema = schemas[resourceType] || defaultSchema;
    const idProperty = schema.idProperty;
    const concatLists =
      resourceChange && isBoolean(resourceChange.concatLists)
        ? resourceChange.concatLists
        : false;

    let mergeResources;
    if (isBoolean(resourceChange.mergeResources)) {
      mergeResources = resourceChange.mergeResources;
    } else {
      mergeResources = true;
    }

    let newResources = merge(currentResourceSection.resources);

    if (isArray(naiveResources)) {
      naiveResources.forEach(resource => {
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
          existing: newResources[id],
          resourceType,
          schema,
          mergeResource: mergeResources,
        });

        if (process.env.NODE_ENV !== 'production') {
          validateResource({ resource: resourceToInsert, schema });
        }

        newResources[id] = resourceToInsert;
      });
    } else {
      for (let id in naiveResources) {
        const resource = naiveResources[id];

        const resourceAlreadyExists = Boolean(
          currentResourceSection.resources &&
            currentResourceSection.resources[id]
        );

        // If there is no existing resource, we just add it to the resources object
        if (!resourceAlreadyExists) {
          newResources[id] = resource;
          continue;
        }

        const resourceToInsert = createResource({
          input: resource,
          existing: newResources[id],
          resourceType,
          schema,
          mergeResource: mergeResources,
        });

        if (process.env.NODE_ENV !== 'production') {
          validateResource({ resource: resourceToInsert, schema });
        }

        newResources[id] = resourceToInsert;
      }
    }

    const newLists = {
      ...currentResourceSection.lists,
    };

    for (let resourceList in naiveLists) {
      const resourceIds = [];

      naiveLists[resourceList].forEach(resource => {
        const id = idFromResource({ resource, schema });
        const hasId = exists(id);

        if (hasId) {
          resourceIds.push(id);

          // This allows you to add a resource by specifying it in
          // a list.
          if (!newResources[id]) {
            newResources[id] = createResource({
              input: resource,
              resourceType,
              schema,
            });
          }
        }
      });

      if (concatLists) {
        const currentList = newLists[resourceList] || [];
        if (currentList.length === 0) {
          newLists[resourceList] = resourceIds;
        } else {
          // Only add IDs that don't already exist in the list
          resourceIds.forEach(id => {
            if (!newLists[resourceList].includes(id)) {
              newLists[resourceList].push(id);
            }
          });
        }
      } else {
        newLists[resourceList] = resourceIds;
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
