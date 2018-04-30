# IDs

Every resource must have a unique identifier, or ID for short. This ID is what distinguishes one
resource of a particular [resource type](./type.md) from another resource of the same
type.

### Uniqueness

IDs must be unique within each resource type. Two resources that are not of the same resource type
may have the same ID, however.

### Type

IDs must be either a string or a number.

### Specifying the property name of the ID

By default, Standard Resource will use the `id` property as the unique identifier. You can
change this within the [schema](../glossary.md#schema) of the resource type.

In this example schema, we use the `movieId` property for the ID.

```js
export default {
  idProperty: 'movieId',
};
```

To learn more about defining and using schemas, refer to the [schemas guide](./schemas.md).

### Restricting the Type of an ID

By default, Standard Resource permits your IDs to be either strings or numbers. If you know
that all of your resource IDs are of one type or another, you can specify that in the
[schema](../glossary.md#schema).

In the following schema, we specify that the ID will always be a string.

```js
export default {
  idType: 'string',
};
```

To learn more about defining and using schemas, refer to the [schemas guide](./schemas.md).

### Tips

* We recommend using strings instead of numbers for IDs. Strings can be used instead of numbers in
  every situation, and are not restricted by the [maximum safe integer limit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER).
