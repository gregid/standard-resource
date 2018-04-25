import objectMatchesObject from '../../src/get-resources/object-matches-object';

describe('objectMatchesObject', () => {
  it('should return false for undefined values', () => {
    const match = objectMatchesObject({ a: true });

    expect(match).toEqual(false);
  });

  it('should return false for non-object values', () => {
    const match = objectMatchesObject({ a: true }, 'blah');

    expect(match).toEqual(false);
  });

  it('should return true for empty objects', () => {
    const match = objectMatchesObject({ a: true }, {});

    expect(match).toEqual(true);
  });

  it('should return true when the values match', () => {
    const match = objectMatchesObject({ a: true }, { a: true });

    expect(match).toEqual(true);
  });

  it('should return false when it is over-specified', () => {
    const match = objectMatchesObject(
      { a: true },
      { a: true, b: 'sandwiches' }
    );

    expect(match).toEqual(false);
  });

  it('should return false when some, but not all, match', () => {
    const match = objectMatchesObject(
      { a: true, b: 'sandwiches', c: 'spaghetti' },
      { a: true, b: 'sandwiches', c: 'pasta' }
    );

    expect(match).toEqual(false);
  });
});
