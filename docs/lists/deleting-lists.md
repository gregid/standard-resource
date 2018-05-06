### Deleting Lists

You can use `store.remove()` to delete an entire list.

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

### Using `update()` to delete a list

Passing `null` or an empty array to `store.update()` has the same effect as deleting
the list.

```js
store.update('lists.selectedBooks', []);
store.update('lists.selectedBooks', null);
```

You may choose to use one over the other when it makes sense as part of a bulk operation.

For instance, in the following call to `store.update()`, we are able to update a resource
and delete a list at the same time:

```js
store.update({
  resources: {
    24: {
      attributes: {
        firstName: 'James',
      },
    },
  },
  lists: {
    selectedBooks: [],
  },
});
```

Because it is not possible to update a resource when using `store.remove()`, it was preferable
to use `store.update()` to remove the list so that both operations occurred in one update to the
store.
