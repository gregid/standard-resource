# `createResourceStore([initialState,] [options])`

Creates a resource store that holds all of the resource data of your app. There should
only be a single resource store in your app.

#### Arguments

1.  `initialState` _(Object)_: The initial state. This can be useful in universal apps or progressive web apps.

2.  [`options`] _(object)_: Optional additional options to configure the store. Presently, the only option is
    `schemas`, which is where you can define schemas for your resource types.

#### Returns

([_`Store`_](Store.md)): An object that holds all of the resource data for your app. It provides methods to
update resources and resource groups, as well as methods to retrieve them from the store.

#### Example

```js
import createResourceStore from 'standard-resource';

const store = createResourceStore();

store.update('resources.books.24', {
  attributes: {
    name: 'Lord of the Rings',
  },
});

console.log(store.getResources('books', ['24']));
// [
//   {
//     id: '24',
//     attributes: { name: 'Lord of the Rings' },
//     meta: {},
//     computedAttributes: {}
//   }
// ]
```
