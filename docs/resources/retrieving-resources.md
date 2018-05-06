# Retrieving Resources

Use `store.getResources()` to access resource data from the store.

By default, `getResources()` returns an array of resource objects. You can
configure it to return an object instead by passing `{ byId: true }` as the
third argument.

### Filtering by ID

Sometimes, you may have the specific IDs that you wish to pull from the
store. In those situations, you can pass an array of IDs to `getResources`.

```js
store.getResources('books', [24, 50, 102]);
```

### Filtering with an object

If you want a set of resources with specific attributes, meta, or computed attributes,
you can pass an object as the second argument. Any resource that matches the object
will be returned.

```js
// Return all of the books that have `isSelected: true` within their meta.
store.getResources('books', {
  meta: {
    isSelected: true,
  },
});
```

### Filtering with a function

You can pass a function as a filter as well. The filter will be called with two
arguments:

1.  `resource`: a resource object
2.  `resources`: all of the resources of the same resource type

Return `true` from the function to include the `resource` in the results.

```js
store.getResources('books', resource => resource.meta.isSelected);
```

### Options

`getResources` accepts a third argument, `options`. Currently, only option is supported: `byId`.

Pass `true`, and you will receive an object back instead of an array, where each key of the object
is a resource ID.

```js
store.getResources('books', [24, 50, 102], {
  byId: true,
});
```
