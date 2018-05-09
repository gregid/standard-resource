# Core Concepts

Standard Resource has two core concepts: **resources** and **groups**.

### Resources

A resource is an atomic unit of data. For instance, if you have an object that represents
a particular book, then that is a resource.

Typically, resources are stored in a remote database, and are sent to your application through
a network request of some kind, such as a RESTful endpoint or as a response to a GraphQL
query.

Resources can have attributes associated with them. In the case of a book, it might have a
name and a publish year.

In Standard Resource, all of your resources are stored in a single state tree, and the library
provides a succinct, but powerful API for retrieving and updating data in the tree.

### Groups

A group is a collection of resources. Groups can be ordered, or they can be unordered.

Groups are designed for the common use case applications have of needing to organize resources together.
Your application may need an ordered group of resources, such as when a user arranges some resources within
a list in the UI. Or, it may might need an unordered group, like when a user selects some resources by
checking checkboxes in the app.

Anytime that you need to organize resources together for any use case, you can use groups.

Groups are stored in the state tree alongside your resources.
