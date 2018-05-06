import remove from '../../src/remove';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('remove - entire resource type', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      author: defaultSchema,
    };

    this.state = {
      resources: {
        books: {
          2: {
            id: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
        authors: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
      groups: {
        favoriteThings: [
          {
            resourceType: 'books',
            id: 2,
          },
          {
            resourceType: 'books',
            id: 5,
          },
          {
            resourceType: 'authors',
            id: 10,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            id: 1,
          },
          {
            resourceType: 'books',
            id: 5,
          },
          {
            resourceType: 'books',
            id: 10,
          },
        ],
        things: [
          {
            id: 10,
            resourceType: 'authors',
          },
        ],
      },
    };
  });

  it('should remove an entire resource type', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      path: 'resources.books',
      changes: null,
    });

    expect(newState).toEqual({
      resources: {
        books: {},
        authors: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
      groups: {
        favoriteThings: [
          {
            resourceType: 'authors',
            id: 10,
          },
        ],
        newBooks: [],
        things: [
          {
            id: 10,
            resourceType: 'authors',
          },
        ],
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });
});
