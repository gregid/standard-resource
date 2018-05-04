import getGlobalId from '../../src/utils/get-global-id';

describe('getGlobalId', () => {
  it('should return a string', () => {
    expect(typeof getGlobalId()).toBe('string');
    expect(typeof getGlobalId({})).toBe('string');
    expect(typeof getGlobalId({ id: 2 })).toBe('string');
    expect(typeof getGlobalId({ id: '2' })).toBe('string');
    expect(typeof getGlobalId({ id: '2', resourceType: '' })).toBe('string');
    expect(typeof getGlobalId({ id: '2', resourceType: 'hi' })).toBe('string');
    expect(typeof getGlobalId({ id: '2', resourceType: null })).toBe('string');
  });

  it('should return unique values across different resource types', () => {
    expect(getGlobalId({ id: '2', resourceType: 'a' })).not.toBe(
      getGlobalId({ id: '2', resourceType: 'b' })
    );
  });

  it('should return the same value when id and resourceType match', () => {
    expect(getGlobalId({ id: '2', resourceType: 'a' })).toBe(
      getGlobalId({ id: '2', resourceType: 'a' })
    );
  });

  it('should return a different value when ids dont match', () => {
    expect(getGlobalId({ id: '3', resourceType: 'a' })).not.toBe(
      getGlobalId({ id: '2', resourceType: 'a' })
    );
  });

  // To avoid this, do not use colons in your resource types. Standard Resource
  // will warn you about this.
  it('is not perfect, and still creates collisions in edge cases', () => {
    expect(getGlobalId({ id: '1:', resourceType: 'hi' })).toBe(
      getGlobalId({ id: '1', resourceType: ':hi' })
    );
  });
});
