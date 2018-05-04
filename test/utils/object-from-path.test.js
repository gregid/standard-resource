import objectFromPath from '../../src/utils/object-from-path';
import { warning } from '../../src/utils/warning';

describe('objectFromPath', () => {
  it('warns if invalid data is passed, returning no change', () => {
    expect(objectFromPath({ what: true }, { pls: 'ok' })).toEqual({});

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('OBJECT_FROM_PATH_INVALID_PATH');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('handles not passing anything', () => {
    expect(objectFromPath()).toEqual({});

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('handles passing just a string', () => {
    expect(objectFromPath('hello.friends')).toEqual({
      hello: {
        friends: undefined,
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('handles passing null as the change', () => {
    expect(objectFromPath('hello.friends', null)).toEqual({
      hello: {
        friends: null,
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('handles passing an object as the change', () => {
    expect(
      objectFromPath('hello.friends', {
        sandwiches: 'yum',
      })
    ).toEqual({
      hello: {
        friends: {
          sandwiches: 'yum',
        },
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('handles passing an object as the change with no path', () => {
    expect(
      objectFromPath({
        sandwiches: 'yum',
      })
    ).toEqual({
      sandwiches: 'yum',
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });
});
