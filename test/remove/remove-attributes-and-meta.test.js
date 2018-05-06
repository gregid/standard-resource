import remove from '../../src/remove';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('remove - resource attributes and meta', function() {
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
            resourceType: 'books',
            attributes: {
              firstName: 'sandwiches',
              lastName: 'aregood',
            },
            meta: {
              isSelected: true,
              isActive: false,
            },
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

  it('should delete all attributes of a single resource', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      path: 'resources.books.10.attributes',
      changes: null,
    });

    expect(newState).toEqual({
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
            resourceType: 'books',
            attributes: {},
            meta: {
              isSelected: true,
              isActive: false,
            },
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
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should delete all meta of a single resource', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      path: 'resources.books.10.meta',
      changes: null,
    });

    expect(newState).toEqual({
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
            resourceType: 'books',
            attributes: {
              firstName: 'sandwiches',
              lastName: 'aregood',
            },
            meta: {},
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
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });
});
