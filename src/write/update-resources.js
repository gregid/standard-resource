import idFromResource from '../utils/id-from-resource';
import defaultSchema from '../initialization/default-schema';
import warning from '../utils/warning';

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

export default function updateResources({ state, changes }) {
  const newState = {
    ...state,
  };

  for (let resourceType in changes) {
    const resourceChange = changes[resourceType];
    const currentResourceSection = state[resourceType] || {};

    if (process.env.NODE_ENV !== 'production') {
      if (resourceChange && resourceChange.constructor !== Object) {
        warning(
          `You called updateResources with an invalid update for the` +
            ` resource of type "${resourceType}". Updates must be an Object.`,
          'UPDATE_RESOURCES_INVALID_TYPE'
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
              'UPDATE_RESOURCES_INVALID_RESOURCES'
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
              'UPDATE_RESOURCES_INVALID_LISTS'
            );
          }
        }
      }
    }

    const naiveResources = resourceChange && resourceChange.resources;
    const naiveLists = (resourceChange && resourceChange.lists) || [];
    const schema = currentResourceSection.schema || defaultSchema;
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
              'MISSING_ID_UPSERT'
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

        newResources[id] = resourceToInsert;
      }
    }

    const newLists = {
      ...currentResourceSection.lists,
    };

    for (let resourceList in naiveLists) {
      if (concatLists) {
        const resourceIds = naiveLists[resourceList].map(resource =>
          idFromResource({ resource, schema })
        );

        // Only add IDs that don't already exist in the list
        resourceIds.forEach(id => {
          if (!newLists[resourceList].includes(id)) {
            newLists[resourceList].push(id);
          }
        });
      } else {
        newLists[resourceList] = naiveLists[resourceList];
      }
    }

    newState[resourceType] = {
      ...currentResourceSection,
      schema,
      resources: newResources,
      lists: newLists,
    };
  }

  return newState;
}
