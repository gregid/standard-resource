import PropTypes from 'prop-types';
import updateResources from '../../src/write/update-resources';

const booksSchema = {
  idAttribute: 'bookId',
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

describe('updateResources – PropTypes with a custom schema', function() {
  beforeEach(() => {
    this.state = {
      books: {
        schema: booksSchema,
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
            attributes: {
              firstName: 'sam',
            },
          },
        },
      },
    };
  });

  it('should not warn when an update is valid', () => {
    const newState = updateResources({
      state: this.state,
      changes: {
        books: {
          resources: {
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
      books: {
        schema: booksSchema,
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
      },
    });

    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should warn when an update sets an invalid type on a prop', () => {
    const newState = updateResources({
      state: this.state,
      changes: {
        books: {
          resources: {
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
      books: {
        schema: booksSchema,
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
      },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0]).toEqual([
      'Warning: Failed attribute type: Invalid attribute `lastName` of type `number` supplied to `resource.attributes`, expected `string`.',
    ]);
  });

  it('should warn when an update does not set a required prop on a resource', () => {
    const newState = updateResources({
      state: this.state,
      changes: {
        books: {
          resources: {
            10: {
              bookId: 10,
              attributes: {
                lastName: 'pls',
              },
            },
          },
          mergeResources: false,
        },
      },
    });

    expect(newState).toEqual({
      books: {
        schema: booksSchema,
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
              lastName: 'pls',
            },
            meta: {},
          },
        },
      },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0]).toEqual([
      'Warning: Failed attribute type: The attribute `firstName` is marked as required in `resource.attributes`, but its value is `undefined`.',
    ]);
  });

  it('should not warn when meta is the right value', () => {
    const newState = updateResources({
      state: this.state,
      changes: {
        books: {
          resources: {
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
      books: {
        schema: booksSchema,
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
              firstName: 'sam',
            },
            meta: {
              isSelected: false,
            },
          },
        },
      },
    });

    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should warn when meta is not the right value (array syntax)', () => {
    const newState = updateResources({
      state: this.state,
      changes: {
        books: {
          resources: [
            {
              bookId: 10,
              meta: {
                isSelected: 'yes',
              },
            },
          ],
        },
      },
    });

    expect(newState).toEqual({
      books: {
        schema: booksSchema,
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
              firstName: 'sam',
            },
            meta: {
              isSelected: 'yes',
            },
          },
        },
      },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0]).toEqual([
      'Warning: Failed meta type: Invalid meta `isSelected` of type `string` supplied to `resource.meta`, expected `boolean`.',
    ]);
  });
});
