// This powers the "drill" update API, which lets
// you specify the path that you want to apply the
// updates to.
//
// For example:
//
// update({
//   books: {
//     24: {
//       name: 'Lord of the Rings'
//     }
//   }
// });
//
// update('books', {
//   24: {
//     name: 'Lord of the Rings'
//   }
// });
//
// update('books.24', {
//   name: 'Lord of the Rings'
// });
//
export default function createChanges(path = '', changes) {
  let changesToApply = {};

  if (!changes) {
    changesToApply = path;
  } else if (!path) {
    changesToApply = changes;
  } else {
    const splitPath = path.split('.');
    const resourceSlice = splitPath[0];
    const listsOrResources = splitPath[1];
    const resourceId = splitPath[2];

    changesToApply = {
      [resourceSlice]: listsOrResources
        ? {
            [listsOrResources]: resourceId
              ? {
                  [resourceId]: changes,
                }
              : changes,
          }
        : changes,
    };
  }

  return changesToApply;
}
