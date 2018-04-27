import idFromResource from '../utils/id-from-resource';
import warning from '../diagnostics/warning';

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

export default function deleteResources({ state, changes }) {
  const newState = {
    ...state,
  };

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
          'DELETE_RESOURCES_INVALID_TYPE'
        );
      } else {
        if (resourceChange.resources) {
          const resourcesIsObject =
            resourceChange.resources.constructor === Object;
          const resourcesIsArray = Array.isArray(resourceChange.resources);

          if (!resourcesIsObject && !resourcesIsArray) {
            warning(
              `You called deleteResources with an invalid "resources" value for the` +
                ` resource of type "${resourceType}". The "resource" value of an update` +
                ` must be an Object or an array.`,
              'DELETE_RESOURCES_INVALID_RESOURCES'
            );
          }
        }

        if (resourceChange.lists) {
          const listIsArray = Array.isArray(resourceChange.lists);

          if (!listIsArray) {
            warning(
              `You called deleteResources with an invalid "lists" value for the` +
                ` resource of type "${resourceType}". The "lists" value when deleting` +
                ` must be an Array of list names to be deleted.`,
              'DELETE_RESOURCES_INVALID_LISTS'
            );
          }
        }
      }
    }

    const naiveResources = resourceChange && resourceChange.resources;
    const naiveLists = (resourceChange && resourceChange.lists) || [];
    const schema = currentResourceSection.schema;

    let idList = [];
    if (Array.isArray(naiveResources)) {
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
