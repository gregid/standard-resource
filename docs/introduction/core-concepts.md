# Core Concepts

Standard Resource has two core concepts: resources and lists.

### Resources

A resource is an atomic unit of data. For instance, if you have an object that represents
a particular book, then that would be a resource.

Typically, resources are stored in a remote database somewhere, and are sent to your
application through a network request of some kind.

Resources can have attributes associated with them. In the case of a book, the book might
have a name and a publish year.

In Standard Resource, all of your resources are stored in a single state tree. And
you get a convenient API for reading data from the state tree, as well as updating data
in the tree.

### Lists

Frequently, applications require you to group resources together. You may need an ordered
list, such as if a user has arranged a specific set of resources in a particular order.
Or, you might need an unordered list, such as if a user has selected a grouping of resources
by checking checkboxes in your app.

Lists can be used for both of these situations.

Like resources, lists are stored in the state tree.
