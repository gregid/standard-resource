import { createResourceStore } from '../../src';
import { warning } from '../../src/utils/warning';

describe('createResourceStore', () => {
  it('returns an object with the right shape', () => {
    const store = createResourceStore();

    expect(typeof store.getState).toEqual('function');
    expect(typeof store.getGroup).toEqual('function');
    expect(typeof store.getResources).toEqual('function');
    expect(typeof store.update).toEqual('function');
    expect(typeof store.remove).toEqual('function');
    expect(typeof store.subscribe).toEqual('function');
  });

  describe('calling getState', () => {
    it('with no initial state returns an empty object', () => {
      const store = createResourceStore(null, {
        schemas: {
          books: {
            idProperty: 'bookId',
          },
        },
      });
      const state = store.getState();
      expect(state).toEqual({
        groups: {},
        resources: {},
      });
      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('with valid initial state returns the initial state', () => {
      const store = createResourceStore({
        resources: {
          books: {
            24: {
              id: 24,
              resourceType: 'books',
              attributes: {
                name: 'Blah',
              },
            },
          },
        },
        groups: {
          favoriteBooks: [{ id: 24, resourceType: 'books' }],
        },
      });
      const state = store.getState();
      expect(state).toEqual({
        resources: {
          books: {
            24: {
              id: 24,
              resourceType: 'books',
              attributes: {
                name: 'Blah',
              },
            },
          },
        },
        groups: {
          favoriteBooks: [{ id: 24, resourceType: 'books' }],
        },
      });
      expect(warning).toHaveBeenCalledTimes(0);
    });
  });

  it('allows you to create and then retrieve a resource', () => {
    const store = createResourceStore(null, {
      schemas: {
        books: {
          idProperty: 'bookId',
        },
      },
    });

    store.update('resources.books', [{ bookId: 5 }]);

    const resources = store.getResources('books', [5]);
    expect(resources).toEqual([
      {
        bookId: 5,
        resourceType: 'books',
        attributes: {},
        meta: {},
        computedAttributes: {},
      },
    ]);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('allows you to create and then retrieve a group', () => {
    const store = createResourceStore(null);

    store.update('groups.favoriteBooks', [{ id: 5, resourceType: 'books' }]);

    const resources = store.getGroup('favoriteBooks');
    expect(resources).toEqual([
      {
        id: 5,
        resourceType: 'books',
        attributes: {},
        meta: {},
        computedAttributes: {},
      },
    ]);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('allows you to create and then retrieve a group when using a custom idProperty in a schema', () => {
    const store = createResourceStore(null, {
      schemas: {
        books: {
          idProperty: 'bookId',
        },
      },
    });

    store.update('groups.favoriteBooks', [
      { bookId: 5, resourceType: 'books' },
    ]);

    const resources = store.getGroup('favoriteBooks');
    expect(resources).toEqual([
      {
        bookId: 5,
        resourceType: 'books',
        attributes: {},
        meta: {},
        computedAttributes: {},
      },
    ]);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('allows you to create and then delete a resource', () => {
    const store = createResourceStore(null, {
      schemas: {
        books: {
          idProperty: 'bookId',
        },
      },
    });

    store.update('resources.books', [{ bookId: 5 }]);

    expect(store.getResources('books', [5])).toEqual([
      {
        bookId: 5,
        resourceType: 'books',
        attributes: {},
        meta: {},
        computedAttributes: {},
      },
    ]);

    store.remove('resources.books', [{ bookId: 5 }]);

    expect(store.getResources('books', [5])).toEqual([]);
    expect(warning).toHaveBeenCalledTimes(0);
  });

  describe('subscribing', () => {
    it('warns if an invalid callback is supplied', () => {
      const store = createResourceStore(null, {
        schemas: {
          books: {
            idProperty: 'bookId',
          },
        },
      });

      store.subscribe(false);

      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning.mock.calls[0][1]).toEqual('LISTENER_INVALID_TYPE');
      expect(warning.mock.calls[0][2]).toEqual('error');
    });

    it('calls the callback', () => {
      const cb = jest.fn();

      const store = createResourceStore(null, {
        schemas: {
          books: {
            idProperty: 'bookId',
          },
        },
      });

      store.subscribe(cb);
      expect(cb).toHaveBeenCalledTimes(0);

      store.update('resources.books', [{ bookId: 5 }]);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('allows you to unsubscribe', () => {
      const cb = jest.fn();

      const store = createResourceStore(null, {
        schemas: {
          books: {
            idProperty: 'bookId',
          },
        },
      });

      const unsubscribe = store.subscribe(cb);
      expect(cb).toHaveBeenCalledTimes(0);

      store.update('resources.books', [{ bookId: 5 }]);
      expect(cb).toHaveBeenCalledTimes(1);

      unsubscribe();
      unsubscribe();

      store.update('resources.books', [{ bookId: 5 }]);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledTimes(0);
    });
  });
});
