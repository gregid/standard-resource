# Motivation

Modern JavaScript applications frequently work with data that is stored in a remote
database. This data is transmitted between the application and the database through
some kind of network layer, such as [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer)
endpoints, a [GraphQL](http://graphql.org/) server, or [gRPC](https://grpc.io/) calls.

Once the data reaches the client, it is commonly stored in a containing object
(a _store_), where it can then be read from, or changed.

There are several libraries that provide stores for you, but existing solutions are
either too _generic_, or too _specific_.

[Redux](https://redux.js.org/) is a notable example of a generic store. It allows you to store
anything that you want within the state tree, as it does not enforce any specific structure. A
consequence of this is that you must implement features such as normalization yourself. While
this isn't an impossible task, it is additional code that you must create and maintain when you
choose to use Redux.

An example of a library that could be considered too _specific_ is [Apollo's](https://www.apollographql.com/)
cache. It is a normalized store, which can make it more convenient to use when working with resources
when compared to Redux. However, Apollo requires that your networking layer be GraphQL. If
you aren't using GraphQL, then you can't use Apollo.

This is where Standard Resource comes in. It is a lightweight, normalized data store with a
powerful API, which allows you to avoid the boilerplate associated with implementing something
similar in Redux. Further, it is agnostic to the network layer that you use. It works well
with RESTful endpoints, GraphQL, gRPC, or something else, making it more general than solutions like Apollo.
