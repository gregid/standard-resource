# Defining Computed Attributes

Computed attributes are values that are derived from other resource data. For instance, if you
have the following resource,

```js
{
  id: 24,
  resourceType: 'people',
  attributes: {
    firstName: 'James',
    lastName: 'Please'
  }
}
```

and you wish to compute a "display name" that has the value `"James P."`, then you can
use a computed attribute to represent that value.

A computed attribute is a function that is called anytime that the resource
is read from the store. It is passed the `resource` as an argument, and its return value
is the value to use as the computed attribute.

Computed attributes are convenient because you do not need to manually update them.
When you change any of the resource's other attributes, then those changes will be reflected in
that resource's computed attributes automatically.

### Defining a Computed Attribute

Computed attributes are defined in the [schema](../glossary.md#schema) for the resource type.

In the above example, the schema might look like:

```js
export default {
  computedAttributes: {
    displayName(resource) {
      return `${resource.firstName} ${resource.lastName[0]}`;
    },
  },
};
```

> Heads up: you must define a schema to use computed attributes.

### Retrieving Computed Attributes

Computed attributes are evaluated automatically any time that you are returned resources from a call to
[`getResources`](../api-reference/store.md#getresources-resourcetype-filter-options) or
[`getGroup`](../api-reference/store.md#getgroup-groupname-options).

Continuing the example from above:

```js
store.getResources('people', 24);
// [
//   {
//     id: 24,
//     resourceType: 'people',
//     attributes: {
//       firstName: 'James',
//       lastName: 'Please'
//     },
//     meta: {},
//     computedAttributes: {
//       displayName: 'James P.'
//     }
//   }
// ]
```

### Managing Slow Computed Attributes

In the above example, performance should not be an issue because computing the display name
is a quick computation. However, that isn't always the case.

You may have a resource with a computed attribute that is slow to compute.
In those situations, we recommend using the [Reselect](https://github.com/reduxjs/reselect)
library. Reselect will memoize the slow computation, so that it is only re-evaluated when it
needs to be.

Consider a resource with attribute that is an array of several thousands of items that you want
to sort alphabetically. If you are reading this resource from the store frequently, then it
may have a performance impact to sort these with every read.

Here is what it would look like to use Reselect for this computed attribute:

```js
import createSelector from 'reselect';

export default {
  computedAttributes: {
    sortedItems: createSelector(
      resource => resource.attributes.items,
      items => sortItemsAlphabetically(items)
    ),
  },
};
```

In this example, the expensive call to `sortItemsAlphabetically` will only be called whenever
`resource.items` changes.

A brief description of how reselect works is this: you define two functions, a fast one, and a
slow one. The second, slow function, will only be called when the result of the first function
changes.

In the example above, pulling `items` off of the resource attributes is a very quick operation. So
that is what we do in the first function that we pass to `createSelector` (remember, that first
function is supposed to be fast).

Then, in the second function that, we do the slow operation.

Although this covers the primary usage of Reselect with Standard Resource, we encourage you to
look at the project's [documentation](https://github.com/reduxjs/reselect) to learn about
its other features.

> Heads up: Reselect describes itself as being a project for [Redux](https://redux.js.org), but
> that is a misleading description. Although it was originally designed to be used with Redux,
> Reselect is a general-purpose JavaScript utility that makes sense to be used in many applications,
> independent of whether or not the application is using Redux.
