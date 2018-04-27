# Validators

A validator is a function that checks the validity of an
object that you pass to ResourceBase.

### Returning `true`

If a validator returns `true`, then the object has no problems,
and the library will behave as expected.

### Returning `false`

If `false` is returned, then the object will be ignored, because
trying to process it would cause the structure of the state to be
messed up in such a way that ResourceBase would no longer work
as expected.

### Console errors

Sometimes, a validator may return `true` even if there are problems.
This is because not every problem would break ResourceBase.

For instance, if you are trying to enforce the `name` attribute of
a particular resource type as a string, and a number is passed.
ResourceBase will continue to work if this change is applied, so
it will be.

In these situations, an error will be logged to the console.