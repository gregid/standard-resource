# Sorted Lists

Sometimes, you may need a list to be sorted in a particular way. To do this, sort the list manually
outside of the store, and then use `store.update` to replace the existing list with the new list.

```js
// To keep a list in order, sort it outside of the store before calling
// `update()`
store.update('favoriteBooks', sortedFavoriteBooks);
```
