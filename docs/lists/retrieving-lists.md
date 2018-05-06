# Retrieving Lists

Use `store.getList()` to access a list from the store:

```js
store.getList('selectedBooks');
```

When you retrieve a list, you will be given the full resources back, and not just their IDs.

For instance, the above call may return:

```js
[
  {
    id: 2,
    attributes: {
      name: 'The Lord of the Rings',
      publishYear: 1940,
    },
    meta: {},
    computedAttributes: {},
  },
];
```

### Accessing a List By ID

Although lists are always stored as arrays, it is not always the case that the order of that array matters.
In those situations, it may be preferable to get an object returned from the call to `getList`, rather
than an array. The second argument to `getList` is an options object that allows you to specify this
behavior:

```js
store.getList('selectedBooks', {
  byId: true,
});
```

This would return an object like the following:

```js
{
  2: {
    id: 2,
    attributes: {
      name: 'The Lord of the Rings',
      publishYear: 1940,
    },
    meta: {},
    computedAttributes: {},
  },
};
```

### Tips

* Although you can also use `store.getState()` to retrieve a list by directly accessing the state tree, we
  do not encourage that approach.
