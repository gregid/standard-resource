# Glossary

This is a glossary of the terms used in Standard Resource.

## Store

An Object that holds the State. It provides the API for reading and writing to the State.

There should only be one Store in an application.

## State

A JavaScript object that holds your data. It is the value returned when you call
`store.getState()`.

Although it is not necessary to keep the State serializable as JSON, we strongly encourage you
to do that.

## Resource

A JavaScript object that represents an individual unit of information. For instance,
if you have a Resource Type “books,” then a book resource might be an object for “The Hobbit.”

## Resource ID

A unique identifier for a Resource. It must be a string or a number.

## Resource Type

A name that is used to group similar resources. For instance, two resource types
for a library might be “people” and “books”.

We recommend using plural names for your resource types.

## Resource Data

All of the information for a particular Resource. It is the collection of attributes,
meta, computed attributes, and relationships that define a Resource.

## Attributes

The primary data about a Resource. Typically, this is the information that the server
sends back. For instance, if your Resource represents a book, then some of its attributes
may be `name`, `publishYear`, and `publisher`.

## Meta

Meta is additional data about a Resource. Typically, you should use Meta to store information
that you do not want to send to a server. For instance, if your application allows a user
to select Resources by clicking a checkbox, then you may put an `isSelected` boolean within Meta.

Another example of meta is forms. If a user is allowed to make changes to a Resource,
then you might decide to place the user’s changes within Meta.

## Relationships

Resource data is frequently relational. For instance, a book may have an author, and an
author may have written multiple books.

## Computed Attributes

Sometimes, you may need to display information about a Resource that is derived from other
information about the resource. Computed Attributes are functions that you can define. They
receive the Resource as an argument, and return an attribute value.

## Lists

A collection of Resources. Because they are arrays, they can be ordered. But you can also
use lists for unordered groupings of resources, too. You can make as many lists as you
would like.

An example use case for a list is if your application allows a user to select Resources,
perhaps by checking a checkbox. You may choose to store the selected resources in a List.

## List Name

A unique identifier for a List. It must be a string.

## Schema

A JavaScript object that describes a particular resource type. Defining a schema is
completely optional, but defining one allows for you to use more features of Standard
Resource, such as Computed Attributes and type validation for Resource Data.
