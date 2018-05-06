# Type

A resource type is a way to group resources that represent the same _kind_ of data
together.

For instance, if your application manages books and people, then you have two resource
types:

1.  books
2.  people

### `resourceType`

Each resource object has a `resourceType` property that is its type. An example book
resource is:

```js
{
  id: 24,
  resourceType: 'books',
  // ...there are other things on a resource, as well.
}
```

### The State Tree

Resources of the same type are grouped together in the same section of the state tree.

This is the state tree for an application with books and people:

```js
{
  resources: {
    books: {
      // The individual book resources are stored here
    },
    people: {
      // The individual people resources are stored here
    }
  },
  groups: {
    // Groups are stored here
  }
}
```

### Schemas

Typically, resources of the same type share a similar structure. You have the option to
define a [schema](../glossary.md#schema) that allows you to specify this structure for
each of your resource types, although this is not a requirement.

By defining a schema, you can use more features of Standard Resource. Schemas can
also be helpful in preventing certain kinds of errors.

To learn more about schemas, refer to the [schemas guide](./schemas.md).

### Tips

* We recommend using a plural name for your resource types. For instance, use
  "people" and not "person".

* You do not need to define your resource types up front.
