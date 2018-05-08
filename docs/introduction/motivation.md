# Motivation

Modern JavaScript applications frequently work with data that is stored in a remote
database. That data is transmitted back and forth between the application and the
database through some kind of network layer, such as RESTful endpoints, a GraphQL
server, or gRPC calls.

Once the data reaches the client, it is typically stored in a containing object (a _store_).

There are numerous libraries that provide stores for you, but existing solutions are
frequently either too _generic_, or too _specific_.

Redux is a notable example of a generic store. It allows for you to store anything that
you want within the state tree, as it does not enforce any specific structure. A consequence
of this is that you must implement features such as normalization yourself. This isn't
an impossible task, but it is additional code that you must create and maintain when you
choose to use Redux.

An example of a library that could be considered too _specific_ is Apollo's cache. It is
a normalized store, which can make it more convenient to use when working with resources
when compared to Redux. However, Apollo requires that your networking layer be GraphQL. If
you aren't using GraphQL, then you can't use Apollo's store.

This is where Standard Resource comes in. It is a normalized data store with a powerful API,
which allows you to avoid the boilerplate associated with implementing a normalized store in
Redux. Further, it is agnostic to the network layer that you use. It works well with RESTful
endpoints, GraphQL, gRPC, or something else.
