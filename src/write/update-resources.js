import idFromResource from '../utils/id-from-resource';
import defaultSchema from '../utils/default-schema';
import validateResource from '../utils/validate-resource';
import { warning } from '../utils/warning';

// updateResources({
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

export default function updateResources({ schemas, state, changes }) {
  const newState = {
    ...state,
  };

  if (
    changes &&
    changes.constructor !== Object &&
    process.env.NODE_ENV !== 'production'
  ) {
    warning(
      `You called updateResources with an invalid changes object. Changes must be an Object.`,
      'UPDATE_RESOURCES_INVALID_CHANGES_OBJECT',
      'error'
    );
  }

  for (let resourceType in changes) {
    const resourceChange = changes[resourceType];
    const currentResourceSection = state[resourceType] || { resourceType };

    if (process.env.NODE_ENV !== 'production') {
      if (resourceChange && resourceChange.constructor !== Object) {
        warning(
          `You called updateResources with an invalid update for the` +
            ` resource of type "${resourceType}". Updates must be an Object.`,
          'UPDATE_RESOURCES_INVALID_TYPE',
          'error'
        );
      } else {
        if (resourceChange.resources) {
          const resourcesIsObject =
            resourceChange.resources.constructor === Object;
          const resourcesIsArray = Array.isArray(resourceChange.resources);

          if (!resourcesIsObject && !resourcesIsArray) {
            warning(
              `You called updateResources with an invalid "resources" value for the` +
                ` resource of type "${resourceType}". The "resource" value of an update` +
                ` must be an Object or an array.`,
              'UPDATE_RESOURCES_INVALID_RESOURCES',
              'error'
            );
          }
        }

        if (resourceChange.lists) {
          const listIsObject = resourceChange.lists.constructor === Object;

          if (!listIsObject) {
            warning(
              `You called updateResources with an invalid "lists" value for the` +
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
    const idAttribute = schema.idAttribute;
    const concatLists =
      resourceChange && typeof resourceChange.concatLists === 'boolean'
        ? resourceChange.concatLists
        : false;

    let mergeResources;
    if (typeof resourceChange.mergeResources === 'boolean') {
      mergeResources = resourceChange.mergeResources;
    } else {
      mergeResources = true;
    }

    let newResources = Object.assign({}, currentResourceSection.resources);

    if (naiveResources instanceof Array) {
      naiveResources.forEach(resource => {
        const resourceIsObject = resource.constructor === Object;
        const id = resourceIsObject ? resource[idAttribute] : resource;

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

        const resourceObj = resourceIsObject
          ? resource
          : { [idAttribute]: resource };

        const resourceAlreadyExists = Boolean(
          currentResourceSection.resources &&
            currentResourceSection.resources[id]
        );

        // If there is no existing resource, we just add it to the resources object
        if (!resourceAlreadyExists) {
          newResources[id] = resourceObj;
          return newResources;
        }

        let resourceToInsert;
        if (mergeResources) {
          const currentResource = newResources[id];

          resourceToInsert = {
            [idAttribute]: currentResource[idAttribute],
            resourceType,
            attributes: Object.assign(
              {},
              currentResource.attributes,
              resourceObj.attributes
            ),
            meta: Object.assign({}, currentResource.meta, resourceObj.meta),
          };
        } else {
          resourceToInsert = {
            [idAttribute]: resourceObj[idAttribute],
            resourceType,
            attributes: {
              ...resourceObj.attributes,
            },
            meta: {
              ...resourceObj.meta,
            },
          };
        }

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

        let resourceToInsert;
        if (mergeResources) {
          const currentResource = newResources[id];
          resourceToInsert = {
            [idAttribute]: currentResource[idAttribute],
            resourceType: resourceType,
            attributes: Object.assign(
              {},
              currentResource.attributes,
              resource.attributes
            ),
            meta: Object.assign({}, currentResource.meta, resource.meta),
          };
        } else {
          resourceToInsert = resourceToInsert = {
            [idAttribute]: resource[idAttribute],
            resourceType,
            attributes: {
              ...resource.attributes,
            },
            meta: {
              ...resource.meta,
            },
          };
        }

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
      const resourceIds = naiveLists[resourceList]
        .map(resource => idFromResource({ resource, schema }))
        .filter(Boolean);

      if (concatLists) {
        const currentList = newLists[resourceList];
        if (currentList && currentList.length === 0) {
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
