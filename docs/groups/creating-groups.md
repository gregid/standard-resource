# Creating Groups

Use [`store.update()`](../api-reference/store.md#update-path-changes-options) to create a group. You need
two things to create a group: a name and the resources that you would like to add to the group.

### Group Names

Groups are identified by their name. A group name is a string. Typically, you'll use a
name that describes what is in the group. For instance, if the user can select books
in your interface, than you may have a group named `"selectedBooks"`.

You use the group name to update the contents of the group, and to retrieve it from
the state tree.

Here are some examples of group names:

* `"selectedBooks"`
* `"favoriteBooks"`
* `"recentBooks"`

### Creating Groups

Once you have decided on a group name, you can make a group. Typically, it is convenient to
use `store.getResources()` when you are creating a group, as the following example
demonstrates:

```js
const booksToAdd = getResources('books', [2]);

store.update('groups.selectedBooks', booksToAdd);
```

If the order of the resources within your group don't matter, then you can also pass an
object when creating a group:

```js
const booksToAdd = getResources('books', [2], { byId: true });

store.update('groups.selectedBooks', booksToAdd);
```

### Duplicates

Groups prevent duplicate resources from appearing within them.

There is no way to disable this behavior, but that is only because we have not run into a use
case where that has been necessary. If that is a feature that you need, just let us know in
[this issue](https://github.com/jamesplease/standard-resource/issues/95).

### Multiple Resource Types in a Group

Groups can have resources of multiple types within them. In this example, we add books
and movies to the `"favoriteThings"` group:

```js
store.update('groups.favoriteThings', [
  { id: 54, resourceType: 'books' },
  { id: 22, resourceType: 'books' },
  { id: 'a9b0', resourceType: 'movies' },
  { id: 70, resourceType: 'books' },
  { id: 'b220', resourceType: 'movies' },
]);
```

### State Tree Structure

A group is stored as an array of IDs in your state tree. For instance, here is what
a state tree with a `selectedBooks` group might look like:

```js
{
  groups: {
    selectedBooks: [
      {id: 50, resourceType: 'books'},
      {id: 22, resourceType: 'books'},
      {id: 3, resourceType: 'books'}
    ],
  },
  resources: {
    // Resources are stored here, by their type
  }
}
```

### Resource Pointers

You do not need to pass full resource objects when creating groups. Instead, you just need
to pass Resource Pointers. A resource pointer is an object that has a unique identifier and
a resource type.

In pseudocode, a resource type looks like the following:

```
{
  [schema.idProperty],
  resourceType
}
```

Because a full resource is also a resource pointer, it is typically more convenient to use `getResources` when
creating a lis rather than manually creating resource pointers.

### Tips

* Resources that don't exist at the time that you add them to a group will be created for you. This is
  useful if you need to create a resource and add it to a group at the same time.

* Your application will be easier to debug if you do your best to keep the group names static. There may
  be use cases for dynamic group names, but we encourage you to use them sparingly.
