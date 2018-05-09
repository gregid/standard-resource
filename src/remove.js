import defaultSchema from './utils/default-schema';
import idFromResource from './utils/id-from-resource';
import merge from './utils/merge';
import { isArray, isObject, isNull } from './utils/identification';
import objectFromPath from './utils/object-from-path';
import { warning } from './utils/warning';

export default function remove({ path, schemas, state, changes }) {
  changes = objectFromPath(path, changes);

  const resourcesChanges = changes.resources;
  const groupsChanges = changes.groups;
  const newResources = merge(state.resources);

  if (process.env.NODE_ENV !== 'production') {
    if (isNull(groupsChanges)) {
      warning(
        `You passed 'null' as the value to groups when calling` +
          ` store.remove(). This is not a valid input. It is not possible to` +
          ` remove every group. No groups have been changed as a result of this action.`,
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

    // This handles: remove('resources.books')
    const deletingEntireSection = isNull(resourceChange);

    let idGroup = [];

    if (isArray(resourceChange)) {
      idGroup = resourceChange.map(resource => {
        const id = idFromResource({ schema, resource });

        resourcesDeletedByType[resourceType][id] = true;

        return id;
      });
    } else if (isObject(resourceChange)) {
      for (let resourceId in resourceChange) {
        const targetResource = resourceChange[resourceId];

        // This handles: `remove('resources.books.24')`
        if (isNull(targetResource)) {
          resourcesDeletedByType[resourceType][resourceId] = true;
          idGroup.push(resourceId);
        }

        // This allows you to remove all or some of a resource's attributes
        // or meta.
        else if (isObject(targetResource)) {
          if (process.env.NODE_ENV !== 'production') {
            if (isNull(targetResource.resourceType)) {
              warning(
                `You attempted to remove the resourceType of a resource in`` a call to store.remove(). resourceType cannot be changed`` or removed. The resourceType has not changed.`,
                'ATTEMPT_TO_REMOVE_RESOURCE_TYPE',
                'warn'
              );
            } else if (isNull(targetResource[schema.idProperty])) {
              warning(
                `You attempted to remove the ${
                  schema.idProperty
                } of a resource in`` a call to store.remove(). The ${
                  schema.idProperty
                } cannot be changed`` or removed. The ${
                  schema.idProperty
                } has not changed.`,
                'ATTEMPT_TO_REMOVE_RESOURCE_ID',
                'warn'
              );
            } else if (isNull(targetResource.computedAttributes)) {
              warning(
                `You attempted to remove the computedAttributes of a resource in`` a call to store.remove(). computedAttributes cannot be changed`` or removed. The computedAttributes have not changed.`,
                'ATTEMPT_TO_REMOVE_RESOURCE_ID',
                'warn'
              );
            }
          }

          newResourceSection =
            newResourceSection || merge(currentResourceSection);

          // Remove all attributes from the resource:
          // remove('resources.book.24.attributes');
          if (isNull(targetResource.attributes)) {
            newResourceSection[resourceId] = merge(
              currentResourceSection[resourceId],
              {
                attributes: {},
              }
            );
            // Use `merge` to delete the attributes
          } else if (isObject(targetResource.attributes)) {
            // Delete any attribute leaf that is `null`
          }

          // Remove all meta from the resource:
          // remove('resources.book.24.meta');
          if (isNull(targetResource.meta)) {
            newResourceSection[resourceId] = merge(
              currentResourceSection[resourceId],
              {
                meta: {},
              }
            );
          } else if (isObject(targetResource.meta)) {
            // Delete any meta leaf that is `null`
          }
        }
      }
    } else if (deletingEntireSection) {
      newResourceSection = {};
      // This represents that every resource of this type has been deleted
      resourcesDeletedByType[resourceType] = true;
    }

    const hasIds = idGroup && idGroup.length;

    if (hasIds) {
      newResourceSection = newResourceSection || merge(currentResourceSection);

      idGroup.map(id => {
        delete newResourceSection[id];
      });
    }

    newResources[resourceType] = newResourceSection;
  }

  const groupIsArray = isArray(groupsChanges);
  const groupIsObject = isObject(groupsChanges);

  let groupsToUse;
  if (groupIsArray || groupIsObject) {
    groupsToUse = groupsChanges;
  } else {
    groupsToUse = [];
  }

  let groupsToDelete = [];
  if (groupIsArray) {
    groupsToDelete = groupsToUse;
  } else if (groupIsObject) {
    for (let groupName in groupsToUse) {
      if (isNull(groupsToUse[groupName])) {
        groupsToDelete.push(groupName);
      }
    }
    groupsToDelete;
  }

  const newGroups = {};

  // We iterate every existing group
  for (let resourceGroup in state.groups) {
    // We only consider the groups that aren't slated to be deleted
    if (!groupsToDelete.includes(resourceGroup)) {
      const existingGroup = state.groups[resourceGroup];
      const thisGroupFromChange = groupIsObject
        ? groupsToUse[resourceGroup]
        : [];
      const thisGroupIsArray = isArray(thisGroupFromChange);

      newGroups[resourceGroup] = existingGroup.filter(resourcePointer => {
        const schema = schemas[resourcePointer.resourceType] || defaultSchema;
        const deletedType =
          resourcesDeletedByType[resourcePointer.resourceType] || {};
        const removedFromStore =
          // This represents that this entire resource section was deleted
          deletedType === true ||
          // This represents that just this one resource within the type was deleted
          deletedType[resourcePointer[schema.idProperty]];

        const removeFromThisGroup =
          thisGroupIsArray &&
          thisGroupFromChange.find(resource => {
            return (
              resource[schema.idProperty] ===
                resourcePointer[schema.idProperty] &&
              resource.resourceType === resourcePointer.resourceType
            );
          });

        return !removedFromStore && !removeFromThisGroup;
      });
    }
  }

  return merge(state, {
    resources: newResources,
    groups: newGroups,
  });
}
