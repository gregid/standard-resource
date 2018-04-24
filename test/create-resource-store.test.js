import createResourceStore from '../src/create-resource-store';

describe('createResourceStore', () => {
  it('returns an object with the right shape', () => {
    const store = createResourceStore();

    expect(typeof store.getState).toEqual('function');
    expect(typeof store.getResources).toEqual('function');
    expect(typeof store.updateResources).toEqual('function');
  });

  describe('calling getState', () => {
    it('with no initial state returns an empty object', () => {
      const store = createResourceStore();
      const state = store.getState();
      expect(state).toEqual({});
    });
  });
});
