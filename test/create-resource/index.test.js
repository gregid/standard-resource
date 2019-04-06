import createResource from '../../src/create-resource';
import { warning } from '../../src/utils/warning';

describe('createResource', () => {
  // TODO: add warning here for when it it's not called with a resourceType
  it('returns an object with the right shape', () => {
    const resource = createResource('books');

    expect(typeof resource.getState).toEqual('function');
    expect(typeof resource.read).toEqual('function');
    expect(typeof resource.upsertResources).toEqual('function');
    expect(typeof resource.deleteResources).toEqual('function');

    expect(warning).toHaveBeenCalledTimes(0);
  });

  describe('resource.getState()', () => {
    it('returns the state', () => {
      const resource = createResource('books');
      const state = resource.getState();

      expect(state).toEqual({
        resourceType: 'books',
        resources: {},
      });

      expect(warning).toHaveBeenCalledTimes(0);
    });
  });

  describe('passing initialState', () => {
    it('returns the state', () => {
      const resource = createResource('books', {
        resources: {
          13: {
            id: '13',
            resourceType: 'books',
            attributes: {
              name: 'The Blade Itself',
            },
          },
        },
      });
      const state = resource.getState();

      expect(state).toEqual({
        resourceType: 'books',
        resources: {
          13: {
            id: '13',
            resourceType: 'books',
            attributes: {
              name: 'The Blade Itself',
            },
          },
        },
      });

      expect(warning).toHaveBeenCalledTimes(0);
    });
  });
});
