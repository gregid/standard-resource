# Creating Lists

Use `store.update()` to create a list. You need two things to create
a list: a name and the resources that you would like to add to the list.

### List Names

Lists are identified by their name. A list name is a string. Typically, you'll use a
name that describes what is in the list. For instance, if the user can select books
in your interface, than you may have a list named `"selectedBooks"`.

You use the list name to update the contents of the list, and to retrieve it from
the state tree.

Here are some examples of list names:

* `"selectedBooks"`
* `"favoriteBooks"`
* `"recentBooks"`

### Creating Lists

Once you have decided on a list name, you can make a list. Typically, it is convenient to
use `store.getResources()` when you are creating a list, as the following example
demonstrates:

```js
const booksToAdd = getResources('books', [2]);

store.update('lists.selectedBooks', booksToAdd);
```

If the order of the resources within your list don't matter, then you can also pass an
object when creating a list:

```js
const booksToAdd = getResources('books', [2], { byId: true });

store.update('lists.selectedBooks', booksToAdd);
```

### Duplicates

Lists prevent duplicate resources from appearing within them.

There is no way to disable this behavior, but that is only because we have not run into a use
case where that has been necessary. If that is a feature that you need, just let us know in
[this issue](https://github.com/jamesplease/standard-resource/issues/95).

### Multiple Resource Types in a List

Lists can have resources of multiple types within them. In this example, we add books
and movies to the `"favoriteThings"` list:

```js
store.update('lists.favoriteThings', [
  { id: 54, resourceType: 'books' },
  { id: 22, resourceType: 'books' },
  { id: 'a9b0', resourceType: 'movies' },
  { id: 70, resourceType: 'books' },
  { id: 'b220', resourceType: 'movies' },
]);
```

### State Tree Structure

A list is stored as an array of IDs in your state tree. For instance, here is what
a state tree with a `selectedBooks` list might look like:

```js
{
  lists: {
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

You do not need to pass full resource objects when creating lists. Instead, you just need
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

* Resources that don't exist at the time that you add them to a list will be created for you. This is
  useful if you need to create a resource and add it to a list at the same time.

* Your application will be easier to debug if you do your best to keep the list names static. There may
  be use cases for dynamic list names, but we encourage you to use them sparingly.
