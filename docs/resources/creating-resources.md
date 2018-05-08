# Creating Resources

Use `store.update()` to create a resource.

### Creating a Single Resource

You can use the first argument of `update` to specify the exact resource
that you wish to create.

In the following code, we create a resource of type "books" with an ID of "24".

```js
store.update('resources.books.24', [
  {
    attributes: {
      name: 'The Fellowship of the Ring',
      publishYear: 1940,
    },
  },
]);
```

Note that the following code is using the string `"24"` as the ID, rather than the
number `24`. If you wish to make the ID a number, be sure to _also_ specify it in the
resource object as well. Otherwise, it will be created as a string.

In this next example, the ID will be created as the number `24`:

```js
store.update('resources.books.24', [
  {
    id: 24,
    attributes: {
      name: 'The Fellowship of the Ring',
      publishYear: 1940,
    },
  },
]);
```

### Creating Multiple Resources

There are two ways to create multiple resources at a time. The first way is to
pass an array of resources:

```js
store.update('resources.books', [
  {
    id: 24,
    attributes: {
      name: 'The Fellowship of the Ring',
      publishYear: 1940,
    },
  },
  {
    id: 102,
    attributes: {
      name: 'Harry Potter',
      publishYear: 1997,
    },
  },
]);
```

Another way is to provide an object with keys that are the IDs:

```js
store.update('resources.books', {
  24: {
    id: 24,
    attributes: {
      name: 'The Fellowship of the Ring',
      publishYear: 1940,
    },
  },
  102: {
    id: 102,
    attributes: {
      name: 'Harry Potter',
      publishYear: 1997,
    },
  },
});
```

> Note: the ID is duplicated within the resource definition to indicate that it
> is a number, and not a string.

### Creating with a Group

You can also create resources when you update a group. Any resources that you
place in a group will be created if they don't already exist in the store.

This can be useful if you want to create a resource and add it to a group
in the same operation.

In the following example, we create a book with an ID of 24 and add it to the
list of favorite books:

```js
const newBook = {
  id: 24,
  attributes: {
    name: 'Harry Potter',
    publishYear: 1997,
  },
};

store.update('groups.favoriteBooks', [newBook], {
  concatGroups: true,
});
```

To learn more about Groups, refer to the [Groups section](../groups/README.md) of these docs.
