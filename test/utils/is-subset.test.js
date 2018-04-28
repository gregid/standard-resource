import isSubset from '../../src/utils/is-subset';

describe('isSubset', () => {
  it('match primitives', () => {
    expect(isSubset(true, true)).toBe(true);
    expect(isSubset(false, false)).toBe(true);
    expect(isSubset('1', '1')).toBe(true);
    expect(isSubset(2, 2)).toBe(true);
    expect(isSubset(0, 0)).toBe(true);
  });

  it('identify mismatched primitives', () => {
    expect(isSubset(true, false)).toBe(false);
    expect(isSubset('1', 1)).toBe(false);
    expect(isSubset(2, 0)).toBe(false);
    expect(isSubset(false, 0)).toBe(false);
    expect(isSubset('a', 'b')).toBe(false);
    expect(isSubset(false, '')).toBe(false);
    expect(isSubset(0, '')).toBe(false);
  });

  it('match two objects exactly', () => {
    const one = /hello/;

    expect(isSubset(one, one)).toBe(true);
  });

  it('match two objects with the same shape', () => {
    const one = {
      id: 2,
      attributes: {
        displayNames: {
          en: 'spanish',
          es: 'espanol',
        },
      },
      meta: {
        isSelected: false,
      },
    };

    const two = {
      id: 2,
      attributes: {
        displayNames: {
          en: 'spanish',
          es: 'espanol',
        },
      },
      meta: {
        isSelected: false,
      },
    };

    expect(isSubset(one, two)).toBe(true);
  });

  it('match a subset of another object', () => {
    const one = {
      id: 2,
      attributes: {
        displayNames: {
          en: 'spanish',
          es: 'espanol',
        },
      },
      meta: {
        isSelected: false,
      },
    };

    const two = {
      attributes: {
        displayNames: {
          en: 'spanish',
        },
      },
    };

    expect(isSubset(one, two)).toBe(true);
  });

  it('matches empty objects', () => {
    const one = {};
    const two = {};

    expect(isSubset(one, two)).toBe(true);
  });

  it('matches empty arrays', () => {
    const one = [];
    const two = [];

    expect(isSubset(one, two)).toBe(true);
  });

  it('matches arrays with primitive contents', () => {
    const one = [1, 2];
    const two = [1, 2];

    expect(isSubset(one, two)).toBe(true);
  });

  it('matches arrays with empty object contents', () => {
    const one = [1, {}];
    const two = [1, {}];

    expect(isSubset(one, two)).toBe(true);
  });

  it('matches arrays with a subset of an object in the test', () => {
    const one = [1, { a: true, b: false }];
    const two = [1, { a: true }];

    expect(isSubset(one, two)).toBe(true);
  });

  it('does not match misordered arrays', () => {
    const one = [1, 2];
    const two = [2, 1];

    expect(isSubset(one, two)).toBe(false);
  });

  it('does not match primitives with objects or arrays', () => {
    expect(isSubset([], 1)).toBe(false);
    expect(isSubset(1, [])).toBe(false);
    expect(isSubset(0, [])).toBe(false);
    expect(isSubset([], 0)).toBe(false);

    expect(isSubset({}, 1)).toBe(false);
    expect(isSubset(1, {})).toBe(false);
    expect(isSubset(0, {})).toBe(false);
    expect(isSubset({}, 0)).toBe(false);
  });

  it('match not match a superset', () => {
    const one = {
      id: 2,
      attributes: {
        displayNames: {
          en: 'spanish',
          es: 'espanol',
        },
      },
      meta: {
        isSelected: false,
      },
    };

    const two = {
      attributes: {
        displayNames: {
          en: 'spanish',
        },
      },
    };

    expect(isSubset(two, one)).toBe(false);
  });

  it('identify a mismatch between two objects with dissimilar shape', () => {
    const one = {
      id: 2,
      attributes: {
        displayNames: {
          en: 'spanish',
          es: 'espanol',
        },
      },
      meta: {
        isSelected: false,
      },
    };

    const two = {
      id: 2,
      attributes: {
        displayNames: {
          en: 'spanish',
          es: 'espanol',
        },
      },
      meta: {
        isSelected: true,
      },
    };

    expect(isSubset(one, two)).toBe(false);
  });

  it('identify a mismatch between two objects that cannot be compared', () => {
    const one = {
      id: 2,
      attributes: {
        displayNames: {
          en: 'spanish',
          es: 'espanol',
        },
      },
      meta: {
        isSelected: /a/,
      },
    };

    const two = {
      id: 2,
      attributes: {
        displayNames: {
          en: 'spanish',
          es: 'espanol',
        },
      },
      meta: {
        isSelected: /c/,
      },
    };

    expect(isSubset(one, two)).toBe(false);
  });
});
