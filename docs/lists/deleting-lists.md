### Deleting Lists

You can use `store.remove()` to delete an entire list. To do that, specify `null` instead
of an array in your call to `remove`:

```js
store.remove('lists.selectedBooks');
```

### Deleting Multiple Lists at Once

You can delete multiple lists by passing an array of list names to delete when calling `remove()`.

```js
store.remove('lists', ['selectedBooks', 'newBooks', 'favoriteMovies']);
```

Here are two other ways to accomplish the same thing:

```js
store.remove({
  lists: ['selectedBooks', 'newBooks', 'favoriteMovies'],
});

store.remove({
  lists: {
    selectedBooks: null,
    newBooks: null,
    favoriteMovies: null,
  },
});
```
