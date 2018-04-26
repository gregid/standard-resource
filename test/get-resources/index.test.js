import getResources from '../../src/get-resources';
import defaultSchema from '../../src/initialization/default-schema';

describe('getResources', function() {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    this.state = {
      books: {
        schema: defaultSchema,
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
        schema: {
          ...defaultSchema,
          idAttribute: 'authorId',
        },
        resources: {
          a: {
            authorId: 'a',
            resourceType: 'authors',
            attributes: {
              name: 'J.K. Rowling',
            },
          },
        },
      },
    };
  });

  it('should warn one time when a nonexistent resource section is attempted to be filtered', () => {
    const result = getResources({
      state: this.state,
      resourceType: 'ooglaboogla',
    });
    const resultTwo = getResources({
      state: this.state,
      resourceType: 'ooglaboogla2',
      options: {
        byId: true,
      },
    });
    getResources({ state: this.state, resourceType: 'ooglaboogla3' });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(resultTwo).toEqual({});
  });

  it('byId: false: it should return all resources by default', () => {
    const results = getResources({ state: this.state, resourceType: 'books' });
    expect(console.error).toHaveBeenCalledTimes(0);

    expect(results).toEqual([
      {
        id: 1,
        resourceType: 'books',
        computedAttributes: {},
        relationships: {},
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
        relationships: {},
        meta: {},
        attributes: {
          name: 'B',
        },
      },
      {
        id: 50,
        resourceType: 'books',
        computedAttributes: {},
        relationships: {},
        meta: {
          selected: false,
        },
        attributes: {},
      },
    ]);
  });

  it('byId: true: it should return all resources by default', () => {
    const results = getResources({
      state: this.state,
      resourceType: 'books',
      options: { byId: true },
    });
    expect(console.error).toHaveBeenCalledTimes(0);

    expect(results).toEqual({
      1: {
        id: 1,
        resourceType: 'books',
        computedAttributes: {},
        relationships: {},
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
        relationships: {},
        meta: {},
        attributes: {
          name: 'B',
        },
      },
      50: {
        id: 50,
        resourceType: 'books',
        computedAttributes: {},
        relationships: {},
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

      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter,
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
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

      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter,
        options: { byId: true },
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual({
        1: {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
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
      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter: [],
      });
      const resultsById = getResources({
        state: this.state,
        resourceType: 'books',
        filter: [],
        options: { byId: true },
      });

      expect(results).toEqual([]);
      expect(resultsById).toEqual({});
    });

    it('byId: false; returns the right resources', () => {
      const filter = [50, 1];

      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter,
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          id: 50,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
          meta: {
            selected: false,
          },
          attributes: {},
        },
        {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
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

      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter,
        options: { byId: true },
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual({
        50: {
          id: 50,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
          meta: {
            selected: false,
          },
          attributes: {},
        },
        1: {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
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

      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter,
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
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

      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter,
        options: {
          byId: true,
        },
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual({
        1: {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
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
      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter: 'listThatDoesntExist',
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual([]);
    });

    it('byId: true; should return an empty object for a nonexistent list', () => {
      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter: 'listThatDoesntExist',
        options: {
          byId: true,
        },
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual({});
    });

    it('byId: false; should return the resources in the list', () => {
      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter: 'newBooks',
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
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
          relationships: {},
          meta: {},
          attributes: {
            name: 'B',
          },
        },
      ]);
    });

    it('byId: true; should return the resources in the list', () => {
      const results = getResources({
        state: this.state,
        resourceType: 'books',
        filter: 'newBooks',
        options: {
          byId: true,
        },
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual({
        1: {
          id: 1,
          resourceType: 'books',
          computedAttributes: {},
          relationships: {},
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
          relationships: {},
          meta: {},
          attributes: {
            name: 'B',
          },
        },
      });
    });
  });

  describe('schema; idAttribute', () => {
    it('byId: false; should return the resources specified', () => {
      const results = getResources({
        state: this.state,
        resourceType: 'authors',
        filter: ['a'],
      });
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(results).toEqual([
        {
          authorId: 'a',
          resourceType: 'authors',
          computedAttributes: {},
          relationships: {},
          meta: {},
          attributes: {
            name: 'J.K. Rowling',
          },
        },
      ]);
    });
  });
});
