# Sorted Groups

To keep a group sorted, you must manually sort the group outside of the store and then
use [`store.update()`](../api-reference/store.md#update-path-changes-options) to replace the existing group
with the new, sorted version of the group.

```js
store.update('favoriteBooks', sortedFavoriteBooks);
```
