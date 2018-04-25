import getResources from '../../src/get-resources';

describe('getResources', function() {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    this.state = {
      books: {
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
    };
  });

  it('should warn one time when a nonexistent resource section is attempted to be filtered', () => {
    const result = getResources(this.state, 'ooglaboogla');
    const resultTwo = getResources(this.state, 'ooglaboogla2', null, {
      byId: true,
    });
    getResources(this.state, 'ooglaboogla3');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(resultTwo).toEqual({});
  });

  it('byId: false: it should return all resources by default', () => {
    const results = getResources(this.state, 'books');
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
    const results = getResources(this.state, 'books', null, { byId: true });
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

      const results = getResources(this.state, 'books', filter);
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

      const results = getResources(this.state, 'books', filter, { byId: true });
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
      const results = getResources(this.state, 'books', []);
      const resultsById = getResources(this.state, 'books', [], { byId: true });
      expect(results).toEqual([]);
      expect(resultsById).toEqual({});
    });

    it('byId: false; returns the right resources', () => {
      const filter = [50, 1];

      const results = getResources(this.state, 'books', filter);
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

      const results = getResources(this.state, 'books', filter, { byId: true });
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
});
