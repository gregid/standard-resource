import resolveResource from '../../src/get-resources/resolve-resource';
import defaultSchema from '../../src/initialization/default-schema';

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
            resourceType: 'people',
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
            resourceType: 'people',
            data: 'b',
          },
        },
      });
    });

    it('should handle circular relationships; requesting one level deep', () => {
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
            resourceType: 'people',
            data: 'b',
          },
        },
      };

      const state = {
        books: {
          resources: {
            a: {
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
                  resourceType: 'people',
                  data: 'b',
                },
              },
            },
          },
        },
        people: {
          schema: defaultSchema,
          resources: {
            b: {
              id: 'b',
              resourceType: 'people',
              attributes: {
                stuff: 'hello',
              },
              relationships: {
                books: {
                  resourceType: 'books',
                  data: 'a',
                },
              },
            },
          },
        },
      };

      const resolved = resolveResource({
        state,
        resource,
        schema: defaultSchema,
        options: {
          relationships: {
            author: true,
          },
        },
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
            id: 'b',
            resourceType: 'people',
            attributes: {
              stuff: 'hello',
            },
            computedAttributes: {},
            meta: {},
            relationships: {
              books: {
                resourceType: 'books',
                data: 'a',
              },
            },
          },
        },
      });
    });

    it.only('should handle circular relationships; requesting 2 levels deep', () => {
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
            resourceType: 'people',
            data: 'b',
          },
        },
      };

      const state = {
        books: {
          schema: defaultSchema,
          resources: {
            a: {
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
                  resourceType: 'people',
                  data: 'b',
                },
              },
            },
          },
        },
        people: {
          schema: defaultSchema,
          resources: {
            b: {
              id: 'b',
              resourceType: 'people',
              attributes: {
                stuff: 'hello',
              },
              relationships: {
                books: {
                  resourceType: 'books',
                  data: 'a',
                },
              },
            },
          },
        },
      };

      const resolved = resolveResource({
        state,
        resource,
        schema: defaultSchema,
        options: {
          relationships: {
            author: {
              relationships: {
                books: true,
              },
            },
          },
        },
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
            id: 'b',
            resourceType: 'people',
            attributes: {
              stuff: 'hello',
            },
            computedAttributes: {},
            meta: {},
            relationships: {
              books: {
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
                    resourceType: 'people',
                    data: 'b',
                  },
                },
              },
            },
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
            resourceType: 'people',
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
          resourceType: 'people',
          data: 'b',
        },
      });
    });

    it('should return a flat object with relationships and schema', () => {
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
            resourceType: 'people',
            data: 'b',
          },
        },
      };

      const resolved = resolveResource({
        state: {
          people: {
            schema: defaultSchema,
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
        resource,
        options: {
          flat: true,
          relationships: {
            author: true,
          },
        },
        schema: {
          ...defaultSchema,
          computedAttributes: {
            blah(resource) {
              return `${resource.meta.changedName} pls & ty`;
            },
          },
        },
      });

      expect(resolved).toEqual({
        id: 'a',
        resourceType: 'books',
        name: 'Lord of the Flies',
        changedName: 'Lord of da Flies',
        blah: 'Lord of da Flies pls & ty',
        publishYear: 1985,
        author: {
          id: 'b',
          resourceType: 'people',
          computedAttributes: {},
          meta: {},
          relationships: {},
          attributes: {
            firstName: 'Rosie',
          },
        },
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
        relationships: {
          author: {
            resourceType: 'people',
            data: 'b',
          },
          blah: {
            resourceType: 'people',
            data: 'b',
          },
        },
      };

      const resolved = resolveResource({
        state: {
          people: {
            schema: defaultSchema,
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
        resource,
        options: {
          flat: true,
          relationships: {
            author: true,
          },
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
        author: {
          id: 'b',
          resourceType: 'people',
          computedAttributes: {},
          meta: {},
          relationships: {},
          attributes: {
            firstName: 'Rosie',
          },
        },
      });
    });
  });
});
