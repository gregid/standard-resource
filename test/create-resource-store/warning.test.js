import { createResourceStore } from '../../src';
import { warning } from '../../src/utils/warning';

describe('createResourceStore - warnings', () => {
  it('warns when invalid schemas are passed', () => {
    createResourceStore(null, {
      schemas: true,
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('CREATE_STORE_INVALID_SCHEMAS');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns when invalid initial state value is passed', () => {
    createResourceStore(true);

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual(
      'CREATE_STORE_INVALID_INITIAL_STATE'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('warns when invalid initial state key is passed', () => {
    createResourceStore({
      pizza: {},
      groups: {},
      resources: {},
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual(
      'CREATE_STORE_INVALID_INITIAL_STATE_KEY'
    );
    expect(warning.mock.calls[0][2]).toEqual('error');
  });
});
