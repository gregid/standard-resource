import createResource from '../../src/create-resource';
import { warning } from '../../src/utils/warning';

const initialResources = {
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
};

describe('resource.read()', () => {
  it('should warn when an invalid filter is passed', () => {
    const resource = createResource('books', {
      resources: initialResources,
    });

    const result = resource.read(/a/);

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('INVALID_GET_RESOURCES_FILTER');
    expect(warning.mock.calls[0][2]).toEqual('error');
    expect(result).toEqual([]);
  });

  it('should warn when an invalid filter array is passed', () => {
    const resource = createResource('books', {
      resources: initialResources,
    });

    const result = resource.read([1000, /a/, {}]);

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
    const resource = createResource('books', {
      resources: initialResources,
    });

    const results = resource.read();
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
    const resource = createResource('books', {
      resources: initialResources,
    });

    const results = resource.read(null, { byId: true });
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
      const resource = createResource('books', {
        resources: initialResources,
      });

      const filter = resource => resource.meta.selected;
      const results = resource.read(filter);

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
      const resource = createResource('books', {
        resources: initialResources,
      });

      const filter = resource => resource.meta.selected;
      const results = resource.read(filter, { byId: true });

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

  describe('calling it with a group of IDs', () => {
    it('should return empty results with an empty set of IDs', () => {
      const resource = createResource('books', {
        resources: initialResources,
      });

      const results = resource.read([]);
      const resultsById = resource.read([], { byId: true });

      expect(results).toEqual([]);
      expect(resultsById).toEqual({});
    });

    it('byId: false; returns the right resources', () => {
      const filter = [50, 1];

      const resource = createResource('books', {
        resources: initialResources,
      });

      const results = resource.read(filter);
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

      const resource = createResource('books', {
        resources: initialResources,
      });

      const results = resource.read(filter, { byId: true });
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

      const resource = createResource('books', {
        resources: initialResources,
      });

      const results = resource.read(filter);
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

      const resource = createResource('books', {
        resources: initialResources,
      });

      const results = resource.read(filter, { byId: true });
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
});
