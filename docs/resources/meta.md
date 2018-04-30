# Meta

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

### Working With Meta Data

Everything that you know about working with attributes applies to meta data as well. You create,
update, and remove meta in the same way that you manipulate attributes.
