# Creating Resources

Use `store.update()` to create or update a resource with attributes.

```js
// This code will create this resource if it does not already exist.
// If it does exist, then these attributes will be shallowly merged with
// the existing attributes of the resource.
store.update('resources.books', [
  {
    id: 24,
    attributes: {
      name: 'The Fellowship of the Ring',
      publishYear: 1940,
    },
  },
]);
```

By default, an existing resource's attributes will be shallowly merged with the
resource attributes that you pass in. If you would like to outright replace any
existing attributes, you can pass a third argument to `update`: an Object with
`mergeResources: false`:

```js
// In this example, we are completely replacing the attributes of this book
store.update(
  'resources.books',
  [
    {
      id: 24,
      attributes: {
        name: 'The Fellowship of the Ring',
        publishYear: 1940,
      },
    },
  ],
  {
    mergeResources: false,
  }
);
```
