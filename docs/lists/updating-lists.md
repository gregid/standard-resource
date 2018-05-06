# Updating Lists

You can use `store.update()` and `store.remove() to update a lists. The following operations are possible:

Using `update()`:

* replacing the contents of a list
* appending new items to the end of a list

Using `remove()`:

* removing resource(s) from a list

### Replacing a List

Replacing the contents of a list is straightforward: it looks the exact same as the call
to create a list. In this example, we replace our `selectedBooks` list with a different
set of IDs:

```js
store.update('lists.selectedBooks', [
  { id: 50, resourceType: 'books' },
  { id: 24, resourceType: 'books' },
]);
```

### Appending to a List

Sometimes, you want to add a new value to a list without losing the old values. Once again,
you use `store.update()` for this purpose. One of the options to `store.update()` is called
`concatLists`. Pass it as `true`, and the IDs will be added to the list.

```js
store.update('lists.selectedBooks', [{ id: 2, resourceType: 'books' }], {
  concatLists: true,
});
```

### Removing Resources From a List

To remove resources from a list, you can use `store.remove()`. The arguments are the same as
adding a resource to the list.

```js
store.remove('lists.selectedBooks', [
  { id: 50, resourceType: 'books' },
  { id: 24, resourceType: 'books' },
]);
```

### Updating Multiple Lists

The previous examples used the `path` argument to `store.update()` to
update a single list. But you can update as many lists across as many resources at a single
time using these methods. In this example, we perform a bulk operation of lists:

```js
store.update({
  lists: {
    selectedBooks: [{ id: 2, resourceType: 'books' }],
    favoriteBooks: [
      { id: 2, resourceType: 'books' },
      { id: 10, resourceType: 'books' },
      { id: 55, resourceType: 'books' },
    ],
  },
});
```

### Tips

* Resources that don't exist at the time that you add them to a list will be created for you. This is
  useful if you need to create a resource and add it to a list at the same time.
