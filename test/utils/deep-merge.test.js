import merge from '../../src/utils/merge';

const big = {
  displayNames: {
    en: {
      value: 'please',
      status: {
        active: true,
      },
    },
    nl: {
      value: 'alstublieft',
      status: {
        active: false,
      },
    },
  },
  internalName: 'please',
};

const deepUpdate = {
  displayNames: {
    nl: {
      status: {
        active: true,
      },
    },
  },
};

describe('merge', () => {
  it('should merge nothing', () => {
    expect(merge(undefined, undefined, true)).toEqual({});
  });

  it('should merge null', () => {
    expect(merge(null, null, true)).toEqual({});
  });

  it('should merge two empty objects', () => {
    expect(merge({}, {}, true)).toEqual({});
  });

  it('should merge big into small', () => {
    const result = merge({}, big, true);
    expect(result).toEqual(big);
    expect(result).not.toBe(big);
  });

  it('should merge small into big', () => {
    const result = merge(big, {}, true);
    expect(result).toEqual(big);
    expect(result).not.toBe(big);
  });

  it('should merge a deep update into a big object', () => {
    const result = merge(big, deepUpdate, true);
    expect(result).toEqual({
      displayNames: {
        en: {
          value: 'please',
          status: {
            active: true,
          },
        },
        nl: {
          value: 'alstublieft',
          status: {
            active: true,
          },
        },
      },
      internalName: 'please',
    });
    expect(result).not.toBe(big);
    expect(result).not.toBe(deepUpdate);
  });

  it('should merge in the opposite direction correctly', () => {
    const result = merge(deepUpdate, big, true);
    expect(result).toEqual({
      displayNames: {
        en: {
          value: 'please',
          status: {
            active: true,
          },
        },
        nl: {
          value: 'alstublieft',
          status: {
            active: false,
          },
        },
      },
      internalName: 'please',
    });
    expect(result).not.toBe(big);
    expect(result).not.toBe(deepUpdate);
  });
});
