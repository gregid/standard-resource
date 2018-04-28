// Note: these do not support multiple global environments
// for more, see: http://web.mit.edu/jwalden/www/isArray.html

export function exists(val) {
  return typeof val !== 'undefined';
}

export function isArray(val) {
  return val instanceof Array;
}

export function isObject(val) {
  return exists(val) && val.constructor === Object;
}

export function isString(val) {
  return typeof val === 'string';
}

export function isNumber(val) {
  return typeof val === 'number';
}

export function isBoolean(val) {
  return typeof val === 'boolean';
}

export function isFunction(val) {
  return typeof val === 'function';
}
