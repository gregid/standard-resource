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
        },
      },
    };
  });

  it('should warn one time when a nonexistent resource section is attempted to be filtered', () => {
    getResources(this.state, 'ooglaboogla');
    getResources(this.state, 'ooglaboogla2');
    getResources(this.state, 'ooglaboogla3');

    expect(console.error).toHaveBeenCalledTimes(1);
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
    });
  });

  // describe('calling it with a function', () => {});
});
