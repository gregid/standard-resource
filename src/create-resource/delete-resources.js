export default function deleteResources(resources, resourceList) {
  let clonedResources;
  let didDelete = false;

  resourceList.forEach(resourcePointer => {
    if (resources[resourcePointer.id]) {
      didDelete = true;
      clonedResources = clonedResources || { ...resources };
      delete clonedResources[resourcePointer.id];
    }
  });

  return didDelete ? clonedResources : resources;
}
