# Deleting Resources

Use [`store.remove()`](../api-reference/store.md#remove-path-changes) to delete resources.

### Deleting a Single Resource

In this example, we delete the books resource with an ID of 24.

```js
store.remove('resources.books.24');
```

### Deleting Every Resource of a Type

Should you ever need to delete every resource of a specific resource type, you
can also do that using `remove()`.

```js
store.remove('resources.books');
```

### Deleting Multiple Resources at Once

You can use `remove` to delete more than one resource at a time. Here's an example
that demonstrates deleting a handful of books, a pair of authors, and every movie:

```js
store.remove('resources', {
  books: [24, 50, 22],
  authors: ['ab9ee', '8hx01'],
  movies: null,
});
```
