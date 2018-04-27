# Standard Resource

> Note: this project is a work in progress.

A standard API for resource management.

✓ Works in Node or in the browser  
✓ Normalizes data  
✓ Flexible: define schemas for extra robustness, or choose not to  
✓ Sophisticated relationship support  

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