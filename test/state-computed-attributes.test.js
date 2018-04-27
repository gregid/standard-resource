import createResourceStore from '../src/create-resource-store';
import defaultSchema from '../src/initialization/default-schema';

describe('createResourceStore - computedAttributes', () => {
  describe('calling getState', () => {
    it('returns the resource types and computed attributes', () => {
      const store = createResourceStore(
        null,
        {
          books: {
            resources: {
              1: {
                id: 1,
                resourceType: 'books',
                attributes: {
                  firstName: 'ok',
                },
              },
            },
          },
        },
        {
          computedAttributes: {
            something(state) {
              return (
                state.resourceTypes.books.resources[1].attributes.firstName +
                ' please'
              );
            },
          },
        }
      );

      const state = store.getState();

      expect(state).toEqual({
        something: 'ok please',
        resourceTypes: {
          books: {
            schema: defaultSchema,
            resources: {
              1: {
                id: 1,
                resourceType: 'books',
                attributes: {
                  firstName: 'ok',
                },
              },
            },
          },
        },
      });
    });
  });
});
