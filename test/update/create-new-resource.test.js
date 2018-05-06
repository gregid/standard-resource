import update from '../../src/update';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('update - creating a new resource for an existing resource type', function() {
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
      groups: {
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

  it('should create a new resource, array format with a path', () => {
    const newState = update({
      path: 'resources.books',
      state: this.state,
      schemas: this.schemas,
      changes: [
        {
          id: 100,
          attributes: {
            what: true,
          },
          meta: {
            selected: true,
          },
        },
      ],
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
          },
          100: {
            id: 100,
            resourceType: 'books',
            attributes: {
              what: true,
            },
            meta: {
              selected: true,
            },
          },
        },
        authors: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
      groups: {
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

  it('should create a new resource, object format', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: {
            100: {
              id: 100,
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
          100: {
            id: 100,
            resourceType: 'books',
            attributes: {
              what: true,
            },
            meta: {
              selected: true,
            },
          },
        },
        authors: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
      groups: {
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

  it('should create a new resource, array format', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: [
            {
              id: 100,
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
          100: {
            id: 100,
            resourceType: 'books',
            attributes: {
              what: true,
            },
            meta: {
              selected: true,
            },
          },
        },
        authors: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
      groups: {
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

  it('should create a new resource, array/ID format', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: [100],
        },
      },
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
          },
          100: {
            id: 100,
            resourceType: 'books',
            attributes: {},
            meta: {},
          },
        },
        authors: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
      groups: {
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
