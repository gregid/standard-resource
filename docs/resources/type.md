# Type

A resource type is a way to group resources that represent the same _kind_ of data
together.

For instance, if your application manages books and people, then these would be your
two resource types:

* books
* people

### The State Tree

Resources of the same type are stored within the same section of the state tree.

Here is an example state tree for an application with books and people:

```js
{
  resourceTypes: {
    books: {
      resources: {
        // The individual book resources are stored here
      },
      lists: {
        // Lists of books resources are stored here
      }
    },
    people: {
      resources: {
        // The individual people resources are stored here
      },
      lists: {
        // Lists of people resources are stored here
      }
    }
  }
}
```

### Schemas

Typically, resources of the same type share a similar structure. You can define a [schema](../glossary.md#schema)
that allows you to specify this structure for each of your resource types.

By defining a schema, you can use more features of Standard Resource, and they can
also be helpful in preventing certain kinds of errors.

To learn more about schemas, refer to the [schemas guide](./schemas.md).

### Tips

* We recommend using a plural name for your resource types. For instance, use
  "people" and not "person".
