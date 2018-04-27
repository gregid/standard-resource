# Standard Resource

[![Travis build status](http://img.shields.io/travis/jamesplease/standard-resource.svg?style=flat)](https://travis-ci.org/jamesplease/standard-resource)
[![npm version](https://img.shields.io/npm/v/standard-resource.svg)](https://www.npmjs.com/package/standard-resource)
[![Test Coverage](https://coveralls.io/repos/github/jamesplease/standard-resource/badge.svg?branch=master)](https://coveralls.io/github/jamesplease/standard-resource?branch=master)

> Note: this project is a work in progress.

A standard API for resource management.

✓ Works in Node or in the browser  
✓ Normalizes data  
✓ Flexible: define schemas for extra robustness, or choose not to  
✓ Sophisticated relationship support  

### Installation

This library is not yet ready to be used.

### Data Models

#### State

```
state {
  [resourceType] {
    schema,
    lists {
      [listName] {
        resources: [ ... ]
      }
    }
    resources {
      [id] {
        id,
        resourceType,
        attributes,
        relationships,
      }
    }
  }
}
```

#### Resource

```
{
  id,
  resourceType,
  attributes,
  meta,
  relationships,
  computedAttributes
}
```