import createResource from '../../src/create-resource';
import { warning } from '../../src/utils/warning';

describe('createResource.resetState()', () => {
  it('it wipes the existing state', () => {
    const resource = createResource('books');
    const initialState = resource.getState();

    expect(initialState).toEqual({
      resourceType: 'books',
      resources: {},
    });

    resource.resetState();

    const finalState = resource.getState();
    expect(finalState).toEqual({
      resourceType: 'books',
      resources: {},
    });

    expect(finalState).not.toBe(initialState);

    expect(warning).toHaveBeenCalledTimes(0);
  });
});
