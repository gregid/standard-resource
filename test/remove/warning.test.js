import remove from '../../src/remove';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('remove', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      author: defaultSchema,
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

  it('warn and not change the state when called with an invalid changes object', () => {
    const newState = remove({
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
      'DELETE_RESOURCES_INVALID_CHANGES_OBJECT'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and not change the state when called with an invalid resource type changes object', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: true,
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
    expect(warning.mock.calls[0][1]).toEqual('DELETE_RESOURCES_INVALID_TYPE');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and not change the state when called with an invalid resource.resources object', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
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
      'DELETE_RESOURCES_INVALID_RESOURCES'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warn and not change the state when called with an invalid resource.lists object', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        books: {
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
    expect(warning.mock.calls[0][1]).toEqual('DELETE_RESOURCES_INVALID_LISTS');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('should not change the state when called with an empty object', () => {
    const newState = remove({
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
      'DELETE_RESOURCES_INVALID_CHANGES_OBJECT'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });
});
