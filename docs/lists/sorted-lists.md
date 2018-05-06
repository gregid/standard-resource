# Sorted Lists

To keep a list sorted, you must manually sort the list outside of the store and then
use `store.update` to replace the existing list with the new, sorted version of the list.

```js
// To keep a list in order, sort it outside of the store before calling
// `update()`
store.update('favoriteBooks', sortedFavoriteBooks);
```
