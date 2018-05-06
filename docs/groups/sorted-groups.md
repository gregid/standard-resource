# Sorted Groups

To keep a group sorted, you must manually sort the group outside of the store and then
use `store.update` to replace the existing group with the new, sorted version of the group.

```js
// To keep a group in order, sort it outside of the store before calling
// `update()`
store.update('favoriteBooks', sortedFavoriteBooks);
```
