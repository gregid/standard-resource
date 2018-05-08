# Resource Data

Each resource has data associated with it. Resource data is organized
into different categories:

* `resourceType`: a string that represents the type of this resource. For instance,
  `books` or `movies`
* `id`: a unique identifier that distinguishes a resource from another resource
  of the same type
* `attributes`: the primary information about the resource. Typically, this is the
  data that the server sends to you. If you have a book resource, then the `title`
  and `releaseYear` would be `attributes`.
* `meta`: similar to `attributes`, but this is for information that the server does
  not understand. For instance, form data or other information that the client uses.
* `computedAttributes`: information about the resource that is derived from the resource's
  other information.

### Resource Type

A resource type is a way to group resources that represent the same _kind_ of data
together.

For instance, if your application manages books and people, then you have two resource
types:

1.  books
2.  people

Each resource object has a `resourceType` property that is its type. An example book
resource is:

```js
{
  id: 24,
  resourceType: 'books',
  attributes: {},
  meta: {},
  computedAttributes: {},
}
```

### ID

Every resource must have a unique identifier, or ID for short. This ID is what distinguishes one
resource of a particular [resource type](./type.md) from another resource of the same
type.

In the following books resource, you can see the unique identifier, `24`, under the `id` property:

```js
{
  id: 24,
  resourceType: 'books',
  attributes: {},
  meta: {},
  computedAttributes: {},
}
```

Attributes is usually the data that the server understands. If your resources are stored in a
database, then the attributes may be the columns of the table.

We do not encourage placing client-side information within `attributes.` In fact, a best practice
is to never modify `attributes` directly. Instead, treat `attributes` as the last known representation
of the resource that the server understands.

If a user can make changes to a resource, store that information elsewhere (such as in resource metadata,
described below). You can update the attributes once you have synchronized the user's changes with the
backend by making a network request to save the data.

#### Uniqueness

IDs must be unique within each resource type. Two resources that are not of the same resource type
may have the same ID, however.

#### Type

IDs must be either a string or a number.

#### Configuring the ID

To have further control over the ID, you can define a [resource schema](schemas.md).

### Attributes

Attributes are the primary data about a resource. For instance, if you have a book, then some of its
primary attributes might be its name and the year it was published.

This is an example resource with some attributes:

```js
{
  id: '24',
  resourceType: 'books',
  attributes: {
    name: 'The Fellowship of the Ring',
    publishYear: 1940
  },
  meta: {},
  computedAttributes: {},
}
```

### Meta

Metadata (meta for short) is additional information about a resource; typically,
it is information that only makes sense on the client, and that you do not want
to persist to the server.

For instance, your application may allow a user to "select" resources that are displayed
in the UI by checking checkboxes. You may represent this in your state by storing
an `isSelected` value on the selected resource's meta.

The only difference between attributes and meta is how the information is used. In general,
`attributes` is the data that the server understands, and `meta` is the data that only makes
sense on the client.

Here is an example resource with some metadata:

```js
{
  id: '24',
  resourceType: 'books',
  attributes: {
    name: 'The Fellowship of the Ring',
    publishYear: 1940
  },
  meta: {
    isSelected: true
  },
  computedAttributes: {},
}
```

### Computed Attributes

Sometimes, you may want to define information that is derived from other information about the resource.
This is what computed attributes are for.

To learn more about them, refer to the [Using Computed Attributes guide](using-computed-attributes.md).

### Tips

* We recommend using a plural name for your resource types. For instance, use
  "people" and not "person".
