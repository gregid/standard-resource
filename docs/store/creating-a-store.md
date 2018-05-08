# Creating a Store

Creating a store is the first thing you must do when getting started with Standard Resource.

The default export of the library is called `createResourceStore`; it is a function that returns a store.

```js
import createResourceStore from 'standard-resource';

const store = createResourceStore();
```

Because a store contains all of your resource data, you should not create more than one store for
your application.

### Initial State

Sometimes, you may want to instantiate a store with initial data. Typically, this feature is used
when building progressive web apps, or universal apps.

```js
import createResourceStore from 'standard-resource';

const store = createResourceStore(initialState);
```

### Passing options

`createResourceStore` accepts a second argument, `options`. This allows you to further
configure the store.

Presently, there is only one option: `schemas`. Use this option to configure the store with the
schemas for your resource types.

```js
import createResourceStore from 'standard-resource';
import booksSchema from './books/schema';
import moviesSchema from './movies/schema';
import authorsSchema from './authors/schema';

const store = createResourceStore(null, {
  schemas: {
    books: booksSchema,
    movies: moviesSchema,
    authors: authorsSchema,
  },
});
```

### Using the store

The store has helpful methods to create and update resources and groups. The following guides
will cover how you can do those things.

### Tips

* There should only ever be one store in each application.
