import remove from '../../src/remove';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('remove - resources', function() {
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
      lists: {
        favoriteBooks: [
          {
            resourceType: 'books',
            id: 2,
          },
          {
            resourceType: 'books',
            id: 5,
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

  it('should delete a bulk selection of things', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: [{ id: 2 }, 5],
          authors: ['a'],
        },
        lists: ['newBooks', 'things'],
      },
    });

    expect(newState).toEqual({
      resources: {
        books: {
          10: {
            id: 10,
          },
        },
        authors: {
          b: { id: 'b' },
        },
      },
      lists: {
        favoriteBooks: [],
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });
});
