import update from '../../src/update';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('update', function() {
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
    const newState = update({
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

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should replace a list', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should concatenate a list with concatList: true', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should concatenate a list that didnt exist before with concatList: true', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          lists: {
            newList: [10],
          },
          concatLists: true,
        },
      },
    });

    expect(newState).toEqual({
      books: {
        lists: {
          favorites: [2, 5],
          newList: [10],
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should concatenate a list with concatList: true, preventing duplicates', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should create a new resource, array format with a path', () => {
    const newState = update({
      path: 'books.resources',
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
            resourceType: 'books',
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should create a new resource, object format', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should create a new resource, array format', () => {
    const newState = update({
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
            resourceType: 'books',
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should create a new resource, array/ID format', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
          resources: [100],
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
            resourceType: 'books',
            attributes: {},
            meta: {},
            id: 100,
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should merge a resource with an existing resource, object format', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should merge a resource with an existing resource, array format', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should replace a resource with an existing resource, object format', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should replace a resource with an existing resource, array format', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should create a new resource type, object format', () => {
    const newState = update({
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
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('allows you to create a resource by specifying it in a list (ID form)', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        authors: {
          lists: {
            favorites: [2],
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
        },
      },
      authors: {
        lists: {
          favorites: [2],
          things: [10],
        },
        resources: {
          2: {
            id: 2,
            resourceType: 'authors',
            attributes: {},
            meta: {},
          },
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('allows you to create a resource by specifying it in a list (object form)', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        authors: {
          lists: {
            favorites: [
              {
                id: 2,
                attributes: {
                  firstName: 'wot',
                  lastName: 'pls',
                },
                meta: {
                  isSelected: false,
                },
              },
            ],
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
        },
      },
      authors: {
        lists: {
          favorites: [2],
          things: [10],
        },
        resources: {
          2: {
            id: 2,
            resourceType: 'authors',
            attributes: {
              firstName: 'wot',
              lastName: 'pls',
            },
            meta: {
              isSelected: false,
            },
          },
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });
});
