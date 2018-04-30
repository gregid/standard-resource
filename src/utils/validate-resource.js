import PropTypes from 'prop-types';

export default function validateResource({ resource, schema }) {
  const idPropTypes = { [schema.idProperty]: schema.idType.isRequired };
  PropTypes.checkPropTypes(
    idPropTypes,
    resource,
    schema.idProperty,
    `resource.${schema.idProperty}`
  );

  PropTypes.checkPropTypes(
    schema.attributes,
    resource.attributes,
    'attribute',
    'resource.attributes'
  );

  PropTypes.checkPropTypes(schema.meta, resource.meta, 'meta', 'resource.meta');
}
