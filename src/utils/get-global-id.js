// Returns a string that is suitable to be used as a global ID. Within reason, it will
// be unique across resources as well as resource types.
//
// Note that it is not perfect. For instance, there will be a a conflict between:
//
// { id: '1:', resourceType: 'hi' }
// { id: '1', resourceType: ':hi' }
//
// As unlikely as situations like this are naturally, Standard Resource will also
// warn you if you include a : in your resource type.
export default function getGlobalId({ id = '', resourceType = '' } = {}) {
  return `${id}:${resourceType}`;
}
