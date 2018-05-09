# Store

A store holds the whole state tree of your application.

To create a store, use [`createResourceStore`](create-resource-store.md).

### Store Methods

* [`getResources()`](#getresources-resourcetype-filter-options)
* [`getGroup()`](#getgroup-groupname-options)
* [`update()`](#update-path-changes-options)
* [`remove()`](#remove-path-changes)
* [`getState()`](#getstate)
* [`subscribe(listener)`](#subscribe-listener)

## Store Methods

### `getResources(resourceType, [filter], [options])`

Retrieve resources from the state tree.

#### Arguments

1.  `resourceType` _(string)_: The type of resource to be retrieved.
2.  [`filter`] _(Array|Object|function)_: A filter to apply to the resources. If it is omitted, then every
    resource of this type will be returned.
3.  [`options`] _(Object)_: An object to customize the response. Presently, there is only one option:
    `byId`. Pass `true` to receive the resources as an Object keyed by their IDs rather than as an array.

#### Returns

_(Array|Object)_: The resources that match the filter.

#### Example

In this example, we return all of the books in the store.

```js
const allBooks = store.getResources('books');
```

Return every book published in 1970:

```js
const booksFrom1970 = store.getResources('books', {
  attributes: {
    publishYear: 1970,
  },
});
```

Return every book without a publish year:

```js
const booksFrom1970 = store.getResources(
  'books',
  book => typeof book.publishYear === 'undefined'
);
```

To learn more about `getResources`, refer to the guide on [Retrieving Resources](../resources/retrieving-resources.md).

---

### `getGroup(groupName, [options])`

Retrieve a group from the state tree.

#### Arguments

1.  `groupName` _(string)_: The name of the group to be retrieved.
2.  [`options`] _(Object)_: An object to customize the response. Presently, there is only one option:
    `byId`. Pass `true` to receive the resources as an Object keyed by ID rather than as an array.

#### Returns

_(Array|Object)_: The resources contained in the group. If the group does not exist, then an empty
array or object will be returned.

#### Example

```js
const selectedBooks = store.getGroup('selectedBooks', { byId: true });
```

To learn more about `getGroup`, refer to the guide on [Retrieving Groups](../groups/retrieving-groups.md).

---

### `update([path], [changes], [options])`

Create or update resources and groups within the state tree.

#### Arguments

1.  [`path`] _(string)_: An optional string that allows you to specify a path in the state tree
    you are updating. Passing this can allow you to type less code, as it allows you to "drill" into
    the state tree to update a specific resource or group.
2.  [`changes`] _(Object)_: This allows you to further specify the sections of the state tree that you wish
    to update.
3.  [`options`] _(Object)_: Configure the update. There are two options. The first is `mergeResources`, which
    determines whether or not existing resource data is merged with what you pass in. The default is `true`. The
    other option is `concatGroups`, which is `false` by default. Pass this as `true`, and existing groups will be
    concatenated with the groups that you pass in.

#### Returns

None.

#### Example

```js
// In this example, we are using the changes argument to create or update the resource.
store.update({
  resources: {
    books: {
      24: {
        attributes: {
          name: 'Lord of the Rings',
          publishYear: 1970,
        },
        meta: {
          isSelected: true,
        },
      },
    },
  },
});

// In this example, we are using the path to create or update the resource. Note how paths
// allow us to clean things up, compared with the example above.
store.remove('resources.books.24', {
  attributes: {
    name: 'Lord of the Rings',
    publishYear: 1970,
  },
  meta: {
    isSelected: true,
  },
});

// Using `path` and `changes`, you can create or update multiple things in the state tree at the same time.
store.update('groups', {
  favoriteBooks: store.getResources('books', [20, 54, 120]),
  favoriteMovies: store.getResources('movies', [20, 54, 240]),
});
```

To learn more about `store.update()`, refer to the following guides:

* [Creating resources](../resources/creating-resources.md)
* [Updating resources](../resources/updating-resources.md)
* [Creating groups](../groups/creating-groups.md)
* [Updating groups](../groups/updating-groups.md)

---

### `remove([path], changes)`

Remove things from the store. You can remove:

* One or many resources from the store entirely
* One or many groups from the store entirely
* Specific resources from a group
* Specific pieces of data from resources

#### Arguments

1.  [`path`] _(string)_: An optional string that allows you to specify a path in the state tree
    you are removing. Passing this can allow you to type less code, as it allows you to "drill" into
    the state tree to remove a specific resource or group.
2.  [`changes`] _(object)_: This allows you to further specify the sections of the state tree that you wish
    to delete. Anything that is set to `null` within `changes` will be deleted from the state tree.

#### Returns

None.

#### Example

```js
// In this example, we are using the changes argument to delete the resource.
store.remove({
  resources: {
    books: {
      24: null,
    },
  },
});

// In this example, we are using the path to delete the resource. Note how paths
// allow us to clean things up, compared with the example above.
store.remove('resources.books.24');

// Using `path` and `changes`, you can delete multiple resources at a time.
store.remove('resources.books', [24, 100, 55]);
```

To learn more about the `remove()` method, refer to these guides:

* [Deleting resources](../resources/deleting-resources.md)
* [Removing resource attributes](../resources/updating-resources.md#removing-an-attribute)
* [Deleting groups](../groups/deleting-groups.md)
* [Removing resources from groups](../groups/updating-groups.md#removing-resources-from-a-group)

---

### `getState()`

Returns the entire state tree.

#### Returns

_(Object)_: The current state tree of your application.

#### Notes

* You should use `getResources` and `getGroup` instead of `getState` within your application.
  They are typically more convenient to use than `getState`. `getState` should be
  used for serializing your store in a universal app, or for persisting user state between
  sessions.

#### Example

```js
const store = createResourceStore();

// This will cause the console.log in the listener function to be called.
store.update('resources.books.24', {
  attributes: {
    name: 'Lord of the Rings',
  },
});

store.getState();
// This will return the state with the book with ID of 24 within it
```

---

### `subscribe(listener)`

Subscribe to changes to the store.

#### Arguments

1.  `listener` _(Function)_. A function that will be called anytime that `store.update()`
    or `store.remove()` is called. The listener will be called whether or not the store
    was changed.

#### Returns

_(Function)_: A function that unsubscribes the listener when called.

#### Example

```js
const store = createResourceStore();

const unsubscribe = store.subscribe(() => {
  console.log(
    'The store was just updated. The new state is:',
    store.getState()
  );
});

// This will cause the console.log in the listener function to be called.
store.update('resources.books.24', {
  attributes: {
    name: 'Lord of the Rings',
  },
});

// Later, we can remove our subscription.
unsubscribe();
```
