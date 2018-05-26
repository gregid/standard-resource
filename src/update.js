import idFromResource from './utils/id-from-resource';
import defaultSchema from './utils/default-schema';
import validateResource from './utils/validate-resource';
import objectFromPath from './utils/object-from-path';
import createResource from './utils/create-resource';
import getGlobalId from './utils/get-global-id';
import { exists, isObject, isArray, isBoolean } from './utils/identification';
import merge from './utils/merge';
import { warning } from './utils/warning';

export default function update({ path, schemas, state, changes, options }) {
  options = options || {};
  const { concatGroups } = options;

  changes = objectFromPath(path, changes);

  const resourcesChanges = changes.resources;
  const groupsChanges = changes.groups;
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

    const currentResourceSection = merge(newResources[resourceType]);

    const schema = schemas[resourceType] || defaultSchema;
    const idProperty = schema.idProperty;

    if (isArray(resourceChange)) {
      resourceChange.forEach(resource => {
        const resourceIsObject = isObject(resource);
        const id = resourceIsObject ? resource[idProperty] : resource;

        // If a resource doesn't have an ID, then it cannot be tracked
        if (!exists(id)) {
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

    newResources[resourceType] = currentResourceSection;
  }

  const newGroups = merge(state.groups);

  for (let groupName in groupsChanges) {
    const pointersInGroup = {};
    const resourcePointers = [];

    const groupChanges = groupsChanges[groupName];

    groupChanges.forEach(resource => {
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

        if (!pointersInGroup[globalIdentifier]) {
          resourcePointers.push({
            [schema.idProperty]: id,
            resourceType,
          });

          if (!newResources[resourceType]) {
            newResources[resourceType] = {};
          }

          const resourceSection = newResources[resourceType];

          // This allows you to add a resource by specifying it in
          // a group.
          if (!resourceSection[id]) {
            resourceSection[id] = createResource({
              input: resource,
              resourceType,
              schema,
            });
          }

          pointersInGroup[globalIdentifier] = true;
        }
      }
    });

    if (concatGroups) {
      const currentGroup = newGroups[groupName] || [];
      if (currentGroup.length === 0) {
        // These need to be deduped!
        newGroups[groupName] = resourcePointers;
      } else {
        // Only add IDs that don't already exist in the group
        resourcePointers.forEach(resourcePointer => {
          const schema = schemas[resourcePointer.resourceType] || defaultSchema;
          const idProperty = schema.idProperty;

          const pointerAlreadyInGroup = newGroups[groupName].find(pointer => {
            return (
              pointer.resourceType === resourcePointer.resourceType &&
              pointer[idProperty] === resourcePointer[idProperty]
            );
          });

          if (!pointerAlreadyInGroup) {
            newGroups[groupName].push(resourcePointer);
          }
        });
      }
    } else {
      newGroups[groupName] = resourcePointers;
    }
  }

  return merge(state, {
    resources: newResources,
    groups: newGroups,
  });
}
