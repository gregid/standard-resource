# Motivation

Modern JavaScript applications frequently work with data that is stored in a remote
database. That data is transmitted back and forth between the application and the
database through some kind of network layer, such as RESTful endpoints, a GraphQL
server, or gRPC calls.

Once the data reaches the client, it is typically stored in a containing object (a _store_).

There are numerous libraries that provide stores for you, but existing solutions are
frequently either:

1.  too generic
2.  too specific

Redux is a notable example of a generic store. It allows for you to store anything that
you want within the state tree, as it does not enforce any specific structure. A consequence
of this is that certain nice-to-have, yet tedious-to-implement features are missing,
such as utilities to help with normalization.

An example of a library that could be considered too _specific_ is Apollo's cache. It was
designed specifically to be a normalized store, which can make it more convenient to use
when working with resources than Redux. However, Apollo only works with GraphQL, which is why
one may consider it to be too specific.

This is where Standard Resource comes in. It is a normalized data store with a powerful API,
which allows you to avoid the boilerplate associated with implementing a normalized store with
Redux. Further, it is an appropriate solution to use for any kind of network layer, whether
it is RESTful endpoints, GraphQL, gRPC, or something else.
