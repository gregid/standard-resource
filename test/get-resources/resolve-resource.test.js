import resolveResource from '../../src/get-resources/resolve-resource';

describe('resolveResource', () => {
  describe('passing no resource', () => {
    it('should return undefined object', () => {
      const resolved = resolveResource({}, null);
      const resolvedTwo = resolveResource({}, null, {
        flat: true,
      });

      expect(resolved).toEqual(undefined);
      expect(resolvedTwo).toEqual(undefined);
    });
  });

  describe('no options', () => {
    it('should return the full resource', () => {
      const resource = {
        id: 'a',
        resourceType: 'books',
        attributes: {
          name: 'Lord of the Flies',
          publishYear: 1985,
        },
        meta: {
          changedName: 'Lord of da Flies',
        },
        relationships: {
          author: {
            type: 'people',
            data: 'b',
          },
        },
      };

      const resolved = resolveResource({}, resource);

      expect(resolved).toEqual({
        id: 'a',
        resourceType: 'books',
        attributes: {
          name: 'Lord of the Flies',
          publishYear: 1985,
        },
        meta: {
          changedName: 'Lord of da Flies',
        },
        computedAttributes: {},
        relationships: {
          author: {
            type: 'people',
            data: 'b',
          },
        },
      });
    });
  });

  describe('flat', () => {
    it('should return a flat object', () => {
      const resource = {
        id: 'a',
        resourceType: 'books',
        attributes: {
          name: 'Lord of the Flies',
          publishYear: 1985,
        },
        meta: {
          changedName: 'Lord of da Flies',
        },
        relationships: {
          author: {
            type: 'people',
            data: 'b',
          },
        },
      };

      const resolved = resolveResource({}, resource, {
        flat: true,
      });

      expect(resolved).toEqual({
        id: 'a',
        resourceType: 'books',
        name: 'Lord of the Flies',
        changedName: 'Lord of da Flies',
        publishYear: 1985,
        author: {
          type: 'people',
          data: 'b',
        },
      });
    });
  });
});
