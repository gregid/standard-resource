// import PropTypes from 'prop-types';

// Do I need to validate a full or a flat resource?
export default function validateResource({ resource, schema }) {
  // If we have no id attribute, then that is no good
  if (typeof resource[schema.idAttribute] === 'undefined') {
    return false;
  }

  // const idObj = { id: resource[schema.idAttribute] };
}
