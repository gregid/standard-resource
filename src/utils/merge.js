import { isObject } from './identification';

export default function merge(x, y, deep = false) {
  if (!deep) {
    return Object.assign({}, x, y);
  }

  let output = Object.assign({}, y);
  if (isObject(y) && isObject(x)) {
    Object.keys(x).forEach(key => {
      if (isObject(x[key])) {
        if (!(key in y)) Object.assign(output, { [key]: x[key] });
        else output[key] = merge(y[key], x[key], true);
      } else {
        Object.assign(output, { [key]: x[key] });
      }
    });
  }
  return output;
}
