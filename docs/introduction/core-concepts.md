# Core Concepts

Standard Resource has two core concepts: **resources** and **groups**.

### Resources

A resource is an atomic unit of data. For instance, if you have an object that represents
a particular book, then that would be a resource.

Typically, resources are stored in a remote database, and are sent to your application through
a network request of some kind, such as a RESTful endpoint or as a response to a GraphQL
query.

Resources can have attributes associated with them. In the case of a book, the book might
have a name and a publish year.

In Standard Resource, all of your resources are stored in a single state tree. Standard
Resource provides a convenient API for reading data from the state tree, as well as updating data
in the tree.

### Groups

A common requirement of applications is to group resources together. You might need an ordered
group of resources, such as when a user arranges some resources within a list in the UI. Or,
you might need an unordered group, like when a user selects some resources by checking
checkboxes in the app.

Groups were designed to support these sorts of situations. Like resources, groups are stored in
the state tree.
