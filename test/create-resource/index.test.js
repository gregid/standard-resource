import createResource from '../../src/create-resource';
import { warning } from '../../src/utils/warning';

describe('createResource', () => {
  // TODO: add warning here for when it it's not called with a resourceType
  it('returns an object with the right shape', () => {
    const resource = createResource('books');

    expect(typeof resource.getState).toEqual('function');
    expect(typeof resource.read).toEqual('function');
    expect(typeof resource.write).toEqual('function');

    expect(warning).toHaveBeenCalledTimes(0);
  });

  describe('resource.getState()', () => {
    it('returns the state', () => {
      const resource = createResource('books');
      const state = resource.getState();

      expect(state).toEqual({
        resourceName: 'books',
        resources: {},
      });

      expect(warning).toHaveBeenCalledTimes(0);
    });
  });

  // To test:
  // update('24');
  // update('24', null);
  // update('24.attributes.firstName', 'Wot');
  // update('24.attributes.firstName', null);
  // update({
  //   24: { ... },
  //   50: { ... }
  // });
  describe('resource.write()', () => {
    // TODO: add warning here
    it('calling it with no arguments is a noop', () => {
      const resource = createResource('books');
      const initialState = resource.getState();

      expect(initialState).toEqual({
        resourceName: 'books',
        resources: {},
      });

      resource.write();

      const finalState = resource.getState();
      expect(finalState).toEqual({
        resourceName: 'books',
        resources: {},
      });

      expect(finalState).toBe(initialState);

      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('calling it with null wipes the existing state', () => {
      const resource = createResource('books');
      const initialState = resource.getState();

      expect(initialState).toEqual({
        resourceName: 'books',
        resources: {},
      });

      resource.write(null);

      const finalState = resource.getState();
      expect(finalState).toEqual({
        resourceName: 'books',
        resources: {},
      });

      expect(finalState).not.toBe(initialState);

      expect(warning).toHaveBeenCalledTimes(0);
    });
  });
});
