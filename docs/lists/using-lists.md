# Using Lists

Applications frequently need to group resources together. Sometimes, you need an ordered
group, such as a sorted list of resources. Other times, you may need an unordered
group, such as the list of resources that a user has selected on an interface.

Lists are designed for these use cases. Anytime that you need a grouping of resources,
you should use lists.

### List Names

Lists are identified by their name. A list name is a string. Typically, you'll use a
name that describes what is in the list. For instance, if the user can select books
in your interface, than you may have a list named `"selectedBooks"`.

You use the list name to update the contents of the list, and to retrieve it from
the state tree.

### Structure

A list is stored as an array of IDs in your state tree. For instance, here is what
a state tree with a `selectedBooks` list might look like:

```js
{
  resourceTypes: {
    books: {
      resources: {
        // resource data is in here
      },
      lists: {
        selectedBooks: [50, 22, 3]
      }
    }
  }
}
```

### Creating Lists

You can create lists using the `store.update()` method. In this example, we create a
list named `"selectedBooks"` that contains a book with an ID of 2.

```js
store.update('books.lists.selectedBooks', [2]);
```

### Retrieving a List

Use `store.read()` to access a list from the store:

```js
store.read('books.lists.selectedBooks');
```

When you read a list, you will be given the full resources back, and not just their IDs.

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

### Replacing a List

Replacing the contents of a list is straightforward: it looks the exact same as the call
to create a list. In this example, we replace our `selectedBooks` list with a different
set of IDs:

```js
store.update('books.lists.selectedBooks', [50, 24]);
```

### Appending to a List

Sometimes, you want to add a new value to a list without losing the old values. Once again,
you use `store.update()` for this purpose. One of the options to `store.update()` is called
`concatLists`. Pass it as `true`, and the IDs will be added to the list.

```js
store.update('books.lists.selectedBooks', [2], {
  concatLists: true,
});
```

### Duplicates in a List

Lists will prevent duplicate from being added automatically. You do not need to do anything.

There is no way to disable this behavior, but that is only because we have not run into a use
case where that has been necessary. If that is a feature that you need, just let us know in
[this issue](https://github.com/jamesplease/standard-resource/issues/95).

### Removing Resources From a List

To remove resources from a list, you can use `store.delete()`. The arguments are the same as
adding a resource to the list.

```js
store.remove('books.lists.selectedBooks', [50, 24]);
```

### Deleting an Entire List

You may also use `store.remove()` to delete an entire list. To do that, specify `null` instead
of an array in your call to `remove`:

```js
store.remove('books.lists.selectedBooks', null);
```

### Updating Multiple Lists

These examples have been using the `path` argument to `store.update()` and `store.remove()` to
update a single list. But you can update as many lists across as many resources at a single
time using these methods. In this example, we perform a bulk operation of lists:

```js
store.update({
  books: {
    lists: {
      selectedBooks: [2],
      favoriteBooks: [2, 10, 55],
    },
  },
  authors: {
    selectedAuthors: null,
  },
});
```

### Keeping a List Sorted

Sometimes, you may need a list to be sorted in a particular way. We recommend sorting the list manually,
and then using `store.update` to replace the existing list with the new list.

### Tips

* Resources that don't exist at the time that you add them to a list will be created for you. This is
  useful if you need to create a resource and add it to a list at the same time.

* Your application will be easier to debug if you do your best to keep the list names static. There may
  be use cases for dynamic list names, but we encourage you to use them sparingly.
