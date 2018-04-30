import read from '../../src/read';
import { warning } from '../../src/utils/warning';
import defaultSchema from '../../src/utils/default-schema';

describe('read', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      authors: {
        ...defaultSchema,
        idProperty: 'authorId',
      },
    };

    this.state = {
      books: {
        lists: {
          newBooks: [1, 2],
        },
        resources: {
          1: {
            id: 1,
            resourceType: 'books',
            attributes: {
              name: 'A',
            },
            meta: {
              selected: true,
            },
          },
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              name: 'B',
            },
          },
          50: {
            resourceType: 'books',
            id: 50,
            meta: {
              selected: false,
            },
          },
        },
      },
      authors: {
        resources: {
          a: {
            authorId: 'a',
            resourceType: 'authors',
            attributes: {
              name: 'J.K. Rowling',
              contracts: {
                en: {
                  purpose: 'book',
                },
                es: {
                  purpose: 'talk',
                },
              },
            },
          },
        },
      },
    };
  });

  it('should warn when an invalid resourceType is passed', () => {
    const result = read({
      state: this.state,
      schemas: this.schemas,
      resourceType: true,
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual(
      'GET_RESOURCES_INVALID_RESOURCE_TYPE'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
    expect(result).toEqual([]);
  });

  it('should warn when a nonexistent resource section is attempted to be filtered', () => {
    const result = read({
      state: this.state,
      schemas: this.schemas,
      resourceType: 'ooglaboogla',
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('GET_RESOURCES_NONEXISTENT_TYPE');
    expect(result).toEqual([]);
  });

  it('should warn when an invalid filter is passed', () => {
    const result = read({
      state: this.state,
      schemas: this.schemas,
      resourceType: 'books',
      filter: /a/,
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('INVALID_GET_RESOURCES_FILTER');
    expect(warning.mock.calls[0][2]).toEqual('error');
    expect(result).toEqual([]);
  });

  it('should warn when an invalid filter array is passed', () => {
    const result = read({
      state: this.state,
      schemas: this.schemas,
      resourceType: 'books',
      filter: [1000, /a/, {}],
    });

    expect(warning).toHaveBeenCalledTimes(2);
    expect(warning.mock.calls[0][1]).toEqual(
      'INVALID_GET_RESOURCES_FILTER_ARRAY_ITEM'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
    expect(warning.mock.calls[1][1]).toEqual(
      'INVALID_GET_RESOURCES_FILTER_ARRAY_ITEM'
    );
    expect(warning.mock.calls[1][2]).toEqual('error');
    expect(result).toEqual([]);
  });

  it('byId: false: it should return all resources by default', () => {
    const results = read({
      state: this.state,
      schemas: this.schemas,
      resourceType: 'books',
    });
    expect(warning).toHaveBeenCalledTimes(0);

    expect(results).toEqual([
      {
        id: 1,
        resourceType: 'books',
        computedAttributes: {},
        meta: {
          selected: true,
        },
        attributes: {
          name: 'A',
        },
      },
      {
        id: 2,
        resourceType: 'books',
        computedAttributes: {},
        meta: {},
        attributes: {
          name: 'B',
        },
      },
      {
        id: 50,
        resourceType: 'books',
        computedAttributes: {},
        meta: {
          selected: false,
        },
        attributes: {},
      },
    ]);
  });

  it('byId: true: it should return all resources by default', () => {
    const results = read({
      state: this.state,
      schemas: this.schemas,
      resourceType: 'books',
      options: { byId: true },
    });
    expect(warning).toHaveBeenCalledTimes(0);

    expect(results).toEqual({
      1: {
        id: 1,
        resourceType: 'books',
        computedAttributes: {},
        meta: {
          selected: true,
        },
        attributes: {
          name: 'A',
        },
      },
      2: {
        id: 2,
        resourceType: 'books',
        computedAttributes: {},
        meta: {},
        attributes: {
          name: 'B',
        },
      },
      50: {
        id: 50,
        resourceType: 'books',
        computedAttributes: {},
        meta: {
          selected: false,
        },
        attributes: {},
      },
    });
  });

  describe('calling it with a function; filtering on meta', () => {
    it('byId: false; should return the right resources', () => {
      const filter = resource => resource.meta.selected;

      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter,
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: true,
          },
          attributes: {
            name: 'A',
          },
        },
      ]);
    });

    it('byId: true; should return the right resources', () => {
      const filter = resource => resource.meta.selected;

      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter,
        options: { byId: true },
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual({
        1: {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: true,
          },
          attributes: {
            name: 'A',
          },
        },
      });
    });
  });

  describe('calling it with a list of IDs', () => {
    it('should return empty results with an empty set of IDs', () => {
      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter: [],
      });
      const resultsById = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter: [],
        options: { byId: true },
      });

      expect(results).toEqual([]);
      expect(resultsById).toEqual({});
    });

    it('byId: false; returns the right resources', () => {
      const filter = [50, 1];

      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter,
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          id: 50,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: false,
          },
          attributes: {},
        },
        {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: true,
          },
          attributes: {
            name: 'A',
          },
        },
      ]);
    });

    it('byId: true; returns the right resources', () => {
      const filter = [50, 1];

      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter,
        options: { byId: true },
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual({
        50: {
          id: 50,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: false,
          },
          attributes: {},
        },
        1: {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: true,
          },
          attributes: {
            name: 'A',
          },
        },
      });
    });
  });

  describe('calling it with an object filter', () => {
    it('byId: false; should return the resources that match', () => {
      const filter = {
        meta: {
          selected: true,
        },
      };

      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter,
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: true,
          },
          attributes: {
            name: 'A',
          },
        },
      ]);
    });

    it('byId: true; should return the resources that match', () => {
      const filter = {
        meta: {
          selected: true,
        },
      };

      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter,
        options: {
          byId: true,
        },
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual({
        1: {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: true,
          },
          attributes: {
            name: 'A',
          },
        },
      });
    });
  });

  describe('calling it with a string filter', () => {
    it('byId: false; should return an empty array for a nonexistent list', () => {
      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter: 'listThatDoesntExist',
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual([]);
    });

    it('byId: true; should return an empty object for a nonexistent list', () => {
      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter: 'listThatDoesntExist',
        options: {
          byId: true,
        },
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual({});
    });

    it('byId: false; should return the resources in the list', () => {
      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter: 'newBooks',
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: true,
          },
          attributes: {
            name: 'A',
          },
        },
        {
          id: 2,
          resourceType: 'books',
          computedAttributes: {},
          meta: {},
          attributes: {
            name: 'B',
          },
        },
      ]);
    });

    it('byId: true; should return the resources in the list', () => {
      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'books',
        filter: 'newBooks',
        options: {
          byId: true,
        },
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual({
        1: {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          meta: {
            selected: true,
          },
          attributes: {
            name: 'A',
          },
        },
        2: {
          id: 2,
          resourceType: 'books',
          computedAttributes: {},
          meta: {},
          attributes: {
            name: 'B',
          },
        },
      });
    });
  });

  describe('schema; idProperty', () => {
    it('byId: false; should return the resources specified', () => {
      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'authors',
        filter: ['a'],
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          authorId: 'a',
          resourceType: 'authors',
          computedAttributes: {},
          meta: {},
          attributes: {
            name: 'J.K. Rowling',
            contracts: {
              en: {
                purpose: 'book',
              },
              es: {
                purpose: 'talk',
              },
            },
          },
        },
      ]);
    });

    it('byId: false; should return the resources specified with a deep object match', () => {
      const results = read({
        state: this.state,
        schemas: this.schemas,
        resourceType: 'authors',
        filter: {
          attributes: {
            contracts: {
              en: {
                purpose: 'book',
              },
            },
          },
        },
      });
      expect(warning).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          authorId: 'a',
          resourceType: 'authors',
          computedAttributes: {},
          meta: {},
          attributes: {
            name: 'J.K. Rowling',
            contracts: {
              en: {
                purpose: 'book',
              },
              es: {
                purpose: 'talk',
              },
            },
          },
        },
      ]);
    });
  });
});
