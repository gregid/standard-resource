import objectFromPath from '../../src/utils/object-from-path';

describe('objectFromPath', () => {
  it('handles not passing anything', () => {
    expect(objectFromPath()).toEqual({});
  });

  it('handles passing just a string', () => {
    expect(objectFromPath('hello.friends')).toEqual({
      hello: {
        friends: undefined,
      },
    });
  });

  it('handles passing null as the change', () => {
    expect(objectFromPath('hello.friends', null)).toEqual({
      hello: {
        friends: null,
      },
    });
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
  });

  it('handles passing an object as the change with no path', () => {
    expect(
      objectFromPath(null, {
        sandwiches: 'yum',
      })
    ).toEqual({
      sandwiches: 'yum',
    });
  });
});
