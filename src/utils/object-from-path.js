// This powers the "drill" update API, which lets
// you specify the path that you want to apply the
// updates to.
export default function objectFromPath(path, changes) {
  if (!path) {
    return {};
  }

  var pathParts = path.split('.');

  var target;
  return pathParts.reduce((result, val, index) => {
    target = target || result;
    const isLastPart = index === pathParts.length - 1;
    target[val] = isLastPart ? changes : {};
    target = target[val];
    return result;
  }, {});
}
