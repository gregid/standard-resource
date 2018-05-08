# Standard Resource

[![Travis build status](http://img.shields.io/travis/jamesplease/standard-resource.svg?style=flat)](https://travis-ci.org/jamesplease/standard-resource)
[![npm version](https://img.shields.io/npm/v/standard-resource.svg)](https://www.npmjs.com/package/standard-resource)
[![Test Coverage](https://coveralls.io/repos/github/jamesplease/standard-resource/badge.svg?branch=master)](https://coveralls.io/github/jamesplease/standard-resource?branch=master)
[![gzip size](http://img.badgesize.io/https://unpkg.com/standard-resource/dist/standard-resource.min.js?compression=gzip)](https://unpkg.com/standard-resource/dist/standard-resource.min.js)

A normalized data store.

✓ Works in Node or in the browser  
✓ Normalizes data  
✓ Flexible: define schemas for extra robustness, or choose not to  
✘ Sophisticated relationship support (_coming soon_)

### Installation

> Note: this library is not yet ready to be used.

Install using [npm](https://www.npmjs.com):

```
npm install standard-resource
```

or [yarn](https://yarnpkg.com/):

```
yarn add standard-resource
```

### Quick Start

Follow this guide to get a taste of what it's like to work with Standard
Resource.

First, we create a store. A store is where all of our resource data will be
located.

```js
import createResourceStore from 'standard-resource';

const store = createResourceStore();
```

Next, we can add a resource to the store. Let's create add a book
with an ID of "24":

```js
store.update('resources.books.24', {
  attributes: {
    name: 'The Lord of the Rings',
  },
});
```

Now that we have created our book, we can retrieve it.

```js
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

This is just a small sample of what it's like working with Standard Resource.
