# Schemas

Schemas are an optional description of the structure of a resource type. Defining a schema
allows you to use more features of Standard Resource. They also can help you to prevent certain
kinds of bugs.

Keep in mind: schemas are entirely optional. You may decide to start using Standard
Resource _without_ schemas, and then add them in later. Or maybe you never add them.
That is okay.

### Defining a Schema

A schema is a JavaScript object. The simplest schema, then, is just an empty object:

```js
{
}
```

Although an empty object is a valid schema, it isn't particularly useful as it doesn't do
anything!

In this guide, we will cover all of the properties of a schema.

### Using a Schema

Once you have your schemas defined, you can add it to your store when you create the store
using the second argument to `createResourceStore()`. In this example, we add a few
schemas to our store:

```js
import createResourceStore from 'standard-resource';
import books from './schemas/books';
import authors from './schemas/authors';

export default createResourceStore(null, {
  schemas: {
    books,
    authors,
  },
});
```

> You cannot add, change, or remove schemas after the store has been created.

## Schema Properties

The rest of this guide will describe the different properties of a schema.

### `idType`

This defines what the data type is of the resource IDs. There are three valid values:

* `"string"`: The ID is a string
* `"number"`: The ID is a number
* `["string", "number"]`: The ID can be either a string or a number

By default, the `idType` is `["string", "number"]`.

```js
export default {
  idType: 'string',
};
```

### `idProperty`

The name of the ID property. By default, it is `"id"`.

Sometimes, servers return IDs on a different property, such as `"bookId"`. You have two
choices in these situations: rename it to `"id"`, or specify the `"idProperty"` in
the schema.

```js
export default {
  idProperty: 'bookId',
};
```

### `attributes`

The `attributes` property allows you to specify the types of the resource's attributes.
This can help you to prevent bugs in your app.

For instance, if your resource has a name that should always be a string, then you can
specify that here. Then, if you update the state with a name that is something other
than a string, you will be warned.

To specify your attribute types, you should use the
[PropTypes](https://github.com/facebook/prop-types) library.

```js
import PropTypes from 'prop-types';

export default {
  attributes: {
    name: PropTypes.string,
    year: PropTypes.number,
  },
};
```

To take full advantage of the `attributes` property, we encourage you to familiarize yourself
with the PropTypes library by reading its
[documentation](https://github.com/facebook/prop-types#usage).

### `meta`

This property is identical in structure to `attributes`, except that it applies to the
[resource metadata](./meta.md) instead.

```js
import PropTypes from 'prop-types';

export default {
  meta: {
    isSelected: PropTypes.bool,
  },
};
```

### `computedAttributes`

Computed attributes allow you to specify the computed attributes for your resource. We encourage you
to read [the guide](./computed-attributes.md) on computed attributes to learn more about them.

In this example, we define a display name that is computed from the first and last name of the resource.

```js
export default {
  computedAttributes: {
    displayName(resource) {
      return `${resource.firstName} ${resource.lastName[0]}`;
    },
  },
};
```

In this example, we use the Reselect library to memoize a slow computed computed:

```js
import createSelector from 'reselect';

export default {
  computedAttributes: {
    sortedItems: createSelector(
      resource => resource.attributes.items,
      items => sortItemsAlphabetically(items)
    ),
  },
};
```
