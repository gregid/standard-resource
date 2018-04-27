import objectKeysMatch from '../../src/utils/object-keys-match';

describe('objectKeysMatch', () => {
  it('should return false for undefined keys', () => {
    const match = objectKeysMatch({ a: true, b: false });

    expect(match).toEqual(true);
  });

  it('should return true for an empty array of keys', () => {
    const match = objectKeysMatch({ a: true, b: false }, []);

    expect(match).toEqual(true);
  });

  it('should return true when the keys all match', () => {
    const match = objectKeysMatch({ a: true, b: false }, ['a', 'b']);

    expect(match).toEqual(true);
  });

  it('should return false when the keys do not match at all', () => {
    const match = objectKeysMatch({ a: true, b: false }, ['c']);

    expect(match).toEqual(false);
  });

  it('should return false when the keys match, but the object has more keys', () => {
    const match = objectKeysMatch({ a: true, b: false, c: {} }, ['a', 'b']);

    expect(match).toEqual(false);
  });

  it('should return false when the keys match, but the keys array has more keys', () => {
    const match = objectKeysMatch({ a: true, b: false }, ['a', 'b', 'c']);

    expect(match).toEqual(false);
  });
});
