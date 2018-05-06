# Reading

There are two methods for retrieving data from the store:

* `getResources`: retrieve resources
* `getGroup`: retrieve a group

### `getResources`

This method is used for reading resources from the state tree. In
this example, we get all of the selected books:

```js
import store from './resource-store';

const selectedBooks = store.getResources('books', {
  meta: {
    isSelected: true,
  },
});
```

`getResources` is a powerful method that allows you to retrieve
resources in a variety of different ways. To learn more about
the extent of the API, refer to the `store.getResources()` guide
within the API reference section of these docs.

### `getGroup`

This method is used to retrieve a single group from the state tree.

```js
import store from './resource-store';

const selectedBooks = store.getGroup('favoriteBooks');
```

To learn more about this method, refer to the `store.getResources()`
guide within the API reference section of these docs.
