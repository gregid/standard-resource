# Creating a Store

Creating a store is the first thing you will do when getting started with Standard Resource.

The export of the library is called `createResourceStore`, and it returns a resource store:

```js
import createResourceStore from 'standard-resource';

const store = createResourceStore();
```

### Initial State

Sometimes, you may want to instantiate a store with initial data. Typically, this is used
for progressive web apps and universal apps.

```js
import createResourceStore from 'standard-resource';

const store = createResourceStore(initialState);
```

### Passing options

`createResourceStore` accepts a second argument, `options`. This allows you to further
configure the store.

Presently, there is only one option: `schemas`. Pass the schemas for your resource types
here.

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
