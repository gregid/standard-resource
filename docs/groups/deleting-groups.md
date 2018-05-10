# Deleting Groups

Use [`store.remove()`](../api-reference/store.md#remove-path-changes) to delete groups.

### Deleting a Single Group

In this example, we delete the group with the name `"selectedBooks"`.

```js
store.remove('groups.selectedBooks');
```

### Deleting Multiple Groups at Once

You can delete multiple groups by passing an array of group names to delete when calling `remove()`.

```js
store.remove('groups', ['selectedBooks', 'newBooks', 'favoriteMovies']);
```

Here are two other ways to accomplish the same thing:

```js
store.remove({
  groups: ['selectedBooks', 'newBooks', 'favoriteMovies'],
});

store.remove({
  groups: {
    selectedBooks: null,
    newBooks: null,
    favoriteMovies: null,
  },
});
```

### Using `update()` to Delete a Group

Passing `null` or an empty array to [`store.update()`](../api-reference/store.md#update-path-changes-options) will
delete the group.

```js
store.update('groups.selectedBooks', []);
store.update('groups.selectedBooks', null);
```

You may choose to use one over the other when it makes sense as part of a bulk operation.

For instance, in the following call to `store.update()`, we are able to update a resource
and delete a group at the same time:

```js
store.update({
  resources: {
    24: {
      attributes: {
        firstName: 'James',
      },
    },
  },
  groups: {
    selectedBooks: [],
  },
});
```

Had we used `remove()` to delete this list, we would have had to create the resource in a
separate call to `update()`, which is why in this situation it made more sense to use
`update` to delete the list.
