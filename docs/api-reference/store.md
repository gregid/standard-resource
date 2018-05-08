# Store

A store holds the whole state tree of your application.

To create a store, use [`createResourceStore`](create-resource-store.md);

A store is not a class. It's just an object with a few methods on it.  
To create it, pass your root [reducing function](../Glossary.md#reducer) to [`createStore`](createStore.md).

### Store Methods

* [`getResources()`](#getResources)
* [`getGroup()`](#getGroup)
* [`update()`](#update)
* [`remove()`](#remove)
* [`getState()`](#getState)
* [`subscribe(listener)`](#subscribe)

## Store Methods

### <a id='getResources'></a>[`getResources(resourceType, [filter], [options])`](#getResources)

Retrieve resources from the state tree.

#### Arguments

1.  `resourceType` _(string)_: The type of resource to be retrieved.
2.  [`filter`] _(Array|Object|function)_: A filter to apply to the resources. By default, every resource
    will be returned.
3.  [`options`] _(Object)_: An object to customize the response. Presently, there is only one option:
    `byId`. Pass `true` to receive the resources as an Object keyed by ID rather than as an array.

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

---

### <a id='getGroup'></a>[`getGroup(groupName, [options])`](#getGroup)

Retrieve a group from the state tree.

#### Arguments

1.  `groupName` _(string)_: The name of the group to be retrieved.
2.  [`options`] _(Object)_: An object to customize the response. Presently, there is only one option:
    `byId`. Pass `true` to receive the resources as an Object keyed by ID rather than as an array.

#### Returns

_(Array|Object)_: The resources contained in the group.

#### Example

```js
const selectedBooks = store.getGroup('selectedBooks', { byId: true });
```

---

### <a id='update'></a>[`update([path], changes)`](#update)

Create or update resources and groups within the state tree.

#### Arguments

1.  First argument here.

#### Returns

None.

#### Notes

Notes here.

#### Example

Example here.

---

### <a id='remove'></a>[`remove([path], changes)`](#remove)

Remove things from the store. You can remove:

* One or many resources from the store entirely
* One or many groups from the store entirely
* Specific resources from a group
* Specific pieces of data from resources

#### Arguments

1.  First argument here.

#### Returns

None.

#### Notes

Notes here.

#### Example

Example here.

---

### <a id='getState'></a>[`getState()`](#getState)

Returns the entire state tree.

#### Returns

_(Object)_: The current state tree of your application.

#### Notes

* You should prefer using `getResources` and `getGroup` over `getState`
  within your application. `getState` can be useful for serializing your store
  in a universal app, or for persisting user state between sessions. But it is
  not intended to be used extensively within your application's code.

---

### <a id='subscribe'></a>[`subscribe(listener)`](#subscribe)

Subscribe to changes to the store.

#### Arguments

1.  `listener` _(Function)_. A function that will be called anytime that `store.update()`
    or `store.remove()` is called. The listener will be called whether or not the store
    was changed.

#### Returns

_(Function)_: A function that unsubscribes the listener when called.
