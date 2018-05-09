# Updating Groups

Use [`store.update()`](../api-reference/store.md#update-path-changes-options) and
[`store.remove()`](../api-reference/store.md#remove-path-changes) to update groups. The following operations are possible:

Using `update()`:

* replace the contents of a group
* append new items to the end of a group

Using `remove()`:

* remove resource(s) from a group

> Heads up: you can also delete an entire group using either `update()` or `remove()`. This
> is covered in the next guide, [Deleting Groups](deleting-groups.md).

### Replacing a Group

Replacing the contents of a group is straightforward: it looks the exact same as the call
to create a group. In this example, we replace our `selectedBooks` group with a different
set of IDs:

```js
const newSelectedBooks = store.getResources('books', [50, 24]);

store.update('groups.selectedBooks', newSelectedBooks);
```

### Appending to a Group

Sometimes, you want to add a new value to a group without losing the old values. Once again,
you use `store.update()` for this purpose. One of the options to `store.update()` is called
`concatGroups`. Pass it as `true`, and the IDs will be added to the group.

```js
store.update('groups.selectedBooks', [{ id: 2, resourceType: 'books' }], {
  concatGroups: true,
});
```

### Removing Resources From a Group

To remove resources from a group, you can use `store.remove()`. The arguments are the same as
adding a resource to the group.

```js
store.remove('groups.selectedBooks', [
  { id: 50, resourceType: 'books' },
  { id: 24, resourceType: 'books' },
]);
```

### Updating Multiple Groups

The previous examples used the `path` argument to `store.update()` to
update a single group. But you can update as many groups across as many resources at a single
time using these methods. In this example, we perform a bulk operation to replace
several groups at the same time:

```js
store.update({
  groups: {
    selectedBooks: [{ id: 2, resourceType: 'books' }],
    favoriteBooks: [
      { id: 2, resourceType: 'books' },
      { id: 10, resourceType: 'books' },
      { id: 55, resourceType: 'books' },
    ],
    favoriteMovies: [],
  },
});
```

### Tips

* Resources that don't exist at the time that you add them to a group will be created for you. This is
  useful if you need to create a resource and add it to a group at the same time.
