# Updating Resources

Use `store.update()` and `store.remove()` to change resource data. The following operations are possible:

Using `update()`:

* merge new data with an existing resource
* replace a resource with new data
* update a single attribute of a resource

Using `remove()`:

* remove attributes and meta from an existing resource

### Updating a Single Resource

Updating a resource is identical to the call to create one.

In this example, we are updating the name and publish year of the resource with an
ID of 24:

```js
store.update('resources.books.24', {
  attributes: {
    name: 'The Fellowship of the Ring',
    publishYear: 1940,
  },
});
```

By default, the resource data that you pass will be _deeply_ merged with any
existing resource.

### Replacing a Resource

If you would like to outright replace an existing resource, you can pass a
third argument to `update`: an Object with `mergeResources: false`.

```js
store.update(
  'resources.books.24',
  {
    attributes: {
      name: 'The Fellowship of the Ring',
      publishYear: 1940,
    },
  },
  {
    mergeResources: false,
  }
);
```

If this resource had any other attributes or meta before this call to `update()`,
they would be removed.

### Updating a Single Attribute

By using the first argument to `update`, you can scope your update to
a single attribute, or even a deeply nested piece of a single attribute.

In the following example, we are updating the English display name for the
book with an ID of 24.

```js
store.update(
  'resources.books.24.attributes.displayNames.en.value',
  'The Lord of the Rings'
);
```

### Updating Multiple Resources at a Time

You can update as many resources as you want with a single call to `update`, even across
different resource types. In the following example, we update two books and an author
with one call.

```js
store.update('resources', {
  books: {
    24: {
      attributes: {
        name: 'The Lord of the Rings',
      },
    },
    350: {
      attributes: {
        publishYear: 1998,
      },
    },
  },
  authors: {
    102: {
      attributes: {
        firstName: 'John',
      },
    },
  },
});
```

### Removing an Attribute

You can remove a specific attribute using `store.remove()`. In the following example,
we remove the `releaseYear` attribute from the book with ID of 24.

```js
store.remove('resources.books.24.attributes.releaseYear');
```
