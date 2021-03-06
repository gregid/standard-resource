# Retrieving Resources

Use [`store.getResources()`](../api-reference/store.md#getresources-resourcetype-filter-options) to access resource data from the store.

### Filtering by ID

Sometimes, you may have the specific IDs that you wish to pull from the
store. In these situations, you can pass an array of IDs to `getResources`.

```js
store.getResources('books', [24, 50]);
//
// [
//   {
//     id: 24,
//     attributes: {
//       name: 'Harry Potter',
//       publishYear: 1997
//     },
//     meta: {},
//     computedAttributes: {}
//   },
//   {
//     id: 50,
//     attributes: {
//       name: 'Lord of the Rings',
//       publishYear: 1939
//     },
//     meta: {},
//     computedAttributes: {}
//   },
// ]
//
```

### Filtering with an object

If you want a set of resources with specific attributes, meta, or computed attributes,
you can pass an object as the second argument. Any resource that matches the object
will be returned.

In the following example, we return every book that was published in 1970.

```js
store.getResources('books', {
  attributes: {
    publishedYear: 1970,
  },
});
```

### Filtering with a function

You can pass a function as a filter as well. The filter will be called with two
arguments:

1.  `resource`: a resource object
2.  `resources`: all of the resources of the same resource type

Return `true` from the function to include the `resource` in the results.

In this example, we return every book that doesn't have a publish year:

```js
store.getResources('books', book => typeof book.publishYear === 'undefined');
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
