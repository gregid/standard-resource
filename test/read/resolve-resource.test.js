import resolveResource from '../../src/get-resources/resolve-resource';
import defaultSchema from '../../src/utils/default-schema';

describe('resolveResource', () => {
  describe('passing no resource', () => {
    it('should return undefined object', () => {
      const resolved = resolveResource({
        state: {},
        schemas: {},
        resource: null,
        schema: defaultSchema,
      });
      const resolvedTwo = resolveResource({
        state: {},
        schemas: {},
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
      };

      const resolved = resolveResource({
        state: {},
        schemas: {},
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
      };

      const resolved = resolveResource({
        state: {},
        schemas: {},
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
      });
    });

    it('should overwrite data in the expected way when flattening', () => {
      const resource = {
        id: 'a',
        resourceType: 'books',
        attributes: {
          name: 'Lord of the Flies',
          publishYear: 1985,
        },
        meta: {
          author: 'Lord of da Flies',
        },
      };

      const resolved = resolveResource({
        state: {
          people: {
            resources: {
              b: {
                id: 'b',
                resourceType: 'people',
                attributes: {
                  firstName: 'Rosie',
                },
              },
            },
          },
        },
        schemas: {
          people: defaultSchema,
        },
        resource,
        options: {
          flat: true,
        },
        schema: {
          ...defaultSchema,
          computedAttributes: {
            blah(resource) {
              return `${resource.meta.author} pls & ty`;
            },
            name() {
              return 'i will be squashed';
            },
          },
        },
      });

      expect(resolved).toEqual({
        id: 'a',
        resourceType: 'books',
        name: 'Lord of the Flies',
        blah: 'Lord of da Flies pls & ty',
        publishYear: 1985,
        author: 'Lord of da Flies',
      });
    });
  });
});
