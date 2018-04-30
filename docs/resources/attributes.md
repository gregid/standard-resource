# Attributes

Attributes are the primary data about a resource. For instance, if you have a Book, then some of its
primary attributes may be its name and the year it was published.

A resource's attributes are stored on the `attributes` key of the resource.

An example book resource is:

```js
{
  id: '24',
  resourceType: 'books',
  attributes: {
    name: 'The Fellowship of the Ring',
    publishYear: 1940
  },
  computedAttributes: {},
  meta: {}
}
```

### Creating or Updating a Resource with Attributes

Use `store.update()` to create or update a resource with attributes.

```js
// This code will create this resource if it does not already exist.
// If it does exist, then these attributes will be shallowly merged with
// the existing attributes of the resource.
store.update('books.resources', [
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
  'books.resources',
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

### Updating a Single Attribute

By using the first argument to `update`, you can scope your update to
a single attribute, or even a deeply nested piece of a single attribute.

In the following example, we are updating the English display name for the
book with an ID of 24.

```js
store.update(
  'books.resources.24.attributes.displayNames.en.value',
  'The Lord of the Rings'
);
```

### Updating Multiple Resources at a Time

You can update as many resources as you want with a single call to `update`, even across
different resource types. In the following example, we update two books and an author
with one call.

```js
store.update({
  books: {
    resources: {
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
  },
  authors: {
    resources: {
      102: {
        attributes: {
          firstName: 'John',
        },
      },
    },
  },
});
```

### Enforcing Types

Often times, the attributes of a resource are always a specific type, such a string, or a number. You can
specify these types witin the [Schema](./schemas.md) of the Resource Type using the
[Prop Types](https://github.com/facebook/prop-types) library.

In the following schema, we enforce the type of the name and publish year:

```js
import PropTypes from 'prop-types';

export default {
  attributes: {
    name: PropTypes.string,
    year: PropTypes.number,
  },
};
```

Remember, schemas are always optional. They are just a useful tool that let you do more with your resources. To learn
more about defining and using schemas, refer to the [Schemas guide](./schemas.md).
