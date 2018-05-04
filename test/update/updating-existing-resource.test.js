import update from '../../src/update';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('update - existing resource', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      authors: defaultSchema,
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

  it('should merge a resource with an existing resource, object format', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: {
            2: {
              id: 2,
              attributes: {
                what: true,
              },
              meta: {
                selected: true,
              },
            },
          },
        },
      },
    });

    expect(newState).toEqual({
      resources: {
        books: {
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              what: true,
              firstName: 'James',
              lastName: 'Please',
            },
            meta: {
              selected: true,
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
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should merge a resource with an existing resource, array format', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: [
            {
              id: 2,
              attributes: {
                what: true,
              },
              meta: {
                selected: true,
              },
            },
          ],
        },
      },
    });

    expect(newState).toEqual({
      resources: {
        books: {
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              what: true,
              firstName: 'James',
              lastName: 'Please',
            },
            meta: {
              selected: true,
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
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should replace a resource with an existing resource, object format', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      options: {
        merge: false,
      },
      changes: {
        resources: {
          books: {
            2: {
              id: 2,
              attributes: {
                what: true,
              },
              meta: {
                selected: true,
              },
            },
          },
        },
      },
    });

    expect(newState).toEqual({
      resources: {
        books: {
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              what: true,
            },
            meta: {
              selected: true,
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
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should replace a resource with an existing resource, array format', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      options: {
        merge: false,
      },
      changes: {
        resources: {
          books: [
            {
              id: 2,
              attributes: {
                what: true,
              },
              meta: {
                selected: true,
              },
            },
          ],
        },
      },
    });

    expect(newState).toEqual({
      resources: {
        books: {
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              what: true,
            },
            meta: {
              selected: true,
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
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });
});
