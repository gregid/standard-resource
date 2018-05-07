# Motivation

Modern JavaScript applications frequently work with data stored in a remote
database. That data is transmitted back and forth between the application and the
database through some kind of network layer, such as RESTful endpoints, a GraphQL
server, or gRPC calls.

Once the data reaches the client, it is typically stored in a containing object (a _store_)
somewhere.

There are numerous libraries that provide stores for you. Existing solutions are
either:

1.  too generic
2.  too specific

Redux is a notable example of a generic store. It allows for you to store anything that
you want within state, and it does not enforce any specific structure. A consequence
of this is that certain nice-to-have, yet tedious-to-implement features are missing,
such as tools to help with normalization.

Apollo's cache, on the other hand, is specifically designed to be a normalized data store.
However, Apollo only works with GraphQL.

This is where Standard Resource comes in. It is a normalized data store with a powerful API,
which allows you to avoid the boilerplate associated with implementing a normalized store with
Redux. And it is an appropriate solution to use no matter your network layer, whether
it be RESTful endpoints, GraphQL, gRPC, or anything else.
