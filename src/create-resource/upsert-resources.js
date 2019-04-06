import upsertResource from './utils/upsert-resource';

export default function upsertResources(
  resources,
  resourceType,
  resourceList,
  mergeResources
) {
  const clonedResources = { ...resources };

  resourceList.forEach(resourcePointer => {
    const id = resourcePointer.id;

    const existing = clonedResources[id];
    clonedResources[id] = upsertResource({
      input: resourcePointer,
      id,
      existing,
      resourceType,
      mergeResource: mergeResources,
    });
  });

  return clonedResources;
}
