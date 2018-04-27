// Given a flat resource and its schema, returns a full resource.
export default function fullFromFlat({ resource, schema }) {
  const attributes = Object.values(schema.attributes);
  const metas = Object.values(schema.meta);

  const newAttributes = {};
  attributes.map(attribute => {
    if (resource[attribute]) {
      newAttributes[attribute] = resource[attribute];
    }
  });

  const newMeta = {};
  metas.map(meta => {
    if (resource[meta]) {
      newMeta[meta] = resource[meta];
    }
  });

  return {
    [schema.idAttribute]: resource[schema.idAttribute],
    resourceType: schema.resourceType,
    attributes: newAttributes,
    meta: newMeta,
    relationships: {},
  };
}
