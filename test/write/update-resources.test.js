import updateResources from '../../src/write/update-resources';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

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

  it('warn and not should not change the state when called with an invalid changes object', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: true,
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

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual(
      'UPDATE_RESOURCES_INVALID_CHANGES_OBJECT'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and not should not change the state when called with an invalid resource change', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: true,
        authors: {},
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
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('UPDATE_RESOURCES_INVALID_TYPE');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and not should not change the state when called with an invalid resource.resources object', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        authors: {
          resources: true,
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
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual(
      'UPDATE_RESOURCES_INVALID_RESOURCES'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and ignore invalid resource.lists ids', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        authors: {
          lists: {
            favorites: [2, true],
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
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('ID_FROM_RESOURCE_INVALID_ID');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and ignore missing resource.lists ids, object form', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        authors: {
          lists: {
            favorites: [2, {}],
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
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual(
      'ID_FROM_RESOURCE_MISSING_ID_IN_OBJECT'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and ignore invalid resource.lists ids, object form', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        authors: {
          lists: {
            favorites: [2, { id: {} }],
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
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual(
      'ID_FROM_RESOURCE_INVALID_ID_OBJECT'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and not should not change the state when called with an invalid resource.lists object', () => {
    const newState = updateResources({
      state: this.state,
      schemas: this.schemas,
      changes: {
        authors: {
          lists: true,
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
          things: [10],
        },
        resources: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('UPDATE_RESOURCES_INVALID_LISTS');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and ignore a resource without an ID', () => {
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
            {
              attributes: {
                soda: true,
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

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('MISSING_ID_UPSERT');
    expect(warning.mock.calls[0][2]).toEqual('error');
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

  it('should concatenate a list that didnt exist before with concatList: true', () => {
    const newState = updateResources({
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

  it('should create a new resource, array format with a path', () => {
    const newState = updateResources({
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

  it('should create a new resource, array/ID format', () => {
    const newState = updateResources({
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
