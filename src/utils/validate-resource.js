import PropTypes from 'prop-types';

export default function validateResource({ resource, schema }) {
  const idPropTypes = { [schema.idAttribute]: schema.idType.isRequired };
  PropTypes.checkPropTypes(
    idPropTypes,
    resource,
    schema.idAttribute,
    `resource.${schema.idAttribute}`
  );

  PropTypes.checkPropTypes(
    schema.attributes,
    resource.attributes,
    'attribute',
    'resource.attributes'
  );

  PropTypes.checkPropTypes(schema.meta, resource.meta, 'meta', 'resource.meta');
}
