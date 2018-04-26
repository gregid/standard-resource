import resolveResource from '../../src/get-resources/resolve-resource';
import defaultSchema from '../../src/default-schema';

describe('resolveResource', () => {
  describe('passing no resource', () => {
    it('should return undefined object', () => {
      const resolved = resolveResource({
        state: {},
        resource: null,
        schema: defaultSchema,
      });
      const resolvedTwo = resolveResource({
        state: {},
        resource: null,
        options: {
          flat: true,
        },
        schema: defaultSchema,
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

      const resolved = resolveResource({
        state: {},
        resource,
        schema: defaultSchema,
      });

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

      const resolved = resolveResource({
        state: {},
        resource,
        options: {
          flat: true,
        },
        schema: defaultSchema,
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
