# Deleting Resources

Use [`store.remove()`](../api-reference/store.md#remove-path-changes) to delete resources.

### Deleting a Single Resource

In this example, we delete the books resource with an ID of 24.

```js
store.remove('resources.books.24');
```

### Deleting Every Resource of a Type

Should you ever need to delete every resource of a specific resource type, you
can also do that using `remove()`.

```js
store.remove('resources.books');
```

### Deleting Multiple Resources at Once

You can use `remove` to delete more than one resource at a time. Here's an example
that demonstrates deleting a handful of books, a pair of authors, and every movie:

```js
store.remove('resources', {
  books: [24, 50, 22],
  authors: ['ab9ee', '8hx01'],
  movies: null,
});
```

### Using `update()` to Delete a Resource

Passing `null` as a resource to [`store.update()`](../api-reference/store.md#update-path-changes-options)
will delete the resource.

```js
store.update('resources.books.24', null);
```

You may choose to use one over the other when it makes sense as part of a bulk operation.

For instance, in the following call to `store.update()`, we are able to update the attributes
of one resource while deleting another at the same time:

```js
store.update('resources', {
  24: {
    attributes: {
      firstName: 'James',
    },
  },
  50: null,
});
```

Had we used `remove()` to delete the resource, we would have had to update the other resource
in a separate call to `update()`, which is why in this situation it made more sense to use
`update` to do both at the same time.
