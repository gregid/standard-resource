import PropTypes from 'prop-types';

export default {
  // The "type" of the ID.
  idType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // The ID attribute
  idAttribute: 'id',

  // A list of computed attributes for this resource type
  computedAttributes: {},

  // Enforce prop types for attributes or meta
  attributes: {},
  meta: {},
};
