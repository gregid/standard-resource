# IDs

Every resource must have a unique identifier. This is what distinguishes one resource of
a particular Resource Type from another resource of that same
type.

### Uniqueness

IDs must be unique within each resource type. Two resources that are not of the same type
may have the same ID, however.

### Type

IDs must be either a string or a number.

### Specifying the property name of the ID

By default, Standard Resource will use the property `id` for the unique identifier. You can
change this by using the [Schemas](./schemas.md).

In this example schema, we use the `movieId` property for the ID.

```js
{
  idProperty: 'movieId';
}
```

### Restricting the Type of an ID

By default, Standard Resource permits your IDs to be either strings or numbers. If you know
that all of your resource IDs are of one type or another, you can specify that in the
[Schema](./schemas.md).

In the following schema, we specify that the ID will always be a string.

```js
{
  idType: 'string';
}
```

### Tips

* We recommend always using strings for IDs. Strings can be used instead of numbers in every
  situation, and are not restricted by the
  [maximum safe integer limit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER).
