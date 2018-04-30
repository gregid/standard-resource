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
        books: {
          lists: {
            favorites: [2, 5, true],
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
        books: {
          lists: {
            favorites: [2, 5, {}],
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
        books: {
          lists: {
            favorites: [2, 5, { id: {} }],
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

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('MISSING_ID_UPSERT');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });
});
