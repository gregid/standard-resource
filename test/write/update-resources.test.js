import updateResources from '../../src/write/update-resources';
import defaultSchema from '../../src/utils/default-schema';

describe('updateResources', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      authors: defaultSchema,
    };

    this.state = {
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    };
  });

  it('should not change the state when called with an empty object', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should replace a list', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          lists: {
            favorites: [10],
          },
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [10],
          new: [1, 5, 10],
        },
        resources: {
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should concatenate a list with concatList: true', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          lists: {
            favorites: [10],
          },
          concatLists: true,
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5, 10],
          new: [1, 5, 10],
        },
        resources: {
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should concatenate a list with concatList: true, preventing duplicates', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          lists: {
            favorites: [10, 10, 10, 2, 5, 10],
          },
          concatLists: true,
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5, 10],
          new: [1, 5, 10],
        },
        resources: {
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should create a new resource, object format', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: {
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
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
            attributes: {
              what: true,
            },
            meta: {
              selected: true,
            },
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should create a new resource, array format', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: [
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
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
            attributes: {
              what: true,
            },
            meta: {
              selected: true,
            },
          },
        },
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should merge a resource with an existing resource, object format', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: {
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
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              firstName: 'James',
              lastName: 'Please',
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should merge a resource with an existing resource, array format', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: [
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
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              firstName: 'James',
              lastName: 'Please',
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should replace a resource with an existing resource, object format', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: {
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
          mergeResources: false,
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should replace a resource with an existing resource, array format', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: [
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
          mergeResources: false,
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });

  it('should create a new resource type, object format', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        sandwiches: {
          resources: {
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
      sandwiches: {
        resourceType: 'sandwiches',
        lists: {},
        resources: {
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
      books: {
        lists: {
          favorites: [2, 5],
          new: [1, 5, 10],
        },
        resources: {
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
      },
      authors: {
        lists: {
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });
  });
});
