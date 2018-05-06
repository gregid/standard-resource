import PropTypes from 'prop-types';

let defaultIdProp;
if (process.env.NODE_ENV !== 'development') {
  defaultIdProp = () => {};
} else {
  defaultIdProp = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
}

export default {
  // The "type" of the ID.
  idType: defaultIdProp,

  // The ID attribute
  idProperty: 'id',

  // A group of computed attributes for this resource type
  computedAttributes: {},

  // Enforce prop types for attributes or meta
  attributes: {},
  meta: {},
};
