import PropTypes from 'prop-types';
import update from '../../src/update';
import { warning } from '../../src/utils/warning';

const booksSchema = {
  idProperty: 'bookId',
  idType: PropTypes.number,
  attributes: {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    age: PropTypes.number,
  },
  meta: {
    isSelected: PropTypes.bool,
  },
};

describe('update – PropTypes with a custom schema', function() {
  beforeEach(() => {
    this.schemas = {
      books: booksSchema,
    };

    this.state = {
      resources: {
        books: {
          2: {
            bookId: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            bookId: 5,
          },
          10: {
            bookId: 10,
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
            bookId: 2,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            bookId: 1,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
          {
            resourceType: 'books',
            bookId: 10,
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

  it('should not warn when an update is valid', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: {
            10: {
              attributes: {
                firstName: 'james',
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
            bookId: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            bookId: 5,
          },
          10: {
            bookId: 10,
            resourceType: 'books',
            attributes: {
              firstName: 'james',
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
            bookId: 2,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            bookId: 1,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
          {
            resourceType: 'books',
            bookId: 10,
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

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should warn when an update sets an invalid type on a prop', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: {
            10: {
              attributes: {
                firstName: 'james',
                lastName: 2,
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
            bookId: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            bookId: 5,
          },
          10: {
            bookId: 10,
            resourceType: 'books',
            attributes: {
              firstName: 'james',
              lastName: 2,
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
            bookId: 2,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            bookId: 1,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
          {
            resourceType: 'books',
            bookId: 10,
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

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0]).toEqual([
      'Warning: Failed attribute type: Invalid attribute `lastName` of type `number` supplied to `resource.attributes`, expected `string`.',
    ]);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should warn when an update does not set a required prop on a resource', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: {
            10: {
              attributes: {
                lastName: 'please',
              },
            },
          },
        },
      },
      merge: false,
    });

    expect(newState).toEqual({
      resources: {
        books: {
          2: {
            bookId: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            bookId: 5,
          },
          10: {
            bookId: 10,
            resourceType: 'books',
            attributes: {
              lastName: 'please',
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
            bookId: 2,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            bookId: 1,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
          {
            resourceType: 'books',
            bookId: 10,
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

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0]).toEqual([
      'Warning: Failed attribute type: The attribute `firstName` is marked as required in `resource.attributes`, but its value is `undefined`.',
    ]);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should not warn when meta is the right value', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: {
            10: {
              meta: {
                isSelected: false,
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
            bookId: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            bookId: 5,
          },
          10: {
            bookId: 10,
            resourceType: 'books',
            attributes: {},
            meta: {
              isSelected: false,
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
            bookId: 2,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            bookId: 1,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
          {
            resourceType: 'books',
            bookId: 10,
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

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should warn when meta is not the right value (array syntax)', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        resources: {
          books: {
            10: {
              meta: {
                isSelected: 'yes',
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
            bookId: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            bookId: 5,
          },
          10: {
            bookId: 10,
            resourceType: 'books',
            attributes: {},
            meta: {
              isSelected: 'yes',
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
            bookId: 2,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            bookId: 1,
          },
          {
            resourceType: 'books',
            bookId: 5,
          },
          {
            resourceType: 'books',
            bookId: 10,
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

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0]).toEqual([
      'Warning: Failed meta type: Invalid meta `isSelected` of type `string` supplied to `resource.meta`, expected `boolean`.',
    ]);
    expect(warning).toHaveBeenCalledTimes(0);
  });
});
